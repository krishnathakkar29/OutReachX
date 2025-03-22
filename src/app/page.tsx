"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  LineChart,
  Mail,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const features = [
    {
      title: "Personalized Mass Emails",
      description:
        "Send personalized emails to thousands of recipients with dynamic content insertion.",
      icon: <Mail className="h-6 w-6 text-indigo-400" />,
    },
    {
      title: "Email History & Analytics",
      description:
        "Track opens, clicks, and responses with detailed analytics dashboards.",
      icon: <BarChart3 className="h-6 w-6 text-indigo-400" />,
    },
    {
      title: "File Attachment Management",
      description:
        "Easily manage and personalize attachments for each recipient.",
      icon: <FileText className="h-6 w-6 text-indigo-400" />,
    },
    {
      title: "Automated Follow-ups",
      description:
        "Set up intelligent follow-up sequences based on recipient actions.",
      icon: <Clock className="h-6 w-6 text-indigo-400" />,
    },
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Automate your outreach and save hours every week.",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      title: "Increase Engagement",
      description:
        "Personalized emails lead to higher open and response rates.",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Easy Tracking",
      description:
        "Know exactly who opened, clicked, and responded to your emails.",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      title: "Professional Management",
      description:
        "Maintain a professional image with well-managed communications.",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Spotlight />
        </div>

        <div className="absolute inset-0 w-full h-full bg-black/50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
          <BackgroundBeams />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full text-sm font-medium bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/50 text-zinc-300"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse" />
            Streamline your email outreach today
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-300 to-white">
              Automate Your Email Outreach
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-zinc-400 mb-10"
          >
            Send personalized mass emails, track engagement, and automate
            follow-ups - all in one powerful platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              className="relative group px-8 py-6 text-lg rounded-xl bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                router.push("/send-mail");
              }}
            >
              <span className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></span>
              <span className="relative flex items-center">
                Start For Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            {/* <Button
              variant="outline"
              className="px-8 py-6 text-lg rounded-xl border-zinc-700 hover:bg-zinc-800 text-white"
            >
              Watch Demo
            </Button> */}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-xl border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 h-full">
                  <div className="relative flex items-center justify-center w-14 h-14 mb-6">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-lg blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center relative z-10 group-hover:bg-zinc-700 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="relative py-32 overflow-hidden bg-zinc-950"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(93,63,211,0.15),transparent_50%)]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-indigo-500 text-sm font-medium mb-2 block"
            >
              WHY CHOOSE OUTREACHX
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400"
            >
              Benefits That Drive Results
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 flex justify-center"
            >
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500/40 via-indigo-500 to-indigo-500/40 rounded-full" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="flex gap-5 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-colors">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-300 to-white"
          >
            Ready to Transform Your Email Outreach?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of professionals who have already improved their
            email campaigns with OutReachX
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              className="relative group px-8 py-6 text-lg rounded-xl bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                router.push("/send-mail");
              }}
            >
              <span className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></span>
              <span className="relative flex items-center">
                Start For Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
