"""
Analytics API Endpoints
Dashboard KPIs and call log management
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, case, cast, Date, delete
from datetime import datetime, timedelta
from typing import Optional, List
import logging

from src.database.connection import get_db
from src.database.models import CallLog
from src.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


async def verify_voice_agent_key(x_api_key: str = Header(None)):
    if not x_api_key or x_api_key != settings.VOICE_AGENT_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


@router.post("/call-logs")
async def create_call_log(
    data: dict,
    db: AsyncSession = Depends(get_db),
    authorized: bool = Depends(verify_voice_agent_key),
):
    """Save a call log entry from the voice agent."""
    try:
        call_log = CallLog(
            phone_number=data.get("phone_number"),
            call_datetime=datetime.fromisoformat(data["call_datetime"]) if data.get("call_datetime") else datetime.utcnow(),
            duration_seconds=data.get("duration_seconds"),
            intent=data.get("intent"),
            room_name=data.get("room_name"),
            session_mode=data.get("session_mode"),
            conversation_phase=data.get("conversation_phase"),
            lead_branche=data.get("lead_branche"),
            lead_unternehmensgroesse=data.get("lead_unternehmensgroesse"),
            lead_aktuelle_loesung=data.get("lead_aktuelle_loesung"),
            lead_budget_zeitrahmen=data.get("lead_budget_zeitrahmen"),
            lead_score=data.get("lead_score"),
            lead_interest_level=data.get("lead_interest_level"),
            booking_attempted=data.get("booking_attempted", False),
            booking_succeeded=data.get("booking_succeeded", False),
            demo_booked=data.get("demo_booked", False),
            email_collected=data.get("email_collected", False),
            session_start=datetime.fromisoformat(data["session_start"]) if data.get("session_start") else None,
            session_end=datetime.fromisoformat(data["session_end"]) if data.get("session_end") else None,
            tools_used=data.get("tools_used"),
            qualification_data=data.get("qualification_data"),
            transcript_summary=data.get("transcript_summary"),
            action_taken=data.get("action_taken"),
        )
        db.add(call_log)
        await db.commit()
        await db.refresh(call_log)
        logger.info(f"Call log saved: id={call_log.id}, room={call_log.room_name}")
        return {"status": "success", "id": call_log.id}
    except Exception as e:
        logger.error(f"Error saving call log: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics/kpis")
async def get_kpis(
    days: int = Query(30, description="Number of days to look back"),
    db: AsyncSession = Depends(get_db),
):
    """Returns aggregated KPIs for the analytics dashboard."""
    cutoff = datetime.utcnow() - timedelta(days=days)
    filters = [CallLog.call_datetime >= cutoff]

    # Total calls
    total_q = await db.execute(
        select(func.count(CallLog.id)).where(and_(*filters))
    )
    total_calls = total_q.scalar() or 0

    # Conversions (demo booked)
    conversions_q = await db.execute(
        select(func.count(CallLog.id)).where(
            and_(*filters, CallLog.demo_booked == True)
        )
    )
    conversions = conversions_q.scalar() or 0
    conversion_rate = round((conversions / total_calls * 100), 1) if total_calls > 0 else 0

    # Average duration
    avg_dur_q = await db.execute(
        select(func.avg(CallLog.duration_seconds)).where(and_(*filters))
    )
    avg_duration = round(avg_dur_q.scalar() or 0)

    # Lead score distribution
    score_q = await db.execute(
        select(CallLog.lead_score, func.count(CallLog.id))
        .where(and_(*filters, CallLog.lead_score.isnot(None)))
        .group_by(CallLog.lead_score)
    )
    lead_scores = {row[0]: row[1] for row in score_q.all()}
    lead_score_distribution = {
        "A": lead_scores.get("A", 0),
        "B": lead_scores.get("B", 0),
        "C": lead_scores.get("C", 0),
    }

    # Drop-off points
    phase_q = await db.execute(
        select(CallLog.conversation_phase, func.count(CallLog.id))
        .where(and_(*filters, CallLog.conversation_phase.isnot(None)))
        .group_by(CallLog.conversation_phase)
    )
    phases = {row[0]: row[1] for row in phase_q.all()}
    drop_off_points = {
        "greeting": phases.get("greeting", 0),
        "qualification": phases.get("qualification", 0),
        "availability_check": phases.get("availability_check", 0),
        "booking": phases.get("booking", 0),
        "completed": phases.get("completed", 0),
        "idle_timeout": phases.get("idle_timeout", 0),
        "max_duration": phases.get("max_duration", 0),
    }

    # Calls by day
    calls_by_day_q = await db.execute(
        select(
            cast(CallLog.call_datetime, Date).label("date"),
            func.count(CallLog.id).label("count"),
            func.sum(case((CallLog.demo_booked == True, 1), else_=0)).label("conversions"),
        )
        .where(and_(*filters))
        .group_by(cast(CallLog.call_datetime, Date))
        .order_by(cast(CallLog.call_datetime, Date))
    )
    calls_by_day = [
        {"date": str(row.date), "count": row.count, "conversions": int(row.conversions or 0)}
        for row in calls_by_day_q.all()
    ]

    # Top industries
    industry_q = await db.execute(
        select(CallLog.lead_branche, func.count(CallLog.id))
        .where(and_(*filters, CallLog.lead_branche.isnot(None), CallLog.lead_branche != "unbekannt"))
        .group_by(CallLog.lead_branche)
        .order_by(func.count(CallLog.id).desc())
        .limit(10)
    )
    top_industries = [
        {"branche": row[0], "count": row[1]}
        for row in industry_q.all()
    ]

    # Email collection rate
    emails_q = await db.execute(
        select(func.count(CallLog.id)).where(
            and_(*filters, CallLog.email_collected == True)
        )
    )
    emails_collected = emails_q.scalar() or 0

    # Demo bookings
    demos_q = await db.execute(
        select(func.count(CallLog.id)).where(
            and_(*filters, CallLog.demo_booked == True)
        )
    )
    demo_bookings = demos_q.scalar() or 0

    return {
        "total_calls": total_calls,
        "conversions": conversions,
        "conversion_rate": conversion_rate,
        "avg_duration_seconds": avg_duration,
        "lead_score_distribution": lead_score_distribution,
        "drop_off_points": drop_off_points,
        "calls_by_day": calls_by_day,
        "top_industries": top_industries,
        "emails_collected": emails_collected,
        "demo_bookings": demo_bookings,
    }


@router.get("/analytics/calls")
async def get_call_logs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    lead_score: Optional[str] = Query(None),
    phase: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Returns paginated call log list with filtering."""
    filters = []
    if lead_score:
        filters.append(CallLog.lead_score == lead_score)
    if phase:
        filters.append(CallLog.conversation_phase == phase)

    count_q = await db.execute(
        select(func.count(CallLog.id)).where(and_(*filters)) if filters
        else select(func.count(CallLog.id))
    )
    total = count_q.scalar() or 0

    query = (
        select(CallLog)
        .where(and_(*filters)) if filters
        else select(CallLog)
    )
    query = query.order_by(CallLog.call_datetime.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(query)
    calls = result.scalars().all()

    return {
        "calls": [
            {
                "id": c.id,
                "call_datetime": c.call_datetime.isoformat() if c.call_datetime else None,
                "duration_seconds": c.duration_seconds,
                "conversation_phase": c.conversation_phase,
                "lead_score": c.lead_score,
                "lead_branche": c.lead_branche,
                "lead_unternehmensgroesse": c.lead_unternehmensgroesse,
                "lead_aktuelle_loesung": c.lead_aktuelle_loesung,
                "lead_budget_zeitrahmen": c.lead_budget_zeitrahmen,
                "lead_interest_level": c.lead_interest_level,
                "booking_attempted": c.booking_attempted,
                "booking_succeeded": c.booking_succeeded,
                "demo_booked": c.demo_booked,
                "email_collected": c.email_collected,
                "room_name": c.room_name,
                "transcript_summary": c.transcript_summary,
                "tools_used": c.tools_used,
                "qualification_data": c.qualification_data,
                "full_transcript": c.action_taken,
            }
            for c in calls
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.delete("/analytics/calls/{call_id}")
async def delete_call_log(
    call_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single call log entry."""
    result = await db.execute(select(CallLog).where(CallLog.id == call_id))
    call = result.scalar_one_or_none()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    await db.delete(call)
    await db.commit()
    return {"status": "deleted", "id": call_id}


@router.post("/analytics/calls/delete-batch")
async def delete_call_logs_batch(
    data: dict,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple call log entries by IDs."""
    ids: List[int] = data.get("ids", [])
    if not ids:
        raise HTTPException(status_code=400, detail="No IDs provided")
    await db.execute(delete(CallLog).where(CallLog.id.in_(ids)))
    await db.commit()
    return {"status": "deleted", "count": len(ids)}
