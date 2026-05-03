import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Let's find the start of the navbar
start_marker = '{/* ENHANCED NAVBAR WITH COLORFUL BACKGROUND */}'
end_marker = '<section id="home"'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    exit(1)

new_navbar = """{/* ENHANCED GLASSMORPHISM NAVBAR */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              suppressHydrationWarning
              onClick={() => {
                const homeSection = document.getElementById("home");
                if (homeSection) {
                  homeSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
            >
              <div className="relative w-12 h-12 md:w-14 md:h-14 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="https://education21.in/wp-content/uploads/2023/12/CA-India-Logo-1024x762.png"
                  alt="CA India Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="text-base md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                  MRS & Co.
                </div>
                <div className="text-[10px] md:text-xs text-blue-600 font-semibold -mt-0.5 tracking-wide uppercase">
                  Chartered Accountants
                </div>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/about"
                className="px-4 py-2 rounded-full hover:bg-blue-50/80 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-all duration-300"
              >
                About
              </Link>
              {[
                ["Services", "services"],
                ["News", "news"],
                ["Startup Advisory", "startup-advisory"],
                ["Contact", "contact"],
              ].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="px-4 py-2 rounded-full hover:bg-blue-50/80 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-all duration-300"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/careers"
                className="px-4 py-2 rounded-full hover:bg-blue-50/80 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-all duration-300"
              >
                Careers
              </Link>
              
              <div className="h-6 w-px bg-slate-200 mx-2" />
              
              <Button
                asChild
                variant="ghost"
                className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold transition-all duration-300"
              >
                <Link href="/login">Client Login</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 transition-all duration-300 ml-1 px-6"
              >
                <a href="#consult">Book a Call</a>
              </Button>
            </nav>

            {/* Mobile Toggle */}
            <button
              suppressHydrationWarning
              className="lg:hidden p-2.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors duration-300"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((s) => !s)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Sheet */}
        {menuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200/50 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3.5 rounded-2xl hover:bg-blue-50/50 text-sm font-semibold text-slate-700 flex items-center justify-between group"
              >
                <span>About</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>
              {[
                ["Services", "services"],
                ["News", "news"],
                ["Startup Advisory", "startup-advisory"],
                ["Contact", "contact"],
              ].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3.5 rounded-2xl hover:bg-blue-50/50 text-sm font-semibold text-slate-700 flex items-center justify-between group"
                >
                  <span>{label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>
              ))}
              <Link
                href="/careers"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3.5 rounded-2xl hover:bg-blue-50/50 text-sm font-semibold text-slate-700 flex items-center justify-between group"
              >
                <span>Careers</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>
              
              <div className="h-px bg-slate-100 my-4 mx-4" />
              
              <div className="flex flex-col gap-3 px-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-2xl border-2 border-blue-100 text-blue-600 py-6"
                  onClick={() => setMenuOpen(false)}
                >
                  <Link href="/login">Client Login</Link>
                </Button>
                <Button
                  asChild
                  className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 py-6"
                  onClick={() => setMenuOpen(false)}
                >
                  <a href="#consult">Book a Free Consultation</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      """

new_content = content[:start_idx] + new_navbar + content[end_idx:]

with open('app/page.tsx', 'w') as f:
    f.write(new_content)

print("Navbar updated successfully!")
