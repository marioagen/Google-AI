import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';

// --- Reusable SVG Icons ---

const CopyIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625a2.625 2.625 0 11-5.25 0v-2.625m0 0V15.75m0 0v-2.625A2.625 2.625 0 0112 10.5h.375a2.625 2.625 0 012.625 2.625v2.625" />
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
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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
        { name: 'Editor de Workflow', icon: <WorkflowEditorIcon />, color: 'text-teal-500' },
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

    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allKeyIds = new Set(keys.map(k => k.id));
            setSelectedKeys(allKeyIds);
        } else {
            // FIX: Explicitly set the type of the new Set to number to match the state type.
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
        // FIX: Explicitly set the type of the new Set to number to match the state type.
        setSelectedKeys(new Set<number>());
    };

    const handleCopy = (key: { id: number, value: string }) => {
        navigator.clipboard.writeText(key.value);
        setCopiedKeyId(key.id);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };

    const allSelected = selectedKeys.size > 0 && selectedKeys.size === keys.length;
    const someSelected = selectedKeys.size > 0 && selectedKeys.size < keys.length;

    const indeterminateCheckboxRef = useRef<HTMLInputElement>(null);
    if (indeterminateCheckboxRef.current) {
      indeterminateCheckboxRef.current.indeterminate = someSelected;
    }


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


// --- Main App Component (Welcome Page) ---

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeView, setActiveView] = useState('Home');
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

    const renderContent = () => {
        switch(activeView) {
            case 'Gerenciar Chaves':
                return <ApiKeysView keys={apiKeys} onAdd={handleAddApiKey} onDelete={handleDeleteApiKeys} />;
            case 'Home':
            default:
                return <WelcomeContent />;
        }
    }

    return (
        <>
            <div className="flex h-screen bg-brand-primary font-sans">
                <Sidebar activeItem={activeView} setActiveItem={setActiveView} />
                
                <div className="flex-1 flex flex-col">
                     <div className="overflow-y-auto">
                        {renderContent()}
                    </div>
                </div>
            </div>


            {/* Floating Action Button for Support */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-accent text-white p-4 rounded-full shadow-lg hover:bg-brand-accent-hover transition-transform transform hover:scale-110"
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