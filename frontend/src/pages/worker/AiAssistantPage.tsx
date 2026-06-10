import { useEffect, useRef, useState } from 'react';
import apiClient from '../../api/client';
import { useAuthStore } from '../../context/authStore';
import { BotIcon, SendIcon, SparklesIcon, UserIcon } from '../../assets/icons';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'What jobs match my skills as a plumber?',
  'Help me write my worker profile bio',
  'What is a fair rate for garden cleaning in Johannesburg?',
  'How does payment work on GIGConnect?',
  'Tips for getting my first job on the platform',
];

export default function AiAssistantPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: `Hello${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}! 👋 I'm GIGAssist, your AI helper for GIGConnect SA.\n\nI can help you with job matching, profile tips, pricing guidance, and more. What would you like to know?`,
      timestamp: new Date(),
    }]);
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const params = conversationId ? `?conversationId=${conversationId}` : '';
      const { data } = await apiClient.post(`/ai/chat${params}`, { message: text });
      setConversationId(data.conversationId);
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages((m) => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I ran into an issue. Please try again in a moment.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl
                          flex items-center justify-center flex-shrink-0">
            <SparklesIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">GIGAssist</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              Powered by Gemini AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}
               className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5
                            ${msg.role === 'assistant'
                              ? 'bg-gradient-to-br from-brand-500 to-accent-500'
                              : 'bg-gray-200'}`}>
              {msg.role === 'assistant'
                ? <BotIcon size={15} className="text-white" />
                : <UserIcon size={15} className="text-gray-600" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                              ${msg.role === 'user'
                                ? 'bg-brand-600 text-white rounded-tr-sm'
                                : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'}`}>
                {msg.content}
              </div>
              <span className="text-xs text-gray-400 px-1">
                {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500
                            flex items-center justify-center flex-shrink-0">
              <BotIcon size={15} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts (only show initially) */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 mb-2 px-1">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs bg-white border border-gray-200 text-gray-600 rounded-full
                           px-3 py-1.5 hover:border-brand-400 hover:text-brand-600 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3
                        focus-within:border-brand-400 focus-within:bg-white transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask GIGAssist anything…"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none
                       outline-none max-h-32 leading-relaxed"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0
                       hover:bg-brand-700 active:scale-90 transition-all disabled:opacity-40
                       disabled:cursor-not-allowed"
          >
            <SendIcon size={14} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          GIGAssist can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
