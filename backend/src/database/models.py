from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class CallLog(Base):
    """Logs all calls handled by the voice agent with lead qualification data."""
    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, nullable=True)
    call_datetime = Column(DateTime, default=datetime.utcnow)
    duration_seconds = Column(Integer, nullable=True)
    intent = Column(String, nullable=True)
    resolved = Column(Boolean, default=True)
    transcript_summary = Column(Text, nullable=True)
    action_taken = Column(JSON, nullable=True)

    # Analytics columns
    room_name = Column(String, nullable=True, index=True)
    session_mode = Column(String, nullable=True)
    conversation_phase = Column(String, nullable=True)
    lead_branche = Column(String, nullable=True)
    lead_unternehmensgroesse = Column(String, nullable=True)
    lead_aktuelle_loesung = Column(String, nullable=True)
    lead_budget_zeitrahmen = Column(String, nullable=True)
    lead_score = Column(String(1), nullable=True)
    lead_interest_level = Column(String, nullable=True)
    booking_attempted = Column(Boolean, default=False)
    booking_succeeded = Column(Boolean, default=False)
    demo_booked = Column(Boolean, default=False)
    email_collected = Column(Boolean, default=False)
    session_start = Column(DateTime, nullable=True)
    session_end = Column(DateTime, nullable=True)
    tools_used = Column(JSON, nullable=True)
    qualification_data = Column(JSON, nullable=True)
