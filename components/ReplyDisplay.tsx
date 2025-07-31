
import React from 'react';
import { ClipboardIcon, CheckIcon } from './icons';

interface ReplyDisplayProps {
    reply: string;
    isLoading: boolean;
    onCopyToClipboard: () => void;
    isCopied: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse p-4">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
    </div>
);

const ReplyDisplay: React.FC<ReplyDisplayProps> = ({ reply, isLoading, onCopyToClipboard, isCopied }) => {
    return (
        <div className="bg-slate-800/50 rounded-lg h-full flex flex-col border border-slate-700">
             <div className="flex justify-between items-center p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Generated Reply</h2>
                {(reply && !isLoading) && (
                     <button
                        onClick={onCopyToClipboard}
                        className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
                    >
                        {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                )}
            </div>

            <div className="prose prose-invert prose-sm max-w-none flex-grow overflow-y-auto whitespace-pre-wrap text-slate-300">
                {isLoading ? (
                    <LoadingSkeleton />
                ) : reply ? (
                    <p className="p-4">{reply}</p>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 text-center p-4">Your generated email reply will appear here...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReplyDisplay;
