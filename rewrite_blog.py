import re

with open('app/BlogSection/page.tsx', 'r') as f:
    old_content = f.read()

# I will write the new content.
new_content = """"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  X,
  ChevronRight,
  BookOpen,
  TrendingUp,
  ZoomIn,
  Sparkles,
  FileText,
  Shield,
} from "lucide-react";

const blogPosts = [
  {
    id: 1,
    tag: "GST Limits",
    tagColor: "text-emerald-700 bg-emerald-100 border-emerald-200",
    tagSolid: { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46" },
    accent: "from-emerald-500 to-teal-500",
    accentSolid: "#059669",
    accentLight: "#ecfdf5",
    accentGlow: "rgba(5, 150, 105, 0.15)",
    date: "May 1, 2026",
    readTime: "8 min read",
    image: "/blog/blog-gst-limits.png",
    title: "10 Important GST Limits Every Business Must Know in 2026",
    subtitle:
      "Know these thresholds, stay compliant and save big on penalties and notices.",
    heroGradient: "from-emerald-50 to-white",
    icon: Shield,
    sections: 10,
    content: [
      {
        heading: "1. GST Registration Limit",
        body: "If your aggregate turnover crosses ₹40 lakh (goods, normal states), ₹20 lakh (services), or ₹10 lakh (special category / NE & Hilly states), GST registration becomes mandatory. Crossing this threshold without registering attracts heavy penalties.",
      },
      {
        heading: "2. Composition Scheme Limit",
        body: "Small businesses with turnover up to ₹1.5 crore (traders/manufacturers) or ₹50 lakh (service providers) can opt for the Composition Scheme. This lowers compliance burden but forfeits ITC benefits — weigh the trade-off carefully.",
      },
      {
        heading: "3. ITC Claim Time Limit",
        body: "Per Section 16(4), Input Tax Credit must be claimed by 30th November of the next financial year, or the date of filing the Annual Return (GSTR-9), whichever is earlier. Miss this window and ITC is permanently lost — no exceptions.",
      },
      {
        heading: "4. Rule 86B – 1% Cash Payment Limit",
        body: "If your taxable turnover in a month exceeds ₹50 lakh, at least 1% of the output GST liability must be paid in cash (not through ITC). This rule targets circular-trading and ITC fraud by ensuring skin-in-the-game cash payments.",
      },
      {
        heading: "5. E-Invoice Applicability",
        body: "Businesses with aggregate turnover above ₹5 crore must generate e-invoices for all B2B supplies. E-invoicing is mandatory and non-compliance can result in invoices being treated as invalid, blocking buyer's ITC claims.",
      },
      {
        heading: "6. E-Way Bill Limit",
        body: "Movement of goods with a consignment value exceeding ₹50,000 requires a valid e-way bill. This applies to interstate and intrastate supplies, job work, and imports/exports. The limit may vary for specific states — always verify.",
      },
      {
        heading: "7. GST Audit (Turnover-Based)",
        body: "Under current law, there is no mandatory GST audit based on turnover. However, reconciliation between GSTR-1, GSTR-3B, GSTR-2B, and books of accounts remains critical. Errors in reconciliation trigger notices and demand orders.",
      },
      {
        heading: "8. Late Fee – GSTR-3B / GSTR-1",
        body: "Late filing attracts ₹50 per day for normal returns and ₹20 per day for NIL returns, subject to maximum caps. These fees accrue daily, so even a short delay compounds into significant costs over time.",
      },
      {
        heading: "9. Interest on Late Tax Payment",
        body: "Interest @18% p.a. applies on delayed GST payments. If ITC is wrongly availed or utilized, the interest rate shoots up to 24% p.a. These rates make timely payment far cheaper than deferred settlement.",
      },
      {
        heading: "10. GST Refund Time Limit",
        body: "Refund applications must be filed within 2 years from the relevant date. Missing this window forfeits your refund claim permanently. Common scenarios include export of goods/services, inverted duty structure, and excess cash in electronic credit ledger.",
      },
      {
        heading: "Pro Tip from MRS & Co.",
        body: "GST limits are not just numbers — they define your compliance strategy. A business straddling the ₹40 lakh threshold should proactively plan registration timing. Similarly, exporters should calendar their refund claim deadlines. Our senior CAs can conduct a GST health-check to identify gaps before they become notices.",
      },
    ],
  },
  {
    id: 2,
    tag: "GST Notices",
    tagColor: "text-blue-700 bg-blue-100 border-blue-200",
    tagSolid: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
    accent: "from-blue-500 to-indigo-500",
    accentSolid: "#2563eb",
    accentLight: "#eff6ff",
    accentGlow: "rgba(37, 99, 235, 0.15)",
    date: "May 2, 2026",
    readTime: "7 min read",
    image: "/blog/blog-gst-notices.png",
    title: "Types of GST Notices: What They Mean & How to Respond",
    subtitle:
      "A notice ignored is a penalty invited. Every GST notice decoded with response timelines.",
    heroGradient: "from-blue-50 to-white",
    icon: FileText,
    sections: 11,
    content: [
      {
        heading: "Why GST Notices Happen",
        body: "GST notices are issued by the department to flag mismatches, missing returns, refund queries, or suspected non-compliance. Every notice carries a specific number, a purpose, a mandatory response timeline, and a consequence for non-response. Knowing the notice type is the first step to responding correctly.",
      },
      {
        heading: "GSTR-3A – Return Not Filed",
        body: "Issued when a taxpayer fails to file GSTR-3B or GSTR-1 returns. You have 15 days to file the pending return. If ignored, the officer proceeds with a best-judgment assessment — typically resulting in a demand far higher than actual liability.",
      },
      {
        heading: "ASMT-10 – Return Mismatch",
        body: "Issued when discrepancies are found between GSTR-1, GSTR-3B, or GSTR-2B. You have 30 days to explain or pay the difference. Ignoring this notice results in a formal demand order with interest and penalty attached.",
      },
      {
        heading: "ASMT-14 – Special Audit",
        body: "Issued when the department decides a special audit of your books is warranted. You must cooperate with the audit team as notified. Non-cooperation attracts penalty and demand proceedings.",
      },
      {
        heading: "REG-03 & REG-17 – Registration Notices",
        body: "REG-03 seeks clarification during registration with a 7-day window — ignoring it leads to application rejection. REG-17 calls for you to justify why your GST registration should not be cancelled — respond within 7 days or face cancellation of your GSTIN.",
      },
      {
        heading: "REG-23 – Revocation of Cancellation",
        body: "If your GST registration was cancelled and you want to revive it, REG-23 is the notice in that journey. You have 30 days to apply for revocation. Missing this window means permanently losing the registration.",
      },
      {
        heading: "CMP-05 & CMP-07 – Composition Scheme Violations",
        body: "CMP-05 is issued for suspected Composition Scheme violations; respond in 15 days or the scheme is withdrawn. CMP-07 demands differential tax on wrong composition tax computation — pay as specified or face a tax demand.",
      },
      {
        heading: "RFD-08 & RFD-09 – Refund Notices",
        body: "RFD-08 highlights issues in your refund claim and gives 15 days to clarify. RFD-09 is issued on refund rejection requiring detailed response within 15 days. Ignoring either results in refund rejection — cash you're owed but won't get.",
      },
      {
        heading: "DRC-01 – Tax Demand",
        body: "This is the most serious notice — a formal tax demand from the department. You must pay or file a detailed reply as specified. Ignoring DRC-01 immediately triggers recovery proceedings including potential bank account attachment and asset seizure.",
      },
      {
        heading: "EWB-03 – E-Way Bill Mismatch",
        body: "Issued when e-way bill details don't match the goods in transit. Explain the movement within the specified time. If ignored, expect penalty and potential seizure of goods under transit.",
      },
      {
        heading: "How MRS & Co. Can Help",
        body: "Our GST litigation team manages the entire notice lifecycle — from initial scrutiny and document preparation to drafting legally sound replies and representing you before GST authorities. We have resolved hundreds of notices across GSTR-3A, ASMT-10, DRC-01, and RFD series. Timely action is always cheaper than penalties.",
      },
    ],
  },
];

// ─── Image Lightbox ───────────────────────────────────────────────────────────
function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 5 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        className="relative max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:rotate-90 hover:bg-slate-100"
        >
          <X className="w-5 h-5 text-slate-800" />
        </button>
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white bg-white">
          <img src={src} alt={alt} className="w-full h-auto object-contain" />
        </div>
        <p className="text-center text-white/70 text-[12px] mt-4 font-medium tracking-wide">Press Esc or tap outside to close</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Reading Progress ─────────────────────────────────────────────────────────
function ReadingProgress({ color }: { color: string }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = document.getElementById("article-body");
    const onScroll = () => {
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const p = Math.min(100, Math.max(0, (-top / (height - window.innerHeight)) * 100));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-slate-100">
      <motion.div
        className="h-full rounded-r-full"
        style={{ background: color, width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// ─── Article Modal ────────────────────────────────────────────────────────────
function ArticleModal({
  post,
  onClose,
  onViewImage,
}: {
  post: (typeof blogPosts)[0];
  onClose: () => void;
  onViewImage: () => void;
}) {
  const Icon = post.icon;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <ReadingProgress color={post.accentSolid} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-3xl my-8 mx-4 rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero ── */}
        <div className={`relative bg-gradient-to-br ${post.heroGradient} border-b border-slate-100`}>
          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-8 pt-6 pb-2">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: post.accentLight, border: `1px solid ${post.tagSolid.border}` }}
              >
                <Icon className="w-4 h-4" style={{ color: post.accentSolid }} />
              </div>
              <span
                className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm"
                style={{
                  background: post.tagSolid.bg,
                  border: `1px solid ${post.tagSolid.border}`,
                  color: post.tagSolid.text,
                }}
              >
                {post.tag}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all duration-200 hover:rotate-90 shadow-sm"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex flex-col md:flex-row gap-6 px-8 pt-4 pb-8 items-start md:items-end">
            {/* Text */}
            <div className="flex-1 min-w-0 order-2 md:order-1">
              <h2 className="text-[22px] md:text-[28px] font-extrabold text-slate-900 leading-[1.3] mb-3 tracking-tight">
                {post.title}
              </h2>
              <p className="text-slate-600 text-[15px] leading-relaxed mb-5 font-medium">{post.subtitle}</p>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[12px] font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" style={{ color: post.accentSolid }} />
                  {post.readTime}
                </span>
                <span>{post.date}</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {post.sections} sections
                </span>
              </div>
            </div>
            
            {/* Thumbnail */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => { e.stopPropagation(); onViewImage(); }}
              className="group relative flex-shrink-0 w-[140px] md:w-[160px] rounded-2xl overflow-hidden cursor-zoom-in order-1 md:order-2 shadow-lg border border-slate-200/50 bg-white"
            >
              <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-200 flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-md" />
              </div>
            </motion.button>
          </div>
        </div>

        {/* ── Article body ── */}
        <div id="article-body" className="bg-white px-8 py-8 space-y-0">
          {post.content.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.4 }}
              className="group/section relative py-6 border-b border-slate-100 last:border-0"
            >
              {/* Number indicator */}
              <div className="flex items-start gap-5">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold mt-0.5 transition-all duration-300 shadow-sm"
                  style={{
                    background: post.accentLight,
                    color: post.accentSolid,
                    border: `1px solid ${post.tagSolid.border}`,
                  }}
                >
                  {i + 1 <= 9 ? `0${i + 1}` : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-slate-900 font-bold text-[16px] leading-snug mb-2.5">
                    {section.heading}
                  </h3>
                  <p className="text-slate-600 text-[14.5px] leading-relaxed">{section.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA Footer ── */}
        <div className="bg-slate-50 border-t border-slate-200 px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Free consultation</p>
            <p className="text-slate-800 text-[15px] font-semibold">Talk to our senior CAs — 30 min, no commitment.</p>
          </div>
          <a
            href="#consult"
            onClick={onClose}
            className="group flex-shrink-0 relative flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold overflow-hidden transition-all duration-200 shadow-md hover:shadow-lg"
            style={{
              background: post.accentSolid,
            }}
          >
            Book a Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({
  post,
  index,
  onRead,
  onViewImage,
}: {
  post: (typeof blogPosts)[0];
  index: number;
  onRead: () => void;
  onViewImage: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = post.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative h-full"
    >
      <motion.div
        animate={{ y: hovered ? -6 : 0 }}
        className="relative h-full flex flex-col bg-white rounded-[2rem] overflow-hidden transition-all duration-300"
        style={{
          border: hovered ? `1px solid ${post.accentSolid}` : "1px solid #e2e8f0",
          boxShadow: hovered 
            ? `0 20px 40px rgba(0,0,0,0.06), 0 0 0 1px ${post.accentSolid}` 
            : "0 4px 15px rgba(0,0,0,0.03)",
        }}
      >
        {/* Top line */}
        <div
          className="h-[4px] w-full flex-shrink-0 transition-colors duration-300"
          style={{ background: hovered ? post.accentSolid : "#f1f5f9" }}
        />

        {/* Image zone */}
        <div className="relative overflow-hidden flex-shrink-0 bg-slate-50 border-b border-slate-100" style={{ height: 220 }}>
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover object-top mix-blend-multiply"
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

          {/* Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: post.tagSolid.bg, border: `1px solid ${post.tagSolid.border}` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: post.accentSolid }} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm"
              style={{
                background: post.tagSolid.bg,
                border: `1px solid ${post.tagSolid.border}`,
                color: post.tagSolid.text,
              }}
            >
              {post.tag}
            </span>
          </div>

          {/* Zoom */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onViewImage(); }}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center transition-colors shadow-sm"
            title="View infographic"
          >
            <ZoomIn className="w-4 h-4 text-slate-700" />
          </motion.button>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-7 bg-white">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[12px] text-slate-500 font-semibold">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[12px] font-bold" style={{ color: post.accentSolid }}>
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-slate-900 text-[20px] font-extrabold leading-[1.35] mb-3 tracking-tight group-hover:text-blue-700 transition-colors">
            {post.title}
          </h3>

          {/* Subtitle */}
          <p className="text-slate-600 text-[14px] leading-[1.6] mb-6 font-medium">{post.subtitle}</p>

          <div className="mt-auto pt-5 border-t border-slate-100">
            <motion.button
              onClick={onRead}
              className="group/btn flex items-center gap-2 text-[14px] font-bold transition-colors"
              style={{ color: hovered ? post.accentSolid : "#475569" }}
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function BlogSection() {
  const [activePost, setActivePost] = useState<(typeof blogPosts)[0] | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <section id="blog" className="relative py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          
          {/* ── Section header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              {/* Label pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-5 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-[11px] font-bold uppercase tracking-widest">
                  Insights & Updates
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-[36px] md:text-[44px] font-extrabold text-slate-900 leading-[1.2] tracking-tight mb-4"
              >
                From Our Senior CAs
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-slate-600 text-[16px] md:text-[18px] font-medium leading-relaxed"
              >
                Practical, no-fluff guides on tax, compliance & finance — written by practitioners, not copywriters.
              </motion.p>
            </div>
          </div>

          {/* ── Cards ── */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {blogPosts.map((post, i) => (
              <BlogCard
                key={post.id}
                post={post}
                index={i}
                onRead={() => setActivePost(post)}
                onViewImage={() => setLightboxImage({ src: post.image, alt: post.title })}
              />
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-14 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-[16px]">Have a specific GST or Tax query?</p>
                  <p className="text-slate-500 text-[13px] mt-1 font-medium">Our team responds within 1 business day.</p>
                </div>
              </div>

              <a
                href="#consult"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Book a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Article modal ── */}
      <AnimatePresence mode="wait">
        {activePost && (
          <ArticleModal
            post={activePost}
            onClose={() => setActivePost(null)}
            onViewImage={() =>
              setLightboxImage({ src: activePost.image, alt: activePost.title })
            }
          />
        )}
      </AnimatePresence>

      {/* ── Image lightbox ── */}
      <AnimatePresence>
        {lightboxImage && (
          <ImageLightbox
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClose={() => setLightboxImage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
"""

with open('app/BlogSection/page.tsx', 'w') as f:
    f.write(new_content)

print("Rewrote blog section.")
