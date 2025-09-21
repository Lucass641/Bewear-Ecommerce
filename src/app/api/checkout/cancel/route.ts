import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/checkout/cancel", request.url));
  }

  try {
    await db
      .update(orderTable)
      .set({
        status: "pending",
      })
      .where(eq(orderTable.stripeSessionId, sessionId));

    return NextResponse.redirect(new URL("/checkout/cancel", request.url));
  } catch (error) {
    console.error("Error updating order status to pending:", error);
    return NextResponse.redirect(new URL("/checkout/cancel", request.url));
  }
};
