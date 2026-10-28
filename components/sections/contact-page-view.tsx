"use client";

import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { HomepageFooter } from "@/components/layout/homepage-footer";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { ContactForm } from "@/components/sections/contact-form";
import { company } from "@/content/ast";

const contactHighlights = [
  {
    icon: Award,
    title: "Global Certification Standards",
    desc: "World Athletics Class 1 & 2, FIH Global Elite, and FIFA Quality Pro certified systems.",
  },
  {
    icon: ShieldCheck,
    title: "Exclusive Partner Network",
    desc: "Sole representative of Polytan / Sport Group Germany across India for Poligras, Rekortan & LigaTurf.",
  },
  {
    icon: Clock,
    title: "Rapid Technical Response",
    desc: "Direct consultation with lead sports infrastructure engineers for surveys, BOQs, and tenders.",
  },
];

export function ContactPageView() {
  return (
    <div className="min-h-screen bg-[var(--home-surface,#0c130f)] text-[var(--home-ink,#edf0ea)]">
      <SiteHeader homeHref="/" />

      <main>
        {/* Contact Hero Section */}
        <section
          className="section-pad pt-36 pb-16 relative overflow-hidden"
          data-nav-theme="dark"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 via-transparent to-transparent pointer-events-none" />
          <div className="page-container relative z-10">
            <div className="max-w-3xl">
              <span className="section-eyebrow text-red-500 font-semibold tracking-wider text-xs uppercase flex items-center gap-2 mb-4">
                <span className="w-6 h-[2px] bg-red-600 inline-block" />
                GET IN TOUCH
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase font-[var(--font-barlow)] leading-[1.08] mb-6">
                CONNECT WITH AST{" "}
                <span className="text-[var(--home-muted,#859489)]">SPECIALISTS.</span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--home-muted,#859489)] leading-relaxed max-w-2xl">
                Planning a championship stadium, institutional running track, synthetic turf, or arena lighting?
                Speak directly with India’s leading sports infrastructure engineering firm.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              {contactHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <item.icon className="text-red-500 flex-shrink-0 mt-1" size={22} />
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--home-muted,#859489)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Office Details Section */}
        <section
          id="contact"
          className="section-pad contact-section bg-[var(--home-light-surface,#f4f6f3)] text-[var(--home-ink-dark,#16201b)]"
          data-nav-theme="light"
          aria-labelledby="contact-heading"
        >
          <div className="page-container contact-layout">
            {/* Left Column: Office & Direct Contact Info */}
            <div className="contact-details">
              <h2 id="contact-heading" className="text-3xl sm:text-4xl font-bold uppercase font-[var(--font-barlow)]">
                OFFICIAL <br />
                <span className="text-[var(--home-muted-dark,#6b7a70)]">COMMUNICATION.</span>
              </h2>
              <p className="contact-company font-medium text-base text-[var(--home-muted-dark,#6b7a70)] mt-2">
                {company.name}
              </p>

              <address className="mt-6 not-italic flex flex-col gap-4 text-sm">
                <a
                  href="https://maps.google.com/?q=E-42+Okhla+Industrial+Area+Phase+II+New+Delhi+110020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-red-600 transition-colors"
                >
                  <MapPin size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <span>
                    {company.contact.address}
                    <br />
                    {company.contact.city}
                  </span>
                </a>

                <a
                  href={company.contact.phoneHref}
                  className="flex items-center gap-3 hover:text-red-600 transition-colors"
                >
                  <Phone size={19} className="text-red-600 flex-shrink-0" />
                  <span>{company.contact.phone}</span>
                </a>

                <a
                  href={`mailto:${company.contact.email}`}
                  className="flex items-center gap-3 hover:text-red-600 transition-colors"
                >
                  <Mail size={19} className="text-red-600 flex-shrink-0" />
                  <span>{company.contact.email}</span>
                </a>

                <a
                  href={company.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-5 py-3 rounded-full bg-[#25D366] text-white font-semibold text-xs tracking-wider uppercase shadow-md hover:bg-[#20ba59] transition-all w-fit"
                >
                  <WhatsAppIcon size={18} />
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight size={15} />
                </a>
              </address>

              {/* Working Hours & Scope */}
              <div className="mt-10 p-5 rounded-xl bg-black/[0.04] border border-black/[0.06] text-xs space-y-2">
                <p className="font-semibold text-black/90 uppercase tracking-wide">
                  Technical Project Desk
                </p>
                <p className="text-black/70 leading-relaxed">
                  Monday – Saturday: 09:30 AM to 06:30 PM IST
                  <br />
                  Surveys, BOQ specifications, and turnkey tender consultations across all Indian states and UTs.
                </p>
              </div>
            </div>

            {/* Right Column: Embedded CRM Sales & Enquiry Form */}
            <div className="contact-form-panel">
              <h3 className="text-2xl font-bold uppercase font-[var(--font-barlow)]">
                Project & Sales Enquiry
              </h3>
              <p className="text-sm text-[var(--home-muted-dark,#6b7a70)] mt-1 mb-4">
                Submit your project requirements below. All enquiries are instantly processed by AST’s technical sales team.
              </p>
              <ContactForm idPrefix="page-contact" formUrl="https://srv1484793.hstgr.cloud/crm-form/sales" />
            </div>
          </div>
        </section>
      </main>

      <HomepageFooter homeHref="/" />

      <a
        href={company.contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Contact AST on WhatsApp"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  );
}
