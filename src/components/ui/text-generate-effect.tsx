"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [renderedText, setRenderedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (renderedText.length < words.length) {
        setRenderedText(words.slice(0, renderedText.length + 1));
      } else {
        setIsComplete(true);
      }
    }, 30);

    return () => clearTimeout(timeout);
  }, [renderedText, words]);

  return (
    <motion.div
      className={cn("font-bold", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {renderedText}
      {!isComplete && (
        <span className="ml-1 inline-block h-4 w-1 animate-blink bg-indigo-500"></span>
      )}
    </motion.div>
  );
};
