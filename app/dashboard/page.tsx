'use client';

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">AI Resume Builder</h1>
        </div>
        
        <UserButton />
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 border-r border-zinc-800 h-[calc(100vh-73px)] p-6 bg-zinc-950">
          <div className="space-y-8">
            <div>
              <h2 className="text-zinc-500 text-sm font-medium mb-3">MENU</h2>
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-xl text-white">
                  🏠 Dashboard
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer">
                  📄 My Resumes
                </div>

                <div 
                  onClick={() => router.push('/resume-builder')}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 rounded-xl text-white hover:text-white transition cursor-pointer font-medium"
                >
                  ✨ Create New Resume
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
            <p className="text-zinc-400 text-lg">Let's build your next great resume</p>

            <div className="mt-12">
              <button 
                onClick={() => router.push('/resume-builder')}
                className="bg-white text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-200 transition flex items-center gap-3"
              >
                ✨ Create New Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}