import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';

const Ticker = () => {
  const [logs, setLogs] = useState([
    "INTERCEPTING PACKET 0x4F2... [OK]",
    "ANALYZING DNA SEQUENCE... [WAITING]",
    "CONNECTION SECURE :: ENCRYPTION AES-256",
    "BYPASSING FIREWALL... [SUCCESS]",
    "SCANNING FOR INJECTION VECTORS...",
    "PII LEAK DETECTED IN SESSION_009",
    "SYSTEM LOG :: TRACE ROUTE COMPLETED",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev];
        const first = next.shift();
        next.push(first);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-hidden whitespace-nowrap px-4 border-l border-r border-ghost-green/20 relative group">
      <div className="animate-marquee inline-block text-xs uppercase tracking-widest text-ghost-green/60">
        {logs.map((log, i) => (
          <span key={i} className="mx-8 hover:text-ghost-green transition-colors cursor-default">
            {log}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 flex items-center px-6 cyber-border border-t-0 border-l-0 border-r-0 bg-void/90 backdrop-blur-md z-50">
      <div className="flex items-center gap-3 mr-8">
        <Activity className="text-warning-amber animate-pulse" size={24} />
        <div>
          <h1 className="text-sm font-bold tracking-tighter uppercase glitch-text" data-text="DNA BREACH EXPLORER">
            DNA BREACH EXPLORER
          </h1>
          <p className="text-[10px] text-ghost-green/40 font-mono tracking-widest">v1.2.0.FINAL</p>
        </div>
      </div>

      <Ticker />

      <div className="flex items-center gap-6 ml-8">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-warning-amber">
            <Clock size={14} />
            <span className="text-sm font-mono tracking-tighter">
              {time.toISOString().split('T')[1].split('.')[0]} UTC
            </span>
          </div>
          <span className="text-[10px] text-ghost-green/30 font-mono">STATION_IAD_01</span>
        </div>
      </div>
    </header>
  );
};
