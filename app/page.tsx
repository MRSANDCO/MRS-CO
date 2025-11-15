"use client";
/* eslint-disable @next/next/no-img-element */
"use strict";
import emailjs from "emailjs-com";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Linkedin,
  Facebook,
  Menu,
  X,
  Award,
  Shield,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  Send,
  Briefcase,
  GraduationCap,
} from "lucide-react";

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_CONSULTATION_TEMPLATE =
  process.env.NEXT_PUBLIC_EMAILJS_CONSULTATION_TEMPLATE;
const EMAILJS_CAREER_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_CAREER_TEMPLATE;

// Initialize EmailJS
if (typeof window !== "undefined" && EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Helper Data
// ------------------------
// Add this NEW array before the services array
const newsItems = [
  "🔔  Major Relief for CAs: Supreme Court rules Form 15CB issuance is not abetment of money laundering",
  "💼 MRS & Co. Recognized Among North India’s Top 50 CA Firms & Empanelled as an RBI Category–I Firm",
  // "📊 ",
  "🚀 Income Tax Return Filling due date extended to 10th December 2025 ",
  "⚖️ We're hiring! Senior Tax Consultants and CA Articleship positions open",
  "💡 MCA Extends Deadline for filling forms AOC-4 and MGT-7/7A to December 31,2025",
  // "📈 Major Relief for CAs: Supreme Court rules Form 15CB issuance is not abetment of money laundering.",
  "🎯 Successfully helped 50+ startups with fundraising in Q1 2025",
];
const services = [
  {
    title: "Startup Advisory",
    desc: "Incorporation to scale: ESOPs, cap tables, funding readiness and policy drafting.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Direct & International Tax",
    desc: "Tax planning, return filing, assessments, remittances, DTAA and FEMA advisory.",
    img: "https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?q=80&w=1600&auto=format&fit=crop",
  },

  {
    title: "GST & Indirect Tax",
    desc: "Registrations, compliance, health-checks, audits, refunds and litigation support.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Audit & Assurance",
    desc: "Statutory, internal and management audits to build trust and strengthen controls.",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  },

  {
    title: "Corporate & ROC Compliance",
    desc: "Company/LLP formation, secretarial, XBRL, and event-based filings.",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
  },

  {
    title: "Virtual CFO Services",
    desc: "Board-ready MIS, financial modelling, KPIs and cash flow stewardship.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop",
  },

  {
    title: "Business Valuation",
    desc: "Valuations for fundraising, buy/sell, ESOPs and regulatory purposes.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Risk & Process Advisory",
    desc: "SOPs, internal controls, enterprise risk and forensic support.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Bookkeeping & Payroll",
    desc: "Full-stack accounting on cloud, reconciliations, AR/AP, payroll and TDS.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Transfer Pricing",
    desc: "Planning, documentation, benchmarking and assessments.",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
  },

  {
    title: "Litigation & Representation",
    desc: "End-to-end representation across tax and regulatory forums.",
    img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1600&auto=format&fit=crop",
  },
];

// ------------------------
// UI Helpers
// ------------------------
interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

function useLockBody(lock: boolean) {
  useEffect(() => {
    if (lock) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [lock]);
}

const Section: React.FC<SectionProps> = ({ id, className = "", children }) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>
    {children}
  </section>
);

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  center,
}) => (
  <div
    className={`max-w-3xl ${
      center ? "mx-auto text-center" : ""
    } mb-10 md:mb-14`}
  >
    {eyebrow && (
      <div className="text-xs tracking-widest uppercase font-medium text-muted-foreground mb-3">
        {eyebrow}
      </div>
    )}
    <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted-foreground mt-3 text-base md:text-lg">
        {subtitle}
      </p>
    )}
  </div>
);

// ------------------------
// Main Component
// ------------------------
export default function MRSCoSite() {
  const [menuOpen, setMenuOpen] = useState(false);

  useLockBody(menuOpen);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [, force] = useState(0);

  const scrollByCards = (dir = 1) => {
    const el = sliderRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollBy({ left: dir * Math.floor(width * 0.85), behavior: "smooth" });
    force((x) => x + 1);
  };

  const year = useMemo(() => new Date().getFullYear(), []);

  // Initialize EmailJS
  useEffect(() => {
    if (typeof window !== "undefined" && EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log("EmailJS initialized successfully");
    }
  }, []);

  const scrollToServices = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // EmailJS Form Handlers
  const handleConsultationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    const originalText = submitButton?.textContent || "Submit";

    // Check if EmailJS is properly configured
    if (
      !EMAILJS_PUBLIC_KEY ||
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_CONSULTATION_TEMPLATE
    ) {
      alert(
        "❌ EmailJS configuration is incomplete. Please check your environment variables."
      );
      return;
    }

    try {
      // Show loading state
      if (submitButton) {
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;
      }

      const formData = new FormData(form);
      const service = formData.get("service") as string;
      const baseMessage = formData.get("message") as string;

      // Prepare email parameters
      const templateParams = {
        from_name: formData.get("name") as string,
        from_email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || "Not provided",
        company: (formData.get("company") as string) || "Not provided",
        service: service || "Not specified",
        message: baseMessage,
        full_message: service
          ? `Service Requested: ${service}\n\n${baseMessage}`
          : baseMessage,
        to_email: "camrsandco@gmail.com",
      };

      console.log("Sending consultation email with params:", templateParams);

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONSULTATION_TEMPLATE,
        templateParams
      );

      if (result.status === 200) {
        console.log("Email sent successfully:", result);
        alert(
          "✅ Thank you! Your consultation request has been sent successfully. We'll get back to you within 24 hours."
        );
        form.reset();
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error("Failed to send consultation email:", error);
      alert(
        "❌ Failed to send message. Please try again or contact us directly at camrsandco@gmail.com"
      );
    } finally {
      // Reset button state
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  };

  const handleCareerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    const originalText = submitButton?.textContent || "Submit";

    // Check if EmailJS is properly configured
    if (
      !EMAILJS_PUBLIC_KEY ||
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_CAREER_TEMPLATE
    ) {
      alert(
        "❌ EmailJS configuration is incomplete. Please check your environment variables."
      );
      return;
    }

    try {
      // Show loading state
      if (submitButton) {
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;
      }

      const formData = new FormData(form);
      const experience =
        (formData.get("experience") as string) || "Not specified";
      const notes = (formData.get("notes") as string) || "";

      // Handle file upload for resume
      const resumeFile = formData.get("resume") as File;
      let resumeInfo = "No resume attached";

      if (resumeFile && resumeFile.size > 0) {
        resumeInfo = `Resume: ${resumeFile.name} (${(
          resumeFile.size / 1024
        ).toFixed(2)} KB)`;
        // Note: EmailJS doesn't support file attachments directly in the browser
        // The user will need to mention this in the email
      }

      // Prepare email parameters
      const templateParams = {
        from_name: formData.get("name") as string,
        from_email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || "Not provided",
        role: (formData.get("role") as string) || "Not specified",
        experience: experience,
        notes: notes || "No additional notes",
        resume_info: resumeInfo,
        full_details: `
Role Applied: ${formData.get("role")}
Experience: ${experience}
${notes ? `Additional Notes: ${notes}` : ""}
Resume: ${
          resumeFile && resumeFile.size > 0
            ? resumeFile.name
            : "Not attached - candidate should send separately"
        }
        `,
        to_email: "camrsandco@gmail.com",
      };

      console.log("Sending career application with params:", templateParams);

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CAREER_TEMPLATE,
        templateParams
      );

      if (result.status === 200) {
        console.log("Email sent successfully:", result);

        let successMessage =
          "✅ Thank you! Your application has been submitted successfully. We'll review it and get back to you soon.";
        if (resumeFile && resumeFile.size > 0) {
          successMessage +=
            "\n\nNote: Please also email your resume directly to camrsandco@gmail.com since file attachments cannot be sent through the web form.";
        }

        alert(successMessage);
        form.reset();
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error("Failed to send career application:", error);
      alert(
        "❌ Failed to submit application. Please try again or email us directly at camrsandco@gmail.com"
      );
    } finally {
      // Reset button state
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* ENHANCED NAVBAR WITH COLORFUL BACKGROUND */}
      <div className="sticky top-0 z-50">
        <div className="relative overflow-hidden">
          {/* Background Image for Navbar */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
              alt="Modern office background"
              className="w-full h-full object-cover"
            />
            {/* Refined Colorful Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/12 via-indigo-400/8 to-blue-600/12"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-cyan-400/8"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/82 to-white/88 backdrop-blur-sm"></div>
          </div>

          {/* Refined Animated Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 90, 0],
                y: [0, -8, 0],
                opacity: [0.25, 0.5, 0.25],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-3 right-24 w-12 h-12 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full shadow-md shadow-blue-400/20"
            />
            <motion.div
              animate={{
                x: [0, -70, 0],
                rotate: [0, 120, 240, 360],
                opacity: [0.2, 0.45, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
              className="absolute bottom-2 left-12 w-8 h-8 bg-gradient-to-br from-cyan-400/45 to-blue-500/45 rounded-lg shadow-sm shadow-cyan-300/25"
            />
            <motion.div
              animate={{
                x: [0, 60, 0],
                y: [0, 12, 0],
                opacity: [0.15, 0.4, 0.15],
                rotate: [0, -60, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 6,
              }}
              className="absolute top-1/2 left-1/3 w-6 h-6 bg-gradient-to-br from-indigo-300/50 to-purple-400/50 rounded-full shadow-sm shadow-indigo-300/30"
            />
            <motion.div
              animate={{
                x: [0, -45, 0],
                y: [0, -15, 0],
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute top-4 right-1/2 w-4 h-4 bg-gradient-to-br from-slate-400/40 to-blue-400/40 rounded-lg shadow-sm shadow-slate-300/20"
            />
          </div>

          <div className="relative z-10 border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <button
                  suppressHydrationWarning
                  onClick={() => {
                    const homeSection = document.getElementById("home");
                    if (homeSection) {
                      homeSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
                >
                  {/* Rectangular Logo */}
                  <div className="relative w-14 h-14 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
                      alt="CA India Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold tracking-tight">
                      MRS & Co.
                    </div>
                    <div className="text-[10px] md:text-xs text-blue-700 font-semibold -mt-0.5 tracking-wide">
                      Chartered Accountants
                    </div>
                  </div>
                </button>
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                  {[
                    ["Home", "home"],
                    ["About", "about"],
                    ["Services", "services"],
                    ["News", "news"],
                    ["Testimonials", "testimonials"],
                    ["Careers", "careers"],
                    ["Startup Advisory", "startup-advisory"],
                    ["Contact", "contact"],
                  ].map(([label, id]) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className="px-3 py-2 rounded-xl hover:bg-white/60 hover:shadow-sm text-sm font-medium transition-all duration-500 hover:text-indigo-700"
                    >
                      {label}
                    </a>
                  ))}
                  <Button
                    asChild
                    className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-500"
                  >
                    <a href="#consult">Book a Call</a>
                  </Button>
                </nav>

                {/* Mobile */}
                <button
                  suppressHydrationWarning
                  className="md:hidden p-2 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all duration-500 hover:text-indigo-600"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((s) => !s)}
                >
                  {menuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>

            {/* Mobile Sheet */}
            {menuOpen && (
              <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 py-4 grid gap-2">
                  {[
                    ["Home", "home"],
                    ["About", "about"],
                    ["Services", "services"],
                    ["News", "news"],
                    ["Testimonials", "testimonials"],
                    ["Careers", "careers"],
                    ["Startup Advisory", "startup-advisory"],
                    ["Contact", "contact"],
                  ].map(([label, id]) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-3 rounded-xl hover:bg-slate-100 text-sm font-medium flex items-center justify-between"
                    >
                      <span>{label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* NEWS TICKER */}
      <section className="relative py-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern business background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/95 via-indigo-700/95 to-blue-800/95"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-10 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ x: [0, -80, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-0 left-20 w-12 h-12 bg-blue-300/20 rounded-full blur-lg"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 z-10">
          <div className="relative flex items-center z-10">
            <div className="bg-white text-blue-700 px-5 py-2.5 font-bold text-sm uppercase tracking-wider flex-shrink-0 shadow-lg rounded-lg flex items-center gap-2">
              <span className="text-lg">📢</span>
              <span className="hidden sm:inline">Latest Updates</span>
              <span className="sm:hidden">News</span>
            </div>

            <div className="flex-1 overflow-hidden relative max-w-5xl">
              <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: [0, -2000] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
              >
                {[...newsItems, ...newsItems].map((news, idx) => (
                  <span
                    key={idx}
                    className="text-white font-medium text-sm flex items-center gap-2"
                  >
                    {news}
                    <span className="text-cyan-300 font-bold">•</span>
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* HERO with Live Background */}
      <section
        id="home"
        className="relative pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
      >
        {/* Live Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-slate-800/75 to-indigo-900/80"></div>
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern glass building with blue tones"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-blue-900/30"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute top-40 left-10 w-12 h-12 bg-blue-400/15 rounded-full backdrop-blur-sm"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6 border border-white/30">
                <Award className="w-4 h-4 mr-2" />
                Trusted Since 1999
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Your Trusted
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                  Financial Partners
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                We are a premier Chartered Accountant firm providing
                comprehensive audit, tax, compliance, and strategic finance
                solutions across India and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  suppressHydrationWarning
                  onClick={scrollToServices}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  suppressHydrationWarning
                  onClick={() => scrollToSection("consult")}
                  variant="outline"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                >
                  Book Consultation
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  ICAI Registered
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Pan India Services
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Startup Friendly
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-cyan-300">500+</div>
                    <div className="text-gray-200">Happy Clients</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-cyan-300">25+</div>
                    <div className="text-gray-200">Years Experience</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-cyan-300">40+</div>
                    <div className="text-gray-200">Industries Served</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                  >
                    <div className="text-3xl font-bold text-cyan-300">98%</div>
                    <div className="text-gray-200">Client Satisfaction</div>
                  </motion.div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-500/30 rounded-3xl transform rotate-3 blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop"
            alt="Professional team working in modern office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/95 via-white/90 to-gray-100/95"></div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-16 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -20, 0],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-32 left-20 w-20 h-20 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-2xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-purple-200/15 to-pink-200/15 rounded-full"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              About MRS & Co.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We are more than just Chartered Accountants — we are your trusted
              financial advisors, helping businesses thrive with clarity and
              confidence.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Expertise & Experience
              </h3>
              <p className="text-gray-600">
                With over 12 years in the industry and a team of experienced
                CAs, we bring deep expertise across all financial domains.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Client-Centric Approach
              </h3>
              <p className="text-gray-600">
                We prioritize understanding your unique needs and provide
                tailored solutions that drive real business value.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Growth Partnership
              </h3>
              <p className="text-gray-600">
                From startups to established enterprises, we partner with you at
                every stage of your business journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEWS SECTION - THEMED TO MATCH WEBSITE */}
      <section id="news" className="relative py-16 overflow-hidden">
        {/* Background Image - Matching Umbrella Services Style */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2069&auto=format&fit=crop"
            alt="Professional business meeting in modern office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-indigo-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        </div>

        {/* Floating Elements - Subtle Like Your Site */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 90, 0],
              y: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 40, 0],
              opacity: [0.15, 0.35, 0.15],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header - Matching Your Section Headers */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Badge - Style from Your News Ticker */}
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-blue-600/90 text-white text-sm font-bold uppercase tracking-wider mb-6 shadow-xl backdrop-blur-sm border border-white/20"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(99, 102, 241, 0.4)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="mr-2 text-lg">📰</span>
                Stay Informed
              </motion.div>

              {/* Heading - Matching Your Typography */}
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Latest News & Updates
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Stay updated with the latest circulars, notifications, and
                announcements from ICAI and regulatory bodies
              </p>
            </motion.div>
          </div>

          {/* News Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "📌 All About GST ",
                desc: "Important updates for compliance - New GST regulations effective from April 2025",
                badge: "New",
                icon: "📄",
                gradient: "from-blue-500 to-blue-600",
                iconBg: "from-blue-400 to-blue-600",
                link: "https://www.cbic.gov.in/entities/gst",
                date: "2 days ago",
              },
              {
                title: "💡Income Tax Latest Amendments",
                desc: "ITR filing deadline extended to July 31, 2025 - Check revised guidelines",
                badge: "Updated",
                icon: "📊",
                gradient: "from-green-500 to-green-600",
                iconBg: "from-green-400 to-green-600",
                link: "https://www.incometax.gov.in/iec/foportal/latest-news",
                date: "2 days ago",
              },
              {
                title: "🏛️ All About MCA – Latest Rules & Alerts",
                desc: "Transfer Pricing impact analysis - Recent Supreme Court judgment details",
                badge: "Important",
                icon: "⚖️",
                gradient: "from-purple-500 to-purple-600",
                iconBg: "from-purple-400 to-purple-600",
                link: "https://www.mca.gov.in/content/mca/global/en/notifications-tender/news-updates/latest-news.html",
                date: "1 day ago",
              },
              {
                title: "Budget 2025 Highlights",
                desc: "New corporate tax rates and compliance requirements announced",
                badge: "Latest",
                icon: "📈",
                gradient: "from-orange-500 to-orange-600",
                iconBg: "from-orange-400 to-orange-600",
                link: "https://www.indiabudget.gov.in/doc/Key_to_Budget_Document_2025.pdf",
                date: "1 week ago",
              },
              {
                title: "📝 New Income Tax Act",
                desc: "Free webinar registration - Learn essential financial strategies",
                badge: "Event",
                icon: "💡",
                gradient: "from-cyan-500 to-cyan-600",
                iconBg: "from-cyan-400 to-cyan-600",
                link: "https://resource.cdn.icai.org/88381dtc-aps2500.pdf",
                date: "Today",
              },
              {
                title: "ICAI Latest Circular",
                desc: "Important notifications and updates for practicing Chartered Accountants",
                badge: "Circular",
                icon: "🔔",
                gradient: "from-indigo-500 to-indigo-600",
                iconBg: "from-indigo-400 to-indigo-600",
                link: "https://www.icai.org/",
                date: "Today",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                {/* Card with Your Glass Morphism Style */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative h-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 group-hover:border-white/40 overflow-hidden"
                >
                  {/* Glow Effect on Hover */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                  />

                  {/* Shine Effect - Like Your Consultation Form */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Icon - Matching Your Service Cards Style */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 bg-gradient-to-br ${item.iconBg} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}
                      >
                        {item.icon}
                      </motion.div>

                      {/* Badge - Your Badge Style */}
                      <span
                        className={`px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r ${item.gradient} text-white shadow-lg uppercase tracking-wider`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3 group-hover:text-white transition-colors duration-300">
                      {item.desc}
                    </p>

                    {/* Date - Matching Your Career Section Style */}
                    <div className="flex items-center text-xs text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.date}
                    </div>

                    {/* CTA Link - UPDATED WITH SEPARATE LINK */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center font-bold text-sm text-cyan-400 hover:text-cyan-300 group-hover:translate-x-2 transition-all duration-300"
                    >
                      View Details
                      <span className="ml-2 text-lg">→</span>
                    </a>
                  </div>

                  {/* Corner Accent - Subtle */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 rounded-tr-3xl transition-opacity duration-500`}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA - Matching Your Button Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.a
              href="https://www.icai.org/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 text-white font-bold text-lg shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Animated Background - Like Your Navbar Buttons */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
              </div>

              <span className="relative z-10 flex items-center">
                View All ICAI Updates
                <span className="ml-3 text-xl">→</span>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SLIDER */}
      <Section id="services" className="pt-2">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="What we do"
            title="A spectrum of services under one roof"
            subtitle="Swipe through to explore how we can help."
            center
          />

          <div className="relative">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
              <Button
                suppressHydrationWarning
                variant="outline"
                size="icon"
                className="rounded-2xl"
                onClick={() => scrollByCards(-1)}
                aria-label="Scroll to previous services"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10">
              <Button
                suppressHydrationWarning
                variant="outline"
                size="icon"
                className="rounded-2xl"
                onClick={() => scrollByCards(1)}
                aria-label="Scroll to next services"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div
              ref={sliderRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-1 scrollbar-thin scrollbar-thumb-slate-300"
            >
              {services.map((s, i) => (
                <div
                  key={i}
                  className="min-w-[85%] md:min-w-[45%] lg:min-w-[32%] snap-start"
                >
                  <Card className="rounded-3xl overflow-hidden h-full">
                    <div
                      className="relative w-full "
                      style={{ height: "170px" }}
                    >
                      <Image
                        src={s.img}
                        alt={s.title}
                        fill
                        sizes="100vw"
                        className="object-cover w-full h-full"
                        style={{
                          objectFit: "cover",
                          borderTopLeftRadius: "1.5rem",
                          borderTopRightRadius: "1.5rem",
                        }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      {s.desc}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* UMBRELLA OF OUR SERVICES with Enhanced Background */}
      <section className="relative py-16 overflow-hidden">
        {/* Enhanced Background with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2069&auto=format&fit=crop"
            alt="Professional business meeting in modern office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-indigo-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/15 to-slate-500/15 rounded-3xl backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -40, 0],
              rotate: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-20 left-16 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-slate-600/10 rounded-full backdrop-blur-sm"
          />
        </div>

        <div className="relative max-w-6xl mx-auto text-center px-4 md:px-6 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Umbrella of Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-200 mb-10"
          >
            From compliance to consulting — explore the complete spectrum of
            financial expertise we provide.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Audit & Assurance",
                desc: "Comprehensive audits ensuring accuracy and compliance for your business.",
                icon: "📊",
                color: "blue",
              },
              {
                title: "Taxation",
                desc: "Expert tax planning, filing, and compliance for individuals and corporations.",
                icon: "💰",
                color: "green",
              },
              {
                title: "Startup Advisory",
                desc: "Helping new businesses structure, register, and scale smoothly with financial clarity.",
                icon: "🚀",
                color: "purple",
              },
              {
                title: "Business Consultancy",
                desc: "Strategic advice to optimize operations and improve financial performance.",
                icon: "📈",
                color: "red",
              },
              {
                title: "Corporate Compliance",
                desc: "Ensuring all statutory and regulatory requirements are met seamlessly.",
                icon: "⚖️",
                color: "yellow",
              },
              {
                title: "Financial Planning",
                desc: "Customized solutions to achieve long-term stability and growth.",
                icon: "🏦",
                color: "indigo",
              },
              {
                title: "Forensic Audit",
                desc: "Specialized investigation of financial record to detect fraud and ensure transparency.",
                icon: "🔍",
                color: "indigo",
              },
              {
                title: "Accounting & Bookkeeping",
                desc: "Stay compliant, reduce errors, and gain clarity into your business finances.",
                icon: "📚",
                color: "indigo",
              },
              {
                title: "Financing & FundRaising",
                desc: "Strategic financing and fundraising solutions to secure capital and accelerate growth.",
                icon: "💸",
                color: "indigo",
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-300 group border border-white/20 hover:border-white/40"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-200 group-hover:text-white transition-colors duration-300">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Connected Newsroom Holdings Private Limited",
                role: "Acquired the BBC World Service Language Business and provide content for BBC's Indian Language platforms",
                text: "MRS & Co. helped us streamline our taxation and provided invaluable financial clarity.",
              },
              {
                name: "State Bank of India,Main Branch, Ghaziabad",
                role: "Provide Centralised Administrative Support",
                text: "MRS & Co. conducted audit with utmost accuracy and their expertise added the great value to the process.",
              },

              {
                name: "Punjab National bank, Branch Vaishali , Ghaziabad",
                role: "Nationalised Bank of India",
                text: "MRS & Co. executed the audit with remarkable diligence and professionalism.",
              },

              {
                name: "Vision India  Private Limited",
                role: "Human Resource and Technology Solutions",
                text: "Their startup advisory service gave us confidence to scale without compliance worries.",
              },
              {
                name: "Pravek Kalp Private Limited",
                role: "Manufacturers and sells Ayurvedic Formulations",
                text: "Professional, reliable, and truly client-focused — highly recommended for any business.",
              },
              {
                name: "Nxtmobility Energy Private Limited",
                role: "Leading electric revolution company",
                text: "MRS & Co. has been instrumental in our growth journey.",
              },
              {
                name: "RightAds Communications Private Limited",
                role: "Leading Digital Marketing Agency",
                text: "MRS & Co. has been a game changer for our business.",
              },
              {
                name: "S A Enterprises",
                role: "Design homespace and workspaces",
                text: "Their expertise in tax and compliance is unmatched.",
              },
              {
                name: "Mahameda Urban Cooperative Bank Ltd.",
                role: "Reputable High-Quality Financial Service Providance",
                text: "MRS & Co. performed the forensic audit of our bank with utmost professionalism.",
              },
            ].map((t, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.03 }}
              >
                <p className="text-gray-700 italic mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <h4 className="font-semibold text-blue-800">{t.name}</h4>
                <span className="text-gray-500 text-sm">{t.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTATION - book a consultation*/}
      {/* ENHANCED CONSULTATION FORM */}
      <section id="consult" className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2126&auto=format&fit=crop"
            alt="Professional consultation in modern office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-indigo-900/85"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 right-10 w-32 h-32 border-2 border-blue-400/15 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 left-10 w-20 h-20 bg-gradient-to-br from-slate-400/15 to-blue-500/15 rounded-2xl backdrop-blur-sm"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Form Header & Info */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-xs tracking-widest uppercase font-medium text-cyan-300 mb-3">
                  Book a consultation
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                  Speak with a Chartered Accountant
                </h2>
                <p className="text-gray-200 mb-8 text-lg">
                  Tell us a bit about your requirement and we&apos;ll get back
                  promptly.
                </p>

                {/* Contact Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="font-medium">Quick Response</div>
                      <div className="text-sm text-gray-300">
                        Reply within 24 hours
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <div className="font-medium">Expert Team</div>
                      <div className="text-sm text-gray-300">
                        Certified CAs with 12+ years experience
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="font-medium">Confidential</div>
                      <div className="text-sm text-gray-300">
                        Your information is secure
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Enhanced Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20"
            >
              <form className="grid gap-4" onSubmit={handleConsultationSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">
                      Full Name *
                    </label>
                    <Input
                      suppressHydrationWarning
                      name="name"
                      placeholder="Your name"
                      required
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      suppressHydrationWarning
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      suppressHydrationWarning
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">
                      Company
                    </label>
                    <Input
                      suppressHydrationWarning
                      name="company"
                      placeholder="Company name"
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Service Required
                  </label>
                  <select
                    suppressHydrationWarning
                    name="service"
                    className="w-full rounded-xl bg-white/20 border-white/30 text-white focus:border-blue-300 focus:ring-blue-300/20 p-3"
                  >
                    <option value="" className="text-gray-800">
                      Select a service
                    </option>
                    <option value="audit" className="text-gray-800">
                      Audit & Assurance
                    </option>
                    <option value="tax" className="text-gray-800">
                      Taxation
                    </option>
                    <option value="startup" className="text-gray-800">
                      Startup Advisory
                    </option>
                    <option value="compliance" className="text-gray-800">
                      Corporate Compliance
                    </option>
                    <option value="cfo" className="text-gray-800">
                      Virtual CFO
                    </option>
                    <option value="forensic" className="text-gray-800">
                      Forensic Audit
                    </option>
                    <option value="financing" className="text-gray-800">
                      Financing & Fundraising
                    </option>
                    <option value="accounting" className="text-gray-800">
                      Accounting & Bookkeeping
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Message *
                  </label>
                  <Textarea
                    suppressHydrationWarning
                    name="message"
                    placeholder="Briefly describe your requirement..."
                    required
                    className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20 min-h-[120px]"
                    rows={5}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center text-sm text-gray-200">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reply within 1 business day
                  </div>
                  <Button
                    suppressHydrationWarning
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STARTUP ADVISORY - Separate Section */}
      <Section id="startup-advisory" className="bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="Advisory for Startups & SMBs"
            title="Launch, comply, scale"
            subtitle="From incorporation and GST to board-ready MIS and fundraising—we're your finance stack."
          />
          <div className="grid gap-4 mb-6">
            {[
              "Incorporation advisory (Company/LLP, licenses, bank A/C)",
              "Founders' agreements, ESOPs, cap table & registry",
              "GST & TDS registrations, returns, reconciliations",
              "Virtual CFO: KPIs, runway, budget vs actual, MIS",
              "Investor readiness: data room, policies, valuation support",
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" />
                <div className="text-slate-700">{p}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button asChild className="rounded-2xl">
              <a href="#services">View Services</a>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
              <a href="#contact">Contact us</a>
            </Button>
          </div>
        </div>
      </Section>

      {/* CAREERS */}
      <Section
        id="careers"
        className="bg-slate-900 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <SectionHeader
            eyebrow="Join Our Team"
            title="Build Your Career with MRS & Co."
            subtitle="We are always looking for curious minds who love numbers, nuance, and making a difference."
            center
          />

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Why Join Us */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Growth Opportunities
              </h3>
              <p className="text-gray-300 text-sm">
                Accelerate your career with exposure to diverse industries,
                cutting-edge financial technologies, and mentorship from senior
                CAs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Collaborative Culture
              </h3>
              <p className="text-gray-300 text-sm">
                Work in a supportive environment where knowledge sharing,
                innovation, and professional development are encouraged and
                rewarded.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Recognition & Rewards
              </h3>
              <p className="text-gray-300 text-sm">
                Competitive compensation, performance bonuses, professional
                development budget, and comprehensive benefits package.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Openings */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="rounded-2xl bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Current Openings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div>
                        <div className="font-medium">Tax Consultant</div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          Delhi · Onsite · 1–3 yrs exp
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        Full-time
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div>
                        <div className="font-medium">CA Articleship</div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Multiple locations · IPCC cleared
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        Internship
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div>
                        <div className="font-medium">Financial Analyst</div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          Ghaziabad· Remote · 0–2 yrs exp
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        Full-time
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="rounded-2xl bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Send className="w-5 h-5 mr-2" />
                    Apply Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid gap-3"
                    onSubmit={handleCareerSubmit}
                    encType="multipart/form-data"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        suppressHydrationWarning
                        name="name"
                        placeholder="Full name"
                        required
                        className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                      <Input
                        suppressHydrationWarning
                        name="email"
                        type="email"
                        placeholder="Email address"
                        required
                        className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        suppressHydrationWarning
                        name="phone"
                        type="tel"
                        placeholder="Phone number"
                        className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                      <select
                        suppressHydrationWarning
                        name="role"
                        required
                        className="rounded-xl bg-white/20 border-white/30 text-white p-3"
                      >
                        <option value="" className="text-gray-800">
                          Select position
                        </option>
                        <option
                          value="tax-consultant"
                          className="text-gray-800"
                        >
                          Tax Consultant
                        </option>
                        <option value="Articleship" className="text-gray-800">
                          CA Articleship
                        </option>
                        <option
                          value="Financial-analyst"
                          className="text-gray-800"
                        >
                          Financial Analyst
                        </option>
                        <option value="other" className="text-gray-800">
                          Other
                        </option>
                      </select>
                    </div>

                    <Input
                      suppressHydrationWarning
                      name="experience"
                      placeholder="Years of experience"
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />

                    <Textarea
                      suppressHydrationWarning
                      name="notes"
                      placeholder="Brief note about yourself, qualifications & achievements..."
                      rows={4}
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />

                    {/* Resume Upload Field */}
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">
                        Attach Resume (PDF/DOCX)
                      </label>
                      <input
                        suppressHydrationWarning
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        required
                        className="block w-full text-white bg-white/20 border-white/30 rounded-xl p-2"
                      />
                    </div>

                    <Button
                      suppressHydrationWarning
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl py-3 font-medium transition-all duration-300 hover:scale-105"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">MRS & Co.</h3>
                  <p className="text-sm text-gray-400">Chartered Accountants</p>
                </div>
              </div>
              <p className="text-gray-400">
                Your trusted financial partners for growth, governance &
                compliance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#consult"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>camrsandco@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+91 9999622662</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1" />
                  <span>
                    F 1/299,Shakti Apartment
                    <br />
                    Sector-4, vaishali -Ghaziabad-201010{" "}
                  </span>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {year} MRS & Co. Chartered Accountants. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
