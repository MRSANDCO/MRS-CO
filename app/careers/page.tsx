"use client";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Shield,
  Clock,
} from "lucide-react";

export default function CareersPage() {
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
        if (!response.ok)
          throw new Error(result.error || "Failed to submit application");
        setTimeout(
          () =>
            alert(
              "✅ Thank you! Your application has been submitted successfully."
            ),
          0
        );
        form.reset();
      } catch (error) {
        console.error("Failed to send career application:", error);
        setTimeout(
          () =>
            alert(
              "❌ Failed to submit. Please email us at camrsandco@gmail.com"
            ),
          0
        );
      } finally {
        if (submitButton) {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* ── NAVBAR (mirrors app/page.tsx exactly) ── */}
      <div className="sticky top-0 z-50">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <NextImage
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
              alt="Modern office background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/12 via-indigo-400/8 to-blue-600/12" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/82 to-white/88 backdrop-blur-sm" />
          </div>

          {/* Animated floating shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 90, 0], y: [0, -8, 0], opacity: [0.25, 0.5, 0.25], scale: [1, 1.15, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-3 right-24 w-12 h-12 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full shadow-md shadow-blue-400/20"
            />
            <motion.div
              animate={{ x: [0, -70, 0], rotate: [0, 120, 240, 360], opacity: [0.2, 0.45, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute bottom-2 left-12 w-8 h-8 bg-gradient-to-br from-cyan-400/45 to-blue-500/45 rounded-lg shadow-sm shadow-cyan-300/25"
            />
          </div>

          <div className="relative z-10 border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
                  <div className="relative w-14 h-14 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
                      alt="CA India Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold tracking-tight">MRS & Co.</div>
                    <div className="text-[10px] md:text-xs text-blue-700 font-semibold -mt-0.5 tracking-wide">
                      Chartered Accountants
                    </div>
                  </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                  {[
                    ["About", "about"],
                    ["Services", "services"],
                    ["News", "news"],
                    ["Team", "team"],
                    ["Careers", "careers"],
                    ["Contact", "contact"],
                  ].map(([label, id]) => (
                    <Link
                      key={id}
                      href={`/#${id}`}
                      className="px-3 py-2 rounded-xl hover:bg-white/60 hover:shadow-sm text-sm font-medium transition-all duration-500 hover:text-indigo-700"
                    >
                      {label}
                    </Link>
                  ))}
                  <Button
                    asChild
                    className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-500"
                  >
                    <Link href="/#consult">Book a Call</Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-2xl border-2 border-blue-500/40 bg-transparent hover:bg-blue-600/10 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-500"
                  >
                    <Link href="/login">Client Login</Link>
                  </Button>
                </nav>

                {/* Mobile back link */}
                <Link
                  href="/"
                  className="md:hidden flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-indigo-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-blue-950/90" />
          <NextImage
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2069&auto=format&fit=crop"
            alt="Team collaboration in modern office"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-indigo-500/5 animate-pulse"
            style={{ animationDuration: "10s" }}
          />
        </div>

        {/* Floating paper-rectangle shapes (mirrors hero section) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 right-[15%] w-32 h-44 bg-white/5 border border-white/10 rounded-sm backdrop-blur-[2px]"
          />
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-[5%] w-64 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
          />
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 left-[10%] w-16 h-20 bg-white/[0.03] border border-white/10 rounded-sm"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-xl text-white text-sm font-semibold mb-6 border border-white/10 shadow-lg">
                <Briefcase className="w-4 h-4 mr-2 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-100 to-indigo-100 bg-clip-text text-transparent">
                  We&apos;re Hiring — Join MRS & Co.
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white drop-shadow-md">Build Your</span>
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent mt-2">
                  Career with Us
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed font-light">
                We are always looking for{" "}
                <span className="text-cyan-300 font-medium">curious minds</span> who love numbers,
                nuance, and making a difference for businesses across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button
                  asChild
                  className="group bg-white text-slate-950 hover:bg-cyan-50 px-8 py-6 rounded-2xl transition-all duration-300 font-bold flex items-center justify-center shadow-2xl shadow-white/10 hover:scale-105"
                >
                  <a href="#openings">
                    View Openings
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button
                  asChild
                  className="group bg-transparent border-2 border-white/20 hover:border-white/50 backdrop-blur-md text-white px-8 py-6 rounded-2xl transition-all duration-300 font-semibold hover:bg-white/5"
                >
                  <a href="#apply">Apply Now</a>
                </Button>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/20">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                  <span className="text-emerald-400 font-medium">ICAI Registered Firm</span>
                </div>
                <div className="flex items-center bg-blue-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/20">
                  <CheckCircle className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-medium">Pan India Presence</span>
                </div>
                <div className="flex items-center bg-purple-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-400/20">
                  <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-purple-400 font-medium">Mentorship-Driven</span>
                </div>
              </div>
            </motion.div>

            {/* Stats card (mirrors app/page.tsx right column) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent mt-8 lg:mt-0"
            >
              <div className="absolute -inset-10 bg-purple-500/5 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-[#0B0F1A]/80 backdrop-blur-3xl p-10 rounded-[2.4rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

                {/* 2×2 stats grid */}
                <div className="grid grid-cols-2 gap-4 relative z-10 mb-6">
                  {[
                    { value: "27+", label: "Years of Excellence", gradient: "from-white to-cyan-400" },
                    { value: "50+", label: "Team Members", gradient: "from-cyan-300 to-blue-500" },
                    { value: "5 Cities", label: "Office Presence", gradient: "from-blue-400 to-indigo-500" },
                    { value: "98%", label: "Staff Retention", gradient: "from-emerald-400 to-teal-500" },
                  ].map(({ value, label, gradient }) => (
                    <div
                      key={label}
                      className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.045] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className={`text-4xl font-extrabold tracking-tight bg-gradient-to-br ${gradient} bg-clip-text text-transparent mb-1.5`}>
                        {value}
                      </div>
                      <div className="text-[10px] font-medium tracking-widest uppercase text-slate-400/60">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/[0.05] mb-5" />

                {/* Culture highlight card */}
                <div className="mx-0 p-[1px] rounded-[16px] bg-gradient-to-br from-purple-400/50 via-indigo-400/40 to-cyan-400/20">
                  <div className="relative bg-gradient-to-br from-[#0d1829] to-[#0f1a2e] rounded-[15px] p-5 overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-start gap-3 mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-purple-400/20 to-indigo-400/15 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-white">Why our team loves it here</div>
                        <div className="text-[11px] text-white/40 mt-0.5">From recent joiners</div>
                      </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                      {[
                        "Hands-on exposure from Day 1",
                        "Direct mentorship from senior CAs",
                        "Diverse client base across industries",
                        "Clear progression & learning path",
                      ].map((point) => (
                        <div key={point} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="text-[12px] text-white/60">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN US (dark glassmorphism, mirrors Careers section in app/page.tsx) ── */}
      <section className="relative py-16 overflow-hidden bg-slate-900 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="text-xs tracking-widest uppercase font-medium text-cyan-300 mb-3">Why MRS & Co.</div>
            <h2 className="text-3xl md:text-4xl font-bold">More than just a job</h2>
            <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
              We invest in our people the same way we invest in our clients — with expertise, care, and a long-term lens.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                color: "blue",
                title: "Growth Opportunities",
                desc: "Accelerate your career with exposure to diverse industries, cutting-edge financial technologies, and mentorship from senior CAs.",
              },
              {
                icon: Users,
                color: "green",
                title: "Collaborative Culture",
                desc: "Work in a supportive environment where knowledge sharing, innovation, and professional development are encouraged and rewarded.",
              },
              {
                icon: Award,
                color: "purple",
                title: "Recognition & Rewards",
                desc: "Competitive compensation, performance bonuses, professional development budget, and comprehensive benefits package.",
              },
            ].map(({ icon: Icon, color, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300`}
              >
                <div className={`w-12 h-12 bg-${color}-500/20 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${color}-300`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPENINGS + FORM (mirrors Careers section layout in app/page.tsx) ── */}
      <section
        id="openings"
        className="relative py-16 overflow-hidden bg-slate-900 text-white"
      >
        {/* Background image (same pattern as Consultation section) */}
        <div className="absolute inset-0">
          <NextImage
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2069&auto=format&fit=crop"
            alt="Professional workspace"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/85" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left — Openings */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-xs tracking-widest uppercase font-medium text-cyan-300 mb-3">Open Positions</div>
              <h2 className="text-2xl font-bold mb-2">We&apos;re hiring</h2>
              <p className="text-gray-300 mb-6 text-sm">
                Join a team that&apos;s shaping the future of financial advisory in India.
              </p>

              <Card className="rounded-2xl bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Current Openings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      role: "Tax Consultant",
                      location: "Delhi · Onsite",
                      exp: "1–3 yrs exp",
                      type: "Full-time",
                      badgeClass: "bg-green-500/20 text-green-300 border-green-500/30",
                      icon: Briefcase,
                    },
                    {
                      role: "CA Articleship",
                      location: "Multiple locations",
                      exp: "IPCC cleared",
                      type: "Internship",
                      badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                      icon: GraduationCap,
                    },
                    {
                      role: "Financial Analyst",
                      location: "Ghaziabad · Remote",
                      exp: "0–2 yrs exp",
                      type: "Full-time",
                      badgeClass: "bg-green-500/20 text-green-300 border-green-500/30",
                      icon: Briefcase,
                    },
                  ].map(({ role, location, exp, type, badgeClass, icon: Icon }) => (
                    <div
                      key={role}
                      className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-cyan-300" />
                        </div>
                        <div>
                          <div className="font-medium">{role}</div>
                          <div className="text-sm text-gray-300 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location} · {exp}
                          </div>
                        </div>
                      </div>
                      <Badge className={badgeClass}>{type}</Badge>
                    </div>
                  ))}

                  {/* Perks row */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs text-gray-400 mb-3 uppercase tracking-widest">What you get</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Clock, text: "Flexible timings" },
                        { icon: Shield, text: "Health benefits" },
                        { icon: TrendingUp, text: "Fast-track growth" },
                        { icon: Users, text: "CA mentorship" },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 text-sm text-gray-300">
                          <Icon className="w-3.5 h-3.5 text-cyan-400" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right — Application Form (id="apply") */}
            <motion.div
              id="apply"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
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
                        <option value="" className="text-gray-800">Select position</option>
                        <option value="tax-consultant" className="text-gray-800">Tax Consultant</option>
                        <option value="Articleship" className="text-gray-800">CA Articleship</option>
                        <option value="Financial-analyst" className="text-gray-800">Financial Analyst</option>
                        <option value="other" className="text-gray-800">Other</option>
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
                        className="block w-full text-white bg-white/20 border border-white/30 rounded-xl p-2"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-2" />
                        Reply within 3 business days
                      </div>
                      <Button
                        suppressHydrationWarning
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER (mirrors app/page.tsx footer exactly) ── */}
      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
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
                {[["About", "/#about"], ["Services", "/#services"], ["Careers", "/careers"], ["Contact", "/#contact"]].map(
                  ([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  camrsandco@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  F 1/299, Shakti Apt., Sector-4, Vaishali, Ghaziabad
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MRS & Co. Chartered Accountants. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}