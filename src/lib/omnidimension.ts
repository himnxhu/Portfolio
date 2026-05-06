const OMNIDIM_BASE_URL =
  process.env.OMNIDIM_BASE_URL ?? "https://backend.omnidim.io/api/v1";

interface DispatchCallParams {
  toNumber: string;
  context?: Record<string, unknown>;
}

export async function dispatchOmniDimensionCall({
  toNumber,
  context,
}: DispatchCallParams) {
  const apiKey = process.env.OMNIDIM_API_KEY;
  const agentId = Number(process.env.OMNIDIM_AGENT_ID);
  const fromNumberId = process.env.OMNIDIM_FROM_NUMBER_ID
    ? Number(process.env.OMNIDIM_FROM_NUMBER_ID)
    : undefined;

  if (!apiKey) {
    throw new Error("OMNIDIM_API_KEY is not configured");
  }

  if (!Number.isInteger(agentId) || agentId <= 0) {
    throw new Error("OMNIDIM_AGENT_ID is not configured");
  }

  if (fromNumberId !== undefined && (!Number.isInteger(fromNumberId) || fromNumberId <= 0)) {
    throw new Error("OMNIDIM_FROM_NUMBER_ID must be a positive integer");
  }

  const response = await fetch(`${OMNIDIM_BASE_URL}/calls/dispatch`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: agentId,
      to_number: toNumber,
      from_number_id: fromNumberId,
      call_context: {
        source: "portfolio",
        assistant: "Nami",
        ...context,
      },
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.error_description === "string"
        ? data.error_description
        : typeof data?.error === "string"
          ? data.error
          : "Failed to dispatch OmniDimension call";

    throw new Error(message);
  }

  return data;
}
