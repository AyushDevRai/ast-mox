import { NextResponse } from "next/server";
import { submitCrmSalesLead } from "@/app/actions/crm-sales";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await submitCrmSalesLead(data);
    if (result.success) {
      return NextResponse.json(result);
    }
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error("[CRM Sales API Route Error]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
