

// export default AchievementSection;
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';

// Memoize the entire component to prevent unnecessary re-renders
const AchievementSection = memo(() => {
  // Pre-define animation variants to avoid recreating them
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    viewport: { once: true, margin: "-50px" }
  };

  const fadeInSide = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
    viewport: { once: true, margin: "-50px" }
  };

  // Simplified background animation - reduced complexity
  const bgAnimation1 = {
    animate: {
      x: [0, 50, 0],
      y: [0, -25, 0],
      opacity: [0.1, 0.2, 0.1],
    },
    transition: { duration: 15, repeat: Infinity }
  };

  const bgAnimation2 = {
    animate: {
      x: [0, -40, 0],
      y: [0, 30, 0],
      opacity: [0.1, 0.2, 0.1],
    },
    transition: { duration: 18, repeat: Infinity, delay: 5 }
  };

  // Badge pulse animation - simpler version
  const badgePulse = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.2)",
        "0 0 30px rgba(99, 102, 241, 0.3)",
        "0 0 20px rgba(59, 130, 246, 0.2)",
      ],
    },
    transition: { duration: 2, repeat: Infinity }
  };

  // Trust badges data
  const trustBadges = [
    { icon: Shield, label: "ICAI Registered", color: "text-blue-400" },
    { icon: Award, label: "ISO Certified", color: "text-indigo-400" },
    { icon: Award, label: "RBI Empanelled", color: "text-yellow-400" },
    { icon: CheckCircle, label: "Quality Assured", color: "text-green-400" },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Enhanced Background - No Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

      {/* Simplified Animated Background - ONLY 2 elements instead of many */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={bgAnimation1.animate}
          transition={bgAnimation1.transition}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={bgAnimation2.animate}
          transition={bgAnimation2.transition}
          className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.whileInView}
            transition={fadeInUp.transition}
            viewport={fadeInUp.viewport}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-blue-600/90 text-white text-sm font-bold uppercase tracking-wider mb-6 shadow-xl backdrop-blur-sm border border-white/20"
              animate={badgePulse.animate}
              transition={badgePulse.transition}
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-5 h-5 mr-2" />
              Our Credentials & Impact
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted Excellence Since 1999
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Certified professionals delivering world-class financial services with proven track record
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Certificates Only - Vertical Stack */}
          <div className="flex flex-col gap-16">
            <motion.div
              initial={fadeInSide.initial}
              whileInView={fadeInSide.whileInView}
              transition={fadeInSide.transition}
              viewport={fadeInSide.viewport}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-8">
                <Shield className="w-8 h-8 text-cyan-400 mr-3" />
                <h3 className="text-3xl font-bold text-white">Verified Accreditations</h3>
              </div>
            </motion.div>
            
            {/* Certificate Components - Memoized */}
            <CertificateCard
              src="/assets/certificates/peer-review-certificate-v2.png"
              alt="ICAI Peer Review Certificate"
              title="ICAI Peer Review Certificate"
              issuer="The Institute of Chartered Accountants of India"
              badges={[
                { text: "Valid till 2028", variant: "green" },
                { text: "Verified", variant: "blue" }
              ]}
              delay={0.1}
              gradientFrom="from-blue-500"
              gradientTo="to-indigo-500"
              iconColor="text-green-400"
              hoverColor="hover:text-cyan-300"
            />

            <CertificateCard
              src="/assets/certificates/forensic-accounting-certificate.png"
              alt="Forensic Accounting & Fraud Detection"
              title="Forensic Accounting & Fraud Detection"
              issuer="The Institute of Chartered Accountants of India (ICAI)"
              badges={[
                { text: "ICAI Certified", variant: "indigo" },
                { text: "Specialized", variant: "purple" }
              ]}
              delay={0.2}
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-500"
              icon={Shield}
              iconColor="text-indigo-400"
              hoverColor="hover:text-indigo-300"
            />
            <CertificateCard
              src="/assets/certificates/Concurrent_audit_ofbank.png"
              alt="Forensic Accounting & Fraud Detection"
              title="Concurrent Audit Of Bank Certificate"
              issuer="The Institute of Chartered Accountants of India (ICAI)"
              badges={[
                { text: "ICAI Certified", variant: "indigo" },
                { text: "Specialized", variant: "purple" }
              ]}
              delay={0.2}
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-500"
              icon={Shield}
              iconColor="text-indigo-400"
              hoverColor="hover:text-indigo-300"
            />

            <CertificateCard
              src="/assets/certificates/card_of_recognition.png"
              alt="Card of Recognition"
              title="Card Of Recognition"
              issuer="The Institute of Chartered Accountants of India (ICAI)"
              badges={[
                { text: "ICAI Certified", variant: "indigo" },
                { text: "Specialized", variant: "purple" }
              ]}
              delay={0.3}
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-500"
              icon={Shield}
              iconColor="text-indigo-400"
              hoverColor="hover:text-indigo-300"
            />
            
            <CertificateCard
              src="/assets/certificates/Uaecorporatetax.png"
              alt="Card of Recognition"
              title="UAE Corporate Tax Certificate"
              issuer="The Institute of Chartered Accountants of India (ICAI)"
              badges={[
                { text: "ICAI Certified", variant: "indigo" },
                { text: "Specialized", variant: "purple" }
              ]}
              delay={0.4}
              gradientFrom="from-indigo-500"
              gradientTo="to-purple-500"
              icon={Shield}
              iconColor="text-indigo-400"
              hoverColor="hover:text-indigo-300"
            />
          </div>
        </div>

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12 pt-12 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustBadges.map((badge, idx) => (
              <TrustBadge
                key={badge.label}
                icon={badge.icon}
                label={badge.label}
                color={badge.color}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

// Memoized Certificate Card Component
interface CertificateCardProps {
  src: string;
  alt: string;
  title: string;
  issuer: string;
  badges: Array<{ text: string; variant: string }>;
  delay: number;
  gradientFrom: string;
  gradientTo: string;
  icon?: React.ElementType;
  iconColor: string;
  hoverColor: string;
}

const CertificateCard = memo<CertificateCardProps>(({
  src,
  alt,
  title,
  issuer,
  badges,
  delay,
  gradientFrom,
  gradientTo,
  icon: Icon,
  iconColor,
  hoverColor
}) => {
  const badgeColors: Record<string, string> = {
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    indigo: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className="group"
    >
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 hover:border-blue-400/50 transition-all duration-300 overflow-hidden">
        {/* Glow Effect - Only on hover */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Certificate Image - Optimized with Next.js Image */}
          <div className="w-full bg-white/5 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-blue-400/30 transition-all duration-300 mb-8 shadow-2xl">
            <Image 
              src={src}
              alt={alt}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              loading="lazy"
              quality={75}
            />
          </div>
          
          {/* Certificate Details */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <h4 className={`font-bold text-3xl text-white ${hoverColor} transition-colors duration-300`}>
                {title}
              </h4>
              {Icon ? (
                <Icon className={`w-8 h-8 ${iconColor} ml-4`} />
              ) : (
                <CheckCircle className={`w-8 h-8 ${iconColor} ml-4`} />
              )}
            </div>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {issuer}
            </p>
            <div className="flex items-center justify-center gap-4">
              {badges.map((badge) => (
                <span
                  key={badge.text}
                  className={`px-6 py-2 rounded-full text-base font-bold border ${badgeColors[badge.variant]}`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Trust Badge Component
interface TrustBadgeProps {
  icon: React.ElementType;
  label: string;
  color: string;
}

const TrustBadge = memo<TrustBadgeProps>(({ icon: Icon, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ duration: 0.2 }}
    className="flex flex-col items-center gap-2"
  >
    <Icon className={`w-8 h-8 ${color}`} />
    <p className="text-sm font-bold text-white">{label}</p>
  </motion.div>
));

// Add display names for better debugging
AchievementSection.displayName = 'AchievementSection';
CertificateCard.displayName = 'CertificateCard';
TrustBadge.displayName = 'TrustBadge';

export default AchievementSection;