import React, { useState, useEffect, useRef } from 'react';
import { peerService } from '../services/peerService';
import { generateShortId, formatFileSize, cn, formatTimeRemaining, formatSpeed } from '../utils';
import { Button } from './Button';
import { FileIcon } from './FileIcon';
import { Check, Copy, Trash2, Cloud, ArrowUpRight, Globe, Timer, Download, ChevronDown, ChevronUp, Share2, Settings, HardDrive, Lock, AlertTriangle, BarChart3, Activity, Plus, X, Zap, Infinity as InfinityIcon, ShieldCheck, Loader2, QrCode, MessageSquare, Send, Bell, Smartphone, FileText, ArrowRight, Wifi, ShieldAlert, Terminal, Users } from 'lucide-react';
import { DataConnection } from 'peerjs';
import { IncomingData, ProtocolMessage, TextMessage } from '../types';
import QRCode from 'qrcode';

const SILENT_AUDIO_URL = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
// Reduced chunk size to 16KB to prevent buffer overflows and improve reliability
const CHUNK_SIZE = 16 * 1024;

interface SenderProps {
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onSessionChange?: (active: boolean) => void;
}
interface HostedFile { id: string; file: File; uploadTime: number; }
interface FileStats { downloads: number; lastDownloadedAt: number | null; }
interface ActiveTransfer { connectionId: string; peerId: string; fileId: string; progress: number; status: 'starting' | 'transferring' | 'completed' | 'failed'; }
interface LogEntry { id: string; timestamp: number; message: string; type: 'info' | 'success' | 'warning' | 'error'; peerId?: string; }
interface PendingApproval { connectionId: string; peerId: string; timestamp: number; }

type TabMode = 'files' | 'text' | 'logs';

export const Sender: React.FC<SenderProps> = ({ onToast, onSessionChange }) => {
  const [hostedFiles, setHostedFiles] = useState<HostedFile[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [activeTransfers, setActiveTransfers] = useState<ActiveTransfer[]>([]);
  const [fileStats, setFileStats] = useState<Record<string, FileStats>>({});
  const [expired, setExpired] = useState(false);
  const [expiredReason, setExpiredReason] = useState<'time' | 'limit'>('time');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // New Features State
  const [activeTab, setActiveTab] = useState<TabMode>('files');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [textMessages, setTextMessages] = useState<TextMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [latency, setLatency] = useState<number | null>(null);
  const [isNudged, setIsNudged] = useState(false);
  
  // Custom Configuration State
  const [expiryMinutes, setExpiryMinutes] = useState<number>(60);
  const [downloadLimit, setDownloadLimit] = useState<number | ''>(''); // Empty string = Unlimited
  const [isUnlimitedDownloads, setIsUnlimitedDownloads] = useState(true);
  const [password, setPassword] = useState('');
  
  // Advanced Functional Logic State
  const [requireApproval, setRequireApproval] = useState(false);
  const [autoClose, setAutoClose] = useState(false);
  const [maxConnections, setMaxConnections] = useState<number | ''>(''); // Empty = Unlimited
  const [isUnlimitedConnections, setIsUnlimitedConnections] = useState(true);
  const [throttleMs, setThrottleMs] = useState<number>(0);
  
  // Operational State for advanced logic
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [actionLogs, setActionLogs] = useState<LogEntry[]>([]);
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [totalBytesSent, setTotalBytesSent] = useState(0);
  const [expirationTime, setExpirationTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const wakeLockRef = useRef<any>(null);
  const filesRef = useRef<HostedFile[]>([]); 
  const activeTransfersRef = useRef<ActiveTransfer[]>([]);
  const totalDownloadsRef = useRef<number>(0);
  const passwordRef = useRef('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const downloadLimitRef = useRef<number | ''>('');
  const isUnlimitedDownloadsRef = useRef(true);
  
  const requireApprovalRef = useRef(false);
  const autoCloseRef = useRef(false);
  const maxConnectionsRef = useRef<number | ''>('');
  const isUnlimitedConnectionsRef = useRef(true);
  const throttleMsRef = useRef<number>(0);
  const connectedPeersRef = useRef<string[]>([]);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { filesRef.current = hostedFiles; }, [hostedFiles]);
  useEffect(() => { activeTransfersRef.current = activeTransfers; }, [activeTransfers]);
  useEffect(() => { passwordRef.current = password; }, [password]);
  useEffect(() => { downloadLimitRef.current = downloadLimit; }, [downloadLimit]);
  useEffect(() => { isUnlimitedDownloadsRef.current = isUnlimitedDownloads; }, [isUnlimitedDownloads]);
  useEffect(() => { requireApprovalRef.current = requireApproval; }, [requireApproval]);
  useEffect(() => { autoCloseRef.current = autoClose; }, [autoClose]);
  useEffect(() => { maxConnectionsRef.current = maxConnections; }, [maxConnections]);
  useEffect(() => { isUnlimitedConnectionsRef.current = isUnlimitedConnections; }, [isUnlimitedConnections]);
  useEffect(() => { throttleMsRef.current = throttleMs; }, [throttleMs]);
  useEffect(() => { connectedPeersRef.current = connectedPeers; }, [connectedPeers]);
  
  const addLog = (message: string, type: LogEntry['type'] = 'info', peerId?: string) => {
      setActionLogs(prev => [...prev, { id: Math.random().toString(36), timestamp: Date.now(), message, type, peerId }]);
  };
  
  // Auto-scroll logs
  useEffect(() => {
    if (activeTab === 'logs' && logsContainerRef.current) {
        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [actionLogs, activeTab]);
  useEffect(() => {
      setFileStats(prev => {
          const next = { ...prev };
          hostedFiles.forEach(f => { if (!next[f.id]) next[f.id] = { downloads: 0, lastDownloadedAt: null }; });
          return next;
      });
  }, [hostedFiles]);

  // Notify parent when session starts/stops
  useEffect(() => {
    onSessionChange?.(!!shareLink);
  }, [shareLink]);

  useEffect(() => {
    if (!expirationTime) return;
    const tick = () => {
        const now = Date.now();
        const remaining = Math.max(0, expirationTime - now);
        setTimeRemaining(remaining);
        if (remaining <= 0) { handleStopSharing('time'); return; }
        const isTransferring = activeTransfersRef.current.some(t => t.status === 'transferring');
        if (!isTransferring) setCurrentSpeed(0);
    };
    const timer = setInterval(tick, 500);
    // Immediately recalculate when tab becomes visible again
    const onVisible = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [expirationTime]);

  const enableKeepAlive = async () => {
    // iOS Background Fix: Play audio immediately on user interaction
    if (audioRef.current) {
        audioRef.current.volume = 0.01;
        audioRef.current.play().catch((e) => console.log("Audio play failed", e));
    }
    if ('wakeLock' in navigator) { 
        try { wakeLockRef.current = await (navigator as any).wakeLock.request('screen'); } catch (e) {} 
    }
  };

  const updateTransferState = (connId: string, fileId: string, updates: Partial<ActiveTransfer>) => {
      setActiveTransfers(prev => {
          const idx = prev.findIndex(t => t.connectionId === connId && t.fileId === fileId);
          if (idx === -1) return [...prev, { connectionId: connId, peerId: '', fileId, progress: 0, status: 'starting', ...updates } as ActiveTransfer];
          const newArr = [...prev];
          newArr[idx] = { ...newArr[idx], ...updates };
          return newArr;
      });
  };

  // Approve a pending connection
  const approveConnection = (connId: string) => {
      setPendingApprovals(prev => prev.filter(p => p.connectionId !== connId));
      setConnectedPeers(prev => [...prev, connId]);
      const isLocked = !!passwordRef.current;
      peerService.sendTo(connId, {
          type: 'MANIFEST',
          payload: { locked: isLocked, files: isLocked ? undefined : filesRef.current.map(f => ({ id: f.id, name: f.file.name, size: f.file.size, type: f.file.type })) }
      });
      addLog('Connection approved', 'success', connId);
  };

  // Deny a pending connection
  const denyConnection = (connId: string) => {
      setPendingApprovals(prev => prev.filter(p => p.connectionId !== connId));
      peerService.sendTo(connId, { type: 'ERROR', payload: { message: 'Connection denied by host.' } });
      setTimeout(() => peerService.closeConnection(connId), 500);
      addLog('Connection denied', 'warning', connId);
  };

  const transferFile = async (connId: string, peerId: string, fileId: string) => {
      // Check limit before starting
      const currentDownloads = totalDownloadsRef.current;
      const limitConfig = isUnlimitedDownloadsRef.current ? Infinity : Number(downloadLimitRef.current);
      
      if (limitConfig !== Infinity && currentDownloads >= limitConfig) {
          handleStopSharing('limit');
          return;
      }

      if (activeTransfersRef.current.some(t => t.connectionId === connId && t.fileId === fileId && t.status !== 'completed')) return;
      const hostFile = filesRef.current.find(f => f.id === fileId);
      if (!hostFile) return;

      setActiveTransfers(prev => [...prev, { connectionId: connId, peerId, fileId, progress: 0, status: 'transferring' }]);
      addLog(`Started transferring ${hostFile.file.name}`, 'info', connId);
      
      try {
          const file = hostFile.file;
          peerService.sendTo(connId, { type: 'START_FILE', payload: { id: fileId, name: file.name, size: file.size, type: file.type } });
          
          const totalSize = file.size;
          let offset = 0;
          let lastTick = Date.now();
          let bytesSinceLastTick = 0;

          // Optimized Loop with Throttling support
          while (offset < totalSize) {
              await peerService.waitForBuffer(connId);

              const chunk = file.slice(offset, offset + CHUNK_SIZE);
              const buffer = await chunk.arrayBuffer();
              peerService.sendTo(connId, buffer);
              
              offset += buffer.byteLength;
              bytesSinceLastTick += buffer.byteLength;
              
              const now = Date.now();
              if (now - lastTick > 100) {
                   const pct = Math.round((offset / totalSize) * 100);
                   setCurrentSpeed(bytesSinceLastTick / ((now - lastTick) / 1000));
                   updateTransferState(connId, fileId, { progress: pct });
                   lastTick = now; 
                   bytesSinceLastTick = 0;
                   await new Promise(r => setTimeout(r, 0));
              } else if (offset >= totalSize) {
                   updateTransferState(connId, fileId, { progress: 100 });
              }
              
              // Apply bandwidth throttling delay if configured
              if (throttleMsRef.current > 0) {
                  await new Promise(r => setTimeout(r, throttleMsRef.current));
              }
          }
          
          setCurrentSpeed(0);
          await peerService.waitForBuffer(connId);
          peerService.sendTo(connId, { type: 'END_FILE', payload: { fileId } });
          updateTransferState(connId, fileId, { status: 'completed', progress: 100 });
          addLog(`Completed transferring ${file.name}`, 'success', connId);
          
          setTotalBytesSent(prev => prev + totalSize);
          
          const newStats = { ...fileStats, [fileId]: { downloads: (fileStats[fileId]?.downloads || 0) + 1, lastDownloadedAt: Date.now() } };
          setFileStats(newStats);
          
          const newDownloadCount = (totalDownloadsRef.current as number) + 1;
          totalDownloadsRef.current = newDownloadCount;

          // Check download limits
          if (limitConfig !== Infinity && newDownloadCount >= limitConfig) {
              setTimeout(() => handleStopSharing('limit'), 1000);
          }
          
          // Check Auto-Destruct logic
          if (autoCloseRef.current) {
               // Check if all hosted files have been downloaded at least once
               const allDownloaded = filesRef.current.every(f => newStats[f.id]?.downloads > 0);
               if (allDownloaded && filesRef.current.length > 0) {
                   addLog('Auto-destruct triggered: All files downloaded.', 'warning');
                   onToast("Auto-destruct triggered", "info");
                   setTimeout(() => handleStopSharing('user'), 2000);
               }
          }
          
          setTimeout(() => setActiveTransfers(prev => prev.filter(t => !(t.connectionId === connId && t.fileId === fileId))), 3000);
      } catch (e) {
          updateTransferState(connId, fileId, { status: 'failed' });
          setCurrentSpeed(0);
          addLog(`Transfer failed: ${hostFile.file.name}`, 'error', connId);
      }
  };

  useEffect(() => {
    const handleConnection = (conn: DataConnection) => {
        addLog(`New connection request`, 'info', conn.connectionId);
        
        // 1. Max Connections Logic
        if (!isUnlimitedConnectionsRef.current && typeof maxConnectionsRef.current === 'number') {
             if (connectedPeersRef.current.length >= maxConnectionsRef.current) {
                 peerService.sendTo(conn.connectionId, { type: 'ERROR', payload: { message: 'Host connection limit reached.' } });
                 addLog(`Rejected connection (Limit reached)`, 'warning', conn.connectionId);
                 setTimeout(() => peerService.closeConnection(conn.connectionId), 500);
                 return;
             }
        }
        
        // 2. Knock-to-Enter Logic
        if (requireApprovalRef.current) {
            setPendingApprovals(prev => [...prev, { connectionId: conn.connectionId, peerId: conn.peer, timestamp: Date.now() }]);
            addLog(`Connection requires manual approval`, 'warning', conn.connectionId);
            return; // Halt manifest sending until approved
        }
        
        setConnectedPeers(prev => [...prev, conn.connectionId]);
        const isLocked = !!passwordRef.current;
        peerService.sendTo(conn.connectionId, {
            type: 'MANIFEST',
            payload: { locked: isLocked, files: isLocked ? undefined : filesRef.current.map(f => ({ id: f.id, name: f.file.name, size: f.file.size, type: f.file.type })) }
        });
    };
    
    // Listen for disconnections to clean up state
    const handlePeerDisconnect = (peerId: string) => {
         setConnectedPeers(prev => prev.filter(p => !p.includes(peerId)));
         addLog(`Peer disconnected`, 'info', peerId);
    };

    const handleData = (event: IncomingData) => {
        const msg = event.data as ProtocolMessage;
        if (msg.type === 'VERIFY_PASSWORD') {
             addLog(`Attempting password verification`, 'info', event.connectionId);
             if (msg.payload?.password === passwordRef.current) {
                  peerService.sendTo(event.connectionId, { type: 'PASSWORD_CORRECT' });
                  peerService.sendTo(event.connectionId, { type: 'MANIFEST', payload: { locked: false, files: filesRef.current.map(f => ({ id: f.id, name: f.file.name, size: f.file.size, type: f.file.type })) } });
                  addLog(`Password verified`, 'success', event.connectionId);
             } else { 
                  peerService.sendTo(event.connectionId, { type: 'PASSWORD_INCORRECT' }); 
                  addLog(`Incorrect password attempt`, 'error', event.connectionId);
             }
        } else if (msg.type === 'REQUEST_FILE') { 
            if (msg.payload?.fileId) transferFile(event.connectionId, event.peerId, msg.payload.fileId); 
        } else if (msg.type === 'TEXT') {
            setTextMessages(prev => [...prev, { id: Math.random().toString(36), text: msg.payload.text, sender: 'peer', timestamp: Date.now() }]);
            if (activeTab !== 'text') onToast("New text message received", 'info');
        } else if (msg.type === 'PING') {
            peerService.sendTo(event.connectionId, { type: 'PONG', payload: msg.payload });
        } else if (msg.type === 'PONG') {
            const rtt = Date.now() - msg.payload.ts;
            setLatency(rtt);
        } else if (msg.type === 'NUDGE') {
            setIsNudged(true);
            setTimeout(() => setIsNudged(false), 500);
            if ('vibrate' in navigator) navigator.vibrate(200);
            addLog(`Received a nudge`, 'info', event.connectionId);
        }
    };
    
    peerService.on('connection', handleConnection);
    peerService.on('data', handleData);
    
    // We would ideally listen to peerService for disconnects if 'close' event was exposed, 
    // but assuming generic handling through tracking
    
    return () => { peerService.off('connection', handleConnection); peerService.off('data', handleData); };
  }, [activeTab]);

  const startSession = async () => {
    setIsStarting(true);
    enableKeepAlive(); // Start audio immediately
    
    // Artificial delay removed for performance
    const id = generateShortId();
    try {
      await peerService.initialize(`nwshare-${id}`);
      const link = `${window.location.protocol}//${window.location.host}/#${id}`;
      setShareLink(link);
      
      // Generate QR Code
      QRCode.toDataURL(link, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } }, (err, url) => {
          if (!err) setQrCodeUrl(url);
      });

      const now = Date.now(), duration = expiryMinutes * 60 * 1000;
      setExpirationTime(now + duration);
      setTimeRemaining(duration);
    } catch (e) { 
        onToast("Failed to start host", "error"); 
        setIsStarting(false);
    }
  };

  const sendText = () => {
      if (!textInput.trim()) return;
      peerService.broadcast({ type: 'TEXT', payload: { text: textInput } });
      setTextMessages(prev => [...prev, { id: Math.random().toString(36), text: textInput, sender: 'self', timestamp: Date.now() }]);
      setTextInput('');
      addLog('Sent text message', 'info');
  };

  const sendNudge = () => {
      peerService.broadcast({ type: 'NUDGE' });
      onToast("Nudged connected peers!", "success");
      addLog('Broadcasted nudge', 'info');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setHostedFiles(prev => [...prev, ...Array.from(e.target.files!).map((f: File) => ({ id: Math.random().toString(36).substring(2, 9), file: f, uploadTime: Date.now() }))]);
        if (shareLink) addLog(`Added ${e.target.files.length} new files to active session`, 'info');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          setHostedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files).map((f: File) => ({ 
              id: Math.random().toString(36).substring(2, 9), 
              file: f, 
              uploadTime: Date.now() 
          }))]);
          if (shareLink) addLog(`Dropped ${e.dataTransfer.files.length} new files to active session`, 'info');
      }
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const removeFile = (id: string) => {
      const file = hostedFiles.find(f => f.id === id);
      if (file && shareLink) addLog(`Removed file ${file.file.name}`, 'warning');
      setHostedFiles(prev => prev.filter(f => f.id !== id));
  };

  const copyLink = () => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleStopSharing = (reason?: 'time' | 'limit' | 'user') => {
      peerService.destroy();
      if (audioRef.current) { audioRef.current.pause(); }

      if (reason && reason !== 'user') { setExpired(true); setExpiredReason(reason); } 
      else {
          setHostedFiles([]); setShareLink(''); setActiveTransfers([]); setExpirationTime(null);
          setExpired(false); setTotalBytesSent(0); setTimeRemaining(0); setFileStats({}); setPassword('');
          totalDownloadsRef.current = 0;
          setIsStarting(false);
          setQrCodeUrl(null);
          setTextMessages([]);
          setPendingApprovals([]);
          setConnectedPeers([]);
          setActionLogs([]);
          if (window.location.hash) window.history.pushState(null, '', window.location.pathname);
      }
  };

  const getTotalDownloads = () => Object.values(fileStats).reduce((acc: number, curr) => acc + (curr as FileStats).downloads, 0);
  const isNearExpiry = timeRemaining < 5 * 60 * 1000;
  
  const limit = isUnlimitedDownloads ? Infinity : Number(downloadLimit);
  const isNearLimit = limit !== Infinity && getTotalDownloads() >= (limit) * 0.9;
  
  const isCritical = isNearExpiry || isNearLimit;
  const activeCardBorder = isCritical ? 'border-amber-400 dark:border-amber-600 ring-4 ring-amber-500/10' : 'border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800';

  if (expired) {
      return (
          <div className="w-full max-w-lg mx-auto animate-fade-in text-center p-10 bg-white dark:bg-slate-800 rounded-3xl border border-red-100 dark:border-red-900/50 shadow-2xl">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {expiredReason === 'time' ? <Timer size={40} className="text-red-500" /> : <AlertTriangle size={40} className="text-red-500" />}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{expiredReason === 'time' ? 'Link Expired' : 'Download Limit Reached'}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">{expiredReason === 'time' ? 'The session time limit has been reached.' : 'The maximum number of allowed downloads has been reached.'}</p>
              <Button onClick={() => handleStopSharing('user')} className="w-full py-4 text-lg">Start New Session</Button>
          </div>
      );
  }

  // --- DROPZONE VIEW ---
  if (hostedFiles.length === 0) {
    return (
      <div 
        className="w-full max-w-4xl mx-auto animate-fade-in text-center px-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-slate-900 dark:text-white tracking-tight leading-tight">
          Share files <br />
          <span className="relative inline-block mt-2">
            <span className="relative z-10 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-text-shimmer">instantly.</span>
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-500 opacity-60 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none"><path className="animate-draw-line" pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M0 5 Q 50 12 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg max-w-2xl mx-auto">Direct P2P file transfer directly in your browser. No cloud limits. No signup.</p>

        <div className="w-full max-w-xl mx-auto relative z-20">
             <label className="block group cursor-pointer transform-gpu transition-all duration-300 ease-out active:scale-95 mb-6">
                 <input type="file" multiple onChange={handleFileSelect} className="hidden" />
                 <div className={cn(
                     "relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 md:p-14 transition-all duration-300 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none transform-gpu overflow-hidden",
                     isDragging 
                        ? "bg-indigo-50 dark:bg-indigo-900/20 scale-105" 
                        : "group-hover:shadow-2xl group-hover:-translate-y-1"
                 )}>
                      {/* Animated gradient border wrapper */}
                      <div className="absolute inset-0 z-0 p-[3px] rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 bg-[length:200%_auto] animate-border-dance opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className={cn("absolute inset-[3px] rounded-[calc(2.5rem-3px)] bg-white dark:bg-slate-800 z-0 transition-colors", isDragging && "bg-indigo-50 dark:bg-indigo-900/40")}></div>
                      
                      {/* Dashed inner border */}
                      <div className={cn("absolute inset-2 rounded-[2rem] border-2 border-dashed z-10 transition-colors pointer-events-none", isDragging ? "border-indigo-400" : "border-slate-200 dark:border-slate-700 group-hover:border-transparent")}></div>

                      <div className="relative z-20 flex flex-col items-center">
                          <div className={cn(
                              "relative w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ease-out",
                              isDragging ? "bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/50" : "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60"
                          )}>
                              {isDragging && <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-pulse-ring"></div>}
                              <Cloud size={48} strokeWidth={1.5} className={cn(isDragging && "animate-bounce")} />
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{isDragging ? 'Drop to Add' : 'Upload a file'}</h3>
                          <p className="text-slate-400 dark:text-slate-500 mb-8 font-medium">Drag and drop here, or click to browse.</p>
                          <div className="inline-block px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-700/50 text-[11px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">Unlimited Size • Direct P2P</div>
                      </div>
                 </div>
             </label>
             
             <button 
                onClick={() => window.location.hash = 'download'}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow-md active:scale-95"
             >
                <Download size={18} /> Have a receive code? Click here
             </button>
        </div>
      </div>
    );
  }

  // --- STAGING / REVIEW VIEW ---
  if (!shareLink) {
    return (
        <div 
            className="w-full max-w-2xl mx-auto animate-slide-up px-4"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 text-center">Ready to Share</h2>
            
            <div className={cn(
                "bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border overflow-hidden mb-6 transition-all duration-300",
                isDragging ? "border-indigo-500 ring-4 ring-indigo-500/10 scale-[1.02]" : "border-slate-100 dark:border-slate-700"
            )}>
                {isDragging && (
                    <div className="absolute inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-800 flex flex-col items-center animate-bounce">
                            <Cloud size={48} className="text-indigo-500 mb-2" />
                            <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">Drop to Add Files</span>
                        </div>
                    </div>
                )}

                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">{hostedFiles.length}</div>
                         <span className="font-bold text-slate-700 dark:text-slate-200">Files Selected</span>
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{formatFileSize(hostedFiles.reduce((acc, f) => acc + f.file.size, 0))} Total</div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {hostedFiles.map((file, idx) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl group transition-all hover:bg-slate-100 dark:hover:bg-slate-900/60">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                                <FileIcon fileName={file.file.name} fileType={file.file.type} className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{file.file.name}</div>
                                <div className="text-xs text-slate-400">{formatFileSize(file.file.size)}</div>
                            </div>
                            <button 
                                onClick={() => removeFile(file.id)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Remove file"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                    >
                        <Plus size={16} /> Add more files
                    </button>
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
                </div>
            </div>

            {/* Config Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden mb-8 shadow-lg">
                <button 
                    onClick={() => setShowAdvanced(!showAdvanced)} 
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                           <Settings size={20} />
                       </div>
                       <div className="text-left">
                           <h3 className="font-bold text-slate-900 dark:text-white">Session Security</h3>
                           <p className="text-xs text-slate-500">Configure expiration, limits, and password</p>
                       </div>
                   </div>
                   {showAdvanced ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>
                
                <div className={cn("transition-all duration-300 ease-in-out border-t border-slate-100 dark:border-slate-700", showAdvanced ? "max-h-[800px] opacity-100 p-6 pt-2 bg-slate-50/50 dark:bg-slate-900/20" : "max-h-0 opacity-0 p-0 overflow-hidden")}>
                    <div className="space-y-8 mt-4">
                        
                        {/* Expiry Control */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><Timer size={14} /> Link Expiration</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <input 
                                        type="range" 
                                        min="5" 
                                        max="10080" // 7 days in minutes
                                        step="5"
                                        value={expiryMinutes}
                                        onChange={(e) => setExpiryMinutes(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div className="w-28 relative">
                                    <input 
                                        type="number" 
                                        value={expiryMinutes} 
                                        onChange={(e) => setExpiryMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                                        className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center focus:border-indigo-500 outline-none" 
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">min</span>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 mt-2 text-right">
                                {formatTimeRemaining(expiryMinutes * 60 * 1000)} duration
                            </div>
                        </div>

                        {/* Download Limit Control */}
                        <div>
                             <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><Download size={14} /> Download Limit</div>
                                 <label className="flex items-center gap-2 cursor-pointer">
                                     <span className="text-xs font-bold text-slate-500">Unlimited</span>
                                     <input 
                                        type="checkbox" 
                                        checked={isUnlimitedDownloads} 
                                        onChange={(e) => setIsUnlimitedDownloads(e.target.checked)} 
                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                     />
                                 </label>
                             </div>
                             
                             <div className={cn("transition-opacity duration-200", isUnlimitedDownloads ? "opacity-40 pointer-events-none" : "opacity-100")}>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="100" 
                                            step="1"
                                            value={downloadLimit || 1}
                                            onChange={(e) => { setDownloadLimit(parseInt(e.target.value)); setIsUnlimitedDownloads(false); }}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            disabled={isUnlimitedDownloads}
                                        />
                                    </div>
                                    <div className="w-28 relative">
                                        {isUnlimitedDownloads ? (
                                            <div className="w-full py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center text-slate-400 flex items-center justify-center">
                                                <InfinityIcon size={16} />
                                            </div>
                                        ) : (
                                            <input 
                                                type="number" 
                                                value={downloadLimit} 
                                                onChange={(e) => setDownloadLimit(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center focus:border-indigo-500 outline-none" 
                                            />
                                        )}
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Password Control */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400"><Lock size={14} /> Password Protection</div>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="text" placeholder="Optional password protection" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 ring-indigo-500/10 transition-all" />
                            </div>
                        </div>

                        {/* Functional WebRTC Settings */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
                            
                            {/* Require Approval */}
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        <ShieldAlert size={16} className="text-indigo-500" /> Require Knock to Enter
                                    </div>
                                    <p className="text-xs text-slate-500 max-w-[200px]">Manually approve every device trying to connect to your session.</p>
                                </div>
                                <div className="relative inline-flex items-center">
                                    <input type="checkbox" className="sr-only peer" checked={requireApproval} onChange={(e) => setRequireApproval(e.target.checked)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </div>
                            </label>

                            {/* Auto Destruct Session */}
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div className="mr-4">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        <Trash2 size={16} className="text-red-500" /> Auto-Destruct
                                    </div>
                                    <p className="text-xs text-slate-500 max-w-[240px]">Automatically delete room and disconnect peers when all files are downloaded.</p>
                                </div>
                                <div className="relative inline-flex items-center">
                                    <input type="checkbox" className="sr-only peer" checked={autoClose} onChange={(e) => setAutoClose(e.target.checked)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                                </div>
                            </label>

                            {/* Max Connections Limit Control */}
                            <div>
                                 <div className="flex items-center justify-between mb-3">
                                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><Users size={14} /> Max Concurrent Peers</div>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                         <span className="text-xs font-bold text-slate-500">Unlimited</span>
                                         <input 
                                            type="checkbox" 
                                            checked={isUnlimitedConnections} 
                                            onChange={(e) => setIsUnlimitedConnections(e.target.checked)} 
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                         />
                                     </label>
                                 </div>
                                 <div className={cn("transition-opacity duration-200 flex gap-4 items-center", isUnlimitedConnections ? "opacity-40 pointer-events-none" : "opacity-100")}>
                                      <div className="flex-1 relative">
                                          <input 
                                              type="range" min="1" max="10" step="1"
                                              value={maxConnections || 1}
                                              onChange={(e) => { setMaxConnections(parseInt(e.target.value)); setIsUnlimitedConnections(false); }}
                                              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                              disabled={isUnlimitedConnections}
                                          />
                                      </div>
                                      <div className="w-28 relative">
                                          {isUnlimitedConnections ? (
                                              <div className="w-full py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center text-slate-400 flex items-center justify-center"><InfinityIcon size={16} /></div>
                                          ) : (
                                              <input 
                                                  type="number" value={maxConnections} onChange={(e) => setMaxConnections(Math.max(1, parseInt(e.target.value) || 1))}
                                                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center focus:border-indigo-500 outline-none" 
                                              />
                                          )}
                                      </div>
                                 </div>
                            </div>

                            {/* Bandwidth / Thread Throttle */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><Activity size={14} /> Send Throttle Delay (MS)</div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <input 
                                            type="range" min="0" max="100" step="5"
                                            value={throttleMs}
                                            onChange={(e) => setThrottleMs(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </div>
                                    <div className="w-28 relative">
                                        <input 
                                            type="number" value={throttleMs} onChange={(e) => setThrottleMs(Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center focus:border-indigo-500 outline-none" 
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-right">0ms = Max Speed, 50ms = Throttled</p>
                            </div>

                        </div>
                    </div>
                </div>
             </div>

             <div className="flex gap-4">
                 <button onClick={() => setHostedFiles([])} className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                 <Button onClick={startSession} disabled={isStarting} className="flex-1 py-4 text-base shadow-2xl shadow-indigo-500/30">
                     {isStarting ? (
                         <div className="flex items-center gap-2 animate-pulse">
                            <Loader2 size={20} className="animate-spin" /> 
                            <span>Allocating Secure ID...</span>
                         </div>
                     ) : (
                         <span className="flex items-center gap-2"><Zap size={18} className="fill-current" /> Create Secure Link</span>
                     )}
                 </Button>
             </div>
        </div>
    );
  }

  // --- ACTIVE SESSION VIEW ---
  return (
    <>
      <div className={cn("w-full max-w-3xl lg:max-w-6xl mx-auto animate-slide-up pb-32 sm:pb-12 px-4", isNudged && "animate-shake")}>
      {/* iOS Background Audio Hack */}
      <audio 
        ref={audioRef} 
        src={SILENT_AUDIO_URL} 
        loop 
        muted={false} 
        playsInline 
        className="opacity-1 pointer-events-none absolute w-1 h-1 -z-10" 
      />

      {/* QR Code Modal for Mobile */}
      {showQrModal && qrCodeUrl && (
          <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in md:hidden" onClick={() => setShowQrModal(false)}>
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-slide-up" onClick={e => e.stopPropagation()}>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">Scan to Connect</h3>
                  <p className="text-slate-500 text-center mb-6">Point your phone's camera at this code to open the secure link.</p>
                  <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner mb-6 flex justify-center">
                      <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 object-contain" />
                  </div>
                  <Button onClick={() => setShowQrModal(false)} className="w-full py-4 text-lg">Close</Button>
              </div>
          </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative mb-8">
          
          {/* LEFT PANE: Connection & Security Info */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-6 lg:sticky lg:top-32">
              <div className={cn("bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-sky-900/5 dark:shadow-none border border-white dark:border-slate-700 p-8 relative overflow-hidden transition-all duration-300 transform-gpu", activeCardBorder)}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/10 dark:bg-sky-500/10 rounded-bl-full blur-2xl"></div>
                  
                  <div className="flex items-center gap-3 mb-8">
                       <div className="w-14 h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-inner">
                           <Share2 size={28} />
                       </div>
                       <div>
                           <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Active Session</h1>
                           <div className="flex items-center gap-2 mt-1">
                               <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full"><Wifi size={10} /> Broadcasting</span>
                           </div>
                       </div>
                  </div>

                  {/* QR Code (Desktop embedded) */}
                  <div className="hidden lg:flex justify-center mb-8">
                      {qrCodeUrl ? (
                          <div className="p-3 bg-white rounded-3xl shadow-lg border border-slate-100 group relative">
                              <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-indigo-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>
                              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 object-contain rounded-xl" />
                          </div>
                      ) : (
                          <div className="w-48 h-48 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                      )}
                  </div>
                  
                  <div className="space-y-4 mb-8">
                      <div className="relative group">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5"><Globe size={12} /> Shareable Link</div>
                          <button onClick={copyLink} className="w-full flex items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-sky-400/50 hover:ring-2 hover:ring-sky-400/20 transition-all text-left group-active:scale-[0.98]">
                              <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 truncate select-all">{shareLink}</span>
                              <div className={cn("shrink-0 p-2 rounded-xl transition-colors", copied ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : "bg-white dark:bg-slate-800 text-slate-400 shadow-sm")}>
                                  {copied ? <Check size={16} /> : <Copy size={16} />}
                              </div>
                          </button>
                      </div>
                      
                      {/* Mobile QR Button */}
                      <button onClick={() => setShowQrModal(true)} className="lg:hidden w-full flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl font-black shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                          <QrCode size={18} /> Show QR Code
                      </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                       {password && (
                           <div className="flex flex-col gap-1 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                               <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1"><Lock size={12}/> Access</span>
                               <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Locked</span>
                           </div>
                       )}
                       <div className={cn("flex flex-col gap-1 p-3 rounded-2xl border transition-colors", isNearExpiry ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30" : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800")}>
                           <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1", isNearExpiry ? "text-red-500" : "text-slate-400")}><Timer size={12}/> Expires In</span>
                           <span className={cn("text-sm font-bold font-mono tracking-wider", isNearExpiry ? "text-red-600 dark:text-red-400 animate-pulse" : "text-slate-700 dark:text-slate-300")}>{formatTimeRemaining(timeRemaining)}</span>
                       </div>
                       {(!isUnlimitedDownloads || (typeof downloadLimit === 'number' && downloadLimit < Infinity)) && (
                           <div className={cn("flex flex-col gap-1.5 p-3 rounded-2xl border transition-colors col-span-2", isNearLimit ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30" : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800")}>
                               <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1", isNearLimit ? "text-red-500" : "text-slate-400")}><Download size={12}/> Downloads</span>
                               <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1 overflow-hidden shadow-inner">
                                   <div className={cn("h-full rounded-full transition-all duration-500", isNearLimit ? "bg-red-500" : "bg-sky-500")} style={{ width: `${(getTotalDownloads() / (downloadLimit as number)) * 100}%` }}></div>
                               </div>
                               <span className={cn("text-xs font-black self-end mt-0.5", isNearLimit ? "text-red-600 dark:text-red-400" : "text-slate-500")}>{getTotalDownloads()} / {downloadLimit}</span>
                           </div>
                       )}
                  </div>
              </div>
          </div>

          {/* RIGHT PANE: Content & Analytics */}
          <div className="flex-1 w-full space-y-6">
              
              {/* Status Header */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white dark:border-slate-700 shadow-xl shadow-sky-900/5 text-center flex flex-col items-center justify-center transform-gpu">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Network Status</div>
                      <div className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 truncate w-full flex items-center justify-center gap-2">
                          {activeTransfers.length > 0 ? (
                              <><div className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></div><span className="text-sky-500">Sending</span></>
                          ) : (latency ? <><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>Connected</> : <><div className="w-2 h-2 rounded-full bg-amber-500"></div>Waiting</>)}
                      </div>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white dark:border-slate-700 shadow-xl shadow-sky-900/5 text-center flex flex-col items-center justify-center transform-gpu">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Ping (RTT)</div>
                      <div className="text-xl font-black text-slate-800 dark:text-slate-100">
                          {latency ? <span className={cn("text-emerald-500", latency > 100 && "text-amber-500", latency > 300 && "text-red-500")}>{latency}<span className="text-xs ml-1 opacity-50">ms</span></span> : <span className="text-slate-300">-</span>}
                      </div>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white dark:border-slate-700 shadow-xl shadow-sky-900/5 text-center flex flex-col items-center justify-center transform-gpu">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Speed</div>
                      <div className="text-lg md:text-xl font-black text-sky-500 dark:text-sky-400 flex items-center justify-center gap-1">{formatSpeed(currentSpeed)}</div>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white dark:border-slate-700 shadow-xl shadow-sky-900/5 text-center flex flex-col items-center justify-center transform-gpu">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Transferred</div>
                      <div className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100">{formatFileSize(totalBytesSent)}</div>
                  </div>
              </div>

              {/* Main Content Area (Tabs) */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-sky-900/5 dark:shadow-none border border-white dark:border-slate-700 p-2 md:p-3 relative overflow-hidden min-h-[500px]">
                  
                  {/* Tab Navigation */}
                  <div className="flex p-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl mb-4 relative z-10 overflow-x-auto hide-scrollbar">
                      <button 
                        onClick={() => setActiveTab('files')}
                        className={cn("flex-1 min-w-[120px] whitespace-nowrap py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2", activeTab === 'files' ? "bg-white dark:bg-slate-800 shadow-lg text-sky-600 dark:text-sky-400 scale-[1.02]" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                      >
                          <HardDrive size={16} className="shrink-0" /> <span className="hidden sm:inline">Shared</span> Files <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{hostedFiles.length}</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('text')}
                        className={cn("flex-1 min-w-[120px] whitespace-nowrap py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2", activeTab === 'text' ? "bg-white dark:bg-slate-800 shadow-lg text-sky-600 dark:text-sky-400 scale-[1.02]" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                      >
                          <MessageSquare size={16} className="shrink-0" /> <span className="hidden sm:inline">Secure</span> Chat
                      </button>
                      <button 
                        onClick={() => setActiveTab('logs')}
                        className={cn("flex-1 min-w-[120px] whitespace-nowrap py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2", activeTab === 'logs' ? "bg-white dark:bg-slate-800 shadow-lg text-sky-600 dark:text-sky-400 scale-[1.02]" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                      >
                          <Terminal size={16} className="shrink-0" /> Logs
                      </button>
                  </div>

                  {/* Pending Approvals Widget */}
                  {pendingApprovals.length > 0 && (
                      <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-4 animate-fade-in shadow-lg">
                          <h4 className="flex items-center gap-2 text-sm font-black text-amber-700 dark:text-amber-500 mb-3"><ShieldAlert size={16}/> {pendingApprovals.length} Waiting for Approval</h4>
                          <div className="space-y-2">
                              {pendingApprovals.map(req => (
                                  <div key={req.connectionId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                      <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 text-ellipsis overflow-hidden">Peer ID: {req.peerId}</div>
                                      <div className="flex items-center gap-2">
                                          <button onClick={() => denyConnection(req.connectionId)} className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors shadow-sm">Deny</button>
                                          <button onClick={() => approveConnection(req.connectionId)} className="px-4 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-sm">Allow</button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Content Panels */}
                  <div className="p-2 md:p-4">
                      {activeTab === 'files' ? (
                          <div className="space-y-4 animate-fade-in max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                              {hostedFiles.map((fileEntry) => {
                                  const stats = fileStats[fileEntry.id] || { downloads: 0, lastDownloadedAt: null };
                                  const activeTrans = activeTransfers.filter(t => t.fileId === fileEntry.id && t.status === 'transferring');
                                  
                                  return (
                                       <div key={fileEntry.id} className="group relative bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-sky-200 dark:hover:border-sky-800 transition-all hover:shadow-lg">
                                           {/* Animated background progress for active transfers */}
                                           {activeTrans.length > 0 && (
                                               <div className="absolute inset-0 bg-sky-50 dark:bg-sky-900/10 z-0 rounded-2xl overflow-hidden opacity-50">
                                                   <div className="h-full bg-sky-100 dark:bg-sky-900/30 transition-all duration-200" style={{ width: `${Math.max(...activeTrans.map(t => t.progress))}%` }}></div>
                                               </div>
                                           )}
                                           
                                           <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 shadow-inner border border-slate-100 dark:border-slate-800 shrink-0">
                                               <FileIcon fileName={fileEntry.file.name} fileType={fileEntry.file.type} className="w-7 h-7" />
                                           </div>
                                           <div className="relative z-10 flex-1 min-w-0">
                                               <div className="text-base font-bold text-slate-800 dark:text-slate-100 truncate pr-4">{fileEntry.file.name}</div>
                                               <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                                                   <span className="bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800 font-mono tracking-wide">{formatFileSize(fileEntry.file.size)}</span>
                                                   {stats.downloads > 0 && (
                                                       <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                                                           <Download size={14} /> {stats.downloads} download{stats.downloads > 1 ? 's' : ''}
                                                       </span>
                                                   )}
                                                   {activeTrans.length > 0 && (
                                                       <span className="flex items-center gap-1 text-sky-500 animate-pulse font-bold bg-sky-50 dark:bg-sky-900/20 px-2 py-1 rounded-lg">
                                                           <ArrowUpRight size={14} /> {activeTrans.length} active ({Math.round(Math.max(...activeTrans.map(t => t.progress)))}%)
                                                       </span>
                                                   )}
                                               </div>
                                           </div>
                                       </div>
                                  );
                              })}
                          </div>
                      ) : activeTab === 'text' ? (
                          <div className="flex flex-col h-[500px] animate-fade-in">
                              <div ref={chatContainerRef} className="flex-1 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-6 overflow-y-auto custom-scrollbar space-y-4 mb-4 shadow-inner">
                                  {textMessages.length === 0 && (
                                      <div className="h-full flex flex-col items-center justify-center text-slate-400/60 dark:text-slate-500/60">
                                          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                              <MessageSquare size={32} />
                                          </div>
                                          <p className="font-bold">No messages yet</p>
                                          <p className="text-xs mt-1">Chat is end-to-end encrypted locally.</p>
                                      </div>
                                  )}
                                  {textMessages.map(msg => (
                                      <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.sender === 'self' ? "ml-auto items-end" : "mr-auto items-start")}>
                                          <div className={cn("rounded-2xl px-5 py-3 text-[15px] shadow-sm", msg.sender === 'self' ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-tr-sm" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm")}>
                                              {msg.text}
                                          </div>
                                          <span className="text-[10px] text-slate-400 mt-1 font-bold px-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                      </div>
                                  ))}
                              </div>
                              <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendText()}
                                    placeholder="Type a secure message..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-[15px] outline-none focus:border-sky-500 focus:ring-4 ring-sky-500/10 transition-all font-medium text-slate-800 dark:text-slate-200"
                                  />
                                  <Button onClick={sendText} className="px-6 rounded-2xl shadow-lg shadow-sky-500/30">
                                      <Send size={20} className="ml-1" />
                                  </Button>
                              </div>
                          </div>
                      ) : activeTab === 'logs' ? (
                           <div ref={logsContainerRef} className="bg-slate-900 rounded-2xl p-4 h-[500px] overflow-y-auto custom-scrollbar font-mono text-xs animate-fade-in shadow-inner">
                               <div className="flex items-center gap-2 text-slate-500 mb-4 pb-2 border-b border-slate-800"><Terminal size={14}/> System Event Log ({actionLogs.length})</div>
                               {actionLogs.length === 0 ? (
                                   <div className="text-slate-600 p-4 pl-0">Waiting for events...</div>
                               ) : (
                                   <div className="space-y-1.5 flex flex-col justify-end">
                                       {actionLogs.map(log => (
                                           <div key={log.id} className="flex items-start gap-4 hover:bg-slate-800/50 p-1 rounded transition-colors group">
                                               <span className="text-slate-500 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                                               <span className={cn(
                                                   "flex-1 break-words",
                                                   log.type === 'info' && "text-slate-300 group-hover:text-white",
                                                   log.type === 'success' && "text-emerald-400 group-hover:text-emerald-300",
                                                   log.type === 'warning' && "text-amber-400 group-hover:text-amber-300",
                                                   log.type === 'error' && "text-red-400 group-hover:text-red-300"
                                               )}>
                                                   {log.message}
                                                   {log.peerId && <span className="ml-2 text-slate-600">({log.peerId.slice(0, 8)}...)</span>}
                                               </span>
                                           </div>
                                       ))}
                                   </div>
                               )}
                           </div>
                      ) : null}
                  </div>
              </div>
          </div>
      </div>
      
      <div className="text-center pb-8 sm:pb-0 px-4">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-1.5">
             <ShieldCheck size={14} className="shrink-0"/> <span className="text-balance">Connections are secured with DTLS/SCTP. Files are streamed directly P2P.</span>
          </p>
      </div>
    </div>

      {/* Action Bar (Floating pill on mobile, inline/relative on desktop) */}
      <div className="fixed sm:relative bottom-6 sm:bottom-0 left-0 right-0 px-4 sm:px-0 z-50 pointer-events-none flex justify-center sm:mt-4 mb-4 sm:mb-8">
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full max-w-[340px] sm:max-w-lg pointer-events-auto bg-white/90 dark:bg-slate-800/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none p-2 sm:p-0 rounded-3xl sm:rounded-none border border-slate-200/50 dark:border-slate-700/50 sm:border-none shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 sm:shadow-none">
               <button onClick={sendNudge} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 border border-slate-200/50 dark:border-slate-700/50 sm:border-transparent shadow-sm sm:shadow-lg hover:shadow-xl" title="Shake peer's screen">
                   <Bell size={18} /> Nudge Peer
               </button>
               <button onClick={() => handleStopSharing('user')} className="flex-[1.5] sm:flex-none flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 transform-gpu sm:border sm:border-red-500 dark:sm:border-red-400 hover:shadow-xl">
                   <Trash2 size={18} /> Stop Sharing
               </button>
          </div>
      </div>
    </>
  );
};
