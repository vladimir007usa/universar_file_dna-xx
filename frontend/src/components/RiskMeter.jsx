export const RiskMeter = ({ riskLevel = 'UNKNOWN' }) => {
  const levels = {
    'CLEAN': { color: '#00FFFF', percent: 10, label: 'SECURE_UPLINK' },
    'LOW': { color: '#00FFFF', percent: 30, label: 'MINOR_GLITCH' },
    'MEDIUM': { color: '#FFBF00', percent: 50, label: 'WARNING_SPIKE' },
    'HIGH': { color: '#FF0000', percent: 80, label: 'HOSTILE_ACTOR' },
    'CRITICAL': { color: '#FF0000', percent: 100, label: 'SYSTEM_BREACHED' },
    'UNKNOWN': { color: '#333333', percent: 0, label: 'HARVESTING' },
  };

  const current = levels[riskLevel] || levels['UNKNOWN'];
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (current.percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 zigzag-border bg-void/90 h-full relative group overflow-hidden">
      <div className="absolute top-2 left-2 text-[10px] text-rage-red/60 uppercase font-mono tracking-tighter animate-jitter">
        NEURAL_MALWARE_SENSORS
      </div>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 scale-150 blur-[2px] opacity-30 absolute">
          <circle cx="96" cy="96" r="40" fill="transparent" stroke={current.color} strokeWidth="12" strokeDasharray="5, 10" className="animate-spin" />
        </svg>
        
        <svg className="w-full h-full transform -rotate-90">
          <motion.circle
            cx="96"
            cy="96"
            r="40"
            fill="transparent"
            stroke={current.color}
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ 
              strokeDashoffset: offset,
              stroke: current.color
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            strokeLinecap="square"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            key={riskLevel}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
            className="text-6xl font-black tracking-tighter italic glitch-text"
            style={{ color: current.color, textShadow: `0 0 30px ${current.color}` }}
            data-text={`${current.percent}%`}
          >
            {current.percent}%
          </motion.span>
          <span className="text-[10px] font-mono tracking-widest opacity-60 uppercase text-static-cyan italic font-chaos">
            CORE_VULNERABILITY
          </span>
        </div>
      </div>

      <motion.div 
        animate={riskLevel === 'CRITICAL' ? {
          x: [-10, 10, -10, 10, 0],
          scale: [1, 1.3, 0.8, 1],
          transition: { repeat: Infinity, duration: 0.1 }
        } : {}}
        className="mt-8 px-10 py-4 border-4 rounded-none text-2xl font-black italic uppercase glitch-text glitch-active font-chaos"
        style={{ backgroundColor: `${current.color}33`, borderColor: current.color, color: current.color }}
        data-text={current.label}
      >
        {current.label}
      </motion.div>
    </div>
  );
};
