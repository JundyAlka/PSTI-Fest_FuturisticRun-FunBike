import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim().slice(0, 80);
  const eventType = searchParams.get("eventType") ?? "futuristic-run";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = insforge.database
    .from("participants")
    .select(
      "id, reg_number, full_name, email, phone, category, jersey_size, bib_name, bib_number, payment_status, payment_method, payment_amount, payment_proof, status, created_at, verified_at, verified_by, rejection_reason, blood_type, city, province, event_type",
      { count: "exact" }
    )
    .eq("event_type", eventType)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category && category !== "all") query = query.eq("category", category);
  if (status && status !== "all") query = query.eq("payment_status", status);
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,reg_number.ilike.%${search}%`);

  const { data: participants, count, error } = await query;

  if (error) {
    console.error("[admin/participants]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    participants,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  });
}
