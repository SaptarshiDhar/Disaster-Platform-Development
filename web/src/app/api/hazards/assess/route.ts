import { NextRequest, NextResponse } from "next/server";
import { assessAllHazards } from "@/lib/hazards/aggregate";
import { computeZone } from "@/lib/hazards/zone-engine";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  const latitude = Number(body?.latitude);
  const longitude = Number(body?.longitude);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return NextResponse.json(
      { error_code: "INVALID_COORDINATES", message: "latitude must be a finite number between -90 and 90." },
      { status: 422 }
    );
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error_code: "INVALID_COORDINATES", message: "longitude must be a finite number between -180 and 180." },
      { status: 422 }
    );
  }

  const bundle = await assessAllHazards({
    latitude,
    longitude,
    locationName: typeof body?.location_name === "string" ? body.location_name : null,
  });

  return NextResponse.json({ ...bundle, zone: computeZone(bundle) });
}
