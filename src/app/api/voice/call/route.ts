import { dispatchOmniDimensionCall } from "@/lib/omnidimension";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";

const VOICE_CALL_BODY_LIMIT_BYTES = 2 * 1024;
const PHONE_NUMBER_PATTERN = /^\+[1-9]\d{7,14}$/;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await readJsonBody<{ phoneNumber?: unknown }>(
      req,
      VOICE_CALL_BODY_LIMIT_BYTES
    );

    if (typeof phoneNumber !== "string" || !PHONE_NUMBER_PATTERN.test(phoneNumber.trim())) {
      return Response.json(
        { error: "Enter a valid phone number with country code, like +919876543210" },
        { status: 400 }
      );
    }

    await dispatchOmniDimensionCall({
      toNumber: phoneNumber.trim(),
      context: {
        page: "portfolio",
      },
    });

    return Response.json({
      success: true,
      message: "Nami is calling now.",
    });
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: error.message }, { status: 413 });
    }

    return Response.json(
      {
        error: "Failed to start voice call",
        details: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
