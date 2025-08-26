"use client" ;
/* eslint-disable @next/next/no-img-element */
"use strict" ;
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../components/ui/badge";

// import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, ArrowLeft, ArrowRight, ChevronRight, CheckCircle2, Linkedin, Instagram, Facebook, Menu, X, Award, Shield, Target, TrendingUp, CheckCircle } from "lucide-react";// ------------------------
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
    img: "https://images.unsplash.com/photo-1520607162513-6b67ff0bfee1?q=80&w=1600&auto=format&fit=crop",
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
    img: "https://images.unsplash.com/photo-1520607162513-6c5e2a88f5d8?q=80&w=1600&auto=format&fit=crop",
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
    title: "Corporate Finance",
    desc: "Debt/equity advisory, financial modelling and investor relations support.",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
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
  const [] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
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



  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50">
        <div className="backdrop-blur-xl bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href="#home" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-500/20 grid place-items-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <div className="text-base md:text-lg font-semibold tracking-tight">MRS & Co.</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground -mt-0.5">Chartered Accountants</div>
                </div>
              </a>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-2">
                {[
                  ["About", "about"],
                  ["Services", "services"],
                  ["Testimonials", "testimonials"],
                  ["Consultation", "consult"],
                  ["Careers", "careers"],
                  ["Contact", "contact"],
                ].map(([label, id]) => (
                  <a key={id} href={`#${id}`} className="px-3 py-2 rounded-xl hover:bg-slate-100 text-sm font-medium">
                    {label}
                  </a>
                ))}
                <Button asChild className="rounded-2xl">
                  <a href="#consult">Book a Call</a>
                </Button>
              </nav>

              {/* Mobile */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-slate-100"
                aria-label="Toggle Menu"
                onClick={() => setMenuOpen((s) => !s)}
              >
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Sheet */}
          {menuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="max-w-7xl mx-auto px-4 py-4 grid gap-2">
                {[
                  ["About", "about"],
                  ["Services", "services"],
                  ["Testimonials", "testimonials"],
                  ["Consultation", "consult"],
                  ["Careers", "careers"],
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

      {/* HERO */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Trusted Since 2012
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
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors font-medium">
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
                    <div className="text-3xl font-bold text-blue-600">12+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">25+</div>
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
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              About MRS & Co.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are more than just Chartered Accountants — we are your trusted financial advisors, helping businesses thrive with clarity and confidence.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expertise & Experience</h3>
              <p className="text-gray-600">
                With over 12 years in the industry and a team of experienced CAs, we bring deep expertise across all financial domains.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client-Centric Approach</h3>
              <p className="text-gray-600">
                We prioritize understanding your unique needs and provide tailored solutions that drive real business value.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Partnership</h3>
              <p className="text-gray-600">
                From startups to established enterprises, we partner with you at every stage of your business journey.
              </p>
            </div>
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
                    <div className="h-40 bg-slate-200">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
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

      {/* UMBRELLA OF OUR SERVICES - GRID with Background */}
      <section className="relative py-12 bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 opacity-40"></div>
        <div className="relative max-w-6xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Umbrella of Our Services
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-10">
            From compliance to consulting — explore the complete spectrum of
            financial expertise we provide.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Cards */}
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
                className="p-6 rounded-2xl shadow-md bg-white hover:shadow-2xl transition group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3
                  className="text-xl font-semibold mb-3 text-blue-700 group-hover:text-blue-900"
                >
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.desc}</p>
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
                name: "Rohit Sharma",
                role: "CEO, TechStart",
                text: "MRS & Co. helped us streamline our taxation and provided invaluable financial clarity.",
              },
              {
                name: "Priya Mehta",
                role: "Founder, GreenLeaf",
                text: "Their startup advisory service gave us confidence to scale without compliance worries.",
              },
              {
                name: "Arjun Verma",
                role: "Managing Director, BuildWell",
                text: "Professional, reliable, and truly client-focused — highly recommended for any business.",
              },
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

      {/* CONSULTATION */}
      <Section id="consult" className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <SectionHeader
              eyebrow="Book a consultation"
              title="Speak with a Chartered Accountant"
              subtitle="Tell us a bit about your requirement and we'll get back promptly."
            />
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const payload = Object.fromEntries(data.entries());
                alert(`Thanks! We'll reach out shortly.\n\n${JSON.stringify(payload, null, 2)}`);
              }}
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

          <div>
            <SectionHeader
              eyebrow="Advisory for Startups & SMBs"
              title="Launch, comply, scale"
              subtitle="From incorporation and GST to board-ready MIS and fundraising—we're your finance stack."
            />
            <div className="grid gap-4">
              {[
                "Incorporation advisory (Company/LLP, licenses, bank A/C)",
                "Founders' agreements, ESOPs, cap table & registry",
                "GST & TDS registrations, returns, reconciliations",
                "Virtual CFO: KPIs, runway, budget vs actual, MIS",
                "Investor readiness: data room, policies, valuation support",
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5" />
                  <div className="text-slate-700">{p}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button asChild className="rounded-2xl"><a href="#services">View Services</a></Button>
              <Button asChild variant="outline" className="rounded-2xl"><a href="#contact">Contact us</a></Button>
            </div>
          </div>
        </div>
      </Section>

      {/* CAREERS */}
      <Section id="careers" className="bg-slate-50">
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    const payload = Object.fromEntries(data.entries());
                    alert(`Application submitted!\n\n${JSON.stringify(payload, null, 2)}`);
                  }}
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
      </Section>

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
                  <span>contact@mrsco.in</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1" />
                  <span>Business Center, BKC<br />Mumbai 400051, India</span>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
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