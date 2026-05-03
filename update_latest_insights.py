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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full max-w-xl overflow-hidden rounded-2xl group text-left cursor-pointer transition-all duration-300 shadow-xl border border-white/20 bg-white/10 backdrop-blur-md"
    >
      {/* Inner Content */}
      <div className="relative p-5 sm:p-6 flex items-center gap-5 sm:gap-6 h-full w-full overflow-hidden">
        
        {/* Icon Container */}
        <div 
          className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 bg-white/10 group-hover:bg-blue-600 border border-white/20"
        >
          <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 group-hover:bg-white transition-colors duration-300" />
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200 group-hover:text-blue-100 transition-colors duration-300">
              News & Updates
            </p>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight group-hover:text-blue-50 transition-colors duration-300">
            Latest Insights
          </h3>
          <p className="text-sm text-slate-300 font-medium truncate group-hover:text-white transition-colors duration-300">
            Tax guides, GST limits & expert compliance advice
          </p>
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
      
      {/* Subtle Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.button>
  );
}"""

# find function LatestInsightsButton() { ... }
content = re.sub(r'function LatestInsightsButton\(\) \{.*?\n\}\n', new_button + '\n', content, flags=re.DOTALL)

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("Updated LatestInsightsButton to be professional")
