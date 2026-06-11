import { useEffect, useRef, useState } from 'react';
import { aiApi } from '../../services/api';
import { ChatMessage } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { IconSparkles, IconSend, IconRefreshCw } from '../../components/icons/Icons';
import { format } from 'date-fns';
import clsx from 'clsx';

const SUGGESTIONS = [
  'How do I write a great worker profile?',
  'What should I charge for plumbing work in Johannesburg?',
  'How does the GIGConnect escrow payment work?',
  'What are my rights as an informal worker in SA?',
  'Help me write a job description for a domestic cleaner',
];

export default function AiChatPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    aiApi.getHistory()
        .then(r => setMessages(r.data.data ?? []))
        .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg: ChatMessage = { role: 'USER', content: msg, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const { data } = await aiApi.chat(msg);
      setMessages(prev => [...prev, data.data]);
    } catch {
      setMessages(prev => [...prev, { role: 'ASSISTANT', content: "I'm sorry, I couldn't connect right now. Please try again.", createdAt: new Date().toISOString() }]);
    } finally { setLoading(false); }
  };

  const clearChat = async () => {
    if (!confirm('Clear all chat history?')) return;
    await aiApi.clearHistory();
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
      <div className="flex flex-col h-[calc(100vh-6rem)] max-w-3xl">
        <div className="card p-4 mb-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
              <IconSparkles size={18} className="text-white"/>
            </div>
            <div>
              <p className="font-semibold text-slate-900">GigAssist AI</p>
              <p className="text-xs text-slate-400">Powered by Gemini • Career & marketplace advisor</p>
            </div>
          </div>
          {messages.length > 0 && (
              <button onClick={clearChat} className="btn-secondary text-xs px-3 py-1.5 text-red-400 hover:text-red-600 hover:border-red-200">
                <IconRefreshCw size={13}/>Clear
              </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4 px-1">
          {historyLoading
              ? <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin"/></div>
              : messages.length === 0
                  ? (
                      <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                          <IconSparkles size={28} className="text-brand-500"/>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-900">Hello, {user?.fullName?.split(' ')[0]}!</p>
                          <p className="text-slate-500 text-sm mt-1 max-w-sm">I'm your AI career and marketplace assistant. Ask me anything about finding work, posting jobs, or navigating SA labour law.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {SUGGESTIONS.map(s => (
                              <button key={s} onClick={() => send(s)}
                                      className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors shadow-sm text-left">
                                {s}
                              </button>
                          ))}
                        </div>
                      </div>
                  )
                  : messages.map((msg, i) => (
                      <div key={i} className={clsx('flex gap-3', msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row')}>
                        {msg.role === 'USER'
                            ? <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {user?.fullName?.charAt(0) ?? 'U'}
                            </div>
                            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
                              <IconSparkles size={14} className="text-white"/>
                            </div>
                        }
                        <div className={clsx('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                            msg.role === 'USER'
                                ? 'bg-brand-500 text-white rounded-tr-sm'
                                : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-sm')}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={clsx('text-xs mt-1.5', msg.role === 'USER' ? 'text-brand-200' : 'text-slate-400')}>
                            {format(new Date(msg.createdAt), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                  ))
          }
          {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
                  <IconSparkles size={14} className="text-white"/>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-5">
                    {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}/>)}
                  </div>
                </div>
              </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div className="card p-3 shrink-0 mt-2">
          <div className="flex gap-2 items-end">
          <textarea ref={inputRef} rows={1}
                    className="input flex-1 resize-none py-2.5 max-h-32 text-sm"
                    placeholder="Ask GigAssist anything… (Enter to send, Shift+Enter for newline)"
                    value={input}
                    onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'; }}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
          />
            <button onClick={() => send()} disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
              <IconSend size={16}/>
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">GigAssist may make mistakes. Always verify important legal or financial advice.</p>
        </div>
      </div>
  );
}