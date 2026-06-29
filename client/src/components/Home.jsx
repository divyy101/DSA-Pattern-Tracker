import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home-bg.png";

function Home({ isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundImage: `url(${homeBg})` }}
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 animate-page-ease-in"
    >
      <div className="max-w-xl w-full bg-[#0f1428]/85 backdrop-blur-[12px] border border-violet-500/25 rounded-2xl p-8 md:p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t-[3px] border-t-violet-500/50">
        <span className="text-5xl block mb-4 animate-gentle-bounce">🧠</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 leading-tight mb-4">
          DSA Pattern Tracker
        </h1>
        <p className="text-[0.95rem] text-slate-400 leading-relaxed mb-8">
          Your personal space to categorize, track, and master coding problems by structural patterns. Save notes, track completion rates, and prepare systematically for technical interviews.
        </p>

        {isLoggedIn ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 font-bold text-[0.9rem] py-3 px-8 rounded-xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.6)]"
          >
            Enter Dashboard 🚀
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-[0.9rem] py-3 px-8 rounded-xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_24px_rgba(139,92,246,0.6)]"
            >
              Sign In 🔑
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-[0.9rem] py-3 px-8 rounded-xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 bg-gradient-to-r from-violet-500/20 to-fuchsia-600/20 hover:from-violet-500/30 hover:to-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-500/40 rounded-xl"
            >
              Register 📝
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
