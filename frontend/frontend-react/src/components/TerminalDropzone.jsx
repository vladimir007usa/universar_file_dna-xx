import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Terminal, ShieldAlert } from 'lucide-react';
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
    multiple: false,
    disabled: isScanning
  });

  return (
    <div
      {...getRootProps()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full h-80 cyber-border flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group overflow-hidden",
        isDragActive ? "bg-ghost-green/5 border-ghost-green scale-[1.01]" : "bg-void/40 hover:bg-ghost-green/5",
        isScanning && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />

      <AnimatePresence>
        {(isHovered || isDragActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
             <div className="absolute inset-x-0 top-0 h-[2px] bg-ghost-green animate-scanline opacity-20" />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center">
        <div className="relative">
          <motion.div
            animate={isHovered ? {
              skewX: [0, -2, 2, -1, 0],
              x: [0, -1, 1, 0],
            } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
          >
            <Terminal 
              size={64} 
              className={cn(
                "transition-colors duration-300",
                isDragActive ? "text-ghost-green" : "text-ghost-green/20 group-hover:text-ghost-green"
              )} 
            />
          </motion.div>
          {isDragActive && (
             <ShieldAlert className="absolute -top-2 -right-2 text-warning-amber animate-bounce" size={24} />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xl font-bold tracking-widest uppercase">
            {isDragActive ? "RELEASE PAYLOAD FOR ANALYSIS" : "DRAG & DROP SECURED PAYLOAD"}
          </p>
          <p className="text-xs text-ghost-green/40 font-mono italic">
            SUPPORTED: .EXE, .PDF, .DOCX, .JS, .PY, .BIN, .HTML
          </p>
        </div>

        {!isScanning && (
          <button className="mt-4 px-8 py-2 border border-ghost-green/30 hover:border-ghost-green hover:bg-ghost-green hover:text-void transition-all duration-300 font-bold uppercase tracking-widest text-xs relative overflow-hidden group/btn">
            <span className="relative z-10">INITIALIZE BREACH</span>
            <div className="absolute inset-0 w-0 group-hover/btn:w-full transition-all duration-500 bg-ghost-green z-0" />
          </button>
        )}
      </div>

      <div className="absolute bottom-2 right-4 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-ghost-green/20" />
        <div className="w-2 h-2 rounded-full bg-warning-amber/20 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-ghost-green/20" />
      </div>
    </div>
  );
};
