import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_TIMEZONE_API_URL;
const REVALIDATE_TIME = 60 * 60 * 24; // 24h

export const revalidate = REVALIDATE_TIME;

export async function GET() {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { error: "Timezone API URL is not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(API_URL, { next: { revalidate } });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch timezones" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const zones: string[] = Array.isArray(data) ? data : [];

    return NextResponse.json(zones, { status: 200 });
  } catch (error) {
    console.error("Timezone fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch timezones" },
      { status: 500 }
    );
  }
}
