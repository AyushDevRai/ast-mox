"use server";

import { crmSalesSchema, type CrmSalesResult, type CrmSalesValues } from "@/lib/crm-sales";

const CRM_BASE_URL =
  process.env.CRM_BASE_URL ||
  process.env.NEXT_PUBLIC_CRM_BASE_URL ||
  "https://srv1484793.hstgr.cloud";

export async function submitCrmSalesLead(input: unknown): Promise<CrmSalesResult> {
  const parsed = crmSalesSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Please check your details and try again.";
    return {
      success: false,
      message: firstError,
    };
  }

  const data: CrmSalesValues = parsed.data;

  // Bot honeypot check
  if (data.bot_trap && data.bot_trap.trim() !== "") {
    return {
      success: true,
      message: "Thank you! Your enquiry has been received.",
    };
  }

  const endpoint = `${CRM_BASE_URL.replace(/\/$/, "")}/api/method/frappe.website.doctype.web_form.web_form.accept`;

  const submitData = {
    doctype: "CRM Lead",
    first_name: data.first_name,
    last_name: data.last_name || "",
    email: data.email,
    mobile_no: data.mobile_no,
    organization: data.organization || "",
    custom_organization_type: data.custom_organization_type,
    custom_contact_role: data.custom_contact_role,
    custom_lcs_court_count_band: data.custom_lcs_court_count_band,
    custom_lcs_area_band: data.custom_lcs_area_band,
    custom_in_service_region: data.custom_in_service_region,
    custom_project_type: data.custom_project_type,
    custom_setting: data.custom_setting,
  };

  const payload = {
    web_form: "sales",
    data: JSON.stringify(submitData),
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      let errMsg = "Sorry, we couldn't submit your response. Please try again.";
      if (json && json._server_messages) {
        try {
          const parsedMsgs = JSON.parse(json._server_messages);
          if (Array.isArray(parsedMsgs) && parsedMsgs.length > 0) {
            const first = JSON.parse(parsedMsgs[0]);
            if (first && first.message) {
              errMsg = first.message.replace(/<[^>]*>?/gm, "");
            }
          }
        } catch (_) {}
      } else if (json && json.message && typeof json.message === "string") {
        errMsg = json.message;
      }
      return {
        success: false,
        message: errMsg,
      };
    }

    const leadId = json?.message?.name || "";
    return {
      success: true,
      leadId,
      message: leadId
        ? `Thank you! Your enquiry has been recorded (${leadId}). Our sports infrastructure specialists will get back to you shortly.`
        : "Thank you! Your response has been recorded. Our sports infrastructure specialists will get back to you shortly.",
    };
  } catch (error) {
    console.error("[CRM Lead Submission Error]:", error);
    return {
      success: false,
      message: "Network error connecting to CRM desk. Please check your internet connection or reach out on WhatsApp.",
    };
  }
}
