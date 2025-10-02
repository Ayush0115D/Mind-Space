import React, { useState, useEffect } from "react";
import { Brain } from "lucide-react";

const AIInsightsCTA = () => {
  const [view, setView] = useState("default"); // "default" | "redirect" | "learnMore"
  const [progress, setProgress] = useState(0);

  // 🔹 Timer logic only for redirect flow
  useEffect(() => {
    if (view === "redirect") {
      let counter = 0;
      const interval = setInterval(() => {
        counter += 1;
        setProgress((counter / 15) * 100);
        if (counter === 15) {
          clearInterval(interval);
          window.location.href = "https://www.perplexity.ai/";
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [view]);

  // =====================================================
  // 🔹 Case 1: Redirect Card (Unlock AI Insights)
  if (view === "redirect") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4 z-50">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/25 to-slate-900/30 backdrop-blur-2xl border border-blue-500/40 rounded-3xl p-12 shadow-[0_0_40px_rgba(0,60,255,0.3)] text-center relative overflow-hidden">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-2xl shadow-lg shadow-blue-500/20">
                <Brain className="w-12 h-12 text-blue-300 animate-spin-slow" />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-blue-200 mb-6">
              Thank You for Your Interest!
            </h2>
            <div className="space-y-6">
              <p className="text-2xl font-semibold text-indigo-300 leading-relaxed">
                Due to billing plans to integrate AI in my project, I am unable
                to provide personalized insights at this time.
              </p>
              <p className="text-lg text-blue-300 opacity-95">
                You’ll be redirected to{" "}
                <span className="font-bold text-indigo-200">Perplexity</span> in{" "}
                <span className="font-bold text-indigo-200">
                  {15 - Math.floor(progress / (100 / 15))}
                </span>{" "}
                seconds...
              </p>
            </div>
            <div className="w-full bg-blue-950/40 rounded-full h-2 mt-10 overflow-hidden border border-blue-700/40">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 h-2 transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // 🔹 Case 2: Learn More Card (no timer, just info)
  if (view === "learnMore") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-extrabold text-blue-200">
              Discover AI Insights
            </h1>
            <p className="text-xl text-blue-300 leading-relaxed max-w-2xl mx-auto">
              Go beyond generic wellness advice. Our AI learns from your habits,{" "}
              preferences, and progress to provide{" "}
              <span className="text-indigo-200 font-semibold">
                insights that grow with you
              </span>
              .
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-3xl p-10 shadow-lg shadow-blue-900/40 space-y-4">
            <h2 className="text-3xl font-bold text-indigo-200">
              📊 Personalized Patterns
            </h2>
            <p className="text-blue-300 leading-relaxed">
              Our AI analyzes your daily routines, energy levels, and lifestyle
              choices to uncover trends you might not notice. This allows you to
              see the bigger picture and make smarter, data-driven decisions.
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-900/20 to-slate-900/20 rounded-3xl p-10 shadow-lg shadow-indigo-900/40 space-y-4">
            <h2 className="text-3xl font-bold text-blue-200">
              🎯 Goal-Driven Insights
            </h2>
            <p className="text-blue-300 leading-relaxed">
              Whether your goal is better sleep, more energy, or balanced
              nutrition, AI Insights adapts to you. It evolves with your journey,
              adjusting recommendations as your goals shift over time.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-3xl p-10 shadow-lg shadow-blue-900/40 space-y-4">
            <h2 className="text-3xl font-bold text-indigo-200">🔒 Privacy First</h2>
            <p className="text-blue-300 leading-relaxed">
              Your data is yours. We prioritize transparency and control,
              ensuring your information is kept secure and used solely for your
              benefit.
            </p>
          </div>

          <div className="text-center mt-16">
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              onClick={() => setView("default")}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // 🔹 Case 3: Default CTA
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-slate-600/20 backdrop-blur-xl border border-blue-400/40 rounded-3xl p-12 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400/30 to-yellow-400/30 rounded-2xl mb-6">
            <Brain className="w-8 h-8 text-amber-300" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">
            Need More Personalized Insights?
          </h3>
          <p className="text-gray-200 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Our advanced AI analyzes your wellness patterns, goals, and
            preferences to deliver hyper-personalized recommendations that evolve
            with your journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 border border-blue-400/20"
              onClick={() => setView("redirect")}
            >
              Unlock AI Insights
            </button>
            <button
              className="bg-gray-900/60 text-blue-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800/80 border-2 border-blue-500/30 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 hover:text-white"
              onClick={() => setView("learnMore")}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsCTA;
