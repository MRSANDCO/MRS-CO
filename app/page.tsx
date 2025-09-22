"use client";
/* eslint-disable @next/next/no-img-element */
"use strict";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Mail, Phone, MapPin, Calendar, ArrowLeft, ArrowRight, ChevronRight, Linkedin, Facebook, Menu, X, Award, Shield, Target, TrendingUp, CheckCircle, Clock, Users, Send, Briefcase, GraduationCap } from "lucide-react";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Utility function to handle API calls
const submitForm = async (endpoint: string, data: Record<string, unknown>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    console.error(`Error submitting ${endpoint} form:`, error);
    throw error;
  }
};

// ------------------------
// Helper Data
// ------------------------
const services = [
  {
    title: "Audit & Assurance",
    desc: "Statutory, internal and management audits to build trust and strengthen controls.",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
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
    title: "Corporate & ROC Compliance",
    desc: "Company/LLP formation, secretarial, XBRL, and event-based filings.",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop", // <-- replaced broken URL
  },

  {
    title: "Virtual CFO Services",
    desc: "Board-ready MIS, financial modelling, KPIs and cash flow stewardship.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Startup Advisory",
    desc: "Incorporation to scale: ESOPs, cap tables, funding readiness and policy drafting.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
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
  <section id={id} className={`py-16 md:py-24 ${className}`}>{children}</section>
);

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, subtitle, center }) => (
  <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-10 md:mb-14`}>
    {eyebrow && (
      <div className="text-xs tracking-widest uppercase font-medium text-muted-foreground mb-3">{eyebrow}</div>
    )}
    <h2 className="text-3xl md:text-4xl font-semibold leading-tight">{title}</h2>
    {subtitle && <p className="text-muted-foreground mt-3 text-base md:text-lg">{subtitle}</p>}
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

  const scrollToServices = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to scroll to any section by id
  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };



  // Form submission handlers
  const handleConsultationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton?.textContent || 'Submit';

    try {
      // Show loading state
      if (submitButton) {
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
      }

      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '',
        company: formData.get('company') as string || '',
        message: formData.get('message') as string
      };

      const result = await submitForm('consultation', data);

      // Show success message
      alert(`✅ ${result.message}`);

      // Reset form safely
      const form = e.currentTarget;
      if (form) {
        form.reset();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      alert(`❌ ${errorMessage}`);
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
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton?.textContent || 'Submit';

    try {
      // Show loading state
      if (submitButton) {
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
      }

      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '',
        role: formData.get('role') as string || '',
        experience: formData.get('experience') as string || '',
        notes: formData.get('notes') as string || ''
      };

      const result = await submitForm('careers', data);

      // Show success message
      alert(`✅ ${result.message}`);

      // Reset form safely
      const form = e.currentTarget;
      if (form) {
        form.reset();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      alert(`❌ ${errorMessage}`);
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
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-3 right-24 w-12 h-12 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full shadow-md shadow-blue-400/20"
            />
            <motion.div
              animate={{
                x: [0, -70, 0],
                rotate: [0, 120, 240, 360],
                opacity: [0.2, 0.45, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
              className="absolute bottom-2 left-12 w-8 h-8 bg-gradient-to-br from-cyan-400/45 to-blue-500/45 rounded-lg shadow-sm shadow-cyan-300/25"
            />
            <motion.div
              animate={{
                x: [0, 60, 0],
                y: [0, 12, 0],
                opacity: [0.15, 0.4, 0.15],
                rotate: [0, -60, 0]
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 6
              }}
              className="absolute top-1/2 left-1/3 w-6 h-6 bg-gradient-to-br from-indigo-300/50 to-purple-400/50 rounded-full shadow-sm shadow-indigo-300/30"
            />
            <motion.div
              animate={{
                x: [0, -45, 0],
                y: [0, -15, 0],
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.08, 1]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-4 right-1/2 w-4 h-4 bg-gradient-to-br from-slate-400/40 to-blue-400/40 rounded-lg shadow-sm shadow-slate-300/20"
            />
          </div>

          <div className="relative z-10 border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <button
                  onClick={() => {
                    const homeSection = document.getElementById('home');
                    if (homeSection) {
                      homeSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
                >
                  {/* Rectangular Logo */}
                  <div className="relative w-16 h-12 bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-500 shadow-2xl shadow-blue-500/40 grid place-items-center border-4 border-white rounded-xl group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl tracking-tight drop-shadow-lg">MRS</span>
                    {/* Decorative Shine */}
                    <span className="absolute top-1 left-1 w-8 h-2 bg-white/30 rounded-full blur-sm opacity-70"></span>
                    {/* Decorative Dot
                    <span className="absolute bottom-2 right-2 w-2 h-2 bg-cyan-300 rounded-full shadow-lg"></span> */}
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold tracking-tight">MRS & Co.</div>
                    <div className="text-[10px] md:text-xs text-blue-700 font-semibold -mt-0.5 tracking-wide">Chartered Accountants</div>
                  </div>
                </button>
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                  {[
                    ["Home", "home"],
                    ["About", "about"],
                    ["Services", "services"],
                    ["Testimonials", "testimonials"],
                    ["Careers", "careers"],
                    ["Startup Advisory", "startup-advisory"],
                    ["Contact", "contact"],
                  ].map(([label, id]) => (
                    <a key={id} href={`#${id}`} className="px-3 py-2 rounded-xl hover:bg-white/60 hover:shadow-sm text-sm font-medium transition-all duration-500 hover:text-indigo-700">
                      {label}
                    </a>
                  ))}
                  <Button asChild className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-500">
                    <a href="#consult">Book a Call</a>
                  </Button>
                </nav>

                {/* Mobile */}
                <button
                  className="md:hidden p-2 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all duration-500 hover:text-indigo-600"
                  aria-label="Toggle Menu"
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

      {/* HERO */}
      {/* <section id="hero" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Trusted Since 1999
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Trusted
                <span className="text-blue-600 block">Financial Partners</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We are a premier Chartered Accountant firm providing comprehensive audit, tax, compliance, and strategic finance solutions across India and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={scrollToServices}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => {
                    const consultSection = document.getElementById('consult');
                    if (consultSection) {
                      consultSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Book Consultation
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ICAI Registered
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Pan India Services
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Startup Friendly
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">500+</div>
                    <div className="text-gray-600">Happy Clients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">25+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">40+</div>
                    <div className="text-gray-600">Industries Served</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">98%</div>
                    <div className="text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl transform rotate-3"></div>
            </div>
          </div>
        </div>
      </section> */}
      {/* HERO with Live Background */}
      <section id="home" className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
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
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
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
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">Financial Partners</span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                We are a premier Chartered Accountant firm providing comprehensive audit, tax, compliance, and strategic finance solutions across India and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={scrollToServices}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => scrollToSection('consult')}
                  variant="outline"
                  className="border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl backdrop-blur-md transition-all duration-300 font-medium hover:scale-105"
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
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-16 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -20, 0],
              rotate: [0, -90, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-32 left-20 w-20 h-20 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-2xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
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
              We are more than just Chartered Accountants — we are your trusted financial advisors, helping businesses thrive with clarity and confidence.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expertise & Experience</h3>
              <p className="text-gray-600">
                With over 12 years in the industry and a team of experienced CAs, we bring deep expertise across all financial domains.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client-Centric Approach</h3>
              <p className="text-gray-600">
                We prioritize understanding your unique needs and provide tailored solutions that drive real business value.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Partnership</h3>
              <p className="text-gray-600">
                From startups to established enterprises, we partner with you at every stage of your business journey.
              </p>
            </motion.div>
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
              <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => scrollByCards(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10">
              <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => scrollByCards(1)}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div
              ref={sliderRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 px-1 scrollbar-thin scrollbar-thumb-slate-300"
            >
              {services.map((s, i) => (
                <div key={i} className="min-w-[85%] md:min-w-[45%] lg:min-w-[32%] snap-start">
                  <Card className="rounded-3xl overflow-hidden h-full">
                    <div className="relative w-full " style={{ height: "170px" }}>

                      <Image
                        src={s.img}
                        alt={s.title}
                        fill
                        sizes="100vw"
                        className="object-cover w-full h-full"
                        style={{ objectFit: "cover", borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">{s.desc}</CardContent>
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
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/15 to-slate-500/15 rounded-3xl backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -40, 0],
              rotate: [0, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
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
                name: "Vision India  Private Limited",
                role: "Human Resource and Technology Solutions",
                text: "Their startup advisory service gave us confidence to scale without compliance worries.",
              },
              {
                name: "Pravek Kelp Private Limited",
                role: "Manufacturers and sells Ayurvedic Formulations",
                text: "Professional, reliable, and truly client-focused — highly recommended for any business.",
              },
              {
                name: "NxtMobility Energy Private Limited",
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
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.03 }}
              >
                <p className="text-gray-700 italic mb-4">&ldquo;{t.text}&rdquo;</p>
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
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 right-10 w-32 h-32 border-2 border-blue-400/15 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
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
                  Tell us a bit about your requirement and we&apos;ll get back promptly.
                </p>

                {/* Contact Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="font-medium">Quick Response</div>
                      <div className="text-sm text-gray-300">Reply within 24 hours</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <div className="font-medium">Expert Team</div>
                      <div className="text-sm text-gray-300">Certified CAs with 12+ years experience</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="font-medium">Confidential</div>
                      <div className="text-sm text-gray-300">Your information is secure</div>
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
              <form
                className="grid gap-4"
                onSubmit={handleConsultationSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Full Name *</label>
                    <Input
                      name="name"
                      placeholder="Your name"
                      required
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Email *</label>
                    <Input
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
                    <label className="text-white text-sm font-medium">Phone</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Company</label>
                    <Input
                      name="company"
                      placeholder="Company name"
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-blue-300 focus:ring-blue-300/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Service Required</label>
                  <select
                    name="service"
                    className="w-full rounded-xl bg-white/20 border-white/30 text-white focus:border-blue-300 focus:ring-blue-300/20 p-3"
                  >
                    <option value="" className="text-gray-800">Select a service</option>
                    <option value="audit" className="text-gray-800">Audit & Assurance</option>
                    <option value="tax" className="text-gray-800">Taxation</option>
                    <option value="startup" className="text-gray-800">Startup Advisory</option>
                    <option value="compliance" className="text-gray-800">Corporate Compliance</option>
                    <option value="cfo" className="text-gray-800">Virtual CFO</option>
                    <option value="other" className="text-gray-800">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Message *</label>
                  <Textarea
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

      {/* <Section id="consult" className="bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="Book a consultation"
            title="Speak with a Chartered Accountant"
            subtitle="Tell us a bit about your requirement and we'll get back promptly."
          />
          <form
            className="grid gap-4"
            onSubmit={handleConsultationSubmit}
          >
            <Input name="name" placeholder="Your name" required className="rounded-2xl" />
            <Input name="email" type="email" placeholder="Email" required className="rounded-2xl" />
            <Input name="phone" type="tel" placeholder="Phone" className="rounded-2xl" />
            <Input name="company" placeholder="Company (optional)" className="rounded-2xl" />
            <Textarea name="message" placeholder="Briefly describe your requirement" required className="rounded-2xl" rows={5} />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Typical reply within 1 business day</div>
              <Button type="submit" className="rounded-2xl">Submit</Button>
            </div>
          </form>
        </div>
      </Section> */}

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
            <Button asChild className="rounded-2xl"><a href="#services">View Services</a></Button>
            <Button asChild variant="outline" className="rounded-2xl"><a href="#contact">Contact us</a></Button>
          </div>
        </div>
      </Section>

      {/* CAREERS */}
      <Section id="careers" className="bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
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
              <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
              <p className="text-gray-300 text-sm">
                Accelerate your career with exposure to diverse industries, cutting-edge financial technologies, and mentorship from senior CAs.
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
              <h3 className="text-xl font-semibold mb-3">Collaborative Culture</h3>
              <p className="text-gray-300 text-sm">
                Work in a supportive environment where knowledge sharing, innovation, and professional development are encouraged and rewarded.
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
              <h3 className="text-xl font-semibold mb-3">Recognition & Rewards</h3>
              <p className="text-gray-300 text-sm">
                Competitive compensation, performance bonuses, professional development budget, and comprehensive benefits package.
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
                        <div className="font-medium">Senior Associate – Audit</div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          Mumbai · Hybrid · 2–4 yrs exp
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Full-time</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div>
                        <div className="font-medium">Tax Consultant</div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          Delhi · Onsite · 1–3 yrs exp
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Full-time</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div>
                        <div className="font-medium">CA Articleship</div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Multiple locations · IPCC cleared
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Internship</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div>
                        <div className="font-medium">Financial Analyst</div>
                        <div className="text-sm text-gray-300 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          Bangalore · Remote · 0–2 yrs exp
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Full-time</Badge>
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
                        name="name"
                        placeholder="Full name"
                        required
                        className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        required
                        className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="Phone number"
                        className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                      />
                      <select
                        name="role"
                        required
                        className="rounded-xl bg-white/20 border-white/30 text-white p-3"
                      >
                        <option value="" className="text-gray-800">Select position</option>
                        {/* <option value="Tax-Consultant" className="text-gray-800">Senior Associate – Audit</option> */}
                        <option value="tax-consultant" className="text-gray-800">Tax Consultant</option>
                        <option value="Articleship" className="text-gray-800">CA Articleship</option>
                        <option value="Financial-analyst" className="text-gray-800">Financial Analyst</option>
                        <option value="other" className="text-gray-800">Other</option>
                      </select>
                    </div>

                    <Input
                      name="experience"
                      placeholder="Years of experience"
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    />

                    {/* <Textarea
                      name="notes"
                      placeholder="Brief note about yourself, qualifications & achievements..."
                      rows={4}
                      className="rounded-xl bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    /> */}

                    {/* Resume Upload Field */}
                    <div className="space-y-2">
                      <label className="text-white text-sm font-medium">Attach Resume (PDF/DOCX)</label>
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        required
                        className="block w-full text-white bg-white/20 border-white/30 rounded-xl p-2"
                      />
                    </div>

                    <Button
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

      {/* <Section id="careers" className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <SectionHeader
            eyebrow="Careers"
            title="Join MRS & Co. – Jobs & Articleship"
            subtitle="We are always looking for curious minds who love numbers and nuance."
            center
          />

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Open Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">Senior Associate – Audit</div>
                    <div>2–4 yrs | Mumbai · Hybrid</div>
                  </div>
                  <Badge>Full-time</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">Analyst – Direct Tax</div>
                    <div>0–2 yrs | New Delhi · Onsite</div>
                  </div>
                  <Badge>Full-time</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">Articleship – GST</div>
                    <div>IPCC/Inter cleared | Bengaluru</div>
                  </div>
                  <Badge variant="secondary">Internship</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="grid gap-3"
                  onSubmit={handleCareerSubmit}
                >
                  <Input name="name" placeholder="Full name" required className="rounded-2xl" />
                  <Input name="email" type="email" placeholder="Email" required className="rounded-2xl" />
                  <Input name="phone" type="tel" placeholder="Phone" className="rounded-2xl" />
                  <Input name="role" placeholder="Role applying for" className="rounded-2xl" />
                  <Textarea name="notes" placeholder="Brief note / achievements" rows={4} className="rounded-2xl" />
                  <Button type="submit" className="rounded-2xl">Submit Application</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section> */}

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
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
                Your trusted financial partners for growth, governance & compliance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#consult" className="hover:text-white transition-colors">Contact</a></li>
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
                  <span>F 1/299,Shakti Apartment<br />Sector-4, vaishali -Ghaziabad-201010 </span>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {year} MRS & Co. Chartered Accountants. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}