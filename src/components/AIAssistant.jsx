import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Cpu, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api'; // Use existing axios singleton

const AIAssistant = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Hello ${user?.name || 'Manager'}. I am the Native AI Remediation Engine. How can I optimize the system for you today?`, sender: 'ai' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const res = await api.post('/ai/chat', { message: userMsg.text });

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: res.data.reply,
                    sender: 'ai',
                    actionLabel: res.data.actionLabel,
                    actionCommand: res.data.actionCommand
                }]);
                setIsTyping(false);
            }, 800); // Simulate "thinking" time
        } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: 'System Error: Lost connection to AI parsing core.', sender: 'ai', isError: true }]);
        }
    };

    const handleExecuteAction = async (command) => {
        setIsTyping(true);
        try {
            const res = await api.post('/ai/remedy', { actionCommand: command });
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: res.data.message,
                    sender: 'ai',
                    isSystemLog: true
                }]);
                setIsTyping(false);
            }, 1200);
        } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now(), text: `Engine failure during remediation execution: ${error.message}`, sender: 'ai', isError: true }]);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl flex items-center justify-center border-2 border-white/20 transition-all z-[9999] ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <Bot size={28} />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-dark-900 rounded-full animate-pulse"></span>
            </motion.button>

            {/* Chat Widget Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[80vh] flex flex-col glass-card border-white/20 shadow-2xl z-[9999] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-white/10 p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                                    <Cpu size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">System AI Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                        <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Engine Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-dark-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm bg-dark-900/40">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'ai' && !msg.isSystemLog && (
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-3 mt-1 shrink-0">
                                            <Bot size={16} className="text-blue-400" />
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.sender === 'user'
                                        ? 'bg-primary-600/20 border border-primary-500/30 text-white rounded-br-none'
                                        : msg.isSystemLog
                                            ? 'bg-dark-800 border border-emerald-500/30 text-emerald-400 font-bold w-full text-center flex items-center justify-center gap-2'
                                            : msg.isError
                                                ? 'bg-red-500/10 border border-red-500/30 text-red-200 rounded-bl-none'
                                                : 'bg-dark-800/80 border border-white/10 text-dark-100 rounded-bl-none'
                                        }`}>
                                        {msg.isSystemLog && <CheckCircle size={16} />}
                                        <p className="leading-relaxed">{msg.text}</p>

                                        {/* Auto-Remediation Button Injection */}
                                        {msg.actionLabel && msg.actionCommand && (
                                            <button
                                                onClick={() => handleExecuteAction(msg.actionCommand)}
                                                className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600/80 to-orange-600/80 hover:from-red-500 hover:to-orange-500 text-white py-2 rounded-lg font-bold border border-red-400/30 transition-all shadow-lg"
                                            >
                                                <ShieldAlert size={16} />
                                                {msg.actionLabel}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-3 shrink-0">
                                        <Bot size={16} className="text-blue-400" />
                                    </div>
                                    <div className="bg-dark-800/80 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce"></span>
                                        <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce delay-150"></span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-dark-900 border-t border-white/10 shrink-0">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Report an issue or ask for system diagnostics..."
                                    className="w-full bg-dark-800 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-dark-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm"
                                    disabled={isTyping}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className={`absolute right-2 p-2 rounded-lg transition-colors ${!inputValue.trim() || isTyping ? 'text-dark-500 cursor-not-allowed' : 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300'}`}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <p className="text-[10px] text-center text-dark-500 mt-2">
                                AI operations trace back to `/routes/ai.js`. Core parameters tracked live.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
