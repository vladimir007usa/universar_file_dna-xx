import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Database, ShieldCheck, AlertCircle, Info } from 'lucide-react';

const Card = ({ title, icon: Icon, children, accent = "rage-red" }) => (
  <div className={`zigzag-border !border-l-8 !border-l-${accent} bg-void/90 p-6 space-y-4 relative overflow-hidden group`}>
    <div className="flex items-center gap-3 text-rage-red/60 uppercase text-xs font-black tracking-widest font-chaos animate-jitter">
      <Icon size={16} className={`text-${accent}`} />
      <span>{title}</span>
    </div>
    <div className="space-y-2">
      {children}
    </div>
    <div className={`absolute top-0 right-0 w-8 h-8 bg-${accent}/10 animate-flicker`} />
  </div>
);

const Row = ({ label, value, color }) => (
  <div className="flex justify-between items-center text-sm font-mono border-b border-rage-red/10 py-2 last:border-0 hover:bg-rage-red/5 transition-colors group/row">
    <span className="text-rage-red/40 uppercase text-[10px] jitter-text">{label}:</span>
    <span className={cn(
      "font-black overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] uppercase",
      color ? `text-${color}` : "text-static-cyan/80",
      "group-hover/row:text-white"
    )}>{value || 'NULL_PTR'}</span>
  </div>
);

export const MetadataMatrix = ({ data }) => {
  if (!data) return null;

  const { fileName, fileSize, detectedType, metadata, securityAnalysis } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {/* 1. File Identity */}
      <Card title="REQUISITION_IDENTITY" icon={FileCode} accent="static-cyan">
        <Row label="FILENAME" value={fileName} />
        <Row label="SIZE" value={fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : '0 KB'} />
        <Row label="MIME_TYPE" value={detectedType} />
        <Row label="UPLINK_PTR" value={metadata?.resourceName} />
      </Card>

      {/* 2. Extraction DNA */}
      <Card title="HARVESTED_INTEL_DNA" icon={Database} accent="warning-amber">
        <Row label="AUTHOR" value={metadata?.['Author'] || metadata?.['creator'] || metadata?.['dc:creator']} />
        <Row label="STAMP" value={metadata?.['Last-Modified'] || metadata?.['date']} />
        <Row label="SOFTWARE_ENV" value={metadata?.['Application'] || metadata?.['producer']} />
        <Row label="SEGMENTS" value={metadata?.['xmpTPg:NPages']} />
      </Card>

      {/* 3. Security Analysis */}
      <Card 
        title="THREAT_SIGNATURE_SCAN" 
        icon={ShieldCheck} 
        accent={securityAnalysis?.risk_level === 'CRITICAL' ? 'rage-red' : 'static-cyan'}
      >
        <Row label="STATUS" value={securityAnalysis?.risk_level} color={securityAnalysis?.risk_level === 'CRITICAL' ? 'rage-red' : 'static-cyan'} />
        <Row label="LATENCY" value={`${securityAnalysis?.scan_duration_ms} MS`} />
        
        <div className="pt-4">
          <p className="text-[10px] font-black text-rage-red/60 uppercase mb-2 italic">MALICIOUS_FLAGS_DETECTED:</p>
          <div className="flex flex-wrap gap-2">
            {securityAnalysis?.red_flags?.length > 0 ? (
              securityAnalysis.red_flags.map((flag, i) => (
                <span key={i} className="px-3 py-1 bg-rage-red text-white text-[10px] uppercase font-black animate-jitter">
                  {flag.substring(0, 20)}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-static-cyan/40 uppercase font-mono">CLEAN_UPLINK_VERIFIED</span>
            )}
          </div>
        </div>
      </Card>

      {/* 4. Binary Snapshot */}
      <div className="md:col-span-2 lg:col-span-3">
         <Card title="DATA_DUMP_STREAM" icon={Info} accent="static-cyan">
            <pre className="text-xs font-mono text-static-cyan/60 p-6 bg-void/100 border-2 border-static-cyan/20 h-64 overflow-y-auto whitespace-pre-wrap break-all custom-scrollbar font-chaos italic">
              {data.extractedText || "NO_HUMAN_READABLE_DATA_HARVESTED"}
            </pre>
         </Card>
      </div>
    </motion.div>
  );
};
