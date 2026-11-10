
import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET() {
  try {
    await client.connect();

    const db = client.db("bazardor");
    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully!",
      database: "bazardor",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
      },
      { status: 500 }
    );
  }
}
