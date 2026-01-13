
// import React, { useEffect, useState } from 'react';

// const AchievementSection = () => {
//   const [counts, setCounts] = useState({ years: 0, clients: 0, retention: 0 });

//   // Simple animation effect for numbers
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCounts((prev) => ({
//         years: prev.years < 25 ? prev.years + 1 : 25,
//         clients: prev.clients < 500 ? prev.clients + 10 : 500,
//         retention: prev.retention < 98 ? prev.retention + 1 : 98,
//       }));
//     }, 30);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="py-16 px-6 bg-slate-50 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Section Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
//             Our Credentials & Global Impact
//           </h2>
//           <div className="h-1 w-20 bg-blue-700 mx-auto"></div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
//           {/* Left Side: 2 Certificates */}
//           <div className="space-y-6">
//             <h3 className="text-xl font-semibold text-slate-700 mb-4">Verified Accreditations</h3>
            
//             {/* Certificate 1 */}
//             <div className="flex items-center p-6 bg-white rounded-xl shadow-sm border-l-4 border-blue-700 hover:shadow-md transition-shadow">
//               <div className="flex-shrink-0 w-24 h-24 bg-blue-50 rounded-lg flex items-center justify-center mr-6 overflow-hidden">
//                 <img 
//                   src="/assets/certificates/peer-review-certificate.png" 
//                   alt="ICAI Peer Review Certificate" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div>
//                 <h4 className="font-bold text-slate-900">Peer Review Certificate</h4>
//                 <p className="text-sm text-slate-600">Issued by The Institute of Chartered Accountants of India</p>
//                 <p className="text-xs text-slate-500 mt-1">Valid till 2028</p>
//               </div>
//             </div>

//             {/* Certificate 2 */}
//             <div className="flex items-center p-6 bg-white rounded-xl shadow-sm border-l-4 border-blue-700 hover:shadow-md transition-shadow">
//               <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mr-6">
//                 <img 
//                   src="/path-to-your-cert2-logo.png" 
//                   alt="Quality ISO Logo" 
//                   className="w-10 h-10 object-contain"
//                 />
//               </div>
//               <div>
//                 <h4 className="font-bold text-slate-900">ISO 9001:2015 Certified</h4>
//                 <p className="text-sm text-slate-600">Recognized for Global Standards in Consulting</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Side: Achievement Stats */}
//           <div className="grid grid-cols-2 gap-6">
//             <div className="p-8 bg-blue-900 text-white rounded-2xl text-center shadow-xl transform hover:-translate-y-2 transition-transform">
//               <p className="text-4xl font-bold mb-2">{counts.years}+</p>
//               <p className="text-blue-200 text-sm uppercase tracking-wider">Years Experience</p>
//             </div>
//             <div className="p-8 bg-white border border-slate-200 text-center rounded-2xl shadow-sm transform hover:-translate-y-2 transition-transform">
//               <p className="text-4xl font-bold text-blue-900 mb-2">{counts.clients}+</p>
//               <p className="text-slate-500 text-sm uppercase tracking-wider">Global Clients</p>
//             </div>
//             <div className="col-span-2 p-8 bg-slate-900 text-white rounded-2xl text-center shadow-xl transform hover:-translate-y-2 transition-transform">
//               <p className="text-4xl font-bold mb-2">{counts.retention}%</p>
//               <p className="text-slate-400 text-sm uppercase tracking-wider">Client Success & Retention Rate</p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default AchievementSection;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, CheckCircle } from 'lucide-react';

const AchievementSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Enhanced Background - No Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -180, -360],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
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
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-8">
                <Shield className="w-8 h-8 text-cyan-400 mr-3" />
                <h3 className="text-3xl font-bold text-white">Verified Accreditations</h3>
              </div>
            </motion.div>
            
            {/* Certificate 1 - ICAI Peer Review */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 hover:border-blue-400/50 transition-all duration-300 overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Certificate Image - Full Width & Natural Height */}
                  <div className="w-full bg-white/5 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-blue-400/30 transition-all duration-300 mb-8 shadow-2xl">
                    <img 
                      src="/assets/certificates/peer-review-certificate-v2.png" 
                      alt="ICAI Peer Review Certificate" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  {/* Certificate Details */}
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-center mb-4">
                      <h4 className="font-bold text-3xl text-white group-hover:text-cyan-300 transition-colors duration-300">
                        ICAI Peer Review Certificate
                      </h4>
                      <CheckCircle className="w-8 h-8 text-green-400 ml-4" />
                    </div>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      Issued by The Institute of Chartered Accountants of India
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="px-6 py-2 rounded-full text-base font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                        Valid till 2028
                      </span>
                      <span className="px-6 py-2 rounded-full text-base font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certificate 2 - Forensic Accounting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 hover:border-indigo-400/50 transition-all duration-300 overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Certificate Image - Full Width & Natural Height */}
                  <div className="w-full bg-white/5 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-indigo-400/30 transition-all duration-300 mb-8 shadow-2xl">
                    <img 
                      src="/assets/certificates/forensic-accounting-certificate.png" 
                      alt="Forensic Accounting & Fraud Detection" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  {/* Certificate Details */}
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-center mb-4">
                      <h4 className="font-bold text-3xl text-white group-hover:text-indigo-300 transition-colors duration-300">
                        Forensic Accounting & Fraud Detection
                      </h4>
                      <Shield className="w-8 h-8 text-indigo-400 ml-4" />
                    </div>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      Certified by The Institute of Chartered Accountants of India (ICAI)
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="px-6 py-2 rounded-full text-base font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        ICAI Certified
                      </span>
                      <span className="px-6 py-2 rounded-full text-base font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Specialized
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 pt-12 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Shield, label: "ICAI Registered", color: "text-blue-400" },
              { icon: Award, label: "ISO Certified", color: "text-indigo-400" },
              { icon: Award, label: "RBI Empanelled", color: "text-yellow-400" },
              { icon: CheckCircle, label: "Quality Assured", color: "text-green-400" },
            ].map((badge, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2"
              >
                <badge.icon className={`w-8 h-8 ${badge.color}`} />
                <p className="text-sm font-bold text-white">{badge.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementSection;