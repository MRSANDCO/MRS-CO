"use client";
// import React from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { Award, GraduationCap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { section } from "framer-motion/client";



export default function TeamSection() {
  const handleScrollToConsult = () => {
    const section = document.getElementById("consult");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
      
      <section id="team" className="relative py-24 overflow-hidden">
        {/* Live Vibrant Background Video/Animation Layer */}
        <div className="absolute inset-0 z-0">
          {/* Base Background Image */}
        <NextImage
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
            alt="Modern glass building"
            fill={true}
            sizes="100vw"
            className="object-cover w-full h-full"
            priority={false}
          />
          {/* Vibrant Animated Gradient Overlays */}
          <motion.div
           className="absolute inset-0 z-0"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.20))",
                "linear-gradient(90deg, rgba(6, 182, 212, 0.20), rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.15))",
                "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.25), rgba(59, 130, 246, 0.20))",
                "linear-gradient(45deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.20))",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
           
          />
          
          {/* Static Gradient Layers for Depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/12 via-indigo-300/8 to-cyan-400/15"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/75 to-white/80 backdrop-blur-[2px]"></div>
        </div>

        {/* Enhanced Animated Floating Elements - More Vibrant */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Orb - Blue */}
          <motion.div
            animate={{
              x: [0, 120, 0],
              y: [0, -50, 0],
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.4, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-400/50 to-indigo-600/50 rounded-full shadow-2xl shadow-blue-400/40 blur-xl"
          />
          
          {/* Medium Orb - Cyan */}
          <motion.div
            animate={{
              x: [0, -90, 0],
              y: [0, 60, 0],
              rotate: [0, -180, -360],
              opacity: [0.35, 0.65, 0.35],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute bottom-32 left-12 w-40 h-40 bg-gradient-to-br from-cyan-400/60 to-blue-500/60 rounded-3xl shadow-xl shadow-cyan-300/50 blur-2xl"
          />
          
          {/* Small Orb - Purple */}
          <motion.div
            animate={{
              x: [0, 70, 0],
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 90, 180],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 8,
            }}
            className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-400/70 to-purple-500/70 rounded-full shadow-lg shadow-indigo-300/60 blur-xl"
          />
          
          {/* Medium Orb - Light Blue */}
          <motion.div
            animate={{
              x: [0, -60, 0],
              y: [0, 40, 0],
              opacity: [0.35, 0.65, 0.35],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute top-1/4 right-1/3 w-36 h-36 bg-gradient-to-br from-sky-400/55 to-blue-500/55 rounded-2xl shadow-md shadow-sky-300/40 blur-2xl"
          />
          
          {/* Additional Small Orb - Teal */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -20, 0],
              opacity: [0.25, 0.55, 0.25],
              rotate: [0, -120, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 10,
            }}
            className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-teal-400/60 to-cyan-500/60 rounded-full shadow-lg shadow-teal-300/50 blur-xl"
          />
          
          {/* Floating Particles Effect */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 30, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${
                i % 3 === 0 
                  ? "from-blue-400 to-indigo-500" 
                  : i % 3 === 1 
                  ? "from-cyan-400 to-blue-500" 
                  : "from-indigo-400 to-purple-500"
              } shadow-lg`}
              style={{
                left: `${10 + i * 12}%`,
                bottom: "10%",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Badge - Matching Your News Ticker Style */}
              <motion.div
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-blue-700/95 text-white text-sm font-bold uppercase tracking-wider mb-6 shadow-xl border border-white/30"
                animate={{
                  boxShadow: [
                    "0 0 25px rgba(59, 130, 246, 0.4)",
                    "0 0 45px rgba(99, 102, 241, 0.5)",
                    "0 0 25px rgba(59, 130, 246, 0.4)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                whileHover={{ scale: 1.08 }}
              >
                <Award className="w-5 h-5 mr-2" />
                Meet Our Leadership
              </motion.div>

              {/* Title */}
              <h2 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                <span className="block text-slate-900">Your Trusted</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Financial Experts
                </span>
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Award-winning Chartered Accountants with 40+ years of combined expertise
              </p>
            </motion.div>
          </div>

          {/* Team Cards Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "CA Ram Kumar Dhiman",
                role: "Founder & Managing Partner",
                image: "/assets/team/member1.jpg",
                qualification: "FCA, FAFD ,M.Com",
                experience: "25+",
                specialization: "Forensic Auditing & International Taxation",
                // imageContainerClass: undefined
              },
              {
                name: "CA Amit Pathak",
                role: "Senior Partner",
                image: "/assets/team/amitpathak.jpg",
                qualification: "FCA, ICWA, ISO Auditor-ICRC(London)",
                experience: "25+",
                specialization: "Accounting Management and Taxation"
              },
              {
                name: "CA Mukesh Thakur",
                role: "Associate Partner",
                image: "/assets/team/mukesh-thakur.jpg",
                imagePosition: "object-top",
                qualification: "FCA, FAFD, M.Com",
                experience: "25+",
                specialization: "FEMA, IndAS, Taxation"
              },
              
              {
                name: "Advocate Prashant Shukla",
                role: "Legal Advisor",
                image: "/assets/team/prashant-shukla.png",
                imagePosition: "object-top",
                qualification: "LLB",
                experience: "20+",
                specialization: "Corporate Law & Direct and Indirect taxes specialisation"
              },
              {
                name: "CA Rajeev Kumar", 
                role: "Senior Partner",
                image: "/assets/team/member2.jpg",
                imagePosition: "object-top",
                qualification: "FCA, MBA",
                experience: "20+",
                specialization: "Corporate Advisory & Taxation"
              },
              {
                name: "CA Shruti Dang",
                role: "Partner", 
                image: "/assets/team/member3.jpg",
                imagePosition: "object-top",
                qualification: "FCA, M.Com",
                experience: "15+",
                specialization: "GST & Compliance and International Corporate Taxation (UAE)"
              },
              
              {
                name: "CA Neha Sharma",
                role: "Partner",
                image: "/assets/team/member4.jpg",
                imagePosition: "object-top",
                qualification: "FCA, DISA",
                experience: "15+",
                specialization: "Risk Advisory and Assurance"
              },
              {
                name: "CA Yash Pal Sharma",
                role: "Partner",
                image: "/assets/team/member5.jpg",
                imagePosition: "object-top",
                qualification: "ACA, LLB",
                experience: "15+",
                specialization: "Direct Taxation & Compliance"
              },
              {
                name: "CA Rinky Vishwakarma",
                role: "Partner",
                image: "/assets/team/member6.jpg",
                imagePosition: "object-top",
                qualification: "Diploma in Financial Management",
                experience: "15+",
                specialization: "Accounting and Financial Management"
              }
              
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Card with Vibrant Design */}
                <motion.div
                  whileHover={{ y: -15, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative h-full bg-white rounded-3xl shadow-2xl p-8 border-2 border-blue-100 overflow-hidden group-hover:border-blue-300 group-hover:shadow-blue-200/50 transition-all duration-500"
                >
                  {/* Colorful Gradient Glow Effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 transition-opacity duration-700" />
                  
                  {/* Shine Effect - Like Your Buttons */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Decorative Corner Element */}
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    whileInView={{ scale: 1, rotate: 45 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                    className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg opacity-50 group-hover:opacity-80 transition-opacity"
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Profile Image */}
                    <div className="mb-6">
                      <motion.div
                        whileHover={{ scale: 1.12, rotate: 8 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="relative"
                      >
                        {/* <div className={`${member.imageContainerClass || "w-36 h-36"} mx-auto relative`}> */}
                         <div className="w-36 h-36 mx-auto relative">
    
                          {/* <source srcSet={member.image.replace('.jpg', '.webp').replace('.png', '.webp')} type="image/webp" /> */}
                          <NextImage
                            src={member.image}
                            alt={member.name}
                            width={144} 
                            height={144}
                           priority={idx < 2} 
                           quality={75}
                            className={`w-full h-full rounded-full object-cover border-4 border-white shadow-2xl group-hover:border-blue-200 transition-all duration-300 ${member.imagePosition || 'object-center'}`}
                          />
                          {/* Colorful Ring */}
                          <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-blue-400/50 transition-all duration-300" />
                          {/* Gradient Glow Behind Image */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        </div>
                        {/* Experience Badge */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold rounded-full shadow-xl whitespace-nowrap border-2 border-white"
                        >
                          {member.experience} Years Experience
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    {/* Name & Role */}
                    <h3 className="text-2xl font-bold text-center mb-2 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-indigo-600 text-center font-bold uppercase text-sm mb-6 tracking-wider">
                      {member.role}
                    </p>
                    
                    {/* Qualifications */}
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-all"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{member.qualification}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-all"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{member.specialization}</span>
                      </motion.div>
                    </div>
                    
                    {/* ICAI Badge */}
                    <div className="mt-6 pt-4 border-t-2 border-blue-100 group-hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                        <Shield className="w-4 h-4" />
                        <span>ICAI REGISTERED</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Button
                suppressHydrationWarning
                onClick={handleScrollToConsult}
                className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white px-12 py-7 rounded-2xl text-lg font-bold shadow-2xl overflow-hidden group border-2 border-blue-400/30"
              >
                {/* Animated Background Layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
                </div>

                {/* Pulsing Glow */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                      "0 0 40px rgba(99, 102, 241, 0.7)",
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl"
                />

                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Schedule a Consultation</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
     

      
    
  );
}