
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Cpu, Database, Network, Code, Layers, FileCode, 
  Zap, Activity, HardDrive, GitBranch, Terminal, Server, 
  Lock, Box, ArrowRight, MousePointerClick, FileJson, 
  ChevronRight, AlertTriangle, CheckCircle2, XCircle, 
  Workflow, Binary, RefreshCw, Layout, Smartphone, Globe,
  Shield, Key, Radio, Menu, X, Play, Pause, Timer,
  Wifi, Monitor, LockKeyhole, Split, ChevronDown,
  Users, Upload, Settings, BarChart3, MessageSquare, Brain,
  Eye, CheckCircle, Code2, PackageCheck, CircuitBoard,
  ShieldCheck, KeyRound, Fingerprint, Gauge
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils';

// --- LOCAL UI COMPONENTS ---

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn("bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all", className)} {...props}>
        {children}
    </div>
);

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn("p-6 pb-4", className)} {...props}>{children}</div>
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
    <h3 className={cn("text-lg font-bold text-slate-900 dark:text-white leading-tight", className)} {...props}>{children}</h3>
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
    <p className={cn("text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed", className)} {...props}>{children}
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>
);

const Badge: React.FC<{ variant?: 'default' | 'secondary' | 'outline' | 'destructive', className?: string, children: React.ReactNode }> = ({ variant = 'default', className, children }) => {
    const variants = {
        default: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-transparent",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent",
        destructive: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-transparent",
        outline: "bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
    };
    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)}>
            {children}
        </span>
    );
};

const Separator: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("h-[1px] w-full bg-slate-200 dark:bg-slate-800 my-4", className)} />
);

const Alert: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4", className)}>
        {children}
    </div>
);

const AlertDescription: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)}>{children}</div>
);

const TabsContext = React.createContext<{ activeTab: string; setActiveTab: (v: string) => void }>({ activeTab: '', setActiveTab: () => {} });

const Tabs: React.FC<{ defaultValue: string; className?: string; children: React.ReactNode }> = ({ defaultValue, className, children }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
};

const TabsList: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-slate-500 dark:text-slate-400", className)}>
        {children}
    </div>
);

const TabsTrigger: React.FC<{ value: string; className?: string; children: React.ReactNode }> = ({ value, className, children }) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext);
    return (
        <button
            onClick={() => setActiveTab(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                activeTab === value ? "bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm" : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100",
                className
            )}
        >
            {children}
        </button>
    );
};

const TabsContent: React.FC<{ value: string; className?: string; children: React.ReactNode }> = ({ value, className, children }) => {
    const { activeTab } = React.useContext(TabsContext);
    if (activeTab !== value) return null;
    return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-fade-in", className)}>{children}</div>;
};

// --- VISUALIZATION COMPONENTS ---

const ArchitectureDiagram = () => {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setStep(s => (s + 1) % 4), 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 relative min-h-[350px] flex flex-col items-center justify-center group w-full overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors duration-500">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 w-full overflow-x-auto pb-6 custom-scrollbar">
                <div className="min-w-[600px] px-8 mx-auto pt-12">
                    <div className="flex justify-between items-end mb-12 relative">
                        <div className="flex flex-col items-center gap-4 z-20 w-24">
                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl bg-white dark:bg-slate-800", step === 0 ? "border-indigo-500 scale-110 shadow-indigo-500/20" : "border-slate-200 dark:border-slate-700")}>
                                <MonitorIcon className={step === 0 ? "text-indigo-500" : "text-slate-400"} />
                            </div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">Sender</div>
                        </div>
                        <div className="absolute left-1/2 -top-24 -translate-x-1/2 flex flex-col items-center gap-2 z-10 w-32">
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 bg-white dark:bg-slate-800", step === 1 ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-110" : "border-slate-200 dark:border-slate-700")}>
                                <Server size={20} className={step === 1 ? "text-amber-500" : "text-slate-400"} />
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Broker</div>
                        </div>
                        <div className="flex flex-col items-center gap-4 z-20 w-24">
                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl bg-white dark:bg-slate-800", step === 2 ? "border-emerald-500 scale-110 shadow-emerald-500/20" : "border-slate-200 dark:border-slate-700")}>
                                <MonitorIcon className={step === 2 ? "text-emerald-500" : "text-slate-400"} />
                            </div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center">Receiver</div>
                        </div>
                        <svg className="absolute inset-0 w-full h-full -top-12 pointer-events-none overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <path d="M 50 30 Q 300 -80 300 -60" fill="none" stroke={step === 1 ? "#f59e0b" : "#cbd5e1"} strokeWidth="2" strokeDasharray="5,5" className={cn("transition-colors duration-500", step === 1 && "animate-pulse")} />
                            <path d="M 550 30 Q 300 -80 300 -60" fill="none" stroke={step === 1 ? "#f59e0b" : "#cbd5e1"} strokeWidth="2" strokeDasharray="5,5" className={cn("transition-colors duration-500", step === 1 && "animate-pulse")} />
                        </svg>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden mt-8 shadow-inner mx-8">
                        <div className={cn("absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-opacity duration-500", step === 3 ? "opacity-100 animate-shimmer" : "opacity-0")} />
                        {step === 3 && (
                            <>
                                <div className="absolute top-1 left-0 w-2 h-2 rounded-full bg-white shadow animate-packet" />
                                <div className="absolute top-1 left-0 w-2 h-2 rounded-full bg-white shadow animate-packet" style={{ animationDelay: '0.5s' }} />
                                <div className="absolute top-1 left-0 w-2 h-2 rounded-full bg-white shadow animate-packet" style={{ animationDelay: '1s' }} />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-center mt-6 w-full px-4 max-w-lg mx-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {step === 0 && "Step 1: Init"}
                    {step === 1 && "Step 2: Signaling (SDP Exchange)"}
                    {step === 2 && "Step 3: ICE Candidate Check"}
                    {step === 3 && "Step 4: P2P Data Tunnel (Active)"}
                </div>
                <p className="text-sm text-slate-400">
                    {step === 0 && "Sender creates a specialized Offer."}
                    {step === 1 && "Metadata is swapped via WebSocket."}
                    {step === 2 && "Best network path is negotiated."}
                    {step === 3 && "Direct, encrypted binary stream."}
                </p>
            </div>
        </div>
    );
};

const HandshakeSequence = () => {
    return (
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white font-mono text-xs relative overflow-hidden group shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar pb-4">
                 <div className="min-w-[500px] px-2">
                    <div className="flex justify-between mb-4 border-b border-slate-700 pb-2">
                        <span className="text-indigo-400 font-bold w-1/3">HOST</span>
                        <span className="text-slate-500 font-bold w-1/3 text-center">SIGNALING</span>
                        <span className="text-emerald-400 font-bold w-1/3 text-right">PEER</span>
                    </div>
                    <div className="space-y-4 relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2" />
                        <div className="flex justify-between items-center group">
                            <div className="w-1/3 text-right pr-4"><span className="bg-indigo-900/50 px-2 py-1 rounded text-indigo-300 border border-indigo-500/30">Connect</span></div>
                            <div className="w-1/3 text-center z-10"><div className="w-2 h-2 bg-slate-600 rounded-full mx-auto" /></div>
                            <div className="w-1/3 pl-4 opacity-50">...</div>
                        </div>
                        <div className="flex justify-between items-center group">
                            <div className="w-1/3 text-right pr-4 opacity-50">...</div>
                            <div className="w-1/3 text-center z-10"><div className="w-2 h-2 bg-slate-600 rounded-full mx-auto" /></div>
                            <div className="w-1/3 text-right pl-4 flex justify-end"><span className="bg-emerald-900/50 px-2 py-1 rounded text-emerald-300 border border-emerald-500/30">Connect</span></div>
                        </div>
                        <div className="flex justify-between items-center relative group">
                            <div className="absolute left-1/3 right-1/3 top-1/2 h-px bg-indigo-500/50" />
                            <div className="w-1/3 text-right pr-4"><span className="text-amber-400 font-bold">OFFER</span> &rarr;</div>
                            <div className="w-1/3 text-center z-10"><div className="w-3 h-3 bg-amber-500 rounded-full mx-auto animate-pulse" /></div>
                            <div className="w-1/3 pl-4 opacity-50">&rarr;</div>
                        </div>
                        <div className="flex justify-between items-center relative group">
                            <div className="absolute left-1/3 right-1/3 top-1/2 h-px bg-emerald-500/50" />
                            <div className="w-1/3 text-right pr-4 opacity-50">&larr;</div>
                            <div className="w-1/3 text-center z-10"><div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto animate-pulse" /></div>
                            <div className="w-1/3 pl-4">&larr; <span className="text-amber-400 font-bold">ANSWER</span></div>
                        </div>
                        <div className="flex justify-center py-4">
                            <span className="bg-slate-800 border border-slate-600 px-3 py-1 rounded-full text-xs font-bold text-slate-300">P2P ESTABLISHED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChunkingSimulator = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [chunks, setChunks] = useState<number[]>([]);
    const [buffer, setBuffer] = useState(0);
    const [transferred, setTransferred] = useState(0);
    const intervalRef = useRef<any>(null);

    const toggle = () => {
        if (isRunning) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        } else {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setBuffer(b => {
                    if (b > 80) return Math.max(0, b - 20);
                    setChunks(c => [...c.slice(-4), Math.random()]); 
                    setTransferred(t => t + 64);
                    return Math.min(100, b + 15);
                });
            }, 200);
        }
    };

    useEffect(() => {
        const drain = setInterval(() => { setBuffer(b => Math.max(0, b - 5)); }, 100);
        return () => { clearInterval(intervalRef.current); clearInterval(drain); };
    }, []);

    const getBufferColor = (val: number) => {
        if (val < 50) return "bg-emerald-500";
        if (val < 80) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="bg-slate-900 text-white rounded-3xl p-4 md:p-6 border border-slate-800 shadow-2xl group hover:border-slate-700 transition-colors w-full overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 shrink-0"><Cpu size={20} /></div>
                    <div className="min-w-0">
                        <h3 className="font-bold truncate text-sm md:text-base">Chunking Engine</h3>
                        <div className="text-[10px] text-slate-400 font-mono truncate">MODE: {isRunning ? 'ACTIVE' : 'IDLE'}</div>
                    </div>
                </div>
                <button onClick={toggle} className="p-3 rounded-full bg-white text-slate-900 hover:bg-indigo-50 transition-colors transform active:scale-95 shrink-0">
                    {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6 min-w-0">
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto custom-scrollbar pb-4 pt-2">
                        <div className="w-14 h-16 md:w-16 md:h-20 border-2 border-slate-700 rounded bg-slate-800 flex items-center justify-center relative shadow-inner shrink-0">
                            <FileCode className="text-slate-500" />
                            <div className="absolute -bottom-6 text-[10px] font-mono text-slate-500">SOURCE</div>
                        </div>
                        <div className="flex-1 h-10 md:h-12 bg-slate-800/50 rounded-lg border border-slate-700/50 relative overflow-hidden flex items-center px-2 gap-2 shadow-inner min-w-[100px]">
                             {chunks.map((_, i) => (
                                 <div key={i} className="w-4 md:w-6 h-6 md:h-8 bg-indigo-500 rounded shadow-lg animate-slide-right shrink-0" />
                             ))}
                        </div>
                        <div className="w-14 h-16 md:w-16 md:h-20 border-2 border-slate-700 rounded bg-slate-800 flex flex-col justify-end relative overflow-hidden shadow-inner shrink-0">
                             <div className={cn("w-full transition-all duration-200 opacity-80", getBufferColor(buffer))} style={{ height: `${buffer}%` }} />
                             <div className="absolute inset-0 flex items-center justify-center font-bold text-xs mix-blend-difference z-10">{Math.round(buffer)}%</div>
                             <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-mono text-slate-500">BUFFER</div>
                        </div>
                    </div>
                </div>
                <div className="bg-black/30 rounded-xl p-4 font-mono text-xs space-y-3 border border-white/5">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-400">STATUS:</span>
                        <span className={isRunning ? "text-emerald-400" : "text-amber-400"}>{isRunning ? "RUNNING" : "PAUSED"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">CHUNK_SIZE:</span>
                        <span className="text-indigo-400">16 KB</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">TRANSFERRED:</span>
                        <span className="text-white">{transferred} KB</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">BACKPRESSURE:</span>
                        <span className={buffer > 80 ? "text-red-500 font-bold animate-pulse" : "text-emerald-500"}>
                            {buffer > 80 ? "THROTTLING" : "NOMINAL"}
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
                <strong>How it works:</strong> The simulator yields execution when the simulated buffer exceeds 80%. In the real app, we check <code className="bg-slate-800 px-1 rounded text-indigo-300">conn.bufferedAmount</code> before reading the next slice.
            </p>
        </div>
    );
};

// --- DATA & CONTENT ---

const componentDocs = [
    {
      id: "peer-connection",
      title: "Peer Connection System",
      description: "WebRTC-based peer-to-peer connection management with real-time monitoring",
      icon: Users,
      category: "Core",
      details: {
        purpose: "Establishes and manages secure WebRTC connections between peers using modern browser APIs for direct peer-to-peer communication without server intermediaries.",
        features: [
          "Automatic peer ID generation using cryptographic Web Crypto API",
          "Real-time connection quality monitoring with latency tracking",
          "Automatic reconnection with exponential backoff strategy",
          "Connection heartbeat system with 2-second intervals",
          "Support for both reliable (TCP-like) and unreliable (UDP-like) data channels",
        ],
        technical: {
          protocol: "WebRTC DataChannel with DTLS 1.2 encryption (RFC 5764)",
          transport: "SCTP over DTLS over UDP with STUN/TURN fallback servers",
          security: "End-to-end encryption with perfect forward secrecy using ECDHE",
          performance: "Sub-100ms latency for optimal connections",
          iceServers: "Google STUN servers (stun.l.google.com)",
        },
        codeExample: `// Peer Service Initialization
this.peer = new Peer(customId, {
  debug: 0,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' }
    ]
  }
});

// Handle incoming connection
(this.peer as any).on('connection', (conn: DataConnection) => {
  this.connections.set(conn.connectionId, conn);
  
  // Set up data listener
  conn.on('data', (data) => {
    this.emit('data', {
      data: data as DataPayload,
      connectionId: conn.connectionId,
      peerId: conn.peer
    });
  });
});`,
        files: ["services/peerService.ts", "components/Receiver.tsx"],
        howItWorks: [
          "User generates a secure 6-char connection ID.",
          "PeerJS connects to signaling server (Broker) to handshake.",
          "ICE candidates are exchanged to punch through NAT.",
          "DTLS handshake completes, establishing direct DataChannel.",
          "PeerService wraps the connection in an EventEmitter for the UI.",
        ]
      },
    },
    {
      id: "file-transfer",
      title: "File Transfer Engine",
      description: "Chunked file transfer system with integrity verification and progress tracking",
      icon: Upload,
      category: "Core",
      details: {
        purpose: "Handles secure, efficient file transfers between connected peers using chunked streaming for memory-efficient processing of files of any size.",
        features: [
          "Chunked transfer system (16KB fixed chunks)",
          "Real-time progress tracking with speed calculations",
          "Memory-efficient processing using Slice API",
          "Backpressure management to prevent browser crashes",
          "Batch file transfers with individual progress tracking",
        ],
        technical: {
          chunking: "Fixed 16KB size to match MTU sweet spots",
          memory: "Streaming approach; only one chunk held in RAM at a time",
          performance: "Async loop with bufferedAmount checks",
          flowControl: "Stop-and-wait implementation for buffer draining",
        },
        codeExample: `// Sender.tsx Transfer Loop
while (offset < totalSize) {
    // 1. Backpressure Check
    await peerService.waitForBuffer(connId);

    // 2. Read Chunk
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const buffer = await chunk.arrayBuffer();
    
    // 3. Send
    peerService.sendTo(connId, buffer);
    
    offset += buffer.byteLength;
    
    // 4. Update UI (throttled)
    if (Date.now() - lastTick > 100) {
       updateProgress(...);
    }
}`,
        files: ["components/Sender.tsx", "components/Receiver.tsx"],
        howItWorks: [
          "Sender creates a 'START_FILE' metadata packet.",
          "Receiver prepares to accept binary stream.",
          "Sender loops through file, slicing 16KB chunks.",
          "Chunks are sent over DataChannel.",
          "Receiver pushes chunks into an array synchronously.",
          "On 'END_FILE', Receiver merges chunks into a Blob.",
        ]
      },
    },
    {
      id: "chat-system",
      title: "Real-time Chat System",
      description: "Peer-to-peer messaging with ephemeral history",
      icon: MessageSquare,
      category: "Communication",
      details: {
        purpose: "Enables real-time text communication between connected peers using WebRTC DataChannel for low-latency messaging.",
        features: [
          "Real-time messaging via WebRTC DataChannel",
          "Ephemeral message history (cleared on refresh)",
          "Typing indicators and read receipts support",
          "Message encryption using WebRTC's built-in DTLS security",
          "Integrated into the main file transfer interface",
        ],
        technical: {
          transport: "WebRTC DataChannel for low-latency, reliable messaging",
          encryption: "Automatic DTLS encryption for all messages",
          storage: "React State (Session-only)",
          serialization: "JSON payloads over binary channel",
        },
        codeExample: `// Sending a text message
const sendText = () => {
  if (!textInput.trim()) return;
  
  // Broadcast to all peers
  peerService.broadcast({ 
    type: 'TEXT', 
    payload: { text: textInput } 
  });
  
  // Update local UI
  setTextMessages(prev => [...prev, {
    id: Math.random().toString(36),
    text: textInput,
    sender: 'self',
    timestamp: Date.now()
  }]);
};`,
        files: ["components/Sender.tsx", "components/Receiver.tsx", "types.ts"],
        howItWorks: [
          "User types message in the 'Text Stream' tab.",
          "Message is wrapped in a ProtocolMessage object.",
          "JSON stringified and sent via DataChannel.",
          "Receiver parses JSON and appends to local state array.",
          "UI re-renders to show new chat bubble.",
        ]
      },
    },
    {
      id: "security-system",
      title: "Security & Encryption",
      description: "End-to-end encryption with zero-knowledge architecture",
      icon: Shield,
      category: "Security",
      details: {
        purpose: "Ensures complete privacy and security for all data transfers using end-to-end encryption with zero server knowledge or storage.",
        features: [
          "End-to-end DTLS 1.2 encryption for all WebRTC connections",
          "Zero server storage - all data transfers happen peer-to-peer",
          "Perfect forward secrecy with unique ephemeral session keys",
          "Optional password protection for sessions",
          "Client-side data validation",
        ],
        technical: {
          encryption: "AES-128-GCM with DTLS 1.2 protocol",
          keys: "Ephemeral ECDHE keys",
          auth: "Challenge-response password protocol",
          architecture: "Zero-knowledge design",
        },
        codeExample: `// Receiver.tsx Password Verification
const verifyPassword = () => {
  if (!hostConnectionIdRef.current) return;
  
  // Send attempt to host
  peerService.sendTo(hostConnectionIdRef.current, { 
      type: 'VERIFY_PASSWORD', 
      payload: { password: passwordInput } 
  });
};

// Sender.tsx Verification Logic
if (msg.type === 'VERIFY_PASSWORD') {
     if (msg.payload?.password === passwordRef.current) {
          peerService.sendTo(connId, { type: 'PASSWORD_CORRECT' });
          sendManifest(); // Unlock files
     } else { 
          peerService.sendTo(connId, { type: 'PASSWORD_INCORRECT' }); 
     }
}`,
        files: ["components/Sender.tsx", "services/peerService.ts"],
        howItWorks: [
          "WebRTC automatically establishes DTLS-encrypted connections.",
          "If password is set, Sender locks the manifest.",
          "Receiver must send a 'VERIFY_PASSWORD' packet.",
          "Sender compares hash strings locally.",
          "If match, 'MANIFEST' is sent and file access is granted.",
        ]
      },
    },
    {
      id: "settings-panel",
      title: "Settings & Configuration",
      description: "Comprehensive session management",
      icon: Settings,
      category: "Configuration",
      details: {
        purpose: "Centralized configuration management for session behavior, limits, and security.",
        features: [
          "Download limits (Max number of downloads)",
          "Time expiration settings (e.g. 1 hour)",
          "Password protection toggle",
          "QR Code generation for quick mobile connection",
        ],
        technical: {
          state: "React useState for transient session config",
          enforcement: "Server-side (Host) logic enforces limits before sending data",
          qrcode: "Client-side generation using 'qrcode' library",
        },
        codeExample: `// Enforcing Limits in Sender.tsx
const newDownloadCount = totalDownloads + 1;

const limit = isUnlimited ? Infinity : Number(downloadLimit);

if (newDownloadCount >= limit) {
    // Graceful shutdown
    setTimeout(() => handleStopSharing('limit'), 1000);
}`,
        files: ["components/Sender.tsx"],
        howItWorks: [
          "Host configures limits in the 'Settings' dropdown.",
          "Values are stored in React state refs.",
          "On every file request, Host checks current count vs limit.",
          "If limit reached, Host destroys the Peer connection.",
        ]
      },
    },
];

const DocSection: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
    <section id={id} className="mb-16 scroll-mt-32 w-full animate-fade-in">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="h-8 w-1 bg-indigo-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
        </div>
        {children}
    </section>
);

const MonitorIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("w-6 h-6", className)}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
);

const InfographicCard: React.FC<{ icon: any; title: string; desc: string; color: string }> = ({ icon: Icon, title, desc, color }) => (
    <div className={cn("p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl", color)}>
        <Icon className="mb-3" size={28} />
        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h4>
        <p className="text-sm opacity-90 leading-relaxed">{desc}</p>
    </div>
);

// --- MAIN PAGE ---

export const Info: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
      setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) setActiveTab(entry.target.id); });
    }, { rootMargin: '-20% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
  };

  const navItems = [
      { id: 'overview', label: 'Executive Summary', icon: Layout },
      { id: 'architecture', label: 'System Architecture', icon: Network },
      { id: 'components', label: 'Component Deep Dive', icon: Layers },
      { id: 'chunking', label: 'Chunking Engine', icon: Split },
      { id: 'security', label: 'Security Model', icon: Shield },
      { id: 'analytics', label: 'Performance', icon: BarChart3 },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-fade-in flex flex-col lg:flex-row min-h-screen items-start bg-slate-50 dark:bg-[#0B0F19]">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-28 self-start mb-8">
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ml-6 flex flex-col">
             <div className="p-6">
                 <div className="flex items-center gap-2 font-black text-xl text-slate-900 dark:text-white tracking-tight mb-8">
                    <Terminal className="text-indigo-500" /> NW<span className="text-slate-400">Docs</span>
                 </div>
                 <nav className="space-y-1">
                     {navItems.map(item => (
                         <button key={item.id} onClick={() => scrollTo(item.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left group", activeTab === item.id ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/10" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800")}>
                             <item.icon size={16} className={cn("transition-colors", activeTab === item.id ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                             {item.label}
                             {activeTab === item.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                         </button>
                     ))}
                 </nav>
             </div>
             <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800">
                 <Button onClick={onBack} variant="ghost" className="w-full justify-start pl-2 gap-3 text-slate-500 hover:text-indigo-600">
                     <ArrowLeft size={18} /> Return to App
                 </Button>
             </div>
         </div>
      </aside>

      {/* MOBILE DRAWER */}
      <div className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden", mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={() => setMobileMenuOpen(false)} />
      <div className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 lg:hidden flex flex-col", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <span className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2"><Terminal className="text-indigo-500" size={20} /> Docs</span>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
             {navItems.map(item => (
                 <button key={item.id} onClick={() => scrollTo(item.id)} className="w-full flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-slate-800 text-sm font-medium text-left text-slate-700 dark:text-slate-300">
                     <item.icon size={18} className="text-slate-400" /> {item.label}
                 </button>
             ))}
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
             <Button onClick={onBack} variant="ghost" className="w-full justify-center gap-2 text-slate-600 dark:text-slate-400"><ArrowLeft size={18} /> Back to App</Button>
          </div>
      </div>
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button onClick={() => setMobileMenuOpen(true)} className="w-14 h-14 bg-indigo-600 rounded-full text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center active:scale-95 transition-transform hover:scale-105"><Menu size={24} /></button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full min-w-0 p-4 md:p-12 overflow-x-hidden">
          
          <div className="mb-12">
               <Alert className="border-2 border-orange-500/50 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse-subtle">
                <AlertTriangle className="h-5 w-5 text-orange-500 animate-bounce-subtle" />
                <div className="ml-2">
                    <h5 className="font-bold text-orange-700 dark:text-orange-400 text-sm mb-1">Educational Project Notice</h5>
                    <div className="text-sm text-orange-600 dark:text-orange-300/80 leading-relaxed">
                        Features described below (like Persistent Storage) are theoretical architecture goals. This is a demonstration project running entirely in browser memory.
                    </div>
                </div>
              </Alert>
          </div>

          <DocSection id="overview" title="Executive Summary">
              <div className="prose dark:prose-invert max-w-4xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p className="text-lg md:text-xl font-light text-slate-900 dark:text-white mb-8">
                      NW Share is a <span className="font-semibold text-indigo-500">serverless, transient file transfer system</span> designed to bypass cloud storage limitations. It utilizes the WebRTC Data Channel standard to establish ephemeral, encrypted peer-to-peer tunnels directly between client browsers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InfographicCard icon={Zap} title="Zero-Persistence" desc="Data streams directly from RAM to RAM. No database, no S3 buckets, no logs." color="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400" />
                      <InfographicCard icon={Binary} title="Unlimited Size" desc="By implementing a custom chunking algorithm, we bypass the browser's 2GB Blob limit." color="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
                      <InfographicCard icon={Shield} title="Trustless" desc="End-to-End Encrypted via DTLS 1.2. The signaling server sees only opaque handshake packets." color="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400" />
                  </div>
              </div>
          </DocSection>

          <DocSection id="architecture" title="System Architecture">
              <p className="mb-8 text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  The system relies on a "Triangle Topology". The Broker (Signaling Server) is only used for the initial 300ms to exchange network candidates. Once the tunnel is established, the Broker is disconnected to ensure privacy.
              </p>
              <ArchitectureDiagram />
              <div className="mt-8">
                  <HandshakeSequence />
              </div>
          </DocSection>

          <DocSection id="components" title="Component Deep Dive">
              <p className="mb-8 text-slate-600 dark:text-slate-400">Detailed breakdown of the core modules powering the application.</p>
              <div className="space-y-6">
                {componentDocs.map((component) => {
                  const Icon = component.icon
                  const isExpanded = expandedSections[component.id]
                  return (
                    <Card key={component.id} className="border-2 hover:border-indigo-500/30 transition-all duration-300">
                      <CardHeader className="cursor-pointer" onClick={() => toggleSection(component.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-900/20 dark:to-slate-800 rounded-xl shadow-sm">
                              <Icon className="h-6 w-6 text-indigo-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <CardTitle>{component.title}</CardTitle>
                                <Badge variant="secondary">{component.category}</Badge>
                              </div>
                              <CardDescription>{component.description}</CardDescription>
                            </div>
                          </div>
                          <Button variant="ghost" className="shrink-0 rounded-full h-10 w-10 p-0">
                             <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-300", isExpanded && "rotate-180")} />
                          </Button>
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="animate-slide-down">
                          <Separator />
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-6">
                              <TabsTrigger value="overview" className="gap-2 py-2"><Eye className="h-4 w-4" /><span className="hidden sm:inline">Overview</span></TabsTrigger>
                              <TabsTrigger value="technical" className="gap-2 py-2"><CircuitBoard className="h-4 w-4" /><span className="hidden sm:inline">Technical</span></TabsTrigger>
                              <TabsTrigger value="code" className="gap-2 py-2"><Code2 className="h-4 w-4" /><span className="hidden sm:inline">Code</span></TabsTrigger>
                              <TabsTrigger value="how" className="gap-2 py-2"><Workflow className="h-4 w-4" /><span className="hidden sm:inline">Flow</span></TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                              <div><h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 text-sm flex items-center gap-2"><Eye className="h-4 w-4" /> Purpose</h4><p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{component.details.purpose}</p></div>
                              <div>
                                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Key Features</h4>
                                <ul className="grid sm:grid-cols-2 gap-2">
                                  {component.details.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TabsContent>

                            <TabsContent value="technical" className="space-y-4">
                              <div className="grid gap-3 md:grid-cols-2">
                                {Object.entries(component.details.technical).map(([key, value]) => (
                                  <div key={key} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="font-bold text-xs uppercase text-slate-400 mb-1 flex items-center gap-2"><Binary className="h-3 w-3" /> {key}</div>
                                    <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">{value}</div>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2 text-sm flex items-center gap-2"><FileCode className="h-4 w-4" /> Related Files</h4>
                                <div className="flex flex-wrap gap-2">
                                  {component.details.files.map((file, i) => (
                                    <Badge key={i} variant="outline" className="font-mono text-xs py-1 px-2">{file}</Badge>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="code">
                                <div className="relative group">
                                  <div className="absolute top-3 right-3 px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider">TypeScript</div>
                                  <pre className="bg-[#0f172a] text-slate-300 p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 shadow-inner custom-scrollbar">
                                    <code>{component.details.codeExample}</code>
                                  </pre>
                                </div>
                            </TabsContent>

                            <TabsContent value="how">
                                <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                                  {component.details.howItWorks.map((step, i) => (
                                    <div key={i} className="relative pl-12 pb-6 last:pb-0">
                                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shadow-sm z-10">{i + 1}</div>
                                      <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">{step}</div>
                                    </div>
                                  ))}
                                </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
          </DocSection>

          <DocSection id="chunking" title="The Chunking Engine">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 items-start">
                  <div>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                          To prevent browser crashes when handling gigabyte-sized files, we implement a streaming protocol. Files are sliced into <span className="font-bold text-indigo-500">16KB chunks</span> (matching the MTU sweet spot) and sent sequentially.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full overflow-hidden mb-6">
                         <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white flex items-center gap-2"><Cpu size={16} /> Backpressure Algorithm</h4>
                         <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" /><span>Checks <code>bufferedAmount</code> before sending</span></li>
                             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" /><span>Yields to event loop using <code>await</code></span></li>
                             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" /><span>Explicit memory release via array detachment</span></li>
                         </ul>
                     </div>
                  </div>
                  <div className="w-full">
                       <ChunkingSimulator />
                  </div>
              </div>
          </DocSection>

          <DocSection id="security" title="Security Model">
               <div className="grid gap-6 md:grid-cols-2">
                    <Card className="hover:border-emerald-500/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-emerald-500" /> End-to-End Encryption</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                WebRTC mandates encryption. We use <strong>DTLS 1.2</strong> with <strong>AES-128-GCM</strong> cipher suites. Keys are generated on the fly and never leave the device.
                            </p>
                            <div className="flex gap-2 text-xs">
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">ECDHE-RSA</Badge>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">SHA-256</Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-amber-500/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><KeyRound className="text-amber-500" /> Ephemeral Sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Connection IDs are random 6-character tokens valid only for the duration of the session. Reloading the page destroys the keys and creates a new identity.
                            </p>
                            <div className="flex gap-2 text-xs">
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700">Transient</Badge>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700">No Logs</Badge>
                            </div>
                        </CardContent>
                    </Card>
               </div>
          </DocSection>

          <DocSection id="analytics" title="Performance & Analytics">
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                  <div className="grid md:grid-cols-2 gap-8 relative z-10">
                      <div>
                          <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><Gauge className="text-indigo-400" /> Real-time Metrics</h4>
                          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                              The application constantly monitors the RTC transport layer to calculate Round Trip Time (RTT) and packet loss. This allows the Chunking Engine to throttle speeds dynamically if network quality degrades.
                          </p>
                          <div className="space-y-4">
                              <div className="flex justify-between text-sm border-b border-slate-800 pb-2"><span className="text-slate-500">Target Latency</span> <span className="font-mono text-emerald-400">&lt; 100ms</span></div>
                              <div className="flex justify-between text-sm border-b border-slate-800 pb-2"><span className="text-slate-500">Max Throughput</span> <span className="font-mono text-indigo-400">~50 MB/s (LAN)</span></div>
                              <div className="flex justify-between text-sm border-b border-slate-800 pb-2"><span className="text-slate-500">Memory Footprint</span> <span className="font-mono text-amber-400">~150 MB</span></div>
                          </div>
                      </div>
                      <div className="flex flex-col justify-center gap-4">
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                              <div className="text-xs text-slate-500 uppercase font-bold mb-1">FPS Target</div>
                              <div className="flex items-end gap-2">
                                  <span className="text-2xl font-black text-white">60</span>
                                  <span className="text-xs text-emerald-400 mb-1">Stable</span>
                              </div>
                              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                  <div className="bg-emerald-500 w-full h-full" />
                              </div>
                          </div>
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                              <div className="text-xs text-slate-500 uppercase font-bold mb-1">Buffer Health</div>
                              <div className="flex items-end gap-2">
                                  <span className="text-2xl font-black text-white">0.2</span>
                                  <span className="text-xs text-indigo-400 mb-1">seconds</span>
                              </div>
                              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                  <div className="bg-indigo-500 w-[20%] h-full animate-pulse" />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </DocSection>

      </main>
    </div>
  );
};
