function About() {

  const features = [
    { icon: "📝", title: "Track Problems", desc: "Log problems with name, pattern, difficulty, status, and notes." },
    { icon: "📊", title: "Progress Dashboard", desc: "See your solved vs. unsolved stats with a visual progress bar." },
    { icon: "🔍", title: "Search & Filter", desc: "Quickly find problems by name or filter by DSA pattern." },
    { icon: "✏️", title: "Edit & Delete", desc: "Update or remove problems as your understanding evolves." },
    { icon: "🎯", title: "Pattern-Based", desc: "Organize by 10+ patterns: Arrays, Trees, DP, Graphs, and more." },
    { icon: "⚡", title: "Real-Time Sync", desc: "All data is stored in MongoDB and synced instantly." },
  ];

  return (
    <div className="animate-page-ease-in">
      <div className="relative text-center p-12 mb-6 rounded-2xl bg-[#0f1428]/70 backdrop-blur-[12px] border border-violet-500/20 overflow-hidden hover:border-violet-500/35 hover:shadow-[0_4px_24px_rgba(139,92,246,0.12)] transition-all duration-300">
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-radial from-violet-500/30 to-transparent pointer-events-none animate-pulse-glow" />
        <h1 className="text-[1.75rem] font-extrabold text-slate-200 relative">
          <span className="text-[2.5rem] block mb-2">🚀</span> DSA Pattern Tracker
        </h1>
        <p className="text-[0.95rem] text-slate-400 mt-2 relative">
          Your personal companion for mastering Data Structures & Algorithms — one pattern at a time.
        </p>
      </div>
      <div className="bg-[#0f1428]/70 backdrop-blur-md border border-violet-500/15 rounded-xl px-7 py-6 mb-5 hover:border-violet-500/30 hover:shadow-[0_4px_20px_rgba(139,92,246,0.1)] hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-fade-slide-up">
        <h2 className="text-[1.1rem] font-bold text-slate-200 mb-3 flex items-center gap-1.5">
          <span>💡</span> What is DSA Pattern Tracker?
        </h2>
        <p className="text-[0.88rem] text-slate-400 leading-7">
          DSA Pattern Tracker is a full-stack web app designed to help you organize, track, and
          master your DSA problem-solving journey. Whether you're preparing for coding interviews
          or leveling up your competitive programming skills, this tool lets you log problems
          by pattern, difficulty, and status — giving you a clear picture of your progress.
        </p>
      </div>
      <div className="bg-[#0f1428]/70 backdrop-blur-md border border-violet-500/15 rounded-xl px-7 py-6 mb-5 hover:border-violet-500/30 hover:shadow-[0_4px_20px_rgba(139,92,246,0.1)] hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-fade-slide-up">
        <h2 className="text-[1.1rem] font-bold text-slate-200 mb-3 flex items-center gap-1.5">
          <span>✨</span> Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="group bg-violet-500/6 border border-violet-500/12 rounded-xl p-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-violet-500/35 hover:shadow-[0_4px_16px_rgba(139,92,246,0.1)] hover:bg-violet-500/10">
              <span className="text-2xl block mb-1.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-115">{feature.icon}</span>
              <h3 className="text-[0.88rem] font-bold text-violet-300 mb-1">{feature.title}</h3>
              <p className="text-[0.8rem] text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0f1428]/70 backdrop-blur-md border border-violet-500/15 rounded-xl px-7 py-6 mb-5 hover:border-violet-500/30 hover:shadow-[0_4px_20px_rgba(139,92,246,0.1)] hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] animate-fade-slide-up text-center">
        <h2 className="text-[1.1rem] font-bold text-slate-200 mb-3 flex items-center gap-1.5 justify-center">
          <span>👨‍💻</span> Built With ❤️
        </h2>
        <p className="text-[0.88rem] text-slate-400 leading-7">
          This project was built as a MERN stack practice project to strengthen
          full-stack development skills. Keep grinding — every problem solved
          brings you closer to your goal! 💪
        </p>
      </div>

    </div>
  );
}

export default About;
