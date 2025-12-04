import React, { useState } from 'react';
import { 
  Network, Zap, Database, FileText, Monitor, Users, Settings, Cpu, 
  Layers, Package, FileCode, Shield, Code, Boxes, Target, Workflow, 
  ArrowLeftRight, Blocks, MemoryStick, Wifi, Gauge, Lock, CloudOff, 
  Fingerprint, ShieldCheck, Key, CheckCircle, HardDrive, GitBranch, 
  Sparkles, TrendingUp, BarChart3, Info, AlertTriangle, XCircle, 
  Binary, ChevronRight, Check, Radio
} from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils';

// --- UI Components ---
const Card: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={cn("rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm", className)}>
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
    <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)}>{children}</p>
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
      dependencies: ["PeerJS", "EventEmitter"],
      keyContributions: [
        "Establishes and maintains WebRTC peer-to-peer connections",
        "Manages simultaneous peer connections in a Map data structure",
        "Wraps PeerJS functionality with specific configuration (STUN/TURN)",
        "Handles connection events, errors, and data transmission",
        "Provides latency checking and buffer management",
      ],
      failureConsequences: [
        "Complete loss of P2P connectivity",
        "Existing connections drop immediately",
        "Peer discovery becomes impossible",
      ],
      technicalDetails: {
        webrtc: "STUN servers (Google, Twilio) for NAT traversal",
        dataStructures: "Map<string, DataConnection> for O(1) peer lookup",
        performance: "Buffer monitoring to prevent backpressure issues",
      },
    },
    {
      name: "Sender Component",
      file: "components/Sender.tsx",
      purpose: "Handles file selection, chunking, and transmission logic",
      icon: Zap,
      complexity: "High",
      linesOfCode: "~400 lines",
      dependencies: ["PeerService", "File API", "React Hooks"],
      keyContributions: [
        "Manages file input and reading using File API",
        "Implements the chunking loop (16KB chunks)",
        "Handles backpressure by checking bufferedAmount",
        "Updates UI with real-time transfer progress",
        "Manages session lifecycle (QR codes, expiration)",
      ],
      failureConsequences: [
        "File transfers cannot be initiated",
        "Browser crashes on large files if chunking fails",
        "UI freezes during transfer",
      ],
      technicalDetails: {
        chunking: "ArrayBuffer-based chunking (16KB default)",
        performance: "Updates UI every 100ms to avoid main thread blocking",
        memory: "Streaming approach, never loads full file into RAM",
      },
    },
    {
      name: "Receiver Component",
      file: "components/Receiver.tsx",
      purpose: "Handles incoming data streams, reassembly, and downloading",
      icon: Database,
      complexity: "High",
      linesOfCode: "~300 lines",
      dependencies: ["PeerService", "Blob API"],
      keyContributions: [
        "Reassembles received chunks into Blobs",
        "Manages download state and progress visualization",
        "Handles password verification and manifests",
        "Directs binary data to efficient storage buffers",
      ],
      failureConsequences: [
        "Corrupted files if reassembly order is lost",
        "Memory leaks from unreleased Blob URLs",
        "Download failures on network interruption",
      ],
      technicalDetails: {
        reassembly: "Synchronous ArrayBuffer pushing to preserve order",
        blobs: "MIME type detection from metadata manifest",
        security: "Password challenge-response verification",
      },
    },
    {
        name: "UI Components",
        file: "components/FileIcon.tsx, Button.tsx",
        purpose: "Reusable interface elements for consistent design",
        icon: Blocks,
        complexity: "Low",
        linesOfCode: "~150 lines",
        dependencies: ["Lucide React", "Tailwind"],
        keyContributions: [
          "Provides consistent visual language",
          "Handles file type icons dynamically",
          "Standardized button states and variants",
        ],
        failureConsequences: [
          "Inconsistent UI appearance",
          "Accessibility issues",
        ],
        technicalDetails: {
          styling: "Tailwind CSS utility classes",
          icons: "Lucide React vector icons",
        },
      }
  ];

  const architectureLayers = [
    {
      name: "Frontend Layer",
      description: "React application with TypeScript and Tailwind CSS",
      icon: Monitor,
      components: [
        "React 19",
        "TypeScript",
        "Tailwind CSS",
        "Lucide React",
      ],
      responsibilities: [
        "User interface rendering",
        "State management",
        "Real-time progress visualization",
        "Responsive design",
      ],
      technologies: ["React 19", "Vite/Create React App structure", "Tailwind CSS"],
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
        "Establishing peer connections",
        "NAT traversal",
        "Connection health monitoring",
        "Data transmission",
      ],
      technologies: ["WebRTC", "PeerJS", "STUN", "ICE"],
    },
    {
      name: "Data Processing Layer",
      description: "Chunked binary data handling",
      icon: FileText,
      components: [
        "File API",
        "ArrayBuffers",
        "Blobs",
      ],
      responsibilities: [
        "File chunking",
        "Binary data reconstruction",
        "Memory management",
      ],
      technologies: ["File API", "ArrayBuffer", "Blob"],
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
        "End-to-end encryption",
        "Session locking",
        "Data privacy",
      ],
      technologies: ["DTLS 1.2", "AES-128", "SHA-256"],
    },
  ];

  const dataFlow = [
    {
      step: "Connection Establishment",
      description: "WebRTC peer connection setup",
      icon: Radio,
      details: [
        "Host generates short ID (e.g., 'X7k9P2')",
        "PeerJS connects to signaling server to await connections",
        "Receiver enters ID, signaling server exchanges SDP offers/answers",
        "ICE candidates gathered via Google/Twilio STUN servers",
        "Direct P2P DataChannel established via DTLS",
      ],
    },
    {
      step: "File Selection & Handshake",
      description: "Metadata exchange",
      icon: FileCode,
      details: [
        "Host selects files, Manifest sent to Receiver",
        "Manifest contains names, sizes, types, and lock status",
        "Receiver validates password if session is locked",
        "Receiver requests specific file ID",
      ],
    },
    {
      step: "Transfer Execution",
      description: "Chunked transmission",
      icon: ArrowLeftRight,
      details: [
        "Sender slices file into 16KB chunks",
        "Chunks sent over DataChannel",
        "Sender monitors bufferedAmount to avoid backpressure",
        "Receiver pushes chunks into array synchronously",
        "Progress calculated based on bytes transferred",
      ],
    },
    {
      step: "File Reconstruction",
      description: "Reassembly and Download",
      icon: Blocks,
      details: [
        "Receiver detects completion based on total size",
        "Chunks merged into single Blob",
        "Anchor tag created with URL.createObjectURL",
        "Browser triggers native download dialog",
        "Resources cleaned up (URL.revokeObjectURL)",
      ],
    },
  ];

  const performanceOptimizations = [
    {
        category: "Memory Management",
        icon: MemoryStick,
        optimizations: [
            "Streaming processing prevents loading full files into RAM",
            "Small chunk size (16KB) ensures low memory footprint",
            "Garbage collection friendly chunk handling",
        ]
    },
    {
        category: "Network Efficiency",
        icon: Wifi,
        optimizations: [
            "Backpressure handling prevents packet loss",
            "STUN server redundancy for reliable connections",
            "Binary serialization for minimal overhead",
        ]
    },
    {
        category: "UI Responsiveness",
        icon: Gauge,
        optimizations: [
            "Throttled state updates (100ms) for progress bars",
            "React.memo used for expensive components",
            "Efficient re-rendering strategies",
        ]
    }
  ];

  const securityFeatures = [
    {
        feature: "End-to-End Encryption",
        description: "DTLS 1.2 with AES-128",
        implementation: "WebRTC standard implementation",
        icon: Lock,
        benefits: ["No plaintext data transmission", "Forward secrecy"],
        technicalDetails: "DTLS 1.2, AES-128-GCM, ECDHE"
    },
    {
        feature: "No Server Storage",
        description: "Direct P2P streaming",
        implementation: "Data passes through RAM only",
        icon: CloudOff,
        benefits: ["Privacy by design", "No data retention"],
        technicalDetails: "Peer-to-Peer DataChannel"
    },
    {
        feature: "Session Security",
        description: "Password protection & Auto-expiry",
        implementation: "Application logic gates",
        icon: ShieldCheck,
        benefits: ["Access control", "Reduced attack surface"],
        technicalDetails: "Challenge-Response protocol"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-20 px-4 md:px-8">
       {/* Navigation */}
       <div className="mb-8">
            <Button onClick={onBack} variant="ghost" className="pl-0 hover:bg-transparent hover:text-indigo-500 gap-2">
                <ChevronRight className="rotate-180" size={20} /> Back to Application
            </Button>
       </div>

       {/* Header */}
       <div className="text-center space-y-4 mb-16 animate-slide-up">
            <div className="inline-block">
              <Badge variant="outline" className="px-3 py-1 mb-4 bg-slate-100 dark:bg-slate-800">
                <Code className="h-3 w-3 mr-1" />
                Technical Deep Dive v2.0
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
              Technical Architecture
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Comprehensive documentation of the peer-to-peer file sharing protocol. Exploring WebRTC implementation, chunking strategies, and security models.
            </p>
       </div>

       {/* Disclaimer */}
       <Alert className="mb-12 border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/10">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertTitle className="text-orange-800 dark:text-orange-400">Educational Project Architecture</AlertTitle>
            <AlertDescription className="text-orange-700 dark:text-orange-300">
                This documentation reflects the current codebase state. The system is designed for direct, ephemeral file transfer without intermediate storage.
            </AlertDescription>
       </Alert>

       {/* Stats Grid */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Core Modules</p>
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
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Lines of Code</p>
                            <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">~2.5K</p>
                        </div>
                        <FileCode className="h-8 w-8 text-violet-100 dark:text-violet-900" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Arch Layers</p>
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
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Security Specs</p>
                            <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">3</p>
                        </div>
                        <Shield className="h-8 w-8 text-rose-100 dark:text-rose-900" />
                    </div>
                </CardContent>
            </Card>
       </div>

       {/* Architecture Overview */}
       <Card className="mb-16">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Layers className="h-5 w-5 text-indigo-500" />
                    System Architecture Layers
                </CardTitle>
                <CardDescription>
                    Modular architecture designed for separation of concerns between UI, Networking, and Data handling.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {architectureLayers.map((layer, i) => {
                        const Icon = layer.icon;
                        return (
                            <div key={i} className="space-y-4 p-4 border rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <Icon className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{layer.name}</h3>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1">
                                        {layer.components.map((c, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-[10px]">{c}</Badge>
                                        ))}
                                    </div>
                                    <ul className="space-y-1 mt-2">
                                        {layer.responsibilities.map((r, idx) => (
                                            <li key={idx} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                                                <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                {r}
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

       {/* Components Deep Dive Tabs */}
       <Card className="mb-16">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5 text-indigo-500" />
                    Core Components Deep Dive
                </CardTitle>
                <CardDescription>
                    Detailed analysis of the primary modules driving the application.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Custom Tabs */}
                <div className="w-full">
                    <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 mb-6">
                        {coreComponents.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i.toString())}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
                                    activeTab === i.toString() 
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" 
                                        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>

                    {coreComponents.map((c, i) => (
                        <div key={i} className={cn("space-y-6 animate-fade-in", activeTab === i.toString() ? "block" : "hidden")}>
                             <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                        <c.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{c.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Code className="h-3 w-3 text-slate-400" />
                                            <p className="text-sm text-slate-500 font-mono">{c.file}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline">{c.complexity}</Badge>
                                    <Badge variant="secondary">{c.linesOfCode}</Badge>
                                </div>
                             </div>

                             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-l-4 border-indigo-500">
                                <h4 className="font-semibold mb-1 text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-sm">
                                    <Info className="h-4 w-4" /> Purpose
                                </h4>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.purpose}</p>
                             </div>

                             <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4" /> Key Contributions
                                    </h4>
                                    <ul className="space-y-2">
                                        {c.keyContributions.map((kc, kci) => (
                                            <li key={kci} className="text-sm flex items-start gap-2 text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                                                {kc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 text-sm">
                                        <XCircle className="h-4 w-4" /> Failure Consequences
                                    </h4>
                                    <ul className="space-y-2">
                                        {c.failureConsequences.map((fc, fci) => (
                                            <li key={fci} className="text-sm flex items-start gap-2 text-slate-600 dark:text-slate-300 bg-rose-50 dark:bg-rose-900/10 p-2 rounded">
                                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                                                {fc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             </div>
                             
                             <Separator />
                             
                             <div>
                                <h4 className="font-semibold mb-4 text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                                    <Binary className="h-4 w-4" /> Implementation Details
                                </h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {Object.entries(c.technicalDetails).map(([k, v], ki) => (
                                        <div key={ki} className="p-3 border rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                                            <span className="text-xs font-bold uppercase text-slate-400 mb-1 block">{k}</span>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{v}</span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </CardContent>
       </Card>

       {/* Data Flow */}
       <Card className="mb-16">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Workflow className="h-5 w-5 text-indigo-500" />
                    Data Flow Sequence
                </CardTitle>
                <CardDescription>
                    Step-by-step lifecycle of a P2P transfer session.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {dataFlow.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={i} className="relative flex gap-6">
                                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white dark:bg-slate-900 shadow-sm">
                                    <Icon className="h-5 w-5 text-indigo-500" />
                                </div>
                                <div className="space-y-2 pt-1">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{step.step}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
                                    <div className="grid gap-2 pt-2">
                                        {step.details.map((d, di) => (
                                            <div key={di} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 p-2 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-100 dark:border-slate-800/50">
                                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                                                {d}
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

       {/* Security & Performance Grid */}
       <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" /> Performance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {performanceOptimizations.map((po, i) => (
                        <div key={i}>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <po.icon className="h-4 w-4 text-slate-400" /> {po.category}
                            </h4>
                            <ul className="space-y-2">
                                {po.optimizations.map((opt, oi) => (
                                    <li key={oi} className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                                        <span className="text-amber-500">•</span> {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-500" /> Security
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {securityFeatures.map((sf, i) => (
                        <div key={i} className="p-3 border rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                    <sf.icon className="h-4 w-4 text-emerald-500" /> {sf.feature}
                                </h4>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{sf.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {sf.benefits.map((b, bi) => (
                                    <Badge key={bi} variant="outline" className="text-[10px] bg-white dark:bg-slate-800">{b}</Badge>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
       </div>

    </div>
  );
};
