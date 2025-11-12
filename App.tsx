

import React, { useState, useRef, FormEvent, ChangeEvent, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    MiniMap,
    Controls,
    Background,
    Handle,
    Position,
    ReactFlowProvider,
    // Fix: Import BackgroundVariant for use in the Background component.
    BackgroundVariant,
} from 'reactflow';


// --- Reusable SVG Icons ---

const CopyIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625a2.625 2.625 0 11-5.25 0v-2.625m0 0V15.75m0 0v-2.625A2.625 2.625 0 0112 10.5h.375a2.625 2.625 0 012.625 2.625v2.625" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);

const GuideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);

const DocsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const FeedbackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const SupportIcon = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// --- NEW ICONS FOR SUPPORT MODAL ---

const BugReportIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M19 8h-1.81A5.002 5.002 0 0 0 13 3.19V2h-2v1.19A5.002 5.002 0 0 0 6.81 8H5v2h1.16a5.002 5.002 0 0 0 0 8H5v2h1.81a5.002 5.002 0 0 0 4.19 4.81V22h2v-1.19a5.002 5.002 0 0 0 4.19-4.81H19v-2h-1.16a5.002 5.002 0 0 0 0-8H19V8zm-7 10c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
);

const LightbulbIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity=".3"/><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8 3.59 8-8-3.59-8-8-8zm-1 15h2v-2h-2v2zm0-4h2V9h-2v6z"/></svg>
);

const UploadFileIcon = ({ className = "w-10 h-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M9.4 16.6 4.8 12l1.4-1.4 3.2 3.2 7.2-7.2 1.4 1.4-8.6 8.6z" opacity=".3"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4h.71C7.37 8.69 9.5 7 12 7c2.76 0 5 2.24 5 5v1h2c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/></svg>
);

const CheckCircleIcon = ({ className = "w-10 h-10" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
);

// --- NEW ICONS FOR SIDEBAR ---
const HomeIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const KeyIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);
const DashboardIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const UsersIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const DocumentIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const WorkflowIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="14" width="7" height="7" rx="2" ry="2"></rect><rect x="14" y="3" width="7" height="7" rx="2" ry="2"></rect><path d="M17.5 10.5h-4a2 2 0 0 0-2 2v4"></path></svg>
);
const WorkflowEditorIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"></rect><path d="M7 11v4a2 2 0 0 0 2 2h4"></path><rect x="13" y="13" width="8" height="8" rx="2"></rect></svg>
);
const TypesIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);
const QuestionsIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const QuestionnairesIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);
const ToolsIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
);
const PromptsIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>
);

// --- NEW ICONS for Workflow Management ---
const PlusIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
const SearchIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const SortIcon = ({ className = "w-4 h-4" }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
);
const TeamIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);
const MoreIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
    </svg>
);
// --- NEW ICONS for Workflow Builder ---
const ChevronLeftIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const SaveIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;
const SaveAltIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V8.25L15.75 3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a3.75 3.75 0 003.75-3.75H8.25A3.75 3.75 0 0012 18.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.375 9.75h-6" />
    </svg>
);
const DownloadIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const UploadIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l4-4m-4 4V4" /></svg>;
const EyeOffIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-2.201-4.209a3 3 0 00-4.243-4.243" /></svg>;
const PlayIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const ScanIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5-1.5l-2.828 2.828a4 4 0 01-5.657-5.657l2.829-2.828a4 4 0 015.656 0l2.828 2.828a4 4 0 010 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LinkIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const FileTextIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const MailIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PaperAirplaneIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
const FlagIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const SettingsIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const XIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const EditIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>


// --- NEW ICONS FOR AUTOMATION FLOW PAGE ---
const OcrIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);
const DatabaseIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7m0 0c0 2.21-3.582 4-8 4S4 9.21 4 7m16 0a8 8 0 00-16 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 11a8 8 0 0116 0" />
    </svg>
);
const DocumentPlusIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
);


// --- Faithfull reimplementation of the provided HTML/JS modal ---
const SupportModal = ({ isOpen, onClose }) => {
    const webhookUrl = 'https://n8n-woopi.dev.sophie.chat/webhook/b124d9d4-7ab9-4c90-a028-4eedba206cfd';

    const [ticketType, setTicketType] = useState('bug');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [browser, setBrowser] = useState('');
    const [os, setOs] = useState('');
    const [priority, setPriority] = useState('media');
    const [files, setFiles] = useState<FileList | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState({ status: 'idle', data: null });

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleReset = () => {
        setTicketType('bug');
        setTitle('');
        setDescription('');
        setBrowser('');
        setOs('');
        setPriority('media');
        setFiles(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsSubmitting(false);
        setSubmissionResult({ status: 'idle', data: null });
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleRemoveFiles = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFiles(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (title.trim() === '') {
            alert('O campo Título é obrigatório.');
            return;
        }

        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('request-type', ticketType);
        formData.append('titulo', title);
        formData.append('descricao', description);
        formData.append('prioridade', priority);

        if (ticketType === 'bug') {
            formData.append('navegador', browser);
            formData.append('sistema_operacional', os);
        }
        
        const hasAttachment = files && files.length > 0;
        formData.append('possui_anexo', String(hasAttachment));

        if (hasAttachment) {
            for (let i = 0; i < files.length; i++) {
                formData.append('anexos', files[i]);
            }
        }
        
        try {
            const response = await fetch(webhookUrl, { method: 'POST', body: formData });
            const responseData = await response.json();
            if (response.ok) {
                setSubmissionResult({ status: 'success', data: responseData });
            } else {
                alert(`Erro ao enviar: ${responseData.message || 'Ocorreu um erro desconhecido.'}`);
                setSubmissionResult({ status: 'error', data: responseData });
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Ocorreu um erro de rede. Verifique sua conexão e tente novamente.');
            setSubmissionResult({ status: 'error', data: null });
        } finally {
            setIsSubmitting(false);
        }
    };

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
    const fileCount = files?.length || 0;
    const hasFiles = fileCount > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 font-sans" onClick={handleClose} aria-modal="true" role="dialog">
            <div className="bg-brand-secondary rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={stopPropagation}>
                {submissionResult.status !== 'success' ? (
                     <div className="p-8">
                        <header className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-brand-text-primary">Painel de Suporte</h2>
                            <p className="text-brand-text-secondary mt-1">Precisa de ajuda? Abra um ticket para nossa equipe com bugs ou sugestões de melhoria.</p>
                        </header>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-6">
                                <label className="block font-semibold mb-2 text-sm">1. Qual o tipo de solicitação?</label>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <label htmlFor="type-bug" className={`flex-1 p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${ticketType === 'bug' ? 'bg-brand-accent-light border-brand-accent text-brand-accent' : 'bg-white border-brand-input-border text-brand-text-primary hover:border-gray-400'}`}>
                                        <input type="radio" id="type-bug" name="request-type" value="bug" checked={ticketType === 'bug'} onChange={() => setTicketType('bug')} className="hidden" />
                                        <BugReportIcon />
                                        <span className="font-medium">Relatar um Bug</span>
                                    </label>
                                    <label htmlFor="type-suggestion" className={`flex-1 p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${ticketType === 'suggestion' ? 'bg-brand-accent-light border-brand-accent text-brand-accent' : 'bg-white border-brand-input-border text-brand-text-primary hover:border-gray-400'}`}>
                                        <input type="radio" id="type-suggestion" name="request-type" value="suggestion" checked={ticketType === 'suggestion'} onChange={() => setTicketType('suggestion')} className="hidden" />
                                        <LightbulbIcon />
                                        <span className="font-medium">Sugestão de Melhoria</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="title" className="block font-semibold mb-2 text-sm">2. Dê um título para sua solicitação</label>
                                <input type="text" id="title" name="titulo" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Erro ao salvar documento" required className="w-full p-3 border border-brand-input-border rounded-lg bg-brand-input-bg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent" />
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="description" className="block font-semibold mb-2 text-sm">3. Descreva em detalhes</label>
                                <textarea id="description" name="descricao" value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Seja o mais detalhado possível..." required className="w-full p-3 border border-brand-input-border rounded-lg bg-brand-input-bg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"></textarea>
                            </div>

                            {ticketType === 'bug' && (
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="browser" className="block font-semibold mb-2 text-sm">Navegador e Versão (Opcional)</label>
                                        <input type="text" id="browser" name="navegador" value={browser} onChange={e => setBrowser(e.target.value)} placeholder="Ex: Chrome 125.0.0" className="w-full p-3 border border-brand-input-border rounded-lg bg-brand-input-bg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent" />
                                    </div>
                                    <div>
                                        <label htmlFor="os" className="block font-semibold mb-2 text-sm">Sistema Operacional (Opcional)</label>
                                        <input type="text" id="os" name="sistema_operacional" value={os} onChange={e => setOs(e.target.value)} placeholder="Ex: Windows 11" className="w-full p-3 border border-brand-input-border rounded-lg bg-brand-input-bg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent" />
                                    </div>
                                </div>
                            )}

                             <div className="grid md:grid-cols-2 gap-6 mb-6 items-start">
                                <div>
                                    <label htmlFor="priority" className="block font-semibold mb-2 text-sm">4. Qual a prioridade?</label>
                                    <select id="priority" name="prioridade" value={priority} onChange={e => setPriority(e.target.value)} required className="w-full p-3 border border-brand-input-border rounded-lg bg-white focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent appearance-none">
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold mb-2 text-sm">5. Anexos (Opcional)</label>
                                    <div className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${hasFiles ? 'border-solid border-brand-success bg-green-50' : 'border-brand-input-border hover:border-brand-accent hover:bg-gray-50'}`} onClick={() => fileInputRef.current?.click()}>
                                        {hasFiles ? <CheckCircleIcon className="mx-auto h-10 w-10 text-brand-success" /> : <UploadFileIcon className="mx-auto h-10 w-10 text-brand-accent" />}
                                        <p className="mt-2 text-sm text-brand-text-secondary">
                                            {hasFiles ? `${fileCount} arquivo(s) selecionado(s)` : <><span className="font-semibold text-brand-accent">Clique para enviar</span> ou arraste e solte</>}
                                        </p>
                                        {hasFiles && <span onClick={handleRemoveFiles} className="mt-2 inline-block text-xs text-brand-text-secondary underline hover:text-brand-text-primary">Remover</span>}
                                        <input type="file" id="attachments" name="anexos" ref={fileInputRef} onChange={handleFileChange} hidden multiple />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-brand-input-border">
                                <button type="button" onClick={handleClose} className="px-6 py-2.5 font-semibold rounded-lg bg-gray-200 text-brand-text-primary hover:bg-gray-300 transition-colors">Cancelar</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 font-semibold rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <CheckCircleIcon className="w-16 h-16 text-brand-success" />
                        <h3 className="text-2xl font-bold mt-4">Ticket Enviado com Sucesso!</h3>
                        <p id="success-message-placeholder" className="mt-2 text-brand-text-secondary">{submissionResult.data?.message || 'Nossa equipe já recebeu sua solicitação e entrará em contato em breve.'}</p>
                        <div className="mt-6 bg-gray-100 p-3 rounded-lg">
                            Seu Protocolo: <a href={submissionResult.data?.ticketUrl || '#'} id="ticket-link-placeholder" target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-brand-accent hover:underline">{submissionResult.data?.ticketId || 'N/A'}</a>
                        </div>
                        <button onClick={handleReset} className="mt-8 px-6 py-2.5 font-semibold rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors">
                            Abrir Novo Ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ApiKeyCard = () => {
    const apiKey = "sk-AbC123XyZ789.................uvW456";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("sk-AbC123XyZ789mnopqrstuvW456fakekey");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-brand-text-primary">Sua Chave de Acesso para Modelos de IA</h3>
            <p className="text-sm text-brand-text-secondary mt-1">Utilize esta chave para integrar nossos modelos de IA em suas aplicações.</p>
            <div className="mt-4 flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                <span className="font-mono text-sm text-brand-text-secondary flex-1 truncate">{apiKey}</span>
                <button onClick={handleCopy} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                    copied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-brand-accent hover:bg-blue-200'
                }`}>
                    {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
             <div className="mt-4 text-xs text-brand-text-secondary p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p><strong>Cota Padrão:</strong> 50.000 tokens/mês.</p>
                <p className="mt-1"><strong>Importante:</strong> Mantenha sua chave de API segura e não a exponha publicamente.</p>
            </div>
        </div>
    );
};


const OnboardingItem = ({ icon, title, description, linkText, href }) => (
    <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
        {icon}
        <h4 className="font-semibold text-brand-text-primary">{title}</h4>
        <p className="text-sm text-brand-text-secondary mt-1 mb-4 flex-grow">{description}</p>
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-accent hover:text-brand-accent-hover">
            {linkText} &rarr;
        </a>
    </div>
);

// --- Sidebar Component ---
const Sidebar = ({ activeItem, setActiveItem }) => {
    const navItems = [
        { name: 'Home', icon: <HomeIcon />, color: 'text-sky-500' },
        { name: 'Gerenciar Chaves', icon: <KeyIcon />, color: 'text-slate-500' },
        { name: 'Dashboard', icon: <DashboardIcon />, color: 'text-rose-500' },
        { name: 'Gestão de usuários', icon: <UsersIcon />, color: 'text-orange-500' },
        { name: 'Documentos', icon: <DocumentIcon />, color: 'text-blue-500' },
        { name: 'Workflow', icon: <WorkflowIcon />, color: 'text-purple-500' },
        { name: 'Gestão de Workflows', icon: <WorkflowEditorIcon />, color: 'text-teal-500' },
        { name: 'Fluxo de automação exemplo', icon: <WorkflowIcon />, color: 'text-cyan-500' },
        { name: 'Tipos', icon: <TypesIcon />, color: 'text-yellow-500' },
        { name: 'Perguntas', icon: <QuestionsIcon />, color: 'text-green-500' },
        { name: 'Questionários', icon: <QuestionnairesIcon />, color: 'text-indigo-500' },
        { name: 'Ferramentas', icon: <ToolsIcon />, color: 'text-amber-500' },
        { name: 'Prompts', icon: <PromptsIcon />, color: 'text-purple-700' },
    ];

    return (
        <aside className="w-64 bg-brand-secondary p-4 space-y-2 border-r border-gray-200 shadow-sm shrink-0">
            <nav>
                <ul>
                    {navItems.map(item => {
                        const isActive = activeItem === item.name;
                        return (
                            <li key={item.name}>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setActiveItem(item.name); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors text-sm ${
                                        isActive
                                            ? 'bg-brand-accent-light text-brand-accent'
                                            : 'text-brand-text-secondary hover:bg-gray-100'
                                    }`}
                                >
                                    <span className={!isActive ? item.color : ''}>
                                      {React.cloneElement(item.icon, { className: 'w-6 h-6 shrink-0' })}
                                    </span>
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

const WelcomeContent = () => (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <main className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <header className="text-center">
                <div className="inline-block bg-blue-100 p-2 rounded-lg mb-2">
                     <svg className="w-8 h-8 text-brand-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.23 18.02c-1.92.7-3.46.48-4.81-.86-2.2-2.2-2.2-5.78 0-7.98 2.2-2.2 5.78-2.2 7.98 0 .33.33.59.7.79 1.1M11.77 5.98c1.92-.7 3.46-.48 4.81.86 2.2 2.2 2.2 5.78 0 7.98-2.2 2.2-5.78 2.2-7.98 0-.33-.33-.59-.7-.79-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 22v-2m0-16V2m10 10h-2M4 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary">Bem-vindo ao AI HUB, Woopi AI!</h1>
                <p className="text-brand-text-secondary mt-2 max-w-2xl mx-auto">Sua jornada para automatizar e otimizar processos com inteligência artificial começa agora.</p>
            </header>

            {/* Purchase Summary */}
            <div className="bg-brand-secondary p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                 <p className="text-sm text-brand-text-secondary">Você adquiriu o</p>
                 <p className="text-2xl font-bold text-brand-accent my-1">Plano Enterprise</p>
                 <p className="text-xs text-brand-text-secondary">Agradecemos por escolher a nossa plataforma!</p>
            </div>

            {/* API Key */}
            <ApiKeyCard />

            {/* Onboarding Section */}
            <div>
                <h2 className="text-2xl font-bold text-brand-text-primary text-center mb-6">Trilha de Iniciação Rápida</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <OnboardingItem 
                        icon={<VideoIcon />}
                        title="Conheça a Plataforma"
                        description="Assista a um tour guiado de 5 minutos sobre as principais funcionalidades."
                        linkText="Ver vídeo"
                        href="#"
                    />
                     <OnboardingItem 
                        icon={<GuideIcon />}
                        title="Seu Primeiro Workflow"
                        description="Siga nosso guia passo-a-passo para criar sua primeira automação em minutos."
                        linkText="Iniciar guia"
                        href="#"
                    />
                     <OnboardingItem 
                        icon={<DocsIcon />}
                        title="Explore a Documentação"
                        description="Consulte nossa documentação completa para explorar todo o potencial da AI HUB."
                        linkText="Acessar docs"
                        href="#"
                    />
                </div>
            </div>
        </main>
    </div>
);

// --- NEW API Key Management View ---
const ApiKeysView = ({ keys, onAdd, onDelete }) => {
    const [newKeyName, setNewKeyName] = useState('');
    const [selectedKeys, setSelectedKeys] = useState(new Set<number>());
    const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);
    const indeterminateCheckboxRef = useRef<HTMLInputElement>(null);

    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allKeyIds = new Set(keys.map(k => k.id));
            setSelectedKeys(allKeyIds);
        } else {
            // Fix: Explicitly type new Set() to avoid assigning Set<unknown> to Set<number>.
            setSelectedKeys(new Set<number>());
        }
    };

    const handleSelect = (keyId: number) => {
        const newSelection = new Set(selectedKeys);
        if (newSelection.has(keyId)) {
            newSelection.delete(keyId);
        } else {
            newSelection.add(keyId);
        }
        setSelectedKeys(newSelection);
    };

    const handleAddKey = (e: FormEvent) => {
        e.preventDefault();
        if (newKeyName.trim()) {
            onAdd(newKeyName.trim());
            setNewKeyName('');
        }
    };

    const handleDeleteSelected = () => {
        onDelete(Array.from(selectedKeys));
        setSelectedKeys(new Set<number>());
    };

    const handleCopy = (key: { id: number, value: string }) => {
        navigator.clipboard.writeText(key.value);
        setCopiedKeyId(key.id);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };

    useEffect(() => {
        const someSelected = selectedKeys.size > 0 && selectedKeys.size < keys.length;
        if (indeterminateCheckboxRef.current) {
          indeterminateCheckboxRef.current.indeterminate = someSelected;
        }
    }, [selectedKeys, keys.length]);


    const allSelected = selectedKeys.size > 0 && selectedKeys.size === keys.length;
    
    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <main className="max-w-5xl mx-auto space-y-6 bg-brand-secondary p-8 rounded-xl border border-gray-200 shadow-sm">
                <header>
                    <h2 className="text-2xl font-bold text-brand-text-primary">Lista de keys relacionados à sua assinatura</h2>
                    <p className="text-brand-text-secondary mt-1">Crie e gerencie chaves para integrar suas aplicações com nossos microsserviços.</p>
                </header>

                <form onSubmit={handleAddKey} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Key name"
                        className="flex-grow p-2 border border-brand-input-border rounded-md bg-brand-input-bg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"
                    />
                    <button type="submit" className="px-6 py-2 font-semibold rounded-md bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors disabled:bg-gray-400">
                        Adicionar
                    </button>
                </form>

                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                         <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                            checked={allSelected}
                            ref={indeterminateCheckboxRef}
                            onChange={handleSelectAll}
                        />
                        <label className="text-sm text-brand-text-primary font-medium">Selecionar tudo</label>
                    </div>
                    <button 
                        onClick={handleDeleteSelected} 
                        disabled={selectedKeys.size === 0}
                        className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                        Remover selecionado(s)
                    </button>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4 w-12">
                                    <span className="sr-only">Select</span>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
                                    Nome
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
                                    Valor
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-brand-text-secondary uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {keys.map(key => (
                                <tr key={key.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                                            checked={selectedKeys.has(key.id)}
                                            onChange={() => handleSelect(key.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text-primary">{key.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary font-mono">
                                        {`${key.value.substring(0, 8)}....................${key.value.substring(key.value.length - 4)}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleCopy(key)} className="text-brand-accent hover:text-brand-accent-hover" aria-label={`Copiar chave ${key.name}`}>
                                            {copiedKeyId === key.id ? <CheckIcon className="w-5 h-5 text-brand-success" /> : <CopyIcon className="w-5 h-5" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="flex justify-between items-center text-sm mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2">
                        <a href="#" className="text-brand-text-secondary hover:underline">Link para o Swagger</a>
                        <div className="relative group">
                            <SupportIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                            <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-center">
                                Documentação da API para integrações.
                            </div>
                        </div>
                    </div>
                    <p className="text-red-500 font-semibold">Não compartilhe sua chave em locais públicos ou não seguros!</p>
                </div>
            </main>
        </div>
    );
};

// --- NEW Workflow Management View ---
const WorkflowManagementView = ({ onNewWorkflow, onEditWorkflow }) => {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const workflows = [
      { id: 2, name: 'Análise de Documentos Fiscais', teams: ['Financeiro', 'Contabilidade'] },
      { id: 1, name: 'Aprovação de Contratos', teams: ['Jurídico', 'Financeiro'] },
      { id: 4, name: 'Processamento de Relatórios', teams: ['Marketing', 'Desenvolvimento'] },
      { id: 3, name: 'Revisão de Políticas Internas', teams: ['RH', 'Jurídico'] },
      { id: 5, name: 'Validação de Certificados', teams: ['RH', 'Qualidade'] },
    ];

    const handleToggleMenu = (id: number) => {
        setOpenMenuId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-text-primary">Gestão de Workflows</h1>
                        <p className="text-brand-text-secondary mt-1">Gerencie e configure workflows de processamento de documentos</p>
                    </div>
                    <button onClick={onNewWorkflow} className="bg-brand-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-brand-accent-hover transition-colors">
                        <PlusIcon className="w-5 h-5" />
                        <span>Novo Workflow</span>
                    </button>
                </header>

                <div className="relative">
                    <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Buscar por nome do workflow ou times..."
                        className="w-full p-3 pl-12 border border-brand-input-border rounded-lg bg-brand-secondary focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"
                    />
                </div>

                <div className="bg-brand-secondary rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="font-semibold text-brand-text-primary">Workflows ({workflows.length})</h2>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-bold text-brand-text-secondary uppercase tracking-wider bg-gray-50">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-4 flex items-center gap-1 cursor-pointer">
                            Nome do Workflow <SortIcon />
                        </div>
                        <div className="col-span-6 flex items-center gap-1 cursor-pointer">
                            Times Associados <SortIcon />
                        </div>
                        <div className="col-span-1 text-right">Ações</div>
                    </div>
                    
                    {/* Table Body */}
                    <div>
                        {workflows.map(wf => (
                            <div key={wf.id} className="grid grid-cols-12 gap-4 px-4 py-4 border-t border-gray-200 items-center text-sm">
                                <div className="col-span-1 text-brand-text-secondary">{wf.id}</div>
                                <div className="col-span-4 font-medium text-brand-text-primary flex items-center">
                                    {wf.name}
                                </div>
                                <div className="col-span-6 flex flex-wrap gap-2">
                                    {wf.teams.map(team => (
                                        <span key={team} className="flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-md border border-gray-200">
                                            <TeamIcon className="w-4 h-4 text-gray-500" />
                                            {team}
                                        </span>
                                    ))}
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <div className="relative">
                                        <button onClick={() => handleToggleMenu(wf.id)} className="text-gray-500 hover:text-brand-text-primary p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
                                            <MoreIcon />
                                        </button>
                                        {openMenuId === wf.id && (
                                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                <div className="py-1">
                                                    <a href="#" onClick={(e) => { e.preventDefault(); onEditWorkflow(wf.id); setOpenMenuId(null); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Editar</a>
                                                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Deletar</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};


// --- NEW Component for Step 1 Content ---
const Step1Content = () => {
    const teams = [
        'Jurídico', 'Financeiro', 'RH', 'Marketing',
        'Desenvolvimento', 'Contabilidade', 'Qualidade'
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-brand-text-primary">Informações Básicas</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="workflow-name" className="block text-sm font-medium text-brand-text-secondary mb-1">
                        Nome do Workflow
                    </label>
                    <input
                        type="text"
                        id="workflow-name"
                        placeholder="Ex: Aprovação de Contratos"
                        className="w-full p-3 border border-brand-input-border rounded-lg bg-brand-input-bg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-2">
                        Times Associados
                    </label>
                    <div className="p-4 border border-brand-input-border rounded-lg">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
                            {teams.map(team => (
                                <div key={team} className="flex items-center">
                                    <input
                                        id={`team-${team}`}
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                                    />
                                    <label htmlFor={`team-${team}`} className="ml-3 text-sm text-brand-text-primary">
                                        {team}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- NEW Component for Step 2 Content ---
const Step2Content = ({ steps, onStepsChange }) => {
    const profiles = ['Advogado Sênior', 'Gerente Financeiro', 'Analista Jurídico', 'Analista Financeiro', 'Diretor Jurídico', 'Diretor Financeiro', 'Qualidade'];

    const handleAddStep = () => {
        const newStepNumbers = steps
            .map(s => s.name)
            .filter(name => name.startsWith('Nova Etapa'))
            .map(name => parseInt(name.replace('Nova Etapa', '').trim(), 10))
            .filter(num => !isNaN(num));
        const nextNum = newStepNumbers.length > 0 ? Math.max(...newStepNumbers) + 1 : 1;

        const newStep = { id: Date.now(), name: `Nova Etapa ${nextNum}`, profile: '' };
        onStepsChange([...steps, newStep]);
    };

    const handleRemoveStep = (idToRemove: number) => {
        onStepsChange(steps.filter(step => step.id !== idToRemove));
    };

    const handleStepChange = (id: number, field: 'name' | 'profile', value: string) => {
        onStepsChange(steps.map(step =>
            step.id === id ? { ...step, [field]: value } : step
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-brand-text-primary">Etapas do Workflow</h2>
                <button onClick={handleAddStep} className="bg-brand-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-brand-accent-hover transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Nova Etapa</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4 flex flex-col">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3 flex-grow min-w-0">
                                <span className="flex items-center justify-center w-6 h-6 bg-brand-accent text-white rounded-full font-bold text-sm flex-shrink-0">
                                    {index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={step.name}
                                    onChange={(e) => handleStepChange(step.id, 'name', e.target.value)}
                                    placeholder="Nome da Etapa"
                                    className="font-semibold text-brand-text-primary bg-transparent focus:outline-none focus:ring-0 border-0 p-0 w-full"
                                    aria-label="Nome da Etapa"
                                />
                            </div>
                            <button onClick={() => handleRemoveStep(step.id)} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-grow">
                            <label htmlFor={`step-profile-${step.id}`} className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                RESPONSÁVEL
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <TeamIcon className="w-5 h-5 text-gray-400" />
                                </span>
                                <select
                                    id={`step-profile-${step.id}`}
                                    value={step.profile}
                                    onChange={(e) => handleStepChange(step.id, 'profile', e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-brand-input-border rounded-md bg-white focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent appearance-none"
                                >
                                    <option value="" disabled>Selecione um perfil</option>
                                    {profiles.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div
                    onClick={handleAddStep}
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 min-h-[190px] text-center cursor-pointer hover:bg-gray-50 hover:border-brand-accent transition-colors group"
                >
                    <div className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center mb-3 group-hover:border-brand-accent">
                        <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-brand-accent" />
                    </div>
                    <p className="font-semibold text-brand-text-primary">Adicionar Etapa</p>
                    <p className="text-sm text-brand-text-secondary">Clique para criar uma nova etapa</p>
                </div>
            </div>
        </div>
    );
};


// --- NEW Component for Step 3 Content ---
const Step3Content = ({ steps, onAddFlow }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-text-primary">Adicionar Fluxo de Ferramentas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col min-h-[220px]">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 bg-brand-accent text-white rounded-full font-bold text-sm flex-shrink-0">
                                {index + 1}
                            </span>
                            <p className="font-semibold text-brand-text-primary">{step.name}</p>
                        </div>
                        
                        <div className="my-4 border-t border-gray-200"></div>

                        <div className="flex-grow">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                RESPONSÁVEL
                            </label>
                            <div className="relative mt-1">
                                <div className="w-full flex items-center gap-3 px-3 py-2 border border-brand-input-border rounded-md bg-white text-brand-text-primary">
                                    <TeamIcon className="w-5 h-5 text-gray-400" />
                                    <span>{step.profile || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => onAddFlow(step.id)} 
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-white border border-brand-input-border text-brand-text-secondary hover:bg-gray-100 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Adicionar Fluxo de Ferramentas</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- NEW Workflow Editor View ---
const WorkflowEditorView = ({ onBack, onAddFlow }) => {
    const [currentStep, setCurrentStep] = useState(3);
    const [workflowSteps, setWorkflowSteps] = useState([
        { id: 1, name: 'Análise Jurídica', profile: 'Advogado Sênior' },
        { id: 2, name: 'Aprovação Financeira', profile: 'Gerente Financeiro' }
    ]);
    const steps = [
        { id: 1, title: 'Nome e Associações' },
        { id: 2, title: 'Etapas' },
        { id: 3, title: 'Ferramentas' },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-text-primary">Criar / Editar Workflow</h1>
                        <p className="text-brand-text-secondary mt-1">Siga as etapas para configurar seu workflow.</p>
                    </div>
                    <button onClick={onBack} className="bg-gray-200 text-brand-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                        Voltar para a Lista
                    </button>
                </header>

                <div className="bg-brand-secondary p-8 rounded-lg border border-gray-200 shadow-sm">
                    {/* Stepper */}
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => setCurrentStep(1)}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${currentStep === 1 ? 'bg-brand-accent text-white' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
                        >
                            Nome e Associações
                        </button>
                        <span className="text-gray-400 font-semibold">&gt;</span>
                        <button
                            onClick={() => setCurrentStep(2)}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${currentStep === 2 ? 'bg-brand-accent text-white' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
                        >
                            Etapas
                        </button>
                        <span className="text-gray-400 font-semibold">&gt;</span>
                        <button
                            onClick={() => setCurrentStep(3)}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${currentStep === 3 ? 'bg-brand-accent text-white' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
                        >
                            Ferramentas
                        </button>
                    </div>


                    {/* Step content */}
                    <div className="mt-8 border-t pt-8 min-h-[400px]">
                        {currentStep === 1 && <Step1Content />}
                        {currentStep === 2 && <Step2Content steps={workflowSteps} onStepsChange={setWorkflowSteps} />}
                        {currentStep === 3 && <Step3Content steps={workflowSteps} onAddFlow={onAddFlow} />}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                         <button 
                            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                            disabled={currentStep === 1}
                            className="px-6 py-2 font-semibold rounded-lg bg-gray-200 text-brand-text-primary hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
                             <ChevronLeftIcon className="w-4 h-4" />
                            Anterior
                        </button>
                        {currentStep < steps.length ? (
                            <button 
                                onClick={() => setCurrentStep(s => Math.min(steps.length, s + 1))}
                                className="px-6 py-2 font-semibold rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors flex items-center gap-2">
                                Próximo
                                <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                            </button>
                        ) : (
                             <button 
                                className="px-6 py-2 font-semibold rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors flex items-center gap-2">
                                <SaveAltIcon className="w-5 h-5" />
                                Salvar Alterações
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- NEW WORKFLOW BUILDER COMPONENTS ---
const ConfigSidePanel = ({ node, onClose, onUpdateNode }) => {
    if (!node) return null;

    const prompts = [
        "Resumidor",
        "Transformador de história de usuário",
        "Gerador de conteúdo jornalístico",
        "Explicando detalhes principais",
    ];

    return (
        <div className="absolute top-0 right-0 h-full w-96 bg-brand-secondary shadow-2xl z-20 border-l border-gray-200 flex flex-col transition-all duration-300">
            <header className="p-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-semibold text-brand-text-primary">Configurar Ferramenta</h3>
                <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700">
                    <XIcon className="w-5 h-5" />
                </button>
            </header>
            <div className="p-6 flex-grow overflow-y-auto">
                <div className="mb-6">
                    <label className="text-sm font-medium text-brand-text-secondary">{node.data.label}</label>
                </div>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="prompt-search" className="block text-sm font-medium text-brand-text-primary mb-2">Prompts cadastrados</label>
                        <div className="relative">
                           <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input id="prompt-search" type="text" placeholder="Buscar..." className="w-full p-2 pl-10 border border-brand-input-border rounded-lg bg-brand-input-bg"/>
                        </div>
                        <div className="mt-2 space-y-1 max-h-40 overflow-y-auto p-1">
                            {prompts.map(p => <div key={p} className="p-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer">{p}</div>)}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="prompt-write" className="block text-sm font-medium text-brand-text-primary mb-2">Escrever Prompt</label>
                        <textarea id="prompt-write" rows={6} className="w-full p-2 border border-brand-input-border rounded-lg bg-brand-input-bg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToolNode = ({ data }) => {
    return (
        <div className="bg-white border-2 border-brand-accent rounded-lg shadow-md p-3 w-56 font-sans">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {data.icon}
                    <span className="font-semibold text-sm text-brand-text-primary">{data.label}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => data.onSettingsClick(data.id)} className="text-gray-400 hover:text-brand-accent">
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => data.onDeleteClick(data.id)} className="text-gray-400 hover:text-red-600">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <Handle type="target" position={Position.Left} className="!bg-brand-accent !w-3 !h-3" />
            <Handle type="source" position={Position.Right} className="!bg-brand-accent !w-3 !h-3" />
        </div>
    );
};

const WorkflowBuilderViewContent = ({ onBack }) => {
    const [selectedNode, setSelectedNode] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#2979ff' } }, eds)), [setEdges]);

    const handleSettingsClick = useCallback((nodeId) => {
        const node = nodes.find(n => n.id === nodeId);
        setSelectedNode(node);
    }, [nodes, setSelectedNode]);

    const handleDeleteClick = useCallback((nodeId) => {
        setNodes((nds) => nds.filter(node => node.id !== nodeId));
    }, [setNodes]);

    const nodeTypes = useMemo(() => ({ tool: ToolNode }), []);

    useEffect(() => {
        const initialNodes = [
            { id: '1', type: 'tool', position: { x: 50, y: 200 }, data: { id: '1', label: 'Início', icon: <PlayIcon className="text-blue-500"/>, onSettingsClick: handleSettingsClick, onDeleteClick: handleDeleteClick } },
            { id: '2', type: 'tool', position: { x: 350, y: 200 }, data: { id: '2', label: 'OCR Padrão', icon: <ScanIcon className="text-green-500"/>, onSettingsClick: handleSettingsClick, onDeleteClick: handleDeleteClick } },
            { id: '3', type: 'tool', position: { x: 650, y: 100 }, data: { id: '3', label: 'Embeddings de Contratos', icon: <LinkIcon className="text-purple-500"/>, onSettingsClick: handleSettingsClick, onDeleteClick: handleDeleteClick } },
            { id: '4', type: 'tool', position: { x: 650, y: 300 }, data: { id: '4', label: 'Extrair Dados de NF-e', icon: <FileTextIcon className="text-orange-500"/>, onSettingsClick: handleSettingsClick, onDeleteClick: handleDeleteClick } },
        ];
        const initialEdges = [
            { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: '#2979ff' } },
            { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true, style: { stroke: '#2979ff' } },
            { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', animated: true, style: { stroke: '#2979ff' } },
        ];
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [handleSettingsClick, handleDeleteClick, setNodes, setEdges]);


    const availableTools = [
        { name: 'Início', icon: <PlayIcon /> }, { name: 'OCR Padrão', icon: <ScanIcon /> },
        { name: 'Embeddings de Contratos', icon: <LinkIcon /> }, { name: 'Resumidor de E-mails', icon: <MailIcon /> },
        { name: 'Extrair Dados de NF-e', icon: <FileTextIcon /> }, { name: 'Enviar para ERP', icon: <PaperAirplaneIcon /> },
        { name: 'Finalizar Fluxo', icon: <FlagIcon /> },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-brand-primary">
            <header className="bg-brand-secondary p-3 border-b border-gray-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 font-semibold text-brand-text-secondary hover:text-brand-text-primary">
                        <ChevronLeftIcon /> Voltar
                    </button>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-brand-text-primary">Fluxo de Automação: Recebimento</h1>
                        <button className="text-gray-400 hover:text-gray-700 p-1"><EditIcon className="w-4 h-4"/></button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors flex items-center gap-2">
                        <SaveIcon /> Salvar
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-brand-text-primary hover:bg-gray-300 transition-colors flex items-center gap-2">
                        <DownloadIcon /> Baixar JSON
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-brand-text-primary hover:bg-gray-300 transition-colors flex items-center gap-2">
                        <UploadIcon /> Upload
                    </button>
                </div>
            </header>
            <main className="flex-grow relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    {/* Fix: Use the BackgroundVariant enum instead of a string literal for the variant prop. */}
                    <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                    <Controls />
                    <MiniMap />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white p-1.5 rounded-lg shadow-md flex items-center gap-1 border border-gray-200">
                        <button className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-brand-text-secondary">
                            <EyeOffIcon /> Ocultar Ferramentas
                        </button>
                        <div className="h-6 w-px bg-gray-200 mx-1"></div>
                        {availableTools.map(tool => (
                            <button key={tool.name} className="flex items-center gap-2 p-2 rounded-md text-sm text-brand-text-secondary hover:bg-gray-100 font-medium border border-transparent hover:border-gray-200">
                                {React.cloneElement(tool.icon, { className: 'w-5 h-5' })}
                                {tool.name}
                            </button>
                        ))}
                    </div>
                </ReactFlow>
                <ConfigSidePanel node={selectedNode} onClose={() => setSelectedNode(null)} onUpdateNode={() => {}} />
            </main>
        </div>
    );
};

const WorkflowBuilderView = ({ onBack }) => (
    <ReactFlowProvider>
        <WorkflowBuilderViewContent onBack={onBack} />
    </ReactFlowProvider>
);

// --- NEW STATIC AUTOMATION FLOW EXAMPLE PAGE ---
const StaticAutomationFlow = () => {
    const tools = [
        { name: 'Início', icon: <PlayIcon className="w-4 h-4" />, active: true },
        { name: 'OCR Padrão', icon: <OcrIcon className="w-4 h-4" /> },
        { name: 'Embeddings de Contratos', icon: <FileTextIcon className="w-4 h-4" /> },
        { name: 'Resumidor de E-mails', icon: <MailIcon className="w-4 h-4" /> },
        { name: 'Extrair Dados de NF-e', icon: <FileTextIcon className="w-4 h-4" /> },
        { name: 'Enviar para ERP', icon: <PaperAirplaneIcon className="w-4 h-4" /> },
        { name: 'Finalizar fluxo', icon: <FlagIcon className="w-4 h-4" /> },
    ];
    
    // Hardcoded node data based on the user's HTML example
    const flowNodes = [
        {
            id: 'inicio',
            style: { left: '100px', top: '100px' },
            widthClass: 'w-48',
            icon: <PlayIcon className="w-5 h-5 text-blue-600" />,
            label: 'Início',
        },
        {
            id: 'ocr',
            style: { left: '350px', top: '50px' },
            widthClass: 'w-56',
            icon: <OcrIcon className="w-5 h-5 text-blue-600" />,
            label: 'OCR Padrão',
        },
        {
            id: 'embeddings',
            style: { left: '650px', top: '20px' },
            widthClass: 'w-64',
            icon: <FileTextIcon className="w-5 h-5 text-blue-600" />,
            label: 'Embeddings de Contratos',
        },
        {
            id: 'nfe',
            style: { left: '650px', top: '200px' },
            widthClass: 'w-64',
            icon: <FileTextIcon className="w-5 h-5 text-blue-600" />,
            label: 'Extrair Dados de NF-e',
        },
    ];

    // Hardcoded SVG paths to connect the nodes
    // M startX startY C cp1X cp1Y, cp2X cp2Y, endX endY
    const connections = [
        { from: 'inicio', to: 'ocr', path: 'M 292 138 C 321 138, 321 83, 350 83' }, // inicio -> ocr
        { from: 'ocr', to: 'embeddings', path: 'M 574 83 C 612 83, 612 58, 650 58' }, // ocr -> embeddings
        { from: 'inicio', to: 'nfe', path: 'M 292 138 C 471 138, 471 238, 650 238' }, // inicio -> nfe
    ];

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 font-sans">
            <header className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Voltar
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Fluxo de Automação: Recebimento</h1>
                        <button className="text-gray-400 hover:text-gray-600">
                            <EditIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <SaveIcon className="w-4 h-4" />
                            Incluir
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                            <DownloadIcon className="w-4 h-4" />
                            Baixar JSON
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                            <UploadIcon className="w-4 h-4" />
                            Upload
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
                <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2">
                        <XIcon className="w-4 h-4" />
                        Ocultar Ferramentas
                    </button>
                </div>
            </div>

            <div className="px-6 py-4 flex items-center gap-3 flex-wrap shrink-0">
                {tools.map(tool => (
                    <button key={tool.name} className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                        tool.active ? 'bg-blue-50 border-2 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                        {tool.icon}
                        {tool.name}
                    </button>
                ))}
            </div>

            <main className="flex-grow relative px-6 py-8">
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]">
                    {connections.map(conn => (
                        <path key={`${conn.from}-${conn.to}`} d={conn.path} fill="none" stroke="#3b82f6" strokeWidth="2" />
                    ))}
                </svg>
                <div className="relative z-[2] h-full">
                    {flowNodes.map(node => (
                        <div key={node.id} className={`absolute bg-white rounded-lg shadow-lg border border-gray-200 p-4 ${node.widthClass}`} style={node.style}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {node.icon}
                                    <span className="font-medium text-gray-900">{node.label}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="text-gray-400 hover:text-gray-600"><SettingsIcon /></button>
                                    <button className="text-gray-400 hover:text-red-600"><XIcon /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};


// --- Main App Component (Welcome Page) ---
const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('Home');
    const [isEditingOrCreatingWorkflow, setIsEditingOrCreatingWorkflow] = useState(false);
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'testemkt', value: 'w-ai-7g2f9k4h1j8l3n5m0p' + Math.random().toString(36).substring(2, 15) },
        { id: 2, name: 'grigio',   value: 'w-ai-a8b3c1d5e7f9g2h4i' + Math.random().toString(36).substring(2, 15) },
        { id: 3, name: 'n8n',      value: 'w-ai-z6y1x3w5v7u9t2s4r' + Math.random().toString(36).substring(2, 15) },
    ]);

    const handleAddApiKey = (name: string) => {
        const newKey = {
            id: Date.now(),
            name,
            value: 'w-ai-' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
        };
        setApiKeys(prevKeys => [...prevKeys, newKey]);
    };

    const handleDeleteApiKeys = (idsToDelete: number[]) => {
        setApiKeys(prevKeys => prevKeys.filter(key => !idsToDelete.includes(key.id)));
    };
    
    const handleSetActiveView = (viewName: string) => {
        setIsEditingOrCreatingWorkflow(false); // Reset workflow view when changing main view
        setActiveView(viewName);
    };

    const handleEditFlow = (stepId: number) => {
        // Per user request, routing from this button has been removed.
        console.log(`"Adicionar Fluxo de Ferramentas" clicked for step ${stepId}, but navigation is disabled.`);
    };

    const renderContent = () => {
        switch(activeView) {
            case 'Gerenciar Chaves':
                return <ApiKeysView keys={apiKeys} onAdd={handleAddApiKey} onDelete={handleDeleteApiKeys} />;
            case 'Gestão de Workflows':
                return isEditingOrCreatingWorkflow ? 
                    <WorkflowEditorView onBack={() => setIsEditingOrCreatingWorkflow(false)} onAddFlow={handleEditFlow}/> : 
                    <WorkflowManagementView 
                        onNewWorkflow={() => setIsEditingOrCreatingWorkflow(true)} 
                        onEditWorkflow={() => setIsEditingOrCreatingWorkflow(true)} 
                    />;
            case 'Fluxo de automação exemplo':
                return <StaticAutomationFlow />;
            case 'Home':
            default:
                return <WelcomeContent />;
        }
    }

    return (
        <>
            <div className="flex h-screen bg-brand-primary font-sans">
                <Sidebar activeItem={activeView} setActiveItem={handleSetActiveView} />
                
                <div className="flex-1 flex flex-col">
                     <div className="overflow-y-auto h-full">
                        {renderContent()}
                    </div>
                </div>
            </div>


            {/* Floating Action Button for Support */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-accent text-white p-4 rounded-full shadow-lg hover:bg-brand-accent-hover transition-transform transform hover:scale-110 z-30"
                aria-label="Abrir formulário de feedback e suporte"
            >
                <SupportIcon />
            </button>

            {/* Support Modal */}
            <SupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default App;
