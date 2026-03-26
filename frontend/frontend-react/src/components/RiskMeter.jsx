import React from 'react';
import { motion } from 'framer-motion';

export const RiskMeter = ({ riskLevel = 'UNKNOWN' }) => {
  const levels = {
    'CLEAN': { color: '#00ff41', percent: 10, label: 'SECURE' },
    'LOW': { color: '#00ccff', percent: 30, label: 'LOW RISK' },
    'MEDIUM': { color: '#ffff00', percent: 50, label: 'CAUTION' },
    'HIGH': { color: '#ff9100', percent: 80, label: 'WARNING' },
    'CRITICAL': { color: '#ff3131', percent: 100, label: 'BREACH' },
    'UNKNOWN': { color: '#666666', percent: 0, label: 'SCANNING' },
  };

  const current = levels[riskLevel] || levels['UNKNOWN'];
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (current.percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 cyber-border bg-void/60 h-full relative group">
      <div className="absolute top-2 left-2 text-[10px] text-ghost-green/40 uppercase font-mono tracking-tighter">
        RISK_VORTEX_SENSORS
      </div>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="96"
            cy="96"
            r="40"
            fill="transparent"
            stroke="rgba(0, 255, 65, 0.05)"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="40"
            fill="transparent"
            stroke={current.color}
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ 
              strokeDashoffset: offset,
              stroke: current.color
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            key={riskLevel}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black tracking-tighter italic"
            style={{ color: current.color, textShadow: `0 0 15px ${current.color}44` }}
          >
            {current.percent}%
          </motion.span>
          <span className="text-[10px] font-mono tracking-widest opacity-60 uppercase">
            THREAT_LEVEL
          </span>
        </div>
      </div>

      <motion.div 
        animate={riskLevel === 'CRITICAL' ? {
          x: [-2, 2, -2, 2, 0],
          transition: { repeat: Infinity, duration: 0.1 }
        } : {}}
        className="mt-4 px-6 py-1 bg-opacity-10 border border-opacity-30 rounded-sm text-xs font-bold tracking-widest uppercase"
        style={{ backgroundColor: `${current.color}22`, borderColor: current.color, color: current.color }}
      >
        {current.label}
      </motion.div>

      {/* Decorative pulse */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 animate-scanline" style={{ backgroundColor: current.color }} />
      </div>
    </div>
  );
};
