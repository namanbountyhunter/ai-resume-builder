'use client';

import { SignInButton, UserButton, Show } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="text-center px-6 max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          AI Resume Builder
        </h1>
        
        <p className="text-xl text-zinc-400 mb-10">
          Build beautiful, ATS-friendly resumes in minutes with the power of AI
        </p>

        {/* Show when user is NOT logged in */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="bg-white hover:bg-zinc-100 transition-all duration-200 text-black px-10 py-4 rounded-2xl text-lg font-semibold">
              Get Started Free
            </button>
          </SignInButton>
        </Show>

        {/* Show when user IS logged in */}
        <Show when="signed-in">
          <a
            href="/dashboard"
            className="bg-white hover:bg-zinc-100 transition-all duration-200 text-black px-10 py-4 rounded-2xl text-lg font-semibold inline-block"
          >
            Go to Dashboard →
          </a>
          <div className="mt-6">
            <UserButton />
          </div>
        </Show>

        <p className="text-xs text-zinc-500 mt-8">No credit card required • Takes 30 seconds</p>
      </div>
    </div>
  );
}