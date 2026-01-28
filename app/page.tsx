"use client";
"use strict";
import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense ,lazy } from "react";
import NextImage from "next/image";
// import AchievementSection from "@/components/AchievementSection";
// import TeamSection from "@/components/TeamSection";
import { motion, useInView } from "framer-motion";
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
import { Image as ImageIcon } from 'lucide-react';
// debounce utility
function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}


const newsItems = [
  "🔔  Major Relief for CAs: Supreme Court rules Form 15CB issuance is not abetment of money laundering",
  "💼 MRS & Co. Recognized Among North India's Top 50 CA Firms & Empanelled as an RBI Category–I Firm",
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

interface StatItemProps {
  value: string;
  label: string;
  gradient: string;
  delay: number;
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
    className={`max-w-3xl ${center ? "mx-auto text-center" : ""
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
const TeamSection = lazy(() => import('@/components/TeamSection'));
const AchievementSection = lazy(() => import('@/components/AchievementSection'));

// FIX: Properly typed StatItem component
const StatItem: React.FC<StatItemProps> = ({ value, label, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
    className="relative p-7 rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-colors duration-300"
  >
    <div className={`text-4xl font-extrabold tracking-tight bg-gradient-to-br ${gradient} bg-clip-text text-transparent mb-1`}>
      {value}
    </div>
    <div className="text-slate-400 font-medium text-xs uppercase tracking-widest">
      {label}
    </div>
  </motion.div>
);

// ------------------------
// Main Component
// ------------------------
export default function MRSCoSite() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [, force] = useState(0);
  const growthRef = useRef(null);
  const isGrowthInView = useInView(growthRef, { once: true });

  useLockBody(menuOpen);



  const debouncedScroll = useDebounce((dir: number) => {
    {
      const el = sliderRef.current;
      if (!el) return;
      debouncedScroll(dir);
      const width = el.clientWidth;
      el.scrollBy({ left: dir * Math.floor(width * 0.85), behavior: "smooth" });
      force((x) => x + 1);
    };
  }, 150);
  const year = useMemo(() => new Date().getFullYear(), []);

  const scrollByCards = useCallback((dir = 1) => {
    debouncedScroll(dir);
  }, [debouncedScroll]);

  const scrollToSection = useCallback((id: string): void => {
    requestAnimationFrame(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
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




  const handleConsultationSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const submitButton = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      const originalText = submitButton?.textContent || "Submit";

      try {
        if (submitButton) {
          submitButton.textContent = "Sending...";
          submitButton.disabled = true;
        }

        const formData = new FormData(form);
        const data = {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          phone: (formData.get("phone") as string) || "",
          company: (formData.get("company") as string) || "",
          service: (formData.get("service") as string) || "",
          message: formData.get("message") as string,
        };

        const response = await fetch("/api/consultation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to send message");
        }

        // Defer alert to prevent blocking
        setTimeout(() => {
          alert(
            "✅ Thank you! Your consultation request has been sent successfully. We'll get back to you within 24 hours."
          );
        }, 0);

        form.reset();
      } catch (error) {
        console.error("Failed to send consultation email:", error);
        setTimeout(() => {
          alert(
            "❌ Failed to send message. Please try again or contact us directly at camrsandco@gmail.com"
          );
        }, 0);
      } finally {
        if (submitButton) {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      }
    },
    []
  );

  // Replace handleCareerSubmit with this:
  const handleCareerSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const submitButton = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      const originalText = submitButton?.textContent || "Submit";

      try {
        if (submitButton) {
          submitButton.textContent = "Sending...";
          submitButton.disabled = true;
        }

        const formData = new FormData(form);
        const response = await fetch("/api/career", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to submit application");
        }

        setTimeout(() => {
          alert(
            "✅ Thank you! Your application has been submitted successfully. We'll review it and get back to you soon."
          );
        }, 0);

        form.reset();
      } catch (error) {
        console.error("Failed to send career application:", error);
        setTimeout(() => {
          alert(
            "❌ Failed to submit application. Please try again or email us directly at camrsandco@gmail.com"
          );
        }, 0);
      } finally {
        if (submitButton) {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      }
    },
    []
  );
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* ENHANCED NAVBAR WITH COLORFUL BACKGROUND */}
      <div className="sticky top-0 z-50">
        <div className="relative overflow-hidden">
          {/* Background Image for Navbar */}
          <div className="absolute inset-0">
            {/* <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
              alt="Modern office background"
              className="w-full h-full object-cover"
            /> */}
            <NextImage
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
              alt="Modern office background"
              fill
              priority={true}
              // quality={80}
              sizes="100vw"
              className="object-cover"
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
                    // ["Home", "home"],
                    ["About", "about"],
                    ["Services", "services"],
                    ["News", "news"],
                    ["Team", "team"],
                    // ["Testimonials", "testimonials"],
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
                    // ["Home", "home"],
                    ["About", "about"],
                    ["Services", "services"],
                    ["News", "news"],
                    ["Team", "team"],
                    // ["Testimonials", "testimonials"],
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
          {/* <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern business background"
            className="w-full h-full object-cover"
          /> */}
          <NextImage
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern business background"
            fill
            priority={false}  // Not above fold
            quality={75}
            sizes="100vw"
            className="object-cover"
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

    {/* REFINED PROFESSIONAL HERO with Elegant Stats Card */}
<section
  id="home"
  className="relative pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
>
  {/* Live Background Image with Enhanced Overlay */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-indigo-950/90"></div>
    <NextImage
      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
      alt="Modern glass building with blue tones"
      fill
      priority={true}
      sizes="100vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQA//Z"
      className="object-cover"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-blue-950/40"></div>
    {/* Subtle animated gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-indigo-500/5 animate-pulse" style={{ animationDuration: '8s' }}></div>
  </div>

  {/* Subtle Floating Elements */}
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
      className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
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
      className="absolute top-40 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/25 to-indigo-500/25 rounded-full backdrop-blur-md border border-blue-400/30 shadow-lg shadow-blue-500/20"
    />
    <motion.div
      animate={{
        y: [0, 25, 0],
        rotate: [0, 10, 0],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
      className="absolute bottom-32 right-1/4 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-xl backdrop-blur-md border border-indigo-400/25"
    />
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced Badge */}
        <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/25 to-blue-500/25 backdrop-blur-xl text-white text-sm font-semibold mb-6 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
          <Award className="w-4 h-4 mr-2 text-cyan-300" />
          <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
            Trusted Since 1999
          </span>
        </div>

        {/* Enhanced Heading */}
        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
          <span className="text-white drop-shadow-lg">Your Trusted</span>
          <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mt-2 drop-shadow-2xl">
            Financial Partners
          </span>
        </h1>

        {/* Enhanced Description */}
        <p className="text-xl text-gray-100 mb-8 leading-relaxed font-light">
          We are a premier Chartered Accountant firm providing
          comprehensive <span className="text-cyan-300 font-medium">audit, tax, compliance</span>, and strategic finance
          solutions across India and beyond.
        </p>

        {/* Enhanced Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Button
            suppressHydrationWarning
            onClick={scrollToServices}
            className="group bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-400 hover:via-blue-400 hover:to-blue-500 text-white px-8 py-6 rounded-2xl transition-all duration-300 font-semibold flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:shadow-cyan-500/50 hover:scale-105 border border-cyan-400/20"
          >
            Explore Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            suppressHydrationWarning
            onClick={() => scrollToSection("consult")}
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-8 py-6 rounded-2xl transition-all duration-300 font-semibold flex items-center justify-center shadow-xl shadow-slate-900/20 hover:shadow-white/10 hover:scale-105 border-2 border-white/30 hover:border-white/50"
          >
            Book Consultation
          </Button>
        </div>

        {/* Enhanced Feature Badges */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center bg-emerald-500/15 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/30">
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="text-emerald-100 font-medium">ICAI Registered</span>
          </div>
          <div className="flex items-center bg-blue-500/15 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
            <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-100 font-medium">Pan India Services</span>
          </div>
          <div className="flex items-center bg-purple-500/15 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-400/30">
            <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-purple-100 font-medium">Startup Friendly</span>
          </div>
        </div>
      </motion.div>

     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative group p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-700/50 to-slate-900/50"
    >
      {/* 1. Dynamic Background Glow */}
      <div className="absolute -inset-10 bg-blue-500/5 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

      {/* 2. Main Container */}
      <div className="relative bg-[#0B0F1A] backdrop-blur-3xl p-10 rounded-[2.4rem] overflow-hidden border border-white/5 shadow-2xl">
        
        {/* subtle radial "spotlight" effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Stat Item Component */}
          <StatItem 
            value="500+" 
            label="Global Clients" 
            gradient="from-cyan-400 to-blue-500" 
            delay={0.1}
          />
          <StatItem 
            value="25+" 
            label="Years of Mastery" 
            gradient="from-blue-400 to-indigo-500" 
            delay={0.2}
          />
          <StatItem 
            value="40+" 
            label="Industries Impacted" 
            gradient="from-indigo-400 to-purple-500" 
            delay={0.3}
          />
          <StatItem 
            value="98%" 
            label="Retention Rate" 
            gradient="from-emerald-400 to-teal-500" 
            delay={0.4}
          />
          
        </div>
      </div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 via-white/60 to-gray-100/65"></div>
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
                With over 27+ years in the industry and a team of experienced
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

            {/* FIX: Changed animate to whileInView */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
              ref={growthRef}
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

      
      {/* <TeamSection /> */}

      {/* Lazy load below-the-fold */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <TeamSection />
      </Suspense>
      

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
                      <NextImage
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

      {/* ACHIEVEMENT SECTION */}
      {/* <AchievementSection /> */}
   
      <Suspense fallback={<div className="min-h-screen" />}>
        <AchievementSection />
      </Suspense>


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



      {/* OFFICES SECTION */}
      <section id="offices" className="relative py-20 overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white" />
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-50 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold uppercase tracking-wider mb-4 border border-blue-100">
                <MapPin className="w-4 h-4 mr-2" />
                Our Presence
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Visit Our Offices
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                With a strong presence across key locations, we are always within
                reach to serve your financial needs.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Office 1: Head Office (Ghaziabad) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Head Office
                </h3>
                <div className="space-y-4 text-slate-600">
                  <p className="font-medium text-slate-800">Ghaziabad</p>
                  <p className="text-sm leading-relaxed">
                    F 1/299, Shakti Apartment
                    <br />
                    Sector-4, Vaishali
                    <br />
                    Ghaziabad - 201010
                  </p>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-blue-500" />
                      +91 9999622662
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      camrsandco@gmail.com
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Office 2: Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Branch Office
                </h3>
                <div className="space-y-4 text-slate-600">
                  <p className="font-medium text-slate-800">Noida</p>
                  <p className="text-sm leading-relaxed ">
                    D, 89 Sector 2, Floor no. 1
                    <br />
                    Gautam Budh Nagar
                    <br />
                    Noida - 201301
                  </p>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-indigo-500" />
                      +91 9999622662
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Office 3: Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6 text-cyan-600 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Branch Office
                </h3>
                <div className="space-y-4 text-slate-600">
                  <p className="font-medium text-slate-800">Mumbai</p>
                  <p className="text-sm leading-relaxed ">
                    Office no. 5 , topiwala centre , Kakaji Nagar
                    <br />
                    Goregaon, West
                    <br />
                    Mumbai - 400001
                  </p>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-cyan-500" />
                      +91 9999622662
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=F+1/299,+Shakti+Apartment,+Sector-4,+Vaishali,+Ghaziabad+-+201010"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    F 1/299, Shakti Apartment
                    <br />
                    Sector-4, Vaishali - Ghaziabad-201010
                  </a>
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
