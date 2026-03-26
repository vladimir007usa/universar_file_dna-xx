import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, Skull, Zap, Lock, Unlock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export const TerminalDropzone = ({ onFileSelect, isScanning }) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isScanning,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative min-h-[400px] zigzag-border transition-all duration-100 cursor-crosshair overflow-hidden group",
        isDragActive ? "border-static-cyan bg-static-cyan/10 scale-[1.05] rotate-1" : "border-rage-red/30 bg-void",
        (isHovered || isDragActive) && "melting-filter"
      )}
    >
      <input {...getInputProps()} />
      
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b2/TV_Static.gif')] mix-blend-overlay pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-10 p-12 text-center">
        <div className="relative">
          <motion.div
            animate={(isHovered || isDragActive) ? {
              skewX: [0, -30, 30, -15, 0],
              x: [0, -15, 15, 0],
              filter: ["none", "hue-rotate(180deg)", "none"],
              scale: [1, 1.3, 0.8, 1.1, 1]
            } : {}}
            transition={{ repeat: Infinity, duration: 0.1 }}
          >
            <Skull 
              size={120} 
              className={cn(
                "transition-colors duration-100 animate-pulse",
                isDragActive ? "text-static-cyan" : "text-rage-red/20 group-hover:text-rage-red"
              )} 
            />
          </motion.div>
          {(isDragActive || isHovered) && (
             <Zap className="absolute -top-10 -right-10 text-static-cyan animate-flicker" size={64} />
          )}
          <Lock className="absolute -bottom-4 -left-10 text-rage-red/40 animate-spin" size={48} />
        </div>

        <div className="space-y-4">
          <p className={cn(
            "text-6xl font-black tracking-tighter uppercase glitch-text font-chaos italic",
            (isHovered || isDragActive) && "glitch-active"
          )}
          data-text={isDragActive ? "FEED_THE_MACHINE" : "INJECT_MALICIOUS_CARGO"}
          >
            {isDragActive ? "FEED_THE_MACHINE" : "INJECT_MALICIOUS_CARGO"}
          </p>
          <div className="flex justify-center gap-4">
            <span className="text-sm bg-rage-red text-white px-4 py-1 font-black animate-jitter">VULNERABILITY: DETECTED</span>
            <span className="text-sm bg-static-cyan text-void px-4 py-1 font-black animate-jitter">UPLINK: ACTIVE</span>
          </div>
          <p className="text-base text-rage-red/60 font-mono italic animate-pulse font-chaos">
            SYSTEM_ACCEPTS: .EXE, .PDF, .JS, .PY, .BIN :: ENCRYPTION_BYPASS_READY
          </p>
        </div>
      </div>

      {/* Interactive scanning lines */}
      <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-transparent via-static-cyan to-transparent animate-scanline" />
        <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-rage-red to-transparent animate-scanline" style={{ animationDirection: 'reverse' }} />
      </div>
    </div>
  );
};
