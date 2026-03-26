import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Terminal as TerminalIcon, Cpu, Lock, Unlock, Skull, Zap } from 'lucide-react';
import { Header } from './components/Header';
import { TerminalDropzone } from './components/TerminalDropzone';
import { RiskMeter } from './components/RiskMeter';
import { MetadataMatrix } from './components/MetadataMatrix';

const MatrixRain = () => {
  return (
    <div className="matrix-bg">
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute inline-block whitespace-pre text-[10px] animate-scanline font-mono" 
          style={{ 
            left: `${i * 3.3}%`, 
            animationDuration: `${Math.random() * 2 + 1}s`,
            color: i % 2 === 0 ? '#FF0000' : '#00FFFF',
            opacity: Math.random() * 0.5
          }}
        >
          {Array.from({ length: 40 }).map(() => String.fromCharCode(33 + Math.random() * 94)).join('\n')}
        </div>
      ))}
    </div>
  );
};

const ChaosOverlay = ({ active }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
        transition={{ repeat: Infinity, duration: 0.2 }}
        className="fixed inset-0 z-[10000] pointer-events-none bg-white mix-blend-difference"
      />
    )}
  </AnimatePresence>
);

const BreachPopup = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 2 }}
        className="fixed inset-0 z-[11000] bg-void flex flex-col items-center justify-center p-6 border-[50px] border-rage-red animate-flicker"
      >
        <div className="absolute inset-0 bg-static-cyan/10 animate-pulse" />
        <div className="relative z-10 text-center space-y-8">
          <h1 className="text-8xl font-black text-rage-red tracking-tighter italic glitch-text glitch-active uppercase" data-text="SYSTEM_INTEGRITY: COMPROMISED">
            SYSTEM_INTEGRITY: COMPROMISED
          </h1>
          <div className="h-2 bg-static-cyan animate-jitter" />
          <p className="text-3xl font-mono text-static-cyan uppercase font-chaos">PAYLOAD_STATUS: ACTIVE :: EXFILTRATING_MEM_DUMP</p>
          <button 
            onClick={onClose}
            className="px-20 py-8 bg-rage-red text-white text-4xl font-black hover:bg-static-cyan hover:text-void transition-all transform hover:scale-110 active:scale-95 border-8 border-white"
          >
            TERMINATE_SESSION
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const DecryptingLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((v) => {
        if (v >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return v + Math.floor(Math.random() * 25) + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[12000] bg-void flex flex-col items-center justify-center font-mono">
      <div className="w-full h-full absolute inset-0 bg-rage-red/10 animate-flicker pointer-events-none" />
      <div className="w-96 space-y-6 relative z-10">
        <div className="flex justify-between items-end text-static-cyan">
          <span className="text-xl font-black italic glitch-text" data-text="OVERRIDING_KERNEL">OVERRIDING_KERNEL</span>
          <span className="text-5xl font-black italic text-rage-red">{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-4 bg-rage-red/20 w-full relative border-2 border-rage-red">
          <motion.div 
            className="h-full bg-rage-red shadow-[0_0_30px_#FF0000]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="flex flex-col text-xs text-static-cyan/60 gap-1 uppercase font-mono">
          <span className="animate-jitter text-rage-red font-black">&gt; INJECTING_CHAOS_ENGINE... [DONE]</span>
          <span className="animate-jitter">&gt; DISMANTLING_SECURITY_WALL... [SUCCESS]</span>
          <span className="animate-jitter">&gt; HARVESTING_USER_DATA... [PROCEEDING]</span>
          <span className="animate-jitter">&gt; SYSTEM_OWNED... [99%]</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [showBreach, setShowBreach] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => setShowBreach(true), 1000);
    }
  }, [isLoaded]);

  const handleFileSelect = async (file) => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
    
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setShowBreach(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`KERNEL_PANIC_${response.status}`);
      
      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'HEARTBEAT_LOST_IN_TRANSMISSION');
    } finally {
      setIsScanning(false);
    }
  };

  const isCritical = scanResult?.securityAnalysis?.risk_level === 'CRITICAL';

  return (
    <div className={`min-h-screen transition-all duration-75 selection:bg-static-cyan selection:text-void relative font-mono ${isCritical ? 'red-alert-bg' : 'bg-void'}`}>
      <MatrixRain />
      <div className="crt-warp" />
      <div className="scanline" />
      <div className="static-noise" />
      <ChaosOverlay active={isGlitching || isScanning} />
      
      <AnimatePresence>
        {!isLoaded && <DecryptingLoader onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      <BreachPopup isOpen={showBreach} onClose={() => setShowBreach(false)} />

      <div className="relative z-10">
        <Header />
        
        <main className="max-w-7xl mx-auto p-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <TerminalDropzone onFileSelect={handleFileSelect} isScanning={isScanning} />
              
              <AnimatePresence mode="wait">
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    key="scanning"
                    className="zigzag-border p-16 flex flex-col items-center justify-center gap-8 bg-void/90"
                  >
                    <div className="relative">
                       <Cpu className="text-static-cyan animate-spin" size={80} />
                       <div className="absolute inset-0 bg-rage-red/40 blur-3xl animate-pulse" />
                    </div>
                    <div className="text-center space-y-6">
                       <h3 className="text-5xl font-black text-rage-red animate-jitter italic">EXFILTRATING_CORE_DUMP</h3>
                       <div className="flex gap-2">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="w-2 h-8 bg-static-cyan/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                       </div>
                       <p className="text-xs text-static-cyan font-mono font-chaos">
                        {Array.from({ length: 4 }).map(() => Math.random().toString(16).substring(2, 10)).join(' ')}
                       </p>
                    </div>
                  </motion.div>
                )}

                {!isScanning && !scanResult && !error && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="idle"
                    className="zigzag-border bg-void/80 p-12 flex items-center justify-center border-rage-red/10"
                   >
                     <div className="flex items-center gap-6 text-rage-red/20 uppercase font-mono tracking-widest text-xl animate-jitter">
                        <Lock size={32} />
                        <span className="font-chaos">System Arraigned :: Awaiting Exploitation</span>
                     </div>
                   </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key="error"
                    className="zigzag-border border-static-cyan bg-static-cyan/5 p-12 flex flex-col items-center gap-8 text-center"
                  >
                     <ShieldAlert size={80} className="text-static-cyan animate-bounce" />
                     <div>
                       <h3 className="text-3xl font-black text-static-cyan uppercase tracking-tighter italic font-chaos">TRANSMISSION_LOST</h3>
                       <p className="text-base text-static-cyan/60 font-mono mt-4 uppercase glitch-text" data-text={error}>{error}</p>
                     </div>
                     <button 
                        onClick={() => setError(null)}
                        className="px-12 py-3 bg-static-cyan text-void font-black text-xs tracking-widest uppercase hover:scale-110 transition-all border-4 border-white"
                     >
                       RE_ESTABLISH_UPLINK
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <RiskMeter riskLevel={scanResult?.securityAnalysis?.risk_level} />
            </div>
          </div>

          <AnimatePresence>
            {scanResult && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                key="results"
                className="space-y-4"
              >
                <div className="flex items-center gap-8 mb-8 overflow-hidden">
                  <div className="h-4 flex-1 bg-rage-red/10 animate-pulse" />
                  <span className="text-xl font-black font-mono text-rage-red uppercase tracking-[0.5em] jitter-text" data-text="HARVESTED_INTEL">HARVESTED_INTEL</span>
                  <div className="h-4 flex-1 bg-rage-red/10 animate-pulse" />
                </div>
                <MetadataMatrix data={scanResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="melt">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>
      </svg>
    </div>
  );
}

export default App;
