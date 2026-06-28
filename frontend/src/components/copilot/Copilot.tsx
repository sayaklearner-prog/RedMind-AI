"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Copilot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 z-50"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/20 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Security Copilot</span>
                  <span className="text-xs text-muted-foreground">AI Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <div className="flex w-[80%] flex-col gap-1 rounded-2xl rounded-tl-sm bg-muted p-3 text-sm">
                Hello! I'm your RedMind AI Security Copilot. I can help explain risks, analyze attack paths, and summarize executive reports. How can I assist you today?
              </div>
            </div>

            <div className="border-t border-border p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about risks, paths, assets..."
                  className="w-full rounded-full border border-input bg-muted/50 px-4 py-2.5 pr-10 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
                <button className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
