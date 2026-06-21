import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, MapPin, Search, Plane, Clock, ShieldAlert } from 'lucide-react';

export default function TravelTools() {
  const tools = [
    {
      title: "Visa Checker",
      description: "Check visa requirements based on your passport and destination.",
      icon: ShieldAlert,
      color: "text-primary-400",
      bg: "bg-primary-500/10",
    },
    {
      title: "Weather Forecast",
      description: "Get accurate weather forecasts for your travel dates.",
      icon: Cloud,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
    },
    {
      title: "Flight Search",
      description: "Find the best flight deals to your destination.",
      icon: Plane,
      color: "text-success-500",
      bg: "bg-success-500/10",
    },
    {
      title: "Timezone Converter",
      description: "Easily convert timezones for seamless planning.",
      icon: Clock,
      color: "text-warning-500",
      bg: "bg-warning-500/10",
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
            Travel <span className="gradient-text">Tools</span>
          </h1>
          <p className="text-dark-400">Essential tools to help you plan and manage your trip seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-start gap-4 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                <tool.icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{tool.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{tool.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try Tool</span>
                  <Search className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
