import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

new_button = """function LatestInsightsButton() {
  const [hovered, setHovered] = React.useState(false);
 
  const scrollToBlog = () => {
    const el = document.getElementById("blog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
 
  return (
    <motion.button
      onClick={scrollToBlog}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] p-[1px] group text-left cursor-pointer transition-all duration-500 shadow-2xl mx-auto"
      style={{
        boxShadow: hovered ? "0 20px 40px -10px rgba(6,182,212,0.4)" : "0 10px 30px -10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Animated Gradient Border */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: hovered 
            ? "linear-gradient(135deg, rgba(6,182,212,1), rgba(99,102,241,1), rgba(16,185,129,1))" 
            : "linear-gradient(135deg, rgba(6,182,212,0.5), rgba(99,102,241,0.5))"
        }}
      />
      
      {/* Inner Content */}
      <div className="relative bg-[#0B1120] backdrop-blur-2xl rounded-[31px] p-6 sm:p-8 flex items-center gap-6 sm:gap-8 h-full w-full overflow-hidden">
        {/* Glow behind icon */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 blur-[40px] rounded-full pointer-events-none transition-all duration-500" />
        
        {/* Icon Container */}
        <div 
          className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-500"
          style={{
            background: hovered ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0.08)",
            border: hovered ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(6,182,212,0.2)",
          }}
        >
          <TrendingUp className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-500 ${hovered ? "text-cyan-300" : "text-cyan-400"}`} />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-cyan-400/90">
              From our Senior CAs
            </p>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
            Explore Latest Insights
          </h3>
          <p className="text-sm sm:text-base text-slate-400 font-medium truncate">
            Tax guides, GST limits & expert compliance advice
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500">
          <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-cyan-300 group-hover:translate-x-1.5 transition-all duration-500" />
        </div>
      </div>
    </motion.button>
  );
}"""

# find function LatestInsightsButton() { ... }
content = re.sub(r'function LatestInsightsButton\(\) \{.*?\n\}\n', new_button + '\n', content, flags=re.DOTALL)

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("Updated LatestInsightsButton")
