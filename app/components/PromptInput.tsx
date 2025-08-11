"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onShape: (text: string) => void;
  loading: boolean;
}

export default function PromptInput({ onShape, loading }: Props) {
  const [text, setText] = useState("");

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <textarea
        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-200 placeholder-gray-500 resize-none"
        rows={6}
        placeholder="Enter your raw ideas here... Let's shape them into something amazing!"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <motion.button
        onClick={() => onShape(text)}
        disabled={loading || !text.trim()}
        className="mt-4 w-full bg-teal-500 text-white py-3 rounded-xl disabled:opacity-50 font-medium"
        whileHover={{ scale: 1.02, backgroundColor: "#0d9488" }}
        whileTap={{ scale: 0.98 }}
        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
      >
        {loading ? "Shaping in Progress..." : "Shape My Prompt"}
      </motion.button>
    </motion.div>
  );
}