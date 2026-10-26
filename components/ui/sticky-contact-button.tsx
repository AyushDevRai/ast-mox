"use client";

import { useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { motion, AnimatePresence } from "motion/react";
import { ContactForm } from "@/components/sections/contact-form";

export function StickyContactButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("ast:open-enquiry-modal", handleOpen);
    return () => {
      window.removeEventListener("ast:open-enquiry-modal", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      // Notify LCS tracker that user opened contact enquiry modal
      if ((window as any).LCS?.track) {
        (window as any).LCS.track("page_view", {
          pageTier: "contact",
          resourceId: `${window.location.origin}/#contact-modal`,
        });
      }
    }
  }, [open]);

  return (
    <>
      {/* Premium Apple-style Floating Contact Pill */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sticky-enquire-tab"
        aria-label="Open contact enquiry form"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-lcs-event="quote_requested"
      >
        <span className="pill-beacon" aria-hidden="true">
          <span className="beacon-ping" />
          <span className="beacon-core" />
        </span>
        <MessageSquare size={15} className="pill-icon" aria-hidden="true" />
        <span className="pill-label">CONTACT US</span>
      </button>

      {/* Accessible Radix Dialog with Apple App Opening Physics */}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              {/* Frosted Glass Overlay */}
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="enquire-modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                />
              </DialogPrimitive.Overlay>

              {/* Modal Card originating directly from the side pill */}
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  className="enquire-modal-card"
                  initial={{
                    opacity: 0,
                    scale: 0.15,
                    x: "38vw",
                    y: "-50%",
                    borderRadius: 48,
                    filter: "blur(12px)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: "-50%",
                    y: "-50%",
                    borderRadius: 22,
                    filter: "blur(0px)",
                    transition: {
                      type: "spring",
                      stiffness: 320,
                      damping: 26,
                      mass: 0.75,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.18,
                    x: "38vw",
                    y: "-50%",
                    borderRadius: 48,
                    filter: "blur(8px)",
                    transition: {
                      duration: 0.22,
                      ease: [0.32, 0, 0.67, 0],
                    },
                  }}
                >
                  {/* Close Button */}
                  <DialogPrimitive.Close asChild>
                    <button
                      type="button"
                      className="enquire-modal-close"
                      aria-label="Close enquiry modal"
                    >
                      <X size={18} />
                    </button>
                  </DialogPrimitive.Close>

                  {/* Modal Header */}
                  <div className="enquire-modal-header">
                    <span className="section-eyebrow">
                      <span className="red-rule" />
                      GET IN TOUCH
                    </span>
                    <h2 className="enquire-modal-title">
                      PROJECT <span className="quiet-text">ENQUIRY.</span>
                    </h2>
                    <p className="enquire-modal-desc">
                      Speak directly with an AST sports infrastructure specialist about your venue, surface
                      certifications, or lighting requirements.
                    </p>
                  </div>

                  {/* Modal Body with Guaranteed Visible Submit Button */}
                  <div className="enquire-modal-body">
                    <ContactForm
                      idPrefix="modal-enquire"
                      inModal={true}
                      onSuccess={() => setOpen(false)}
                    />
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </>
  );
}
