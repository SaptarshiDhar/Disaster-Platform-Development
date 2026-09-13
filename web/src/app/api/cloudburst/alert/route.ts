import { NextRequest, NextResponse } from "next/server";
import { cloudburstEngineFetch, CloudburstEngineRequestError } from "@/lib/cloudburst-engine";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const data = await cloudburstEngineFetch("/alert", { method: "POST", body: JSON.stringify(body) });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof CloudburstEngineRequestError) {
      return NextResponse.json(err.body, { status: err.status });
    }
    return NextResponse.json(
      { error_code: "CLOUDBURST_ENGINE_UNREACHABLE", message: "Could not reach the cloudburst engine. Is it running on CLOUDBURST_ENGINE_API_URL?" },
      { status: 502 }
    );
  }
}
