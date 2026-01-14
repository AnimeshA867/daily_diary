import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { getCacheStats, clearUserCache } from "@/lib/redis";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getCacheStats(user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Cache stats error:", error);
    return NextResponse.json(
      { error: "Failed to get cache stats" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await clearUserCache(user.id);
    return NextResponse.json({ message: "Cache cleared successfully" });
  } catch (error) {
    console.error("Cache clear error:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}
