function About() {

  const features = [
    { icon: "📝", title: "Track Problems", desc: "Log problems with name, pattern, difficulty, status, and notes.", color: "violet" },
    { icon: "📊", title: "Progress Dashboard", desc: "See your solved vs. unsolved stats with a visual progress bar.", color: "blue" },
    { icon: "🔍", title: "Search & Filter", desc: "Quickly find problems by name or filter by DSA pattern.", color: "cyan" },
    { icon: "✏️", title: "Edit & Delete", desc: "Update or remove problems as your understanding evolves.", color: "amber" },
    { icon: "🎯", title: "Pattern-Based", desc: "Organize by 10+ patterns: Arrays, Trees, DP, Graphs, and more.", color: "rose" },
    { icon: "⚡", title: "Real-Time Sync", desc: "All data is stored in MongoDB and synced instantly.", color: "emerald" },
  ];

  const techStack = [
    { name: "React", desc: "Frontend UI" },
    { name: "Node.js", desc: "Backend Runtime" },
    { name: "Express", desc: "API Server" },
    { name: "MongoDB", desc: "Database" },
    { name: "Tailwind", desc: "Styling" },
    { name: "Vite", desc: "Build Tool" },
  ];

  function getFeatureAccent(color) {
    const map = {
      violet: "from-violet-500/10 to-violet-500/5 border-violet-500/10 group-hover:border-violet-500/25 group-hover:shadow-[0_4px_20px_rgba(139,92,246,0.08)]",
      blue: "from-blue-500/10 to-blue-500/5 border-blue-500/10 group-hover:border-blue-500/25 group-hover:shadow-[0_4px_20px_rgba(59,130,246,0.08)]",
      cyan: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/10 group-hover:border-cyan-500/25 group-hover:shadow-[0_4px_20px_rgba(6,182,212,0.08)]",
      amber: "from-amber-500/10 to-amber-500/5 border-amber-500/10 group-hover:border-amber-500/25 group-hover:shadow-[0_4px_20px_rgba(245,158,11,0.08)]",
      rose: "from-rose-500/10 to-rose-500/5 border-rose-500/10 group-hover:border-rose-500/25 group-hover:shadow-[0_4px_20px_rgba(244,63,94,0.08)]",
      emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/10 group-hover:border-emerald-500/25 group-hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)]",
    };
    return map[color] || map.violet;
  }

  return (
    <div className="animate-page-ease-in">
      {/* Hero Section */}
      <div className="relative text-center p-12 md:p-16 mb-8 rounded-3xl bg-[#0c1024]/70 backdrop-blur-2xl border border-white/[0.06] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-radial from-violet-500/20 to-transparent pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-fuchsia-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-bold bg-violet-500/[0.08] text-violet-300 border border-violet-500/15 mb-5 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            About This Project
          </div>
          <h1 className="text-[2rem] md:text-[2.5rem] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-violet-200 mb-3 leading-tight">
            DSA Pattern Tracker
          </h1>
          <p className="text-[0.92rem] text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
            Your personal companion for mastering Data Structures & Algorithms — one pattern at a time.
          </p>
        </div>
      </div>

      {/* What is it section */}
      <div className="bg-[#0c1024]/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-7 py-7 mb-6 hover:border-white/[0.1] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] animate-fade-slide-up shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
        <h2 className="text-[1.1rem] font-bold text-slate-200 mb-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          What is DSA Pattern Tracker?
        </h2>
        <p className="text-[0.86rem] text-slate-400 leading-7 ml-9">
          DSA Pattern Tracker is a full-stack web app designed to help you organize, track, and
          master your DSA problem-solving journey. Whether you're preparing for coding interviews
          or leveling up your competitive programming skills, this tool lets you log problems
          by pattern, difficulty, and status — giving you a clear picture of your progress.
        </p>
      </div>

      {/* Features Grid */}
      <div className="bg-[#0c1024]/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-7 py-7 mb-6 shadow-[0_4px_16px_rgba(0,0,0,0.2)] animate-fade-slide-up" style={{ animationDelay: "100ms" }}>
        <h2 className="text-[1.1rem] font-bold text-slate-200 mb-5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br ${getFeatureAccent(feature.color)} border rounded-2xl p-5 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 cursor-default`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="text-[1.5rem] block mb-2.5 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-rotate-3 drop-shadow-lg">
                {feature.icon}
              </span>
              <h3 className="text-[0.85rem] font-bold text-slate-200 mb-1">{feature.title}</h3>
              <p className="text-[0.78rem] text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-[#0c1024]/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-7 py-7 mb-6 shadow-[0_4px_16px_rgba(0,0,0,0.2)] animate-fade-slide-up" style={{ animationDelay: "200ms" }}>
        <h2 className="text-[1.1rem] font-bold text-slate-200 mb-5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="group text-center py-4 px-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/20 hover:bg-violet-500/[0.04] transition-all duration-300 cursor-default"
            >
              <span className="block text-[0.82rem] font-bold text-slate-200 mb-0.5 group-hover:text-violet-300 transition-colors duration-300">{tech.name}</span>
              <span className="block text-[0.68rem] font-medium text-slate-600">{tech.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Built With Love */}
      <div className="bg-[#0c1024]/60 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-7 py-7 text-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] animate-fade-slide-up" style={{ animationDelay: "300ms" }}>
        <h2 className="text-[1.1rem] font-bold text-slate-200 mb-3 flex items-center gap-2 justify-center">
          <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
          </div>
          Built With Love
        </h2>
        <p className="text-[0.86rem] text-slate-400 leading-7 max-w-lg mx-auto">
          This project was built as a MERN stack practice project to strengthen
          full-stack development skills. Keep grinding — every problem solved
          brings you closer to your goal! 💪
        </p>
      </div>
    </div>
  );
}

export default About;
