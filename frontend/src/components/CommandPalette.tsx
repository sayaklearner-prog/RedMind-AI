"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col">
        <Command label="Global Command Palette" className="w-full h-full flex flex-col">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Command.Input 
              placeholder="Search assets, domains, risks, or type a command..." 
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
              autoFocus
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
            
            <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              <Command.Item 
                onSelect={() => { setOpen(false); router.push("/"); }}
                className="px-2 py-2 mt-1 rounded-md text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center"
              >
                Analyze New URL
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); router.push("/history"); }}
                className="px-2 py-2 mt-1 rounded-md text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center"
              >
                View Analysis History
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
