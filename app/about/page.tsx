"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Award,
  Shield,
  Target,
  TrendingUp,
  CheckCircle,
  Users,
  Building2,
  Calendar,
  FileText,
  Globe,
  X,
  ChevronDown,
  Briefcase,
  Star,
  ArrowRight,
} from "lucide-react";

// ── Partner data from PDF ──────────────────────────────────────────────
const partners = [
  {
    name: "CA R.K. Dhiman",
    designation: "Founding Partner",
    quals: "M.Com, FCA, Forensic Auditor (FAFD)",
    email: "carkdhiman@gmail.com",
    phone: "9999622662",
    initials: "RD",
    gradient: "from-blue-600 to-indigo-700",
    accentColor: "blue",
    since: "ICAI Member since 1999",
    specializations: ["Income Tax Search & Seizure", "IPO/FDI Advisory", "Merger & Demerger", "Fund Syndication"],
    bio: "Founder of MRS & Co. with over 25 years of experience. Specialist in Direct Income Tax, Service Tax, IPO/FDI and Merger/Demerger/Acquisition. Has served NTPC, NHPC, Power Grid Corporation and Bank of America clients among others.",
    highlights: ["NTPC – Coal & Hydro Projects", "NHPC – Multiple H.P. Projects", "Power Grid Corporation", "BHEL, CITCO, Bank of America clients"],
  },
  {
    name: "CA Kaynat Fatima",
    designation: "Partner",
    quals: "FCA, FCS, B.Com",
    email: "cakaynatfatima@gmail.com",
    phone: "9891782779",
    initials: "KF",
    gradient: "from-cyan-600 to-blue-700",
    accentColor: "cyan",
    since: "ICAI Member since 2010",
    specializations: ["Assurance & Audit", "Due Diligence", "Stock Takes", "RBI Certifications"],
    bio: "Former PricewaterhouseCoopers (Big 4) professional with 14+ years experience. Served HCL Infosystems, ONGC Videsh, Areva T&D, Dell International and United Breweries among others.",
    highlights: ["PricewaterhouseCoopers (Big 4)", "HCL Infosystems, ONGC Videsh", "Dell International Services", "JCB India – SAD Certification"],
  },
  {
    name: "CA Amit Pathak",
    designation: "Partner",
    quals: "FCA, ICWA, DISA, ISO Auditor – ICRC London",
    email: "caamitpathak@gmail.com",
    phone: "9560833488",
    initials: "AP",
    gradient: "from-indigo-600 to-purple-700",
    accentColor: "indigo",
    since: "ICAI Member since 2004",
    specializations: ["SAP FICO", "IFRS & USGAAP", "Transfer Pricing", "International Taxation"],
    bio: "20+ years experience spanning MNC plant accounting, Big 4 engagement (Ernst & Young, Deloitte), SAP FICO Core Team Leader. Expert in finalization of financial statements for listed companies across manufacturing, NBFC and real estate sectors.",
    highlights: ["Ernst & Young, Deloitte exposure", "SAP FICO Core Team Leader", "IFRS & USGAAP reporting", "Search & Seizure cases"],
  },
  {
    name: "CA Yash Pal Sharma",
    designation: "Partner",
    quals: "B.Com, ACA",
    email: "sharma.yash93@gmail.com",
    phone: "9024503154",
    initials: "YS",
    gradient: "from-emerald-600 to-teal-700",
    accentColor: "emerald",
    since: "ICAI Member since 2020",
    specializations: ["Statutory & Tax Audit", "Bank Audits", "NGO Compliance", "SAP/Oracle Implementation"],
    bio: "10+ years in the accounting profession. Handles statutory audits, due diligence, internal audits and bank audits. Specialist in Income Tax, Service Tax and GST litigation before ITAT and High Court.",
    highlights: ["Statutory & Tax Audit", "Due Diligence Audits", "GST Litigation – High Court", "SAP/Oracle Consultancy"],
  },
  {
    name: "CA Neha Sharma",
    designation: "Partner",
    quals: "ACA",
    email: "",
    phone: "9811216316",
    initials: "NS",
    gradient: "from-rose-500 to-pink-700",
    accentColor: "rose",
    since: "Partner, MRS & Co.",
    specializations: ["Statutory Audit", "Tax Compliance", "GST Advisory", "Financial Reporting"],
    bio: "Partner at MRS & Co. with expertise in statutory audits, tax compliance, GST advisory and financial reporting across diverse client verticals.",
    highlights: ["Statutory Audit", "Tax Compliance", "GST Advisory", "Financial Reporting"],
  },
  {
    name: "CA Rinky Vishwakarma",
    designation: "Partner",
    quals: "ACA",
    email: "",
    phone: "8080918797",
    initials: "RV",
    gradient: "from-amber-500 to-orange-700",
    accentColor: "amber",
    since: "ICAI Member since 2016",
    specializations: ["Internal Audit", "Bank Audits", "Income Tax & GST", "Fund Syndication"],
    bio: "10+ years experience. Handles statutory audits, tax audits, due diligence, internal audits and bank audits. Specialises in Income Tax search & seizure cases and GST litigation. Also oversees fund syndication via banking institutions.",
    highlights: ["Bank Audits – SBI, PNB, OBC", "GST Litigation – ITAT/HC", "SAP Implementation", "IPO & Right Issues"],
  },
];

const associatePartners = [
  { name: "CA Sanjeev Kumar Chhabra", quals: "FCA", initials: "SC" },
  { name: "CA Surbhi Rajpoot", quals: "FCA", initials: "SR" },
  { name: "CA Akshay Mishra", quals: "ACA", initials: "AM" },
  { name: "CA Shruti Dang", quals: "FCA, UAE Corporate Tax", initials: "SD" },
  { name: "CS Jitendra Kumar", quals: "ACS", initials: "JK" },
  { name: "CA Prem Lamba", quals: "FCA", initials: "PL" },
  { name: "Adv. Bhupender Singh", quals: "Advocate", initials: "BS" },
  { name: "Joginder Pal Singh", quals: "Retired PSB Official", initials: "JP" },
  { name: "M.C. Garg", quals: "Retired PSB Official", initials: "MG" },
  { name: "Raj Kumar", quals: "Retired PSB Official", initials: "RK" },
  { name: "R. Chamoli", quals: "Retired PSB Official", initials: "RC" },
];

const milestones = [
  { year: "1999", event: "Founded in Ghaziabad by CA R.K. Dhiman", icon: "🏛️" },
  { year: "2004", event: "Empanelled with C&AG (CR-3755)", icon: "📋" },
  { year: "2010", event: "Big 4 alumna CA Kaynat Fatima joins as Partner", icon: "🤝" },
  { year: "2015", event: "Branch offices opened in Noida & Mumbai", icon: "🏢" },
  { year: "2019", event: "ISO 9001:2008 Certification achieved", icon: "🏆" },
  { year: "2021", event: "Forensic Audit – Mahamedha Urban Co-op Bank (₹100Cr+ case)", icon: "🔍" },
  { year: "2022", event: "Empanelled with RBI – Category I (No. 334273)", icon: "🏦" },
  { year: "2024", event: "Recognised among North India's Top 50 CA Firms", icon: "⭐" },
];

const clientSegments = [
  { title: "Bank Audits", icon: "🏦", clients: ["SBI – Multiple Branches", "Punjab National Bank", "Union Bank of India", "IDBI Bank (Concurrent)", "Oriental Bank of Commerce"] },
  { title: "Internal Audit", icon: "🔎", clients: ["NHPC Ltd. (Govt. of India)", "NTPC Ltd. (Govt. of India)", "Utility Power (Reliance-NTPC JV)", "Uflex Limited", "Cosmiq Exports"] },
  { title: "Statutory Audit", icon: "📊", clients: ["Vision India Services Pvt. Ltd.", "ICAI", "Shivalik Co-op Mercantile Bank", "India World Foundation", "Vandana Travels Pvt. Ltd."] },
  { title: "Forensic / Special Audit", icon: "🔍", clients: ["Mahamedha Urban Co-op Bank", "Urban Co-op Bank, Saharanpur", "Shivalik Mercantile Co-op Bank", "Citizen Co-operative Bank"] },
  { title: "Income Tax", icon: "💰", clients: ["NIIT Ltd.", "Reliance Industries Ltd.", "GE Energy Ltd.", "DMC International", "Bright Group of Companies"] },
  { title: "Bookkeeping & Outsourcing", icon: "📚", clients: ["Nxtmobility Energy Pvt. Ltd.", "Combine Advertising (Patanjali)", "RightAds Communications", "ALIYA Air Travels", "CAPRO Switchgears"] },
];

// ── Partner Modal ──────────────────────────────────────────────────────
function PartnerModal({ partner, onClose }: { partner: typeof partners[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative bg-[#0B0F1A] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0`}>
            {partner.initials}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{partner.name}</h3>
            <p className="text-cyan-400 text-sm font-medium">{partner.designation}</p>
            <p className="text-white/40 text-xs mt-0.5">{partner.quals}</p>
          </div>
        </div>

        {/* Since badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs mb-5">
          <Calendar className="w-3 h-3" /> {partner.since}
        </div>

        {/* Bio */}
        <p className="text-white/70 text-sm leading-relaxed mb-5">{partner.bio}</p>

        {/* Specialisations */}
        <div className="mb-5">
          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Specialisations</div>
          <div className="flex flex-wrap gap-2">
            {partner.specializations.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs">{s}</span>
            ))}
          </div>
        </div>

        {/* Notable clients */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Notable Engagements</div>
          <div className="grid grid-cols-2 gap-1.5">
            {partner.highlights.map((h) => (
              <div key={h} className="flex items-center gap-1.5 text-xs text-white/50">
                <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0" /> {h}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        {(partner.email || partner.phone) && (
          <div className="mt-5 pt-5 border-t border-white/[0.06] flex flex-wrap gap-3">
            {partner.phone && (
              <a href={`tel:${partner.phone}`} className="flex items-center gap-2 text-xs text-white/50 hover:text-cyan-400 transition-colors">
                <Phone className="w-3.5 h-3.5" /> {partner.phone}
              </a>
            )}
            {partner.email && (
              <a href={`mailto:${partner.email}`} className="flex items-center gap-2 text-xs text-white/50 hover:text-cyan-400 transition-colors">
                <Mail className="w-3.5 h-3.5" /> {partner.email}
              </a>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function AboutPage() {
  const [selectedPartner, setSelectedPartner] = useState<typeof partners[0] | null>(null);
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">

      {/* ── NAVBAR ── */}
      <div className="sticky top-0 z-50">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <NextImage src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" alt="Office" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/12 via-indigo-400/8 to-blue-600/12" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/82 to-white/88 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 border-b border-white/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
                  <div className="relative w-14 h-14 group-hover:scale-105 transition-transform duration-300">
                    <img src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png" alt="CA India Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-bold tracking-tight">MRS & Co.</div>
                    <div className="text-[10px] md:text-xs text-blue-700 font-semibold -mt-0.5 tracking-wide">Chartered Accountants</div>
                  </div>
                </Link>
                <nav className="hidden md:flex items-center gap-2">
                  {[["About", "/about"], ["Services", "/#services"], ["News", "/#news"], ["Team", "/#team"], ["Careers", "/careers"], ["Contact", "/#contact"]].map(([label, href]) => (
                    <Link key={label} href={href} className={`px-3 py-2 rounded-xl hover:bg-white/60 hover:shadow-sm text-sm font-medium transition-all duration-500 hover:text-indigo-700 ${href === "/about" ? "text-indigo-700 bg-white/60" : ""}`}>
                      {label}
                    </Link>
                  ))}
                  <Button asChild className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-md hover:shadow-indigo-500/30 transform hover:scale-105 transition-all duration-500">
                    <Link href="/#consult">Book a Call</Link>
                  </Button>
                </nav>
                <Link href="/" className="md:hidden flex items-center gap-1 text-sm font-medium text-blue-700">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative py-20 min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-blue-950/90" />
          <NextImage src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop" alt="Professional team" fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
        </div>
        {/* floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-24 right-[15%] w-32 h-44 bg-white/5 border border-white/10 rounded-sm backdrop-blur-[2px]" />
          <motion.div animate={{ x: [-10, 10, -10] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 left-[5%] w-64 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl text-white text-sm font-semibold mb-6 border border-white/10">
              <Award className="w-4 h-4 mr-2 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-100 to-blue-100 bg-clip-text text-transparent">ISO 9001:2008 Certified · C&AG & RBI Empanelled</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">About</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent mt-2">MRS & Co.</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed font-light">
              Founded in <span className="text-cyan-300 font-medium">November 1999</span>, we are a premier Chartered Accountants firm delivering Assurance, Taxation and Advisory services across India — trusted by 500+ clients over 25 years.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/20">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" /> <span className="text-emerald-400 text-sm font-medium">Firm Reg. 016610N</span>
              </div>
              <div className="flex items-center bg-blue-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/20">
                <CheckCircle className="w-4 h-4 text-blue-400 mr-2" /> <span className="text-blue-400 text-sm font-medium">C&AG Empanelled CR-3755</span>
              </div>
              <div className="flex items-center bg-purple-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-400/20">
                <CheckCircle className="w-4 h-4 text-purple-400 mr-2" /> <span className="text-purple-400 text-sm font-medium">RBI Category I – 334273</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FIRM SNAPSHOT ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left — text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <div className="text-xs tracking-widest uppercase font-medium text-blue-600 mb-3">Our Story</div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 leading-tight">
                Two decades of partnering with businesses
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Founded in 1999, MRS & Co. is revered for its professional ethos and technical expertise drawn on perspicacity of over two decades. Our philosophy is of <strong>partnering with clients</strong> — not being a distant service provider. Since businesses are inherently different, we tailor our services and banish the 'one-size-fits-all' approach.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                We are emerging as a force in <strong>Forensic Audit</strong> — most notably our investigation of M/s Mahamedha Urban Co-operative Bank Limited involving siphoning of funds exceeding ₹100 Cr., completed in 1.5 years and appreciated by the Government of Uttar Pradesh.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our team includes ex-bankers, software & hardware engineers, advocates and senior finance professionals — blending diverse expertise to deliver the stupendous power of teamwork.
              </p>
              {/* Firm details grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, label: "Established", value: "17 Nov 1999" },
                  { icon: Building2, label: "Constitution", value: "Partnership Firm" },
                  { icon: FileText, label: "Firm Reg. No.", value: "016610N" },
                  { icon: Globe, label: "Website", value: "mrsandco.in" },
                  { icon: Shield, label: "PAN", value: "AAEFR9827L" },
                  { icon: Award, label: "GST No.", value: "09AAEFR9827L1ZH" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">{label}</div>
                      <div className="text-sm font-semibold text-slate-800">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — stats card (dark, mirrors hero right column) */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative group p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
              <div className="absolute -inset-10 bg-cyan-500/5 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-[#0B0F1A] backdrop-blur-3xl p-10 rounded-[2.4rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { value: "500+", label: "Global Clients", gradient: "from-white to-cyan-400" },
                    { value: "25+", label: "Years of Practice", gradient: "from-cyan-300 to-blue-500" },
                    { value: "40+", label: "Team Members", gradient: "from-blue-400 to-indigo-500" },
                    { value: "6", label: "Partners", gradient: "from-emerald-400 to-teal-500" },
                  ].map(({ value, label, gradient }) => (
                    <div key={label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.045] hover:-translate-y-1 transition-all duration-300">
                      <div className={`text-4xl font-extrabold tracking-tight bg-gradient-to-br ${gradient} bg-clip-text text-transparent mb-1.5`}>{value}</div>
                      <div className="text-[10px] font-medium tracking-widest uppercase text-slate-400/60">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-white/[0.05] mb-5" />
                {/* Empanelments */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Empanelments & Certifications</div>
                  {[
                    { label: "C&AG Empanelled", value: "CR-3755", color: "text-cyan-400" },
                    { label: "RBI Category I", value: "No. 334273", color: "text-blue-400" },
                    { label: "ISO 9001:2008", value: "Certified", color: "text-emerald-400" },
                    { label: "ICAI Registered", value: "Firm No. 016610N", color: "text-purple-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/50 text-sm">{label}</span>
                      <span className={`text-xs font-semibold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MILESTONE TIMELINE ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <NextImage src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2069&auto=format&fit=crop" alt="Office" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/85" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="text-xs tracking-widest uppercase font-medium text-cyan-300 mb-3">Our Journey</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">25 Years of Milestones</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.07 }} viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 hover:bg-white/15 hover:border-white/35 hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">{m.icon}</div>
                <div className="text-cyan-400 font-bold text-lg mb-1">{m.year}</div>
                <p className="text-white/70 text-sm leading-snug">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PEOPLE PHILOSOPHY ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="lg:col-span-1">
              <div className="text-xs tracking-widest uppercase font-medium text-blue-600 mb-3">Our People</div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">People are our only assets</h2>
              <p className="text-slate-600 leading-relaxed">We recruit, train, motivate and retain highly capable talent who bring quality and deliver best solutions. Some have risen from intern to partner level — a testament to our culture.</p>
            </motion.div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
              {[
                { icon: TrendingUp, color: "blue", title: "Continuous Learning", desc: "Regular CPE programs far exceeding ICAI mandates. Knowledge-hungry minds are always fed." },
                { icon: Target, color: "green", title: "Merit-Based Growth", desc: "Strict performance policy — people progress solely on accomplishments. Achievements are celebrated." },
                { icon: Users, color: "purple", title: "Diverse Talent", desc: "Team includes ex-bankers, engineers, advocates and finance professionals for interdisciplinary excellence." },
                { icon: Shield, color: "orange", title: "Quality First", desc: "ISO 9001:2008 processes. Every engagement goes through rigorous quality review before delivery." },
              ].map(({ icon: Icon, color, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                  className="p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
                  <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

     {/* ── TEAM SECTION (your existing TeamSection, inlined) ── */}
      <section id="partners" className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <NextImage
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
            alt="Modern glass building"
            fill
            sizes="100vw"
            className="object-cover w-full h-full"
          />
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59,130,246,0.25), rgba(99,102,241,0.15), rgba(6,182,212,0.20))",
                "linear-gradient(90deg, rgba(6,182,212,0.20), rgba(59,130,246,0.25), rgba(139,92,246,0.15))",
                "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.25), rgba(59,130,246,0.20))",
                "linear-gradient(45deg, rgba(59,130,246,0.25), rgba(99,102,241,0.15), rgba(6,182,212,0.20))",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/12 via-indigo-300/8 to-cyan-400/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/75 to-white/80 backdrop-blur-[2px]" />
        </div>
 
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ x:[0,120,0], y:[0,-50,0], opacity:[0.4,0.7,0.4], scale:[1,1.4,1], rotate:[0,180,360] }} transition={{ duration:18, repeat:Infinity, ease:"easeInOut" }}
            className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-400/50 to-indigo-600/50 rounded-full shadow-2xl shadow-blue-400/40 blur-xl" />
          <motion.div animate={{ x:[0,-90,0], y:[0,60,0], rotate:[0,-180,-360], opacity:[0.35,0.65,0.35], scale:[1,1.5,1] }} transition={{ duration:20, repeat:Infinity, ease:"easeInOut", delay:5 }}
            className="absolute bottom-32 left-12 w-40 h-40 bg-gradient-to-br from-cyan-400/60 to-blue-500/60 rounded-3xl shadow-xl shadow-cyan-300/50 blur-2xl" />
          <motion.div animate={{ x:[0,70,0], y:[0,-30,0], opacity:[0.3,0.6,0.3], rotate:[0,90,180], scale:[1,1.3,1] }} transition={{ duration:16, repeat:Infinity, ease:"easeInOut", delay:8 }}
            className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-400/70 to-purple-500/70 rounded-full shadow-lg shadow-indigo-300/60 blur-xl" />
          {[...Array(8)].map((_, i) => (
            <motion.div key={i}
              animate={{ y:[0,-100,0], x:[0,Math.sin(i)*30,0], opacity:[0,0.6,0], scale:[0.5,1,0.5] }}
              transition={{ duration:8+i*2, repeat:Infinity, ease:"easeInOut", delay:i*1.5 }}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${i%3===0?"from-blue-400 to-indigo-500":i%3===1?"from-cyan-400 to-blue-500":"from-indigo-400 to-purple-500"} shadow-lg`}
              style={{ left:`${10+i*12}%`, bottom:"10%" }}
            />
          ))}
        </div>
 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.6 }} viewport={{ once:true }}>
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-blue-700/95 text-white text-sm font-bold uppercase tracking-wider mb-6 shadow-xl border border-white/30"
                animate={{ boxShadow:["0 0 25px rgba(59,130,246,0.4)","0 0 45px rgba(99,102,241,0.5)","0 0 25px rgba(59,130,246,0.4)"] }}
                transition={{ duration:3, repeat:Infinity }}
                whileHover={{ scale:1.08 }}
              >
                <Award className="w-5 h-5 mr-2" />
                Meet Our Leadership
              </motion.div>
              <h2 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                <span className="block text-slate-900">Your Trusted</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">Financial Experts</span>
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Award-winning Chartered Accountants with 40+ years of combined expertise
              </p>
            </motion.div>
          </div>
 
          {/* Group photo */}
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.7 }} viewport={{ once:true }} className="mb-16">
            <motion.div whileHover={{ scale:1.01 }} transition={{ type:"spring", stiffness:300, damping:25 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-200 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
              <div className="relative w-full h-[500px] sm:h-[580px] lg:h-[650px]">
                <NextImage src="/assets/team/Group-photo.jpeg" alt="CA MRS Team" fill sizes="100vw" className="object-cover object-center" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-3 bg-white/15 backdrop-blur-md rounded-full border border-white/30 shadow-xl whitespace-nowrap">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-lg tracking-wide">Our CA MRS Team</span>
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>
 
          {/* Team cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { name:"CA Ram Kumar Dhiman", role:"Founder & Managing Partner", image:"/assets/team/member1.jpg", qualification:"FCA, FAFD, M.Com", experience:"25+", specialization:"Forensic Auditing & International Taxation" },
              { name:"CA Amit Pathak", role:"Senior Partner", image:"/assets/team/amitpathak.jpg", qualification:"FCA, ICWA, ISO Auditor-ICRC(London)", experience:"25+", specialization:"Accounting Management and Taxation" },
              { name:"CA Mukesh Thakur", role:"Associate Partner", image:"/assets/team/mukesh-thakur.jpg", imagePosition:"object-top", qualification:"FCA, FAFD, M.Com", experience:"25+", specialization:"FEMA, IndAS, Taxation" },
              { name:"Advocate Prashant Shukla", role:"Legal Advisor", image:"/assets/team/prashant-shukla.png", imagePosition:"object-top", qualification:"LLB", experience:"20+", specialization:"Corporate Law & Direct and Indirect Taxes" },
              { name:"CA Shruti Dang", role:"Partner", image:"/assets/team/member3.jpg", imagePosition:"object-top", qualification:"FCA, M.Com", experience:"15+", specialization:"GST & Compliance and International Corporate Taxation (UAE)" },
              { name:"CA Neha Sharma", role:"Partner", image:"/assets/team/member4.jpg", imagePosition:"object-top", qualification:"FCA, DISA", experience:"15+", specialization:"Risk Advisory and Assurance" },
              { name:"CA Yash Pal Sharma", role:"Partner", image:"/assets/team/member5.jpg", imagePosition:"object-top", qualification:"ACA, LLB", experience:"15+", specialization:"Direct Taxation & Compliance" },
              { name:"CA Rinky Vishwakarma", role:"Partner", image:"/assets/team/member6.jpg", imagePosition:"object-top", qualification:"FCA, B.Com", experience:"15+", specialization:"Accounting and Financial Management" },
            ].map((member, idx) => (
              <motion.div key={idx} initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:idx*0.15 }} viewport={{ once:true }} className="group relative">
                <motion.div whileHover={{ y:-15, scale:1.03 }} transition={{ type:"spring", stiffness:400, damping:25 }}
                  className="relative h-full bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 overflow-hidden group-hover:border-blue-300 group-hover:shadow-blue-200/50 transition-all duration-500">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 transition-opacity duration-700" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  <motion.div initial={{ scale:0, rotate:0 }} whileInView={{ scale:1, rotate:45 }} transition={{ duration:0.5, delay:idx*0.1+0.3 }}
                    className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="relative z-10">
                    {/* Photo */}
                    <div className="mb-6">
                      <motion.div whileHover={{ scale:1.12, rotate:8 }} transition={{ type:"spring", stiffness:400 }} className="relative">
                        <div className="w-36 h-36 mx-auto relative">
                          <NextImage src={member.image} alt={member.name} width={144} height={144} priority={idx<2} quality={75}
                            className={`w-full h-full rounded-full object-cover border-4 border-white shadow-2xl group-hover:border-blue-200 transition-all duration-300 ${(member as {imagePosition?:string}).imagePosition || "object-center"}`} />
                          <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-blue-400/50 transition-all duration-300" />
                        </div>
                        <motion.div whileHover={{ scale:1.1 }}
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold rounded-full shadow-xl whitespace-nowrap border-2 border-white">
                          {member.experience} Years Experience
                        </motion.div>
                      </motion.div>
                    </div>
                    {/* Name & role */}
                    <h3 className="text-2xl font-bold text-center mb-2 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{member.name}</h3>
                    <p className="text-indigo-600 text-center font-bold uppercase text-sm mb-6 tracking-wider">{member.role}</p>
                    {/* Details */}
                    <div className="space-y-3">
                      <motion.div whileHover={{ x:5 }} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-all">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{member.qualification}</span>
                      </motion.div>
                      <motion.div whileHover={{ x:5 }} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-all">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{member.specialization}</span>
                      </motion.div>
                    </div>
                    {/* ICAI badge */}
                    <div className="mt-6 pt-4 border-t-2 border-blue-100 group-hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                        <Shield className="w-4 h-4" /><span>ICAI REGISTERED</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
 

           {/* Associate Partners */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <div className="text-xs tracking-widest uppercase font-medium text-slate-400 mb-2">Also on Our Team</div>
              <h3 className="text-2xl font-bold text-slate-900">Associate Partners</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {associatePartners.map((ap, i) => (
                <motion.div key={ap.name} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:i*0.05 }} viewport={{ once:true }}
                  className="flex items-center gap-3 bg-white border border-slate-100 shadow-sm rounded-xl p-3 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {ap.initials}
                  </div>
                  <div>
                    <div className="text-slate-800 text-xs font-semibold leading-tight">{ap.name}</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">{ap.quals}</div>
                  </div>
                </motion.div>
              ))}
            </div>
 
            {/* Staff summary */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label:"Retired PSB Officials", value:"6", icon:Briefcase },
                { label:"Semi-Qualified Staff", value:"10", icon:GraduationCap },
                { label:"Other Staff", value:"15", icon:Users },
                { label:"Total Strength", value:"40+", icon:Star },
              ].map(({ label, value, icon:Icon }) => (
                <div key={label} className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 text-center hover:border-blue-200 hover:shadow-md transition-all">
                  <Icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-0.5">{value}</div>
                  <div className="text-slate-400 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* CTA */}
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.5 }} viewport={{ once:true }} className="text-center mt-16">
            <motion.div whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}>
              <Button asChild
                className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white px-12 py-7 rounded-2xl text-lg font-bold shadow-2xl overflow-hidden group border-2 border-blue-400/30">
                <Link href="/#consult">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Schedule a Consultation
                    <motion.div animate={{ x:[0,5,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CLIENT SEGMENTS ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <NextImage src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2069&auto=format&fit=crop" alt="Team" fill sizes="100vw" className="object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/88 to-indigo-900/85" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="text-xs tracking-widest uppercase font-medium text-cyan-300 mb-3">Track Record</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Major Client Segments</h2>
            <p className="text-gray-300 mt-3 max-w-2xl mx-auto">Tap a segment to see representative clients</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clientSegments.map((seg, i) => (
              <motion.div key={seg.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.07 }} viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:border-white/35 transition-all duration-300">
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setExpandedSegment(expandedSegment === i ? null : i)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{seg.icon}</span>
                    <span className="font-semibold text-white">{seg.title}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${expandedSegment === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {expandedSegment === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-5 pb-5 pt-0 border-t border-white/10">
                        {seg.clients.map((c) => (
                          <div key={c} className="flex items-center gap-2 py-1.5 text-sm text-white/60">
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" /> {c}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFICES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="text-xs tracking-widest uppercase font-medium text-blue-600 mb-3">Our Presence</div>
            <h2 className="text-3xl font-bold text-slate-900">Office Locations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Head Office", city: "Ghaziabad", address: "F-1/299, Sector-4, Vaishali, Ghaziabad – 201010", phone: "+91 9999622662", email: "camrsandco@gmail.com", color: "blue" },
              { title: "Branch Office I", city: "Noida", address: "Flat A-1003, Prateek Stylome, Sector 45, Noida – 201301", phone: "+91 9999622662", email: "", color: "indigo" },
              { title: "Branch Office II", city: "Mumbai", address: "Office No. 5, Topiwala Centre, Kakaji Nagar, Goregaon West, Mumbai – 400104", phone: "+91 9999622662", email: "", color: "cyan" },
            ].map(({ title, city, address, phone, email, color }) => (
              <motion.div key={city} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
                className={`bg-white rounded-2xl shadow-lg border border-slate-100 p-7 hover:shadow-xl hover:border-${color}-200 transition-all duration-300`}>
                <div className={`w-11 h-11 bg-${color}-100 rounded-xl flex items-center justify-center mb-5`}>
                  <MapPin className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest text-${color}-600 mb-1`}>{title}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{city}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{address}</p>
                <div className="pt-4 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className={`w-3.5 h-3.5 text-${color}-500`} /> {phone}
                  </div>
                  {email && <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail className={`w-3.5 h-3.5 text-${color}-500`} /> {email}
                  </div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to work with us?</h2>
          <p className="text-gray-300 mb-8">Book a free consultation and speak directly with one of our senior CAs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="group bg-white text-slate-950 hover:bg-cyan-50 px-8 py-6 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl">
              <Link href="/#consult">Book a Consultation <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
            <Button asChild className="bg-transparent border-2 border-white/20 hover:border-white/50 text-white px-8 py-6 rounded-2xl font-semibold hover:bg-white/5 transition-all duration-300">
              <Link href="/#services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
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
              <p className="text-gray-400">Your trusted financial partners for growth, governance & compliance.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                {[["About", "/about"], ["Services", "/#services"], ["Careers", "/careers"], ["Contact", "/#contact"]].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> camrsandco@gmail.com</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 9999622662</div>
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> F-1/299, Sector-4, Vaishali, Ghaziabad – 201010</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MRS & Co. Chartered Accountants. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── PARTNER MODAL ── */}
      <AnimatePresence>
        {selectedPartner && <PartnerModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />}
      </AnimatePresence>
    </div>
  );
}

// need this for the staff section icon
function GraduationCap({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  );
}