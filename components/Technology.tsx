import React, { useState } from 'react';
import { 
  Network, Zap, Database, FileText, Monitor, Users, Settings, Cpu, 
  Layers, Package, FileCode, Shield, Code, Boxes, Target, Workflow, 
  ArrowLeftRight, Blocks, MemoryStick, Wifi, Gauge, Lock, CloudOff, 
  Fingerprint, ShieldCheck, Key, CheckCircle, HardDrive, GitBranch, 
  Sparkles, TrendingUp, BarChart3, Info, AlertTriangle, XCircle, 
  Binary, ChevronRight, Check, Radio, Server, Globe, ArrowLeft,
  Smartphone, RefreshCw, Activity, LockKeyhole, FileStack, Layout
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils';

// --- UI Components ---
const Card: React.FC<{ className?: string, children: React.ReactNode, style?: React.CSSProperties }> = ({ className, children, style }) => (
    <div className={cn("rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm", className)} style={style}>
        {children}
    </div>
);

const CardHeader: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

const CardTitle: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <h3 className={cn("font-semibold leading-none tracking-tight", className)}>{children}</h3>
);

const CardDescription: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <p className={cn("text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)}>{children}</p>
);

const CardContent: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("p-6 pt-0", className)}>{children}</div>
);

const Badge: React.FC<{ variant?: 'default' | 'secondary' | 'outline' | 'destructive', className?: string, children: React.ReactNode }> = ({ variant = 'default', className, children }) => {
    const variants = {
        default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
    };
    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300", variants[variant], className)}>
            {children}
        </div>
    );
};

const Separator: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("shrink-0 bg-slate-200 dark:bg-slate-800 h-[1px] w-full", className)} />
);

const Alert: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950 dark:[&>svg]:text-slate-50", className)}>
        {children}
    </div>
);

const AlertTitle: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)}>{children}</h5>
);

const AlertDescription: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)}>{children}</div>
);

// --- Page Component ---

export const Technology: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("0");

  const coreComponents = [
    {
      name: "Peer Service",
      file: "services/peerService.ts",
      purpose: "Central WebRTC connection management and coordination hub",
      icon: Network,
      complexity: "Critical",
      linesOfCode: "~150 lines",
      dependencies: ["PeerJS", "EventEmitter", "WebRTC API"],
      keyContributions: [
        "Establishes and maintains WebRTC peer-to-peer connections using PeerJS library",
        "Manages simultaneous peer connections in a Map data structure for O(1) lookup",
        "Implements connection health monitoring via 'ping/pong' latency checks",
        "Wraps standard WebRTC DataChannels with event-driven abstraction (on 'data', 'open')",
        "Handles buffer pressure by exposing `waitForBuffer` to prevent memory overflows",
      ],
      failureConsequences: [
        "Complete loss of P2P connectivity - no file transfers possible",
        "Existing connections drop immediately without cleanup",
        "Peer discovery becomes impossible",
      ],
      technicalDetails: {
        webrtc: "STUN servers (Google, Twilio) for NAT traversal with ICE candidate gathering",
        dataStructures: "Map<string, DataConnection> for connection pooling",
        errorHandling: "Exponential backoff on connection failure (handled by PeerJS internally)",
        performance: "BufferedAmount monitoring to implement backpressure",
      },
    },
    {
      name: "Sender Engine",
      file: "components/Sender.tsx",
      purpose: "Core file reading, chunking, and transmission logic",
      icon: Zap,
      complexity: "High",
      linesOfCode: "~600 lines",
      dependencies: ["File API", "PeerService", "React Hooks"],
      keyContributions: [
        "Splits files into 16KB chunks to ensure compatibility with all browser MTUs",
        "Implements a 'Stop-and-Wait' style flow control using `await peerService.waitForBuffer()`",
        "Manages session lifecycle including QR code generation and expiration timers",
        "Updates UI state every 100ms to maintain 60fps performance during heavy transfer",
        "Handles file input via Drag-and-Drop API and standard inputs",
      ],
      failureConsequences: [
        "Browser crashes if files are loaded entirely into memory",
        "Transfer freezes if backpressure is not handled correctly",
        "UI becomes unresponsive during large file processing",
      ],
      technicalDetails: {
        chunking: "Fixed 16KB chunks (16 * 1024 bytes) for optimal reliability",
        memory: "Streaming approach; only one chunk held in memory at a time",
        loop: "Async while-loop with `Date.now()` checks for UI throttling",
        state: "React Refs used for high-frequency variables to avoid re-renders",
      },
    },
    {
      name: "Receiver Engine",
      file: "components/Receiver.tsx",
      purpose: "Incoming stream handling, reassembly, and security verification",
      icon: Database,
      complexity: "High",
      linesOfCode: "~400 lines",
      dependencies: ["Blob API", "PeerService", "URL API"],
      keyContributions: [
        "Demultiplexes incoming traffic: JSON (Signaling) vs ArrayBuffer (Data)",
        "Reconstructs files from ordered chunks using synchronous array pushing",
        "Verifies session passwords via challenge-response protocol before accepting data",
        "Generates Blob URLs for download triggers and manages cleanup",
        "Calculates real-time transfer speed and ETA based on byte velocity",
      ],
      failureConsequences: [
        "Corrupted files if chunks are processed out of order",
        "Memory leaks from unrevoked Blob URLs crashing the tab",
        "Security bypass if password logic fails",
      ],
      technicalDetails: {
        reassembly: "In-memory ArrayBuffer accumulation",
        integrity: "Relies on SCTP (WebRTC default) for ordered, reliable delivery",
        security: "Manifest payload validation for file metadata",
        performance: "Debounced state updates to prevent render trashing",
      },
    },
    {
      name: "Application Shell",
      file: "App.tsx",
      purpose: "Routing, global state, and layout orchestration",
      icon: Layout,
      complexity: "Medium",
      linesOfCode: "~200 lines",
      dependencies: ["React", "Tailwind", "LocalStorage"],
      keyContributions: [
        "Manages URL hash-based routing (#host-id) for deep linking",
        "Handles global theme state (Dark/Light mode) with persistence",
        "Orchestrates view transitions between Home, Info, and Transfer screens",
        "Provides global Toast notification context",
      ],
      failureConsequences: [
        "Broken deep links prevents connecting to peers",
        "Theme flickering or inconsistency",
        "Loss of application context",
      ],
      technicalDetails: {
        routing: "HashRouter pattern for client-side only navigation",
        state: "React `useState` and `useEffect` for lifecycle management",
        styling: "Tailwind CSS with `dark:` modifiers for theming",
      },
    },
  ];

  const architectureLayers = [
    {
      name: "Frontend Layer",
      description: "React application with TypeScript and Tailwind CSS",
      icon: Monitor,
      components: [
        "React 19",
        "TypeScript 5+",
        "Tailwind CSS",
        "Lucide Icons",
      ],
      responsibilities: [
        "User interface rendering and interaction",
        "State management and view routing",
        "Real-time progress visualization",
        "Responsive design for all devices",
      ],
      technologies: ["React", "Vite", "Tailwind", "PostCSS"],
    },
    {
      name: "P2P Communication Layer",
      description: "WebRTC implementation for direct peer connections",
      icon: Network,
      components: [
        "PeerJS",
        "WebRTC DataChannel",
        "STUN Servers",
      ],
      responsibilities: [
        "Establishing secure peer-to-peer connections",
        "NAT traversal via STUN (Google/Twilio)",
        "Connection health monitoring (Ping/Pong)",
        "Signaling via WebSocket (broker)",
      ],
      technologies: ["WebRTC 1.0", "PeerJS", "STUN", "ICE"],
    },
    {
      name: "Data Processing Layer",
      description: "Chunked binary data transmission logic",
      icon: FileText,
      components: [
        "File API",
        "ArrayBuffer",
        "Blob",
        "Streams",
      ],
      responsibilities: [
        "File chunking (16KB segments)",
        "Binary data reconstruction",
        "Memory flow control (Backpressure)",
        "MIME type detection",
      ],
      technologies: ["File API", "TypedArrays", "Blob API"],
    },
    {
      name: "Security Layer",
      description: "Encryption and Access Control",
      icon: Shield,
      components: [
        "DTLS 1.2",
        "Password Logic",
        "Ephemeral Sessions",
      ],
      responsibilities: [
        "End-to-end encryption (AES-128-GCM)",
        "Session locking via password hash",
        "Zero-persistence data policy",
      ],
      technologies: ["DTLS 1.2", "SCTP", "SHA-256"],
    },
  ];

  const dataFlow = [
    {
      step: "Connection Establishment",
      description: "WebRTC peer connection setup with STUN",
      icon: Radio,
      details: [
        "Host generates a unique 6-char ID (e.g., 'X7k9P2')",
        "PeerJS connects to signaling server to await incoming connections",
        "Receiver enters ID; signaling server exchanges SDP offers/answers",
        "STUN servers discover public IPs for NAT traversal (ICE candidates)",
        "Direct P2P DataChannel established via DTLS 1.2",
      ],
    },
    {
      step: "File Selection & Handshake",
      description: "Metadata exchange and approval",
      icon: FileStack,
      details: [
        "Host selects files; 'MANIFEST' message sent to Receiver",
        "Manifest contains filenames, sizes, types, and lock status",
        "Receiver validates password if session is locked",
        "Receiver sends 'REQUEST_FILE' for specific file ID",
      ],
    },
    {
      step: "Transfer Execution",
      description: "Chunked data transmission",
      icon: ArrowLeftRight,
      details: [
        "Sender reads file slice (16KB) into ArrayBuffer",
        "Sender checks `bufferedAmount` to prevent memory overflow",
        "Chunk sent over DataChannel; Progress calculated",
        "Receiver accepts chunk synchronously into memory array",
        "UI updates every 100ms to show real-time speed/ETA",
      ],
    },
    {
      step: "File Reconstruction",
      description: "Reassembly and completion",
      icon: Blocks,
      details: [
        "Receiver tracks total bytes vs expected size",
        "On completion, chunks merged into single Blob object",
        "MIME type applied from original Manifest",
        "Download triggered via `URL.createObjectURL` anchor click",
        "Resources cleaned up immediately to free RAM",
      ],
    },
  ];

  const performanceOptimizations = [
    {
      category: "Memory Management",
      icon: MemoryStick,
      optimizations: [
        "Streaming file processing prevents loading entire files into memory",
        "Small fixed chunk size (16KB) ensures low memory footprint and high reliability",
        "Manual garbage collection triggers (URL revocation) to prevent leaks",
        "Backpressure monitoring (waitForBuffer) prevents browser crashes",
      ],
    },
    {
      category: "Network Efficiency",
      icon: Wifi,
      optimizations: [
        "STUN server redundancy (Google + Twilio) ensures reliable NAT traversal",
        "Binary serialization avoids Base64 overhead (33% savings)",
        "SCTP guarantees ordered delivery, removing need for manual reordering logic",
        "Keep-alive audio beacon prevents iOS Safari from throttling background tabs",
      ],
    },
    {
      category: "UI Responsiveness",
      icon: Gauge,
      optimizations: [
        "Debounced progress updates (100ms) prevent main thread blocking",
        "React Refs used for high-frequency data to avoid re-renders",
        "CSS transforms used for animations to utilize GPU acceleration",
        "Virtual DOM diffing minimized during active transfers",
      ],
    },
  ];

  const securityFeatures = [
    {
      feature: "End-to-End Encryption",
      description: "All data encrypted with DTLS 1.2",
      implementation:
        "WebRTC's built-in encryption handles key exchange and data protection automatically.",
      icon: Lock,
      benefits: [
        "No plaintext data transmission",
        "Perfect forward secrecy",
        "Protection against eavesdropping",
      ],
      technicalDetails: "DTLS 1.2 with AES-128-GCM, ECDHE key exchange",
    },
    {
      feature: "No Server Storage",
      description: "Files transfer directly between devices",
      implementation:
        "Pure P2P architecture with no file upload endpoints - data exists only in RAM.",
      icon: CloudOff,
      benefits: [
        "Complete data privacy",
        "No risk of server-side breaches",
        "Unlimited file sizes",
      ],
      technicalDetails:
        "WebRTC DataChannel, ephemeral RAM buffers",
    },
    {
      feature: "Session Security",
      description: "Password protection and auto-expiry",
      implementation: "Application-level gating of file manifests and download requests.",
      icon: ShieldCheck,
      benefits: [
        "Prevents unauthorized access",
        "Auto-cleanup of stale sessions",
        "Granular control",
      ],
      technicalDetails:
        "Challenge-response protocol, client-side hash verification",
    },
  ];

  const browserCompatibility = [
    {
      browser: "Google Chrome",
      version: "80+",
      support: "Full Support",
      icon: CheckCircle,
      color: "text-green-500",
      notes: "Best performance. V8 engine handles large ArrayBuffers efficiently.",
    },
    {
      browser: "Mozilla Firefox",
      version: "75+",
      support: "Full Support",
      icon: CheckCircle,
      color: "text-green-500",
      notes: "Excellent WebRTC implementation. Reliable large file transfer.",
    },
    {
      browser: "Safari (macOS/iOS)",
      version: "14.1+",
      support: "Full Support",
      icon: CheckCircle,
      color: "text-green-500",
      notes: "Requires iOS 15+ for stable DataChannel. Backgrounding limited.",
    },
    {
      browser: "Microsoft Edge",
      version: "80+",
      support: "Full Support",
      icon: CheckCircle,
      color: "text-green-500",
      notes: "Chromium-based. Identical performance to Chrome.",
    },
  ];

  const technicalSpecs = [
    {
      category: "Network Protocol",
      icon: Network,
      specs: [
        { label: "Protocol", value: "WebRTC DataChannel" },
        { label: "Transport", value: "SCTP over DTLS over UDP" },
        { label: "Encryption", value: "AES-128-GCM" },
        { label: "NAT Traversal", value: "ICE (STUN)" },
        { label: "Signaling", value: "WebSocket (PeerJS)" },
      ],
    },
    {
      category: "Performance Limits",
      icon: Gauge,
      specs: [
        { label: "Chunk Size", value: "16 KB (Fixed)" },
        { label: "Max File Size", value: "Browser RAM Limit (~2-4GB)" },
        { label: "Transfer Speed", value: "Network Dependent (LAN 50MB/s+)" },
        { label: "Concurrent Peers", value: "Limited by Upstream BW" },
      ],
    },
  ];

  const realWorldUseCases = [
    {
      title: "Ad-Hoc File Sharing",
      description: "Quickly sending photos or documents to a colleague across the room without email limits.",
      icon: Zap,
    },
    {
      title: "Privacy-Sensitive Transfer",
      description: "Sending legal or medical documents where cloud storage retention is a liability.",
      icon: Lock,
    },
    {
      title: "Large Media Transfer",
      description: "Video editors sending raw footage (GBs) over local LAN at high speeds.",
      icon: FilmIcon,
    },
    {
      title: "Cross-Device Clipboard",
      description: "Moving text snippets or URLs between phone and desktop instantly.",
      icon: Smartphone,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] w-full animate-fade-in">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Navigation */}
        <div className="mb-8">
             <Button onClick={onBack} variant="ghost" className="pl-0 hover:bg-transparent hover:text-indigo-500 gap-2 text-slate-500">
                 <ArrowLeft size={20} /> Back to Application
             </Button>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-slide-up">
            <div className="inline-block">
              <Badge variant="outline" className="text-xs px-3 py-1 mb-4 bg-white dark:bg-slate-800">
                <Code className="h-3 w-3 mr-1" />
                Technical Deep Dive v2.0
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Technical Architecture
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Comprehensive technical documentation of NW Share's peer-to-peer file sharing architecture. Deep dive into
              WebRTC protocols, memory management, and security implementation.
            </p>
          </div>

          {/* Educational Project Notice */}
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/10">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <AlertTitle className="text-lg font-bold text-orange-800 dark:text-orange-400 mb-2">
              Architecture Overview
            </AlertTitle>
            <AlertDescription className="text-orange-700 dark:text-orange-300 leading-relaxed">
              NW Share operates on a strictly client-side model. The server component (PeerJS Broker) only facilitates the initial handshake. Once connected, all data flows directly between peers.
            </AlertDescription>
          </Alert>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Core Modules</p>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">4</p>
                  </div>
                  <Package className="h-8 w-8 text-indigo-100 dark:text-indigo-900" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Lines of Code</p>
                    <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">~1.5K</p>
                  </div>
                  <FileCode className="h-8 w-8 text-violet-100 dark:text-violet-900" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Arch Layers</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4</p>
                  </div>
                  <Layers className="h-8 w-8 text-emerald-100 dark:text-emerald-900" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Security Specs</p>
                    <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">3</p>
                  </div>
                  <Shield className="h-8 w-8 text-rose-100 dark:text-rose-900" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Overview */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Layers className="h-5 w-5 text-indigo-500" />
                System Architecture Overview
              </CardTitle>
              <CardDescription>
                Modular, layered architecture designed for separation of concerns between UI, Networking, and Data handling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {architectureLayers.map((layer, index) => {
                  const Icon = layer.icon
                  return (
                    <div
                      key={index}
                      className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                          <Icon className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{layer.name}</h3>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                          <Boxes className="h-3 w-3" /> Components
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {layer.components.map((component, compIndex) => (
                            <Badge key={compIndex} variant="secondary" className="text-[10px]">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                          <Target className="h-3 w-3" /> Responsibilities
                        </h4>
                        <ul className="space-y-1.5">
                          {layer.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Core Components Deep Dive */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5 text-indigo-500" />
                Core Components Deep Dive
              </CardTitle>
              <CardDescription>
                Detailed analysis of each core component including purpose, contributions, and technical implementation details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Custom Tabs Implementation */}
              <div className="w-full">
                <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 mb-6">
                    {coreComponents.map((component, index) => {
                        const Icon = component.icon;
                        return (
                            <button 
                                key={index}
                                onClick={() => setActiveTab(index.toString())}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-[2px]",
                                    activeTab === index.toString() 
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20" 
                                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {component.name}
                            </button>
                        )
                    })}
                </div>

                {coreComponents.map((component, index) => {
                  const Icon = component.icon
                  return (
                    <div key={index} className={cn("space-y-6 animate-fade-in", activeTab === index.toString() ? "block" : "hidden")}>
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                            <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{component.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Code className="h-3 w-3 text-slate-400" />
                              <p className="text-sm text-slate-500 font-mono">{component.file}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {component.complexity} Priority
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {component.linesOfCode}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-indigo-500">
                        <h4 className="font-semibold mb-2 text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-sm">
                          <Info className="h-4 w-4" />
                          Purpose & Function
                        </h4>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{component.purpose}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm">
                            <CheckCircle className="h-5 w-5" />
                            Key Contributions
                          </h4>
                          <ul className="space-y-3">
                            {component.keyContributions.map((contribution, contribIndex) => (
                              <li
                                key={contribIndex}
                                className="text-xs md:text-sm flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-slate-700 dark:text-slate-300"
                              >
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                <span>{contribution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 text-sm">
                            <XCircle className="h-5 w-5" />
                            Failure Consequences
                          </h4>
                          <ul className="space-y-3">
                            {component.failureConsequences.map((consequence, consIndex) => (
                              <li
                                key={consIndex}
                                className="text-xs md:text-sm flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-100 dark:border-rose-900/30 text-slate-700 dark:text-slate-300"
                              >
                                <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                <span>{consequence}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-4 text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-sm">
                          <Workflow className="h-5 w-5" />
                          Technical Implementation Details
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {Object.entries(component.technicalDetails).map(([key, value], techIndex) => (
                            <div
                              key={techIndex}
                              className="p-4 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800"
                            >
                              <div className="font-bold text-xs uppercase text-slate-400 mb-2 flex items-center gap-2">
                                <Binary className="h-3 w-3" />
                                {key.replace(/([A-Z])/g, " $1")}:
                              </div>
                              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {component.dependencies && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                          <h4 className="font-bold text-xs uppercase text-slate-400 mb-3 flex items-center gap-2">
                            <GitBranch className="h-3 w-3" />
                            Dependencies:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {component.dependencies.map((dep, depIndex) => (
                              <Badge key={depIndex} variant="secondary">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Data Flow */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Workflow className="h-5 w-5 text-indigo-500" />
                File Transfer Data Flow
              </CardTitle>
              <CardDescription>
                Step-by-step breakdown of how files move through the system from selection to completion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {dataFlow.map((step, index) => {
                  const StepIcon = step.icon
                  return (
                    <div key={index} className="relative pl-16">
                      <div className="absolute left-0 top-0 w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-900 bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm z-10">
                        <StepIcon className="h-5 w-5 text-indigo-500" />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{step.step}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
                        </div>
                        <div className="grid gap-2">
                          {step.details.map((detail, detailIndex) => (
                            <div
                              key={detailIndex}
                              className="text-xs md:text-sm flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-100 dark:border-slate-800/50"
                            >
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="leading-relaxed text-slate-600 dark:text-slate-300">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Optimizations */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-5 w-5 text-amber-500" />
                Performance Optimizations
              </CardTitle>
              <CardDescription>
                Technical optimizations that make NW Share fast, efficient, and responsive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {performanceOptimizations.map((category, index) => {
                  const CategoryIcon = category.icon
                  return (
                    <div
                      key={index}
                      className="space-y-4 p-5 border rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                          <CategoryIcon className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{category.category}</h3>
                      </div>
                      <ul className="space-y-3">
                        {category.optimizations.map((optimization, optIndex) => (
                          <li key={optIndex} className="text-xs md:text-sm flex items-start gap-3 leading-relaxed text-slate-600 dark:text-slate-300">
                            <Zap className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                            <span>{optimization}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-emerald-500" />
                Security Architecture
              </CardTitle>
              <CardDescription>
                Comprehensive security measures protecting user data and privacy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {securityFeatures.map((feature, index) => {
                  const FeatureIcon = feature.icon
                  return (
                    <div
                      key={index}
                      className="space-y-4 p-5 border rounded-xl hover:border-emerald-500/30 transition-all bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                          <FeatureIcon className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{feature.feature}</h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase text-slate-400 flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          Implementation:
                        </h4>
                        <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg leading-relaxed font-mono">
                          {feature.implementation}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase text-slate-400 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                          Benefits:
                        </h4>
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="text-xs flex items-start gap-2 leading-relaxed text-slate-600 dark:text-slate-300">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {feature.technicalDetails && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-mono text-slate-400">{feature.technicalDetails}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Browser Compatibility */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-5 w-5 text-blue-500" />
                Browser Compatibility Matrix
              </CardTitle>
              <CardDescription>
                Detailed browser support information for WebRTC DataChannels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {browserCompatibility.map((browser, index) => {
                  const StatusIcon = browser.icon
                  return (
                    <div
                      key={index}
                      className="space-y-3 p-4 border rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">{browser.browser}</h3>
                        <StatusIcon className={`h-5 w-5 ${browser.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{browser.version}</Badge>
                        <Badge className="bg-emerald-500 text-white border-0">{browser.support}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">{browser.notes}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Server className="h-5 w-5 text-indigo-500" />
                Technical Specifications
              </CardTitle>
              <CardDescription>
                Key parameters defining the operational limits of NW Share.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {technicalSpecs.map((category, index) => {
                  const CategoryIcon = category.icon
                  return (
                    <div
                      key={index}
                      className="space-y-4 p-5 border rounded-xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{category.category}</h3>
                      </div>
                      <div className="space-y-3">
                        {category.specs.map((spec, specIndex) => (
                          <div
                            key={specIndex}
                            className="flex items-start justify-between gap-4 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                          >
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{spec.label}:</span>
                            <span className="text-sm text-right font-mono text-slate-900 dark:text-white">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Real World Use Cases */}
          <Card className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-purple-500" />
                Real-World Use Cases
              </CardTitle>
              <CardDescription>
                Production scenarios where P2P technology excels over cloud storage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {realWorldUseCases.map((useCase, index) => {
                  const Icon = useCase.icon
                  return (
                    <div
                      key={index}
                      className="space-y-4 p-5 border rounded-xl hover:border-purple-400/50 transition-all bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                          <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{useCase.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{useCase.description}</p>
                      
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Efficiency</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
// Helper for UseCase icon since FilmIcon was not imported in the main list
const FilmIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></svg>
);
