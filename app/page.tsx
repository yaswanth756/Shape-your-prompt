"use client";

import { useState } from "react";
import PromptInput from "./components/PromptInput";
import PromptOutput from "./components/PromptOutput";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [hasResult, setHasResult] = useState(false);

  const handleShape = async (text: string, strategy?: string) => {
    setLoading(true);
    setResult("");
    setHasResult(false);

    try {
      const res = await fetch("/api/shape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, strategy }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setResult(data.result || "No output received.");
      setHasResult(true);
    } catch (error) {
      console.error(error);
      setResult("Error shaping prompt. Please try again.");
      setHasResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-teal-500/20 rounded-full mix-blend-screen opacity-50"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen opacity-50"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <main className="relative z-10 flex flex-col items-center py-12 px-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Prompt Shaper AI
          </motion.h1>
          <motion.p 
            className="text-base md:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Craft smarter prompts with AI-driven optimization for unparalleled results.
          </motion.p>
          
          {/* Feature Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {['Intelligent Shaping', 'Custom Strategies', 'Fast Processing'].map((feature, index) => (
              <motion.div
                key={feature}
                className="px-4 py-3 bg-gray-800/50 backdrop-blur-md rounded-lg text-sm font-medium text-gray-200 border border-gray-700/50"
                whileHover={{ 
                  scale: 1.03, 
                  backgroundColor: 'rgba(55, 65, 81, 0.8)',
                  borderColor: 'rgba(45, 212, 191, 0.5)' 
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          className="w-full max-w-3xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <PromptInput onShape={handleShape} loading={loading} />
        </motion.div>

        {/* Output Section */}
        <AnimatePresence mode="wait">
          {(loading || hasResult) && (
            <motion.div 
              className="w-full max-w-3xl"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <PromptOutput result={result} loading={loading} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        {!loading && !hasResult && (
          <motion.div 
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {[
              { number: '15K+', label: 'Prompts Processed', icon: '⚙️' },
              { number: '98%', label: 'Accuracy Rate', icon: '🎯' },
              { number: '1.5s', label: 'Avg. Response Time', icon: '⏱️' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center p-5 bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/50"
                whileHover={{ 
                  scale: 1.03, 
                  backgroundColor: 'rgba(55, 65, 81, 0.9)',
                  borderColor: 'rgba(45, 212, 191, 0.5)' 
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-xl mb-2">{stat.icon}</div>
                <div className="text-xl font-semibold text-teal-400">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}