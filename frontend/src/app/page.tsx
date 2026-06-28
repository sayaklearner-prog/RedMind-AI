"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Search, Network, Globe, Activity, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useStartAnalysis } from "@/hooks/useAnalysis";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().regex(
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    "Please enter a valid domain or URL (e.g., example.com)"
  ),
});

export default function LandingPage() {
  const router = useRouter();
  const { mutate: startAnalysis, isPending } = useStartAnalysis();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    let targetUrl = values.url;
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    startAnalysis(targetUrl, {
      onSuccess: (data) => {
        toast.success("Analysis started successfully!");
        router.push(`/analysis/${data.analysis_id}`);
      },
      onError: () => {
        toast.error("Failed to start analysis. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-destructive/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-20 items-center justify-between px-8 md:px-16">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">RedMind AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Platform</a>
          <a href="#agents" className="text-muted-foreground hover:text-foreground transition-colors">Agents</a>
          <button className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
            <Lock className="w-4 h-4" />
            <span>Enterprise Attack Surface Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Autonomous Cyber <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Intelligence Pipeline
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exposures, map attack paths, and prioritize risks across your entire infrastructure using our 7-agent AI workflow.
          </p>

          <div className="pt-8 w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="relative flex items-center shadow-2xl">
              <Search className="absolute left-6 h-6 w-6 text-muted-foreground" />
              <input
                {...register("url")}
                disabled={isPending}
                placeholder="Enter target domain (e.g. example.com)"
                className="w-full h-16 pl-16 pr-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/60"
              />
              <button 
                type="submit"
                disabled={isPending}
                className="absolute right-2 top-2 bottom-2 px-8 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
                {!isPending && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            {errors.url && (
              <p className="text-destructive text-sm mt-3 text-left pl-6">{errors.url.message}</p>
            )}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4"
        >
          <div className="p-6 rounded-2xl bg-card border border-border/50 flex flex-col items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Continuous Discovery</h3>
            <p className="text-muted-foreground leading-relaxed">Map your entire digital footprint including unmanaged assets, shadow IT, and forgotten infrastructure.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50 flex flex-col items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Attack Path Mapping</h3>
            <p className="text-muted-foreground leading-relaxed">Visualize exactly how attackers could chain vulnerabilities together to breach critical assets.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/50 flex flex-col items-start gap-4">
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Risk Prioritization</h3>
            <p className="text-muted-foreground leading-relaxed">Focus on what matters most with AI-driven risk scoring based on actual exploitability and business impact.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
