import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactPageView } from "@/components/sections/contact-page-view";

export const metadata: Metadata = {
  title: "Contact Us — Advanced Sports Technologies (AST) | Sales & Project Enquiries",
  description:
    "Connect with Advanced Sports Technologies (AST) for Olympic-standard running tracks, hockey turfs, synthetic football pitches, and institutional sports infrastructure across India.",
};

export default async function ContactUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPageView />;
}
