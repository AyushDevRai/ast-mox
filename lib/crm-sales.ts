import { z } from "zod";

export const ORGANIZATION_TYPES = [
  "Sports infra contractor",
  "Court builder",
  "School",
  "University",
  "Academy",
  "Municipal",
  "Government sports authority",
  "Real estate developer",
  "Gated community",
  "Sports club",
  "Architect",
  "Landscape consultant",
  "Hotel",
  "Resort",
  "Corporate campus",
  "Homeowner",
  "Dealer",
  "Distributor",
  "Student",
  "Job seeker",
  "Competitor",
  "Vendor",
] as const;

export const CONTACT_ROLES = [
  "Decision maker",
  "Owner",
  "Procurement",
  "Project head",
  "Principal",
  "Influencer",
  "Architect",
  "Coach",
  "Facility manager",
  "Other",
] as const;

export const COURT_COUNT_BANDS = [
  "Not sure",
  "0 courts / area-based project",
  "1 court",
  "2 courts",
  "3 or more courts",
] as const;

export const AREA_BANDS = [
  "Not sure",
  "Under 2000 m²",
  "2000 m² or more",
] as const;

export const SERVICE_REGIONS = [
  "Unknown",
  "Inside",
  "Outside",
] as const;

export const PROJECT_TYPES = [
  "New build",
  "Resurfacing",
  "Repair",
] as const;

export const COURT_SETTINGS = [
  "Outdoor",
  "Covered",
  "Indoor competition",
] as const;

export const crmSalesSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required.").max(100),
  last_name: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  mobile_no: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number with country code.")
    .max(30),
  organization: z.string().trim().max(150).optional().default(""),
  custom_organization_type: z.string().min(1, "Please select an organization type."),
  custom_contact_role: z.string().min(1, "Please select your role."),
  custom_lcs_court_count_band: z.string().min(1, "Please select court count band."),
  custom_lcs_area_band: z.string().min(1, "Please select approximate project area."),
  custom_in_service_region: z.string().min(1, "Please select service region."),
  custom_project_type: z.string().min(1, "Please select project type."),
  custom_setting: z.string().min(1, "Please select court setting."),
  bot_trap: z.string().max(0).optional(),
});

export type CrmSalesValues = z.infer<typeof crmSalesSchema>;

export type CrmSalesResult = {
  success: boolean;
  message: string;
  leadId?: string;
  serverMessages?: string[];
};
