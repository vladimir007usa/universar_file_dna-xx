import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Terminal as TerminalIcon, Cpu, Lock, Unlock } from 'lucide-react';
import { Header } from './components/Header';
import { TerminalDropzone } from './components/TerminalDropzone';
import { RiskMeter } from './components/RiskMeter';
import { MetadataMatrix } from './components/MetadataMatrix';

const MatrixRain = () => {
  return (
    <div className="matrix-bg">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="absolute inline-block whitespace-pre opacity-20 text-[8px] animate-scanline" 
             style={{ left: `${i * 7}%`, animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 5}s` }}>
          {"X0Y1Z".repeat(20)}
        </div>
      ))}
    </div>
  );
};

const BreachModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-risk-critical/20 backdrop-blur-xl flex flex-col items-center justify-center p-12 border-[20px] border-risk-critical animate-flicker"
      >
        <ShieldAlert size={120} className="text-risk-critical animate-bounce" />
        <h2 className="text-6xl font-black text-risk-critical tracking-tighter italic mt-8 glitch-text glitch-active" data-text="SYSTEM COMPROMISED">
          SYSTEM COMPROMISED
        </h2>
        <p className="text-xl font-mono text-risk-critical/80 mt-4 uppercase">Direct Breach Detected :: IP_LOGGED :: ENCRYPTION_FAILED</p>
        <button 
          onClick={onClose}
          className="mt-12 px-12 py-4 bg-risk-critical text-void font-black text-xl hover:scale-110 transition-transform uppercase tracking-widest"
        >
          ACKNOWLEDGE_THREAT
        </button>
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
          setTimeout(onComplete, 500);
          return 100;
        }
        return v + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-center font-mono">
      <div className="w-64 space-y-4">
        <div className="flex justify-between items-end text-ghost-green">
          <span className="text-xs tracking-tighter animate-pulse">INITIATING_HOSTILE_TAKEOVER</span>
          <span className="text-xl font-black italic">{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-1 bg-ghost-green/10 w-full relative">
          <motion.div 
            className="h-full bg-ghost-green shadow-[0_0_10px_#00ff41]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="flex flex-col text-[8px] text-ghost-green/40 gap-1 uppercase">
          <span>&gt; UPLOADING_VIRUS... [OK]</span>
          <span>&gt; DESTROYING_FIREWALL... [SUCCESS]</span>
          <span>&gt; EXFILTRATING_LOCAL_STORAGE... [OK]</span>
          <span>&gt; MASTER_KEY_OBTAINED... [100%]</span>
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

  const handleFileSelect = async (file) => {
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

      if (!response.ok) throw new Error(`CRITICAL_VORTEX_FAILURE_${response.status}`);
      
      const data = await response.json();
      setScanResult(data);
      
      if (data?.securityAnalysis?.risk_level === 'CRITICAL') {
        setTimeout(() => setShowBreach(true), 1000);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'LINK_SEVERED_BY_FIREWALL');
    } finally {
      setIsScanning(false);
    }
  };

  const isCritical = scanResult?.securityAnalysis?.risk_level === 'CRITICAL';

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-warning-amber selection:text-void relative ${isCritical ? 'red-alert-bg' : 'bg-void'}`}>
      <MatrixRain />
      <div className="crt-overlay" />
      <div className="scanline" />
      
      <AnimatePresence>
        {!isLoaded && <DecryptingLoader onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      <BreachModal isOpen={showBreach} onClose={() => setShowBreach(false)} />

      <div className="relative z-10">
        <Header />
        
        <main className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Upload & Status */}
            <div className="lg:col-span-2 space-y-6">
              <TerminalDropzone onFileSelect={handleFileSelect} isScanning={isScanning} />
              
              <AnimatePresence mode="wait">
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="cyber-border !border-risk-critical bg-risk-critical/5 p-12 flex flex-col items-center justify-center gap-6"
                  >
                    <div className="relative">
                       <Cpu className="text-risk-critical animate-spin" size={48} />
                       <div className="absolute inset-0 bg-risk-critical/40 blur-2xl animate-pulse" />
                    </div>
                    <div className="text-center space-y-4">
                       <h3 className="text-2xl font-black tracking-tighter uppercase text-risk-critical animate-pulse">EXFILTRATING_DATA</h3>
                       <div className="w-64 h-2 bg-risk-critical/10 relative">
                          <motion.div 
                            className="h-full bg-risk-critical"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, repeat: Infinity }}
                          />
                       </div>
                       <p className="text-[10px] text-risk-critical/40 font-mono italic">CLONING_DRIVE_C :: REDIRECTING_PACKETS_TO_STATION_UNKNOWN</p>
                    </div>
                  </motion.div>
                )}

                {!isScanning && !scanResult && !error && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="cyber-border bg-void/60 p-8 flex items-center justify-center"
                   >
                     <div className="flex items-center gap-4 text-ghost-green/20 uppercase font-mono tracking-widest">
                        <Lock size={20} />
                        <span>System Armed :: Ready for Breach</span>
                     </div>
                   </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="cyber-border !border-risk-critical bg-risk-critical/5 p-8 flex flex-col items-center gap-4 text-center"
                  >
                     <ShieldAlert size={48} className="text-risk-critical" />
                     <div>
                       <h3 className="text-xl font-black text-risk-critical uppercase tracking-tighter italic">CONNECTION_TERMINATED</h3>
                       <p className="text-xs text-risk-critical/60 font-mono mt-2 uppercase">{error}</p>
                     </div>
                     <button 
                        onClick={() => setError(null)}
                        className="px-6 py-1 border border-risk-critical text-risk-critical text-[10px] font-bold tracking-widest uppercase hover:bg-risk-critical hover:text-void transition-all"
                     >
                       RE-ESTABLISH_CONNECTION
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Col: Risk Visualization */}
            <div className="lg:col-span-1">
              <RiskMeter riskLevel={scanResult?.securityAnalysis?.risk_level} />
            </div>
          </div>

          <AnimatePresence>
            {scanResult && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[2px] flex-1 bg-ghost-green/10" />
                  <span className="text-[10px] font-mono text-ghost-green/40 uppercase tracking-[0.3em]">Data Harvest Results</span>
                  <div className="h-[2px] flex-1 bg-ghost-green/10" />
                </div>
                <MetadataMatrix data={scanResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-50" />
      </div>
    </div>
  );
}

export default App;
