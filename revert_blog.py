import re

content = """"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
    tagColor: "text-emerald-300 bg-emerald-500/20 border-emerald-400/40",
    tagSolid: { bg: "#064e3b", border: "#10b981", text: "#6ee7b7" },
    accent: "from-emerald-500 to-teal-500",
    accentSolid: "#10b981",
    accentLight: "rgba(16,185,129,0.12)",
    accentGlow: "rgba(16,185,129,0.35)",
    date: "May 1, 2026",
    readTime: "8 min read",
    image: "/blog/blog-gst-limits.png",
    title: "10 Important GST Limits Every Business Must Know in 2026",
    subtitle:
      "Know these thresholds, stay compliant and save big on penalties and notices.",
    heroGradient: "from-emerald-950 via-teal-950 to-slate-950",
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
    tagColor: "text-amber-300 bg-amber-500/20 border-amber-400/40",
    tagSolid: { bg: "#451a03", border: "#f59e0b", text: "#fcd34d" },
    accent: "from-amber-500 to-orange-500",
    accentSolid: "#f59e0b",
    accentLight: "rgba(245,158,11,0.12)",
    accentGlow: "rgba(245,158,11,0.35)",
    date: "May 2, 2026",
    readTime: "7 min read",
    image: "/blog/blog-gst-notices.png",
    title: "Types of GST Notices: What They Mean & How to Respond",
    subtitle:
      "A notice ignored is a penalty invited. Every GST notice decoded with response timelines.",
    heroGradient: "from-amber-950 via-orange-950 to-slate-950",
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

// ─── Floating Particle ────────────────────────────────────────────────────────
function FloatingOrb({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

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
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        className="relative max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 hover:rotate-90"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08] ring-1 ring-white/5">
          <img src={src} alt={alt} className="w-full h-auto object-contain" />
        </div>
        <p className="text-center text-white/30 text-[11px] mt-3 tracking-wider uppercase">Press Esc or tap outside to close</p>
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
    <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] bg-white/5">
      <motion.div
        className="h-full"
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
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
      onClick={onClose}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <ReadingProgress color={post.accentSolid} />
      <div className="absolute inset-0 bg-slate-950/96 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative w-full max-w-2xl my-6 mx-4 rounded-[2rem] overflow-hidden shadow-2xl"
        style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 40px 100px rgba(0,0,0,0.7), 0 0 80px ${post.accentGlow}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero ── */}
        <div className={`relative bg-gradient-to-br ${post.heroGradient} overflow-hidden`}>
          {/* Ambient bg image */}
          <div className="absolute inset-0">
            <img src={post.image} alt="" className="w-full h-full object-cover opacity-[0.06] scale-125 blur-2xl" />
            <div className={`absolute inset-0 bg-gradient-to-b ${post.heroGradient} opacity-90`} />
          </div>

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-7 pt-6 pb-0">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: post.accentLight, border: `1px solid ${post.accentGlow}` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: post.accentSolid }} />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
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
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex gap-5 px-7 pt-5 pb-7 items-end">
            {/* Thumbnail */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); onViewImage(); }}
              className="group relative flex-shrink-0 w-[100px] md:w-[128px] rounded-2xl overflow-hidden cursor-zoom-in"
              style={{
                border: `1px solid rgba(255,255,255,0.2)`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${post.accentGlow}`,
              }}
            >
              <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
              </div>
            </motion.button>

            {/* Text */}
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-[18px] md:text-[22px] font-bold text-white leading-[1.3] mb-2 tracking-[-0.02em]">
                {post.title}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{post.subtitle}</p>
              <div className="flex flex-wrap items-center gap-4 text-white/50 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" style={{ color: post.accentSolid }} />
                  {post.readTime}
                </span>
                <span>{post.date}</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  {post.sections} sections
                </span>
              </div>
            </div>
          </div>

          {/* Decorative rule */}
          <div className="h-[1px] w-full" style={{ background: `linear-gradient(to right, transparent, ${post.accentGlow}, transparent)` }} />
        </div>

        {/* ── Article body ── */}
        <div id="article-body" className="bg-[#080f1e] px-7 py-8 space-y-0">
          {post.content.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.4 }}
              className="group/section relative py-5 border-b border-white/[0.06] last:border-0"
            >
              {/* Number indicator */}
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold mt-0.5 transition-all duration-300"
                  style={{
                    background: post.accentLight,
                    color: post.accentSolid,
                    border: `1px solid ${post.accentGlow}`,
                  }}
                >
                  {i + 1 <= 9 ? `0${i + 1}` : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-[14px] leading-snug mb-2 tracking-[-0.01em]">
                    {section.heading}
                  </h3>
                  <p className="text-slate-400 text-[13px] leading-[1.75]">{section.body}</p>
                </div>
              </div>

              {/* Hover accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to bottom, transparent, ${post.accentSolid}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* ── CTA Footer ── */}
        <div
          className="px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{
            background: "linear-gradient(to right, rgba(8,15,30,0.95), rgba(8,15,30,0.8))",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div>
            <p className="text-[11px] text-white/40 uppercase tracking-widest mb-1">Free consultation</p>
            <p className="text-white/90 text-sm font-medium">Talk to our senior CAs — 30 min, no commitment.</p>
          </div>
          <a
            href="#consult"
            onClick={onClose}
            className="group flex-shrink-0 relative flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold overflow-hidden transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${post.accentSolid}dd, ${post.accentSolid}aa)`,
              boxShadow: `0 4px 20px ${post.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          >
            Book a Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative h-full"
    >
      {/* Glow layer */}
      <motion.div
        className="absolute -inset-[1px] rounded-[2rem] pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse at center, ${post.accentGlow}, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      <motion.div
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative h-full flex flex-col rounded-[2rem] overflow-hidden"
        style={{
          background: hovered
            ? "rgba(255,255,255,0.075)"
            : "rgba(255,255,255,0.04)",
          border: hovered
            ? `1px solid rgba(255,255,255,0.18)`
            : `1px solid rgba(255,255,255,0.09)`,
          boxShadow: hovered
            ? `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px ${post.accentGlow}`
            : "0 4px 24px rgba(0,0,0,0.2)",
          transition: "background 0.3s, border 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Top gradient line */}
        <div
          className="h-[2px] w-full flex-shrink-0"
          style={{ background: `linear-gradient(to right, transparent, ${post.accentSolid}, transparent)` }}
        />

        {/* Image zone */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: 240 }}>
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover object-top"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 30%, rgba(8,12,24,0.98) 100%)`,
            }}
          />
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: post.accentLight, border: `1px solid ${post.accentGlow}` }}
            >
              <Icon className="w-3 h-3" style={{ color: post.accentSolid }} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm"
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
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
            title="View infographic"
          >
            <ZoomIn className="w-3.5 h-3.5 text-white/80" />
          </motion.button>

          {/* Read time pill */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-full text-white/60 text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-7">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] text-white/30 font-medium">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[11px]" style={{ color: post.accentSolid }}>
              {post.sections} sections
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white text-[19px] font-bold leading-[1.35] mb-3 tracking-[-0.02em]">
            {post.title}
          </h3>

          {/* Subtitle */}
          <p className="text-slate-400 text-[13px] leading-[1.7] mb-6">{post.subtitle}</p>

          {/* Divider */}
          <div className="h-px bg-white/[0.07] mb-5" />

          {/* Preview headings */}
          <ul className="space-y-3 mb-6 flex-1">
            {post.content.slice(0, 3).map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[12.5px]">
                <div
                  className="w-1 h-1 rounded-full flex-shrink-0 mt-[7px]"
                  style={{ background: post.accentSolid, opacity: 0.7 }}
                />
                <span className="text-slate-400 leading-snug">{s.heading}</span>
              </li>
            ))}
            <li className="text-[11.5px] pl-3.5" style={{ color: post.accentSolid, opacity: 0.6 }}>
              + {post.content.length - 3} more sections
            </li>
          </ul>

          {/* CTA row */}
          <motion.button
            onClick={onRead}
            whileHover={{ gap: "12px" }}
            className="group/btn flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: hovered ? post.accentLight : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? post.accentGlow : "rgba(255,255,255,0.08)"}`,
              color: hovered ? post.accentSolid : "rgba(255,255,255,0.6)",
            }}
          >
            <span>Read Full Article</span>
            <ArrowRight
              className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5"
              style={{ color: post.accentSolid }}
            />
          </motion.button>
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
      <section id="blog" className="relative py-24 overflow-hidden bg-[#05080f]">
        {/* ── Background atmosphere ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: "52px 52px",
            }}
          />

          {/* Radial ambient lights */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(60px)" }}
          />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(60px)" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.04]"
            style={{ background: "radial-gradient(ellipse, #10b981 0%, transparent 70%)", filter: "blur(80px)" }}
          />

          {/* Floating orbs */}
          <FloatingOrb style={{ top: "20%", left: "8%", width: 6, height: 6, background: "#06b6d4", filter: "blur(1px)" }} />
          <FloatingOrb style={{ top: "55%", left: "92%", width: 4, height: 4, background: "#10b981", filter: "blur(1px)" }} />
          <FloatingOrb style={{ top: "75%", left: "15%", width: 3, height: 3, background: "#f59e0b", filter: "blur(1px)" }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

          {/* ── Section header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              {/* Label pill */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5"
                style={{
                  background: "rgba(6,182,212,0.08)",
                  borderColor: "rgba(6,182,212,0.25)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-300/90 text-[11px] font-bold uppercase tracking-[0.15em]">
                  Insights & Updates
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="text-[36px] md:text-[44px] font-bold text-white leading-[1.15] tracking-[-0.03em] mb-3"
              >
                From Our{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #06b6d4, #818cf8)" }}
                >
                  Senior CAs
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.14 }}
                className="text-slate-400 text-[15px] leading-relaxed"
              >
                Practical, no-fluff guides on tax, compliance & finance — written by practitioners, not copywriters.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">New articles every week</p>
                <p className="text-slate-500 text-[11px]">2 published this week</p>
              </div>
            </motion.div>
          </div>

          {/* ── Cards ── */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-10 relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 0 60px rgba(99,102,241,0.08)",
            }}
          >
            {/* Subtle inner glow */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: "radial-gradient(ellipse at top left, rgba(6,182,212,0.08), transparent 60%), radial-gradient(ellipse at bottom right, rgba(99,102,241,0.08), transparent 60%)",
              }}
            />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Have a GST or Tax query?</p>
                  <p className="text-slate-400 text-[12px] mt-0.5">Our team responds within 1 business day.</p>
                </div>
              </div>

              <a
                href="#consult"
                className="group flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold overflow-hidden transition-all duration-200 hover:scale-[1.04] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                Book a Free Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
    f.write(content)

print("BlogSection reverted completely.")
