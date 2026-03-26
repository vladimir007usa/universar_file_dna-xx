import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Terminal as TerminalIcon, Cpu, Lock, Unlock } from 'lucide-react';
import { Header } from './components/Header';
import { TerminalDropzone } from './components/TerminalDropzone';
import { RiskMeter } from './components/RiskMeter';
import { MetadataMatrix } from './components/MetadataMatrix';

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
          <span className="text-xs tracking-tighter animate-pulse">DECRYPTING_UI_CORE</span>
          <span className="text-xl font-black italic">{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-1 bg-ghost-green/10 w-full relative">
          <motion.div 
            className="h-full bg-ghost-green shadow-[0_0_10px_#00ff41]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="flex flex-col text-[8px] text-ghost-green/40 gap-1 uppercase">
          <span>&gt; BOOTING_VIRTUAL_DOM... [OK]</span>
          <span>&gt; LOADING_FRAMER_MOTION... [OK]</span>
          <span>&gt; INJECTING_CYBER_OVERLAY... [OK]</span>
          <span>&gt; CONNECTING_API_SOCKET... [OK]</span>
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

  const handleFileSelect = async (file) => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // API call to the unified backend
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP_ERROR_CODE_${response.status}`);
      
      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'CONNECTION_INTERRUPTED');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-void selection:bg-warning-amber selection:text-void relative">
      <div className="crt-overlay" />
      <div className="scanline" />
      
      <AnimatePresence>
        {!isLoaded && <DecryptingLoader onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

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
                    className="cyber-border bg-void/60 p-12 flex flex-col items-center justify-center gap-6"
                  >
                    <div className="relative">
                       <Cpu className="text-ghost-green animate-spin" size={48} />
                       <div className="absolute inset-0 bg-ghost-green/20 blur-xl animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                       <h3 className="text-xl font-bold tracking-widest uppercase">ANALYZING_DNA_SEQUENCE</h3>
                       <p className="text-xs text-ghost-green/40 font-mono italic">BYPASSING_FILE_ENCRYPTION :: EXTRACTING_METADATA :: SCANNING_MALWARE_VECTORS</p>
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
                        <span>System Standby :: Waiting for Payload</span>
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
                       <h3 className="text-xl font-black text-risk-critical uppercase tracking-tighter italic">ORBITAL_SCANNER_FAILURE</h3>
                       <p className="text-xs text-risk-critical/60 font-mono mt-2 uppercase">{error}</p>
                     </div>
                     <button 
                        onClick={() => setError(null)}
                        className="px-6 py-1 border border-risk-critical text-risk-critical text-[10px] font-bold tracking-widest uppercase hover:bg-risk-critical hover:text-void transition-all"
                     >
                       RESET_CORE
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
                  <span className="text-[10px] font-mono text-ghost-green/40 uppercase tracking-[0.3em]">Analysis Result Matrices</span>
                  <div className="h-[2px] flex-1 bg-ghost-green/10" />
                </div>
                <MetadataMatrix data={scanResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-50" />
      </div>
    </div>
  );
}

export default App;
