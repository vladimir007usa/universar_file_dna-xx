import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Database, ShieldCheck, AlertCircle, Info } from 'lucide-react';

const Card = ({ title, icon: Icon, children, accent = "ghost-green" }) => (
  <div className={`cyber-border !border-l-4 !border-l-${accent} bg-void/40 p-4 space-y-3 relative overflow-hidden group`}>
    <div className="flex items-center gap-2 text-ghost-green/60 uppercase text-[10px] font-mono tracking-widest">
      <Icon size={12} className={`text-${accent}`} />
      <span>{title}</span>
    </div>
    <div className="space-y-1">
      {children}
    </div>
    {/* Decorative corner */}
    <div className={`absolute top-0 right-0 w-0 h-0 border-t-[8px] border-l-[8px] border-t-${accent}/20 border-l-transparent`} />
  </div>
);

const Row = ({ label, value, color }) => (
  <div className="flex justify-between items-center text-xs font-mono border-b border-ghost-green/5 py-1 last:border-0 hover:bg-ghost-green/5 transition-colors">
    <span className="text-ghost-green/40 uppercase text-[9px]">{label}:</span>
    <span className={color ? `text-${color}` : "text-ghost-green/80 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]"}>{value || 'N/A'}</span>
  </div>
);

export const MetadataMatrix = ({ data }) => {
  if (!data) return null;

  const { fileName, fileSize, detectedType, metadata, securityAnalysis } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {/* 1. File Identity */}
      <Card title="REQUISITION_IDENTITY" icon={FileCode} accent="ghost-green">
        <Row label="FILENAME" value={fileName} />
        <Row label="SIZE" value={fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : '0 KB'} />
        <Row label="MIME_DETECTION" value={detectedType} />
        <Row label="RESOURCE_NAME" value={metadata?.resourceName} />
      </Card>

      {/* 2. Extraction DNA */}
      <Card title="METADATA_DNA" icon={Database} accent="warning-amber">
        <Row label="AUTHOR" value={metadata?.['Author'] || metadata?.['creator'] || metadata?.['dc:creator']} />
        <Row label="MODIFIED" value={metadata?.['Last-Modified'] || metadata?.['date'] || metadata?.['dcterms:modified']} />
        <Row label="SOFTWARE" value={metadata?.['Application'] || metadata?.['producer'] || metadata?.['xmp:CreatorTool']} />
        <Row label="PAGES" value={metadata?.['xmpTPg:NPages']} />
      </Card>

      {/* 3. Security Analysis */}
      <Card 
        title="SECURITY_SCAN_REPORT" 
        icon={ShieldCheck} 
        accent={securityAnalysis?.risk_level === 'CRITICAL' ? 'risk-critical' : 'ghost-green'}
      >
        <Row label="GLITCH_SCAN" value={securityAnalysis?.risk_level} color={securityAnalysis?.risk_level === 'CRITICAL' ? 'risk-critical' : 'ghost-green'} />
        <Row label="DURATION" value={`${securityAnalysis?.scan_duration_ms} MS`} />
        
        <div className="pt-2 italic">
          <p className="text-[9px] font-mono text-ghost-green/30 uppercase mb-1">Detected Flags:</p>
          <div className="flex flex-wrap gap-1">
            {securityAnalysis?.red_flags?.length > 0 ? (
              securityAnalysis.red_flags.map((flag, i) => (
                <span key={i} className="px-2 py-0.5 bg-risk-critical/10 border border-risk-critical/30 text-[8px] text-risk-critical uppercase font-bold">
                  {flag.substring(0, 15)}
                </span>
              ))
            ) : (
              <span className="text-[8px] text-ghost-green/40 uppercase">NO THREATS DETECTED</span>
            )}
          </div>
        </div>
      </Card>

      {/* 4. Binary Snapshot (Optional text preview) */}
      <div className="md:col-span-2 lg:col-span-3">
         <Card title="EXTRACTED_PAYLOAD_PREVIEW" icon={Info}>
            <pre className="text-[10px] font-mono text-ghost-green/40 p-2 bg-black/40 h-40 overflow-y-auto whitespace-pre-wrap break-all custom-scrollbar">
              {data.extractedText || "NO EXTRACTED DATA AVAILABLE FOR THIS TYPE"}
            </pre>
         </Card>
      </div>
    </motion.div>
  );
};
