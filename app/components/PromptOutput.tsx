"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  result: string;
  loading: boolean;
}

export default function PromptOutput({ result, loading }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {(loading || result) && (
        <motion.div 
          className="w-full mt-6 p-6 bg-gray-800 border border-gray-700 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-teal-400 mb-3">Your Refined Prompt</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-gray-400 italic">AI is crafting your perfect prompt... ✨</p>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap text-gray-200 bg-gray-900 p-4 rounded-lg">{result}</p>
              <motion.button
                onClick={copyToClipboard}
                className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05, backgroundColor: "#a855f7" }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </motion.button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}