
import React, { useState, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { generateReply } from './services/geminiService';
import { Tone } from './types';
import ToneSelector from './components/ToneSelector';
import ReplyDisplay from './components/ReplyDisplay';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
    const [incomingEmail, setIncomingEmail] = useState<string>('');
    const [generatedReply, setGeneratedReply] = useState<string>('');
    const [selectedTone, setSelectedTone] = useState<Tone>(Tone.FORMAL);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [editor, setEditor] = useState<any>(null);
    const [selectionFormat, setSelectionFormat] = useState<string>('Normal');

    const handleGenerateReply = useCallback(async () => {
        if (!incomingEmail.trim()) {
            setError('Please enter the incoming email content.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedReply('');

        const reply = await generateReply(incomingEmail, selectedTone);
        
        // A small delay to make the transition smoother if the API is very fast
        setTimeout(() => {
            if (reply.toLowerCase().startsWith('error:')) {
                setError(reply);
            } else {
                setGeneratedReply(reply);
            }
            setIsLoading(false);
        }, 300);

    }, [incomingEmail, selectedTone]);

    const handleCopyToClipboard = useCallback(() => {
        if (!generatedReply) return;
        navigator.clipboard.writeText(generatedReply);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }, [generatedReply]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        AI Email Reply Assistant
                    </h1>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        Paste an email, select a tone, and let our AI agent draft the perfect professional reply for you in seconds.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                        <div>
                           <label htmlFor="incoming-email" className="block text-lg font-semibold text-white mb-3">
                                Incoming Email
                            </label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={incomingEmail}
                                onReady={editor => {
                                    setEditor(editor);
                                    editor.model.document.selection.on('change:range', () => {
                                        const selection = editor.model.document.selection;
                                        const selectedText = selection.getFirstRange()?.start.parent;
                                        if (selectedText) {
                                            if (selectedText.name === 'paragraph') {
                                                setSelectionFormat('Normal');
                                            } else {
                                                setSelectionFormat(selectedText.name);
                                            }
                                        }
                                    });
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setIncomingEmail(data);
                                }}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                                    placeholder: "Paste the content of the email you received here...",
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-slate-300">
                                Selected Text Format
                            </label>
                            <div className="w-full bg-slate-900/70 border border-slate-700 rounded-md p-2 text-slate-300">
                                {selectionFormat}
                            </div>
                        </div>
                        
                        <ToneSelector selectedTone={selectedTone} onSelectTone={setSelectedTone} />
                        
                        <div>
                            <button
                                onClick={handleGenerateReply}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 text-lg"
                            >
                                <SparklesIcon className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? 'Generating...' : 'Generate Reply'}
                            </button>
                            {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
                        </div>
                    </div>

                    <div className="min-h-[400px] lg:min-h-full">
                      <ReplyDisplay
                          reply={generatedReply}
                          isLoading={isLoading}
                          onCopyToClipboard={handleCopyToClipboard}
                          isCopied={isCopied}
                      />
                    </div>
                </main>

                <footer className="text-center mt-12 text-slate-500 text-sm">
                    <p>Powered by Google Gemini. Designed for efficiency.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
