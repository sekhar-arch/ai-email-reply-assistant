
import React from 'react';
import { Tone } from '../types';

interface ToneSelectorProps {
    selectedTone: Tone;
    onSelectTone: (tone: Tone) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onSelectTone }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Reply Tone
            </label>
            <div className="flex flex-wrap gap-2">
                {Object.values(Tone).map((tone) => (
                    <button
                        key={tone}
                        type="button"
                        onClick={() => onSelectTone(tone)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${
                            selectedTone === tone
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                    >
                        {tone}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ToneSelector;
