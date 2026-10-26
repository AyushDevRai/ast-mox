"use client";

import { useState, useTransition } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, LoaderCircle, Sparkles, RotateCcw } from "lucide-react";
import { triggerMascotReaction } from "@/lib/mascot-events";
import { submitCrmSalesLead } from "@/app/actions/crm-sales";
import {
  ORGANIZATION_TYPES,
  CONTACT_ROLES,
  COURT_COUNT_BANDS,
  AREA_BANDS,
  SERVICE_REGIONS,
  PROJECT_TYPES,
  COURT_SETTINGS,
  type CrmSalesValues,
} from "@/lib/crm-sales";

interface ContactFormProps {
  idPrefix?: string;
  onSuccess?: () => void;
  inModal?: boolean;
  formUrl?: string;
  useIframe?: boolean;
}

const INITIAL_VALUES: CrmSalesValues = {
  first_name: "",
  last_name: "",
  email: "",
  mobile_no: "",
  organization: "",
  custom_organization_type: "",
  custom_contact_role: "",
  custom_lcs_court_count_band: "",
  custom_lcs_area_band: "",
  custom_in_service_region: "Unknown",
  custom_project_type: "",
  custom_setting: "",
  bot_trap: "",
};

export function ContactForm({
  idPrefix = "contact",
  onSuccess,
  inModal = false,
  formUrl = "http://crm.eastasia.cloudapp.azure.com/crm-form/sales",
  useIframe = false,
}: ContactFormProps) {
  const [values, setValues] = useState<CrmSalesValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof CrmSalesValues, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // If iframe rendering is explicitly requested
  if (useIframe) {
    const embedUrl = formUrl.includes("?") ? `${formUrl}&embed=1` : `${formUrl}?embed=1`;
    return (
      <div
        className={`crm-form-container ${inModal ? "crm-form-container-modal" : "crm-form-container-inline"}`}
        style={{ position: "relative", width: "100%", minHeight: inModal ? "560px" : "860px" }}
      >
        <iframe
          id={`${idPrefix}-crm-iframe`}
          src={embedUrl}
          title="AST Contact & Project Enquiry Form"
          className="crm-form-iframe"
          style={{
            width: "100%",
            height: inModal ? "720px" : "1060px",
            border: "none",
            borderRadius: inModal ? "0" : "12px",
            display: "block",
            background: "transparent",
          }}
        />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error as user types/selects
    if (errors[name as keyof CrmSalesValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CrmSalesValues, string>> = {};

    if (!values.first_name.trim()) {
      newErrors.first_name = "First name is required.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!values.mobile_no.trim()) {
      newErrors.mobile_no = "Phone / WhatsApp number is required.";
    } else if (values.mobile_no.trim().length < 7) {
      newErrors.mobile_no = "Please include country code and valid digits.";
    }

    if (!values.custom_organization_type) {
      newErrors.custom_organization_type = "Please select organization type.";
    }

    if (!values.custom_contact_role) {
      newErrors.custom_contact_role = "Please select your role.";
    }

    if (!values.custom_lcs_court_count_band) {
      newErrors.custom_lcs_court_count_band = "Please select number of courts.";
    }

    if (!values.custom_lcs_area_band) {
      newErrors.custom_lcs_area_band = "Please select approximate project area.";
    }

    if (!values.custom_in_service_region) {
      newErrors.custom_in_service_region = "Please select project service region.";
    }

    if (!values.custom_project_type) {
      newErrors.custom_project_type = "Please select project type.";
    }

    if (!values.custom_setting) {
      newErrors.custom_setting = "Please select court setting.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setGeneralError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      setGeneralError("Please fill in all required fields marked with *.");
      return;
    }

    startTransition(async () => {
      const res = await submitCrmSalesLead(values);

      if (res.success) {
        setSuccessLeadId(res.leadId || "Enquiry Recorded");

        // Mascot celebratory feedback
        triggerMascotReaction(
          "celebrate",
          "Enquiry received! Our sports infrastructure specialists will get back to you shortly! 🎉"
        );

        // LCS tracking integration
        if (typeof window !== "undefined") {
          try {
            if ((window as any).LCS?.identify) {
              (window as any).LCS.identify({
                email: values.email,
                phone: values.mobile_no,
              });
            }
            // Broadcast postMessage for any listening iframe parents / telemetry
            window.postMessage(
              {
                type: "crm:form-submitted",
                documentType: "CRM Lead",
                formName: "sales",
                identity: { email: values.email, phone: values.mobile_no },
                leadId: res.leadId,
              },
              "*"
            );
          } catch (_) {}
        }

        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2600);
        }
      } else {
        setGeneralError(res.message || "Failed to submit enquiry. Please try again.");
      }
    });
  };

  // Success view
  if (successLeadId) {
    return (
      <div className="crm-success-card animate-in fade-in zoom-in-95 duration-300">
        <div className="crm-success-ring">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="crm-success-title">Thank You!</h3>
        <p className="crm-success-note">
          Your project specifications have been securely submitted to Advanced Sports Tech CRM desk.
          Our technical advisors are reviewing your requirements.
        </p>

        {successLeadId && (
          <div>
            <span className="crm-lead-badge">
              Ref ID: <strong>{successLeadId}</strong>
            </span>
          </div>
        )}

        <div className="flex justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              setSuccessLeadId(null);
              handleReset();
            }}
            className="crm-btn-discard inline-flex items-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Submit Another Enquiry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className={`contact-form ${inModal ? "contact-form-modal" : ""}`}
      noValidate
      onSubmit={handleSubmit}
    >
      {/* Bot honeypot */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${idPrefix}-bot_trap`}>Bot Field</label>
        <input
          id={`${idPrefix}-bot_trap`}
          name="bot_trap"
          type="text"
          value={values.bot_trap}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* General Alert on Error */}
      {generalError && (
        <div className="form-result form-result-error mb-4" role="alert">
          <AlertCircle size={18} className="flex-shrink-0 text-red-600" />
          <p>{generalError}</p>
        </div>
      )}

      {/* Section 1: Contact Details */}
      <div className="crm-form-section">
        <div className="crm-form-section-title">
          <Sparkles size={14} />
          <span>01 / Contact Details</span>
        </div>

        <div className="form-grid">
          {/* First Name */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-first_name`}>
              First Name <span>*</span>
            </label>
            <input
              id={`${idPrefix}-first_name`}
              name="first_name"
              type="text"
              placeholder="e.g. Rajesh"
              value={values.first_name}
              onChange={handleChange}
              required
              aria-invalid={!!errors.first_name}
            />
            {errors.first_name && <p className="form-error">{errors.first_name}</p>}
          </div>

          {/* Last Name */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-last_name`}>Last Name</label>
            <input
              id={`${idPrefix}-last_name`}
              name="last_name"
              type="text"
              placeholder="e.g. Kumar"
              value={values.last_name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-email`}>
              Email <span>*</span>
            </label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              placeholder="name@company.com"
              value={values.email}
              onChange={handleChange}
              required
              aria-invalid={!!errors.email}
            />
            <div className="field-desc">Use the email you want us to contact you on.</div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Phone / WhatsApp */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-mobile_no`}>
              Phone / WhatsApp Number <span>*</span>
            </label>
            <input
              id={`${idPrefix}-mobile_no`}
              name="mobile_no"
              type="tel"
              placeholder="+91 98765 43210"
              value={values.mobile_no}
              onChange={handleChange}
              required
              aria-invalid={!!errors.mobile_no}
            />
            <div className="field-desc">Include your country code (e.g. +91).</div>
            {errors.mobile_no && <p className="form-error">{errors.mobile_no}</p>}
          </div>

          {/* Organization / Company */}
          <div className="form-field sm:col-span-2">
            <label htmlFor={`${idPrefix}-organization`}>Organization / Company Name</label>
            <input
              id={`${idPrefix}-organization`}
              name="organization"
              type="text"
              placeholder="e.g. Delhi Sports Complex, Apex Builders"
              value={values.organization}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Project Details */}
      <div className="crm-form-section">
        <div className="crm-form-section-title">
          <Sparkles size={14} />
          <span>02 / Project Details</span>
        </div>

        <div className="form-grid">
          {/* Organization Type */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-custom_organization_type`}>
              Organization Type <span>*</span>
            </label>
            <select
              id={`${idPrefix}-custom_organization_type`}
              name="custom_organization_type"
              value={values.custom_organization_type}
              onChange={handleChange}
              required
              aria-invalid={!!errors.custom_organization_type}
            >
              <option value="">Select organization type…</option>
              {ORGANIZATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.custom_organization_type && (
              <p className="form-error">{errors.custom_organization_type}</p>
            )}
          </div>

          {/* Your Role */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-custom_contact_role`}>
              Your Role <span>*</span>
            </label>
            <select
              id={`${idPrefix}-custom_contact_role`}
              name="custom_contact_role"
              value={values.custom_contact_role}
              onChange={handleChange}
              required
              aria-invalid={!!errors.custom_contact_role}
            >
              <option value="">Select your role…</option>
              {CONTACT_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.custom_contact_role && (
              <p className="form-error">{errors.custom_contact_role}</p>
            )}
          </div>

          {/* Project Type */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-custom_project_type`}>
              Project Type <span>*</span>
            </label>
            <select
              id={`${idPrefix}-custom_project_type`}
              name="custom_project_type"
              value={values.custom_project_type}
              onChange={handleChange}
              required
              aria-invalid={!!errors.custom_project_type}
            >
              <option value="">Select project type…</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.custom_project_type && (
              <p className="form-error">{errors.custom_project_type}</p>
            )}
          </div>

          {/* Court Setting */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-custom_setting`}>
              Court Setting <span>*</span>
            </label>
            <select
              id={`${idPrefix}-custom_setting`}
              name="custom_setting"
              value={values.custom_setting}
              onChange={handleChange}
              required
              aria-invalid={!!errors.custom_setting}
            >
              <option value="">Select court setting…</option>
              {COURT_SETTINGS.map((setting) => (
                <option key={setting} value={setting}>
                  {setting}
                </option>
              ))}
            </select>
            {errors.custom_setting && <p className="form-error">{errors.custom_setting}</p>}
          </div>

          {/* Number of Courts */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-custom_lcs_court_count_band`}>
              Number of Courts <span>*</span>
            </label>
            <select
              id={`${idPrefix}-custom_lcs_court_count_band`}
              name="custom_lcs_court_count_band"
              value={values.custom_lcs_court_count_band}
              onChange={handleChange}
              required
              aria-invalid={!!errors.custom_lcs_court_count_band}
            >
              <option value="">Select number of courts…</option>
              {COURT_COUNT_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
            <div className="field-desc">
              For 3 or more courts, select the final option. Undecided? Choose Not sure.
            </div>
            {errors.custom_lcs_court_count_band && (
              <p className="form-error">{errors.custom_lcs_court_count_band}</p>
            )}
          </div>

          {/* Approximate Project Area */}
          <div className="form-field">
            <label htmlFor={`${idPrefix}-custom_lcs_area_band`}>
              Approximate Project Area <span>*</span>
            </label>
            <select
              id={`${idPrefix}-custom_lcs_area_band`}
              name="custom_lcs_area_band"
              value={values.custom_lcs_area_band}
              onChange={handleChange}
              required
              aria-invalid={!!errors.custom_lcs_area_band}
            >
              <option value="">Select project area…</option>
              {AREA_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
            <div className="field-desc">
              Square metres. Area of 2000 m² or more qualifies as a large turnkey project.
            </div>
            {errors.custom_lcs_area_band && (
              <p className="form-error">{errors.custom_lcs_area_band}</p>
            )}
          </div>

          {/* Project Service Region */}
          <div className="form-field sm:col-span-2">
            <label htmlFor={`${idPrefix}-custom_in_service_region`}>
              Project Service Region <span>*</span>
            </label>
            <select
              id={`${idPrefix}-custom_in_service_region`}
              name="custom_in_service_region"
              value={values.custom_in_service_region}
              onChange={handleChange}
              required
              aria-invalid={!!errors.custom_in_service_region}
            >
              {SERVICE_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region === "Unknown" ? "Unknown (Pan-India / Not sure)" : region}
                </option>
              ))}
            </select>
            <div className="field-desc">
              Select Inside or Outside if you know AST&apos;s coverage radius; otherwise select Unknown.
            </div>
            {errors.custom_in_service_region && (
              <p className="form-error">{errors.custom_in_service_region}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {inModal ? (
        <div className="modal-submit-row">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="crm-btn-discard flex-shrink-0"
            >
              Discard
            </button>
            <button
              className="ast-button ast-button-red modal-submit-btn flex-1"
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" size={18} />
                  <span>Submitting to CRM…</span>
                </>
              ) : (
                <>
                  <span>Submit Project Enquiry</span>
                  <ArrowUpRight size={18} />
                </>
              )}
            </button>
          </div>
          <p className="modal-privacy-text">
            🔒 All project details are securely routed to AST&apos;s technical sales desk on Azure CRM.
          </p>
        </div>
      ) : (
        <div className="form-submit-row">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="crm-btn-discard"
            >
              Discard
            </button>
            <p>
              Your requirements are instantly routed
              <br />
              to AST technical sales specialists.
            </p>
          </div>
          <button
            className="ast-button ast-button-red"
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" size={18} />
                <span>Submitting to CRM…</span>
              </>
            ) : (
              <>
                <span>Submit Project Enquiry</span>
                <ArrowUpRight size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </form>
  );
}
