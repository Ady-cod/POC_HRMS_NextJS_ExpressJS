// app/api/quote/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/today");
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json({
        quote: data[0].q,
        name: data[0].a,
      });
    }

    return NextResponse.json({ error: "No quote found." }, { status: 500 });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote." },
      { status: 500 }
    );
  }
}
