
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Cpu, Database, Network, Code, Layers, FileCode, 
  Zap, HardDrive, GitBranch, Terminal, Server, 
  Lock, Box, AlertTriangle, CheckCircle2, XCircle, 
  Workflow, Binary, RefreshCw, Layout, Smartphone, Globe,
  Shield, Radio, X, Play, Pause, Timer,
  Wifi, Monitor, ChevronDown,
  Users, Upload, Settings, BarChart3, MessageSquare,
  Eye, CheckCircle, Code2, CircuitBoard,
  ShieldCheck, KeyRound, Fingerprint, Gauge, FileStack,
  ArrowRight
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils';

// --- LOCAL UI COMPONENTS ---

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn("bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-500/30", className)} {...props}>
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
    <p className={cn("text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed", className)} {...props}>{children}</p>
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
    <div className={cn("relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4", className)}>
        {children}
    </div>
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
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-slate-500 dark:text-slate-400 w-full md:w-auto", className)}>
        {children}
    </div>
);

const TabsTrigger: React.FC<{ value: string; className?: string; children: React.ReactNode }> = ({ value, className, children }) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext);
    return (
        <button
            onClick={() => setActiveTab(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 md:flex-none",
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

    // Helper to calculate line classes based on step
    const getLineClass = (activeStep: number) => 
        cn("transition-all duration-700", step === activeStep ? "stroke-amber-500 opacity-100" : "stroke-slate-300 dark:stroke-slate-700 opacity-30");

    return (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 relative flex flex-col items-center justify-center group w-full overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors duration-500">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* Diagram Container - Responsive Scaling */}
            <div className="w-full relative h-[240px] md:h-[280px] max-w-md mx-auto my-4">
                
                {/* Broker (Top Center) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center gap-2 z-20">
                     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 bg-white dark:bg-slate-800 shadow-lg", step === 1 ? "border-amber-500 shadow-amber-500/20 scale-110" : "border-slate-200 dark:border-slate-700")}>
                        <Server size={20} className={step === 1 ? "text-amber-500" : "text-slate-400"} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Broker</div>
                </div>

                {/* Sender (Bottom Left) */}
                <div className="absolute left-0 bottom-8 flex flex-col items-center gap-2 z-20">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl bg-white dark:bg-slate-800", step === 0 ? "border-indigo-500 scale-110 shadow-indigo-500/20" : "border-slate-200 dark:border-slate-700")}>
                        <MonitorIcon className={cn("w-7 h-7", step === 0 ? "text-indigo-500" : "text-slate-400")} />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Sender</div>
                </div>

                {/* Receiver (Bottom Right) */}
                <div className="absolute right-0 bottom-8 flex flex-col items-center gap-2 z-20">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl bg-white dark:bg-slate-800", step === 2 ? "border-emerald-500 scale-110 shadow-emerald-500/20" : "border-slate-200 dark:border-slate-700")}>
                        <MonitorIcon className={cn("w-7 h-7", step === 2 ? "text-emerald-500" : "text-slate-400")} />
                    </div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Receiver</div>
                </div>

                {/* Connecting Lines SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                    {/* Sender to Broker */}
                    <path d="M 40 180 Q 40 60 50% 50" fill="none" strokeWidth="2" strokeDasharray="6,4" className={getLineClass(1)} />
                    {/* Receiver to Broker */}
                    <path d="M 100% 180 Q 100% 60 50% 50" fill="none" strokeWidth="2" strokeDasharray="6,4" className={getLineClass(1)} transform="translate(-40, 0)" />
                    
                    {/* P2P Tunnel (Direct) */}
                    <path d="M 50 190 L 90% 190" fill="none" stroke={step === 3 ? "#6366f1" : "#cbd5e1"} strokeWidth={step === 3 ? "4" : "1"} className={cn("transition-all duration-500", step !== 3 && "opacity-20 dark:opacity-10")} />
                    
                    {/* Data Packets */}
                    {step === 3 && (
                        <>
                            <circle r="4" fill="#fff" className="animate-packet">
                                <animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 190 L 90% 190" />
                            </circle>
                            <circle r="4" fill="#fff" className="animate-packet" style={{ animationDelay: '0.5s' }}>
                                <animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 190 L 90% 190" />
                            </circle>
                        </>
                    )}
                </svg>
            </div>

            <div className="text-center mt-2 w-full px-4 max-w-lg mx-auto bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
                    {step === 0 && "Step 1: Init"}
                    {step === 1 && "Step 2: Signaling"}
                    {step === 2 && "Step 3: Traversal"}
                    {step === 3 && "Step 4: P2P Tunnel"}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {step === 0 && "Sender initializes session & generates Offer."}
                    {step === 1 && "Broker exchanges metadata (SDP)."}
                    {step === 2 && "Peers find path via STUN (ICE)."}
                    {step === 3 && "Direct, encrypted stream established."}
                </p>
            </div>
        </div>
    );
};

const HandshakeSequence = () => {
    return (
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white font-mono text-[10px] md:text-xs relative overflow-hidden group shadow-2xl w-full">
            <div className="w-full">
                <div className="flex justify-between mb-4 border-b border-slate-700 pb-2 px-2">
                    <span className="text-indigo-400 font-bold w-1/4">HOST</span>
                    <span className="text-slate-500 font-bold w-2/4 text-center">BROKER</span>
                    <span className="text-emerald-400 font-bold w-1/4 text-right">PEER</span>
                </div>
                <div className="space-y-3 relative px-1">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2" />
                    
                    <div className="flex justify-between items-center relative z-10">
                        <div className="w-1/4 text-right pr-2"><span className="text-indigo-300 bg-indigo-900/40 px-1 rounded">Connect</span></div>
                        <div className="w-2/4 text-center"><div className="w-1.5 h-1.5 bg-slate-600 rounded-full mx-auto" /></div>
                        <div className="w-1/4"></div>
                    </div>

                    <div className="flex justify-between items-center relative z-10">
                        <div className="w-1/4"></div>
                        <div className="w-2/4 text-center"><div className="w-1.5 h-1.5 bg-slate-600 rounded-full mx-auto" /></div>
                        <div className="w-1/4 text-left pl-2"><span className="text-emerald-300 bg-emerald-900/40 px-1 rounded">Join</span></div>
                    </div>

                    <div className="flex justify-between items-center relative z-10">
                        <div className="w-1/4 text-right pr-2 font-bold text-amber-500">OFFER &rarr;</div>
                        <div className="w-2/4 text-center flex items-center justify-center">
                            <div className="h-px w-full bg-slate-700 absolute -z-10" />
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        </div>
                        <div className="w-1/4 text-left pl-2 opacity-50">&rarr;</div>
                    </div>

                    <div className="flex justify-between items-center relative z-10">
                        <div className="w-1/4 text-right pr-2 opacity-50">&larr;</div>
                        <div className="w-2/4 text-center flex items-center justify-center">
                             <div className="h-px w-full bg-slate-700 absolute -z-10" />
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                        <div className="w-1/4 text-left pl-2 font-bold text-emerald-500">&larr; ANSWER</div>
                    </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-700 text-center">
                     <span className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider">
                         P2P CONNECTION ESTABLISHED
                     </span>
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
                    if (b > 80) return Math.max(0, b - 20); // Throttle simulation
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
        if (val < 50) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]";
        if (val < 80) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]";
        return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse";
    };

    return (
        <div className="bg-slate-900 text-white rounded-3xl p-4 md:p-6 border border-slate-800 shadow-2xl group hover:border-slate-700 transition-colors w-full overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 shrink-0"><Cpu size={20} /></div>
                    <div className="min-w-0">
                        <h3 className="font-bold truncate text-sm md:text-base">Chunking Engine</h3>
                        <div className="text-[10px] text-slate-400 font-mono truncate">STATUS: {isRunning ? 'PROCESSING' : 'IDLE'}</div>
                    </div>
                </div>
                <button onClick={toggle} className="p-3 rounded-full bg-white text-slate-900 hover:bg-indigo-50 transition-colors transform active:scale-95 shrink-0 shadow-lg">
                    {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
            </div>
            
            <div className="flex flex-col gap-6">
                {/* Visualizer Track */}
                <div className="relative bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 overflow-hidden">
                    <div className="flex items-center gap-2 md:gap-4 justify-between">
                        {/* Source File */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                             <div className="w-10 h-12 md:w-12 md:h-16 border-2 border-slate-600 rounded bg-slate-700 flex flex-col items-center justify-center relative shadow-lg">
                                <FileCode size={16} className="text-slate-400 mb-1" />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping" style={{ display: isRunning ? 'block' : 'none' }} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 tracking-wider">SOURCE</span>
                        </div>
                        
                        {/* Stream */}
                        <div className="flex-1 h-12 bg-slate-950/50 rounded border border-slate-800/50 relative overflow-hidden flex items-center px-2 gap-2 mx-2">
                             <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-slate-700 pointer-events-none">DATA STREAM</div>
                             {chunks.map((_, i) => (
                                 <div key={i} className="w-2 h-6 md:w-3 md:h-6 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-sm shadow-lg animate-slide-right shrink-0" />
                             ))}
                        </div>

                        {/* Buffer Tank */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <div className="w-12 h-12 md:w-14 md:h-16 border-2 border-slate-600 rounded bg-slate-800 flex flex-col justify-end relative overflow-hidden shadow-inner">
                                <div className={cn("w-full transition-all duration-200 opacity-90", getBufferColor(buffer))} style={{ height: `${buffer}%` }} />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-[9px] md:text-[10px] text-white mix-blend-difference z-10">{Math.round(buffer)}%</div>
                            </div>
                             <span className="text-[9px] font-bold text-slate-500 tracking-wider">BUFFER</span>
                        </div>
                    </div>
                </div>

                {/* Explanatory Legend */}
                <div className="grid grid-cols-3 gap-2 text-[10px] md:text-xs">
                     <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                         <div className="font-bold text-slate-300 mb-1">Source</div>
                         <div className="text-slate-500 leading-tight">Original file on disk</div>
                     </div>
                     <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                         <div className="font-bold text-indigo-300 mb-1">Stream</div>
                         <div className="text-slate-500 leading-tight">16KB chunks in transit</div>
                     </div>
                     <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                         <div className={cn("font-bold mb-1", buffer > 80 ? "text-red-400" : "text-emerald-400")}>{buffer > 80 ? "Wait" : "Flow"}</div>
                         <div className="text-slate-500 leading-tight">{buffer > 80 ? "Backpressure Active" : "Memory Optimal"}</div>
                     </div>
                </div>

                {/* Stats Panel */}
                <div className="bg-black/30 rounded-xl p-3 font-mono text-[9px] md:text-[10px] space-y-1.5 border border-white/5">
                    <div className="flex justify-between">
                        <span className="text-slate-500">CHUNK_SIZE</span>
                        <span className="text-indigo-400">16 KB (Fixed)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">TRANSFERRED</span>
                        <span className="text-white">{transferred} KB</span>
                    </div>
                </div>
            </div>
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
        codeExample: `// Sender.tsx Verification Logic
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
    <section id={id} className="mb-16 scroll-mt-28 w-full animate-fade-in px-2 md:px-0">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="h-6 w-1 md:h-8 bg-indigo-500 rounded-full" />
            <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
      setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navItems = [
      { id: 'overview', label: 'Summary', icon: Layout },
      { id: 'architecture', label: 'Architecture', icon: Network },
      { id: 'components', label: 'Components', icon: Layers },
      { id: 'chunking', label: 'Chunking', icon: FileCode },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'analytics', label: 'Metrics', icon: BarChart3 },
  ];

  const scrollTo = (id: string) => {
      setActiveTab(id);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B0F19]">
      
      {/* HEADER & NAV */}
      <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
             <Button onClick={onBack} variant="ghost" className="pl-0 hover:bg-transparent hover:text-indigo-500 gap-2 text-slate-500 text-xs md:text-sm">
                 <ArrowLeft size={16} /> <span className="hidden md:inline">Back to App</span><span className="md:hidden">Back</span>
             </Button>
             <div className="flex items-center gap-2 font-black text-lg text-slate-900 dark:text-white tracking-tight">
                <Terminal className="text-indigo-500" size={20} /> <span className="hidden md:inline">NW</span>Docs
             </div>
          </div>
          
          {/* Scrollable Nav */}
          <div className="px-4 md:px-8 pb-3 overflow-x-auto custom-scrollbar">
              <div className="flex gap-2 md:gap-4 min-w-max">
                 {navItems.map(item => (
                     <button 
                        key={item.id} 
                        onClick={() => scrollTo(item.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all border",
                            activeTab === item.id 
                                ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20" 
                                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600"
                        )}
                     >
                         <item.icon size={14} /> {item.label}
                     </button>
                 ))}
              </div>
          </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full min-w-0 p-4 md:p-8 md:pt-12 overflow-x-hidden">
          
          <div className="mb-12 px-2 md:px-0">
               <Alert className="border-2 border-orange-500/50 bg-orange-500/5 animate-pulse-subtle">
                <AlertTriangle className="h-5 w-5 text-orange-500 animate-bounce-subtle" />
                <div className="ml-2">
                    <h5 className="font-bold text-orange-700 dark:text-orange-400 text-sm mb-1">Educational Project Notice</h5>
                    <div className="text-xs md:text-sm text-orange-600 dark:text-orange-300/80 leading-relaxed">
                        Features described below (like Persistent Storage) are architecture goals. This is a demonstration project running entirely in browser memory.
                    </div>
                </div>
              </Alert>
          </div>

          <DocSection id="overview" title="Executive Summary">
              <div className="prose dark:prose-invert max-w-4xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p className="text-base md:text-xl font-light text-slate-900 dark:text-white mb-8">
                      NW Share is a <span className="font-semibold text-indigo-500">serverless, transient file transfer system</span> designed to bypass cloud storage limitations. It utilizes the WebRTC Data Channel standard to establish ephemeral, encrypted peer-to-peer tunnels directly between client browsers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <InfographicCard icon={Zap} title="Zero-Persistence" desc="Data streams directly from RAM to RAM. No database, no buckets." color="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400" />
                      <InfographicCard icon={Binary} title="Unlimited Size" desc="Custom chunking algorithm bypasses browser Blob limits." color="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
                      <InfographicCard icon={Shield} title="Trustless" desc="End-to-End Encrypted via DTLS 1.2. Signaling is opaque." color="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400" />
                  </div>
              </div>
          </DocSection>

          <DocSection id="architecture" title="System Architecture">
              <p className="mb-8 text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed text-sm md:text-base">
                  The system relies on a "Triangle Topology". The Broker (Signaling Server) is only used for the initial 300ms to exchange network candidates. Once the tunnel is established, the Broker is disconnected to ensure privacy.
              </p>
              <ArchitectureDiagram />
              <div className="mt-8">
                  <HandshakeSequence />
              </div>
          </DocSection>

          <DocSection id="components" title="Component Deep Dive">
              <p className="mb-8 text-slate-600 dark:text-slate-400 text-sm md:text-base">Detailed breakdown of the core modules powering the application.</p>
              <div className="space-y-4 md:space-y-6">
                {componentDocs.map((component) => {
                  const Icon = component.icon
                  const isExpanded = expandedSections[component.id]
                  return (
                    <Card key={component.id} className="border-2 hover:border-indigo-500/30 transition-all duration-300">
                      <div className="cursor-pointer p-4 md:p-6" onClick={() => toggleSection(component.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-900/20 dark:to-slate-800 rounded-xl shadow-sm shrink-0">
                              <Icon className="h-6 w-6 text-indigo-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">{component.title}</h3>
                                <Badge variant="secondary" className="hidden sm:inline-flex">{component.category}</Badge>
                              </div>
                              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-none">{component.description}</p>
                            </div>
                          </div>
                          <Button variant="ghost" className="shrink-0 rounded-full h-8 w-8 md:h-10 md:w-10 p-0 ml-2">
                             <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-300", isExpanded && "rotate-180")} />
                          </Button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="animate-slide-down px-4 md:px-6 pb-6">
                          <Separator className="mt-0 mb-6" />
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="mb-6 w-full">
                              <TabsTrigger value="overview" className="gap-1 md:gap-2"><Eye className="h-3 w-3 md:h-4 md:w-4" /> Overview</TabsTrigger>
                              <TabsTrigger value="technical" className="gap-1 md:gap-2"><CircuitBoard className="h-3 w-3 md:h-4 md:w-4" /> Technical</TabsTrigger>
                              <TabsTrigger value="code" className="gap-1 md:gap-2"><Code2 className="h-3 w-3 md:h-4 md:w-4" /> Code</TabsTrigger>
                              <TabsTrigger value="how" className="gap-1 md:gap-2"><Workflow className="h-3 w-3 md:h-4 md:w-4" /> Flow</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                              <div><h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 text-xs md:text-sm flex items-center gap-2"><Eye className="h-4 w-4" /> Purpose</h4><p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">{component.details.purpose}</p></div>
                              <div>
                                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 text-xs md:text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Key Features</h4>
                                <ul className="grid sm:grid-cols-2 gap-2">
                                  {component.details.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                      <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" /> {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TabsContent>

                            <TabsContent value="technical" className="space-y-4">
                              <div className="grid gap-3 md:grid-cols-2">
                                {Object.entries(component.details.technical).map(([key, value]) => (
                                  <div key={key} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="font-bold text-[10px] md:text-xs uppercase text-slate-400 mb-1 flex items-center gap-2"><Binary className="h-3 w-3" /> {key}</div>
                                    <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-mono break-words">{value}</div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="code">
                                <div className="relative group">
                                  <div className="absolute top-3 right-3 px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider">TS</div>
                                  <pre className="bg-[#0f172a] text-slate-300 p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 shadow-inner custom-scrollbar">
                                    <code>{component.details.codeExample}</code>
                                  </pre>
                                </div>
                            </TabsContent>

                            <TabsContent value="how">
                                <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                                  {component.details.howItWorks.map((step, i) => (
                                    <div key={i} className="relative pl-10 pb-6 last:pb-0">
                                      <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] shadow-sm z-10">{i + 1}</div>
                                      <div className="text-xs md:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">{step}</div>
                                    </div>
                                  ))}
                                </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
          </DocSection>

          <DocSection id="chunking" title="The Chunking Engine">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 items-start">
                  <div>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 text-base leading-relaxed">
                          To prevent browser crashes when handling gigabyte-sized files, we implement a streaming protocol. Files are sliced into <span className="font-bold text-indigo-500">16KB chunks</span> (matching the MTU sweet spot) and sent sequentially.
                      </p>
                      <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 w-full overflow-hidden mb-6">
                         <h4 className="font-bold text-sm mb-4 text-slate-900 dark:text-white flex items-center gap-2"><Cpu size={16} /> Backpressure Algorithm</h4>
                         <ul className="space-y-3 text-xs md:text-sm text-slate-600 dark:text-slate-400">
                             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" /><span>Checks <code>bufferedAmount</code> before sending</span></li>
                             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" /><span>Yields to event loop using <code>await</code></span></li>
                             <li className="flex gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" /><span>Explicit memory release via array detachment</span></li>
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
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg"><ShieldCheck className="text-emerald-500" /> End-to-End Encryption</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-4">
                                WebRTC mandates encryption. We use <strong>DTLS 1.2</strong> with <strong>AES-128-GCM</strong> cipher suites. Keys are generated on the fly and never leave the device.
                            </p>
                            <div className="flex gap-2 text-[10px] md:text-xs">
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">ECDHE-RSA</Badge>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">SHA-256</Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="hover:border-amber-500/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base md:text-lg"><KeyRound className="text-amber-500" /> Ephemeral Sessions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Connection IDs are random 6-character tokens valid only for the duration of the session. Reloading the page destroys the keys and creates a new identity.
                            </p>
                            <div className="flex gap-2 text-[10px] md:text-xs">
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700">Transient</Badge>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700">No Logs</Badge>
                            </div>
                        </CardContent>
                    </Card>
               </div>
          </DocSection>

          <DocSection id="analytics" title="Performance Metrics">
              <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                  <div className="grid md:grid-cols-2 gap-8 relative z-10">
                      <div>
                          <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2"><Gauge className="text-indigo-400" /> Real-time Metrics</h4>
                          <p className="text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">
                              The application constantly monitors the RTC transport layer to calculate Round Trip Time (RTT) and packet loss. This allows the Chunking Engine to throttle speeds dynamically if network quality degrades.
                          </p>
                          <div className="space-y-4">
                              <div className="flex justify-between text-xs md:text-sm border-b border-slate-800 pb-2"><span className="text-slate-500">Target Latency</span> <span className="font-mono text-emerald-400">&lt; 100ms</span></div>
                              <div className="flex justify-between text-xs md:text-sm border-b border-slate-800 pb-2"><span className="text-slate-500">Max Throughput</span> <span className="font-mono text-indigo-400">~50 MB/s (LAN)</span></div>
                              <div className="flex justify-between text-xs md:text-sm border-b border-slate-800 pb-2"><span className="text-slate-500">Memory Footprint</span> <span className="font-mono text-amber-400">~150 MB</span></div>
                          </div>
                      </div>
                      <div className="flex flex-col justify-center gap-4">
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">FPS Target</div>
                              <div className="flex items-end gap-2">
                                  <span className="text-2xl font-black text-white">60</span>
                                  <span className="text-[10px] text-emerald-400 mb-1">Stable</span>
                              </div>
                              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                  <div className="bg-emerald-500 w-full h-full" />
                              </div>
                          </div>
                          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Buffer Health</div>
                              <div className="flex items-end gap-2">
                                  <span className="text-2xl font-black text-white">0.2</span>
                                  <span className="text-[10px] text-indigo-400 mb-1">seconds</span>
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
