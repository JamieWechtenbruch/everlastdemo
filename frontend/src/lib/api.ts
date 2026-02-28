const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchKPIs(days = 30) {
  const res = await fetch(`${API_URL}/api/analytics/kpis?days=${days}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCalls(page = 1, perPage = 20, leadScore?: string) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (leadScore) params.set("lead_score", leadScore);
  const res = await fetch(`${API_URL}/api/analytics/calls?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
