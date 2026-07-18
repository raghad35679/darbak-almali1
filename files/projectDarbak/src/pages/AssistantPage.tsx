import { useState, useRef, useEffect } from 'react';
import { useUserData } from '../lib/useData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { generateAIResponse } from '../lib/ai';
import { Card, Button } from '../components/ui';
import { Sparkles, Send, Brain, User, Trash2, Lightbulb } from 'lucide-react';

const suggestedQuestions = [
  'كيف أزيد مدخراتي؟',
  'كيف أضع ميزانية مناسبة؟',
  'نصائح للاستثمار للمبتدئين',
  'كيف أدير ديوني؟',
  'كيف أحدد أهدافاً مالية؟',
];

export function AssistantPage() {
  const { user } = useAuth();
  const { chatMessages, analysis, setChatMessages } = useUserData();
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, thinking]);

  const handleSend = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || !user) return;

    setInput('');
    setThinking(true);

    // Save user message
    const { data: userMsg } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'user',
      content: message,
    }).select('*').single();

    if (userMsg) {
      setChatMessages(prev => [...prev, userMsg as typeof chatMessages[0]]);
    }

    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const response = generateAIResponse(message, analysis);

    const { data: aiMsg } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: response,
    }).select('*').single();

    if (aiMsg) {
      setChatMessages(prev => [...prev, aiMsg as typeof chatMessages[0]]);
    }

    setThinking(false);
  };

  const handleClear = async () => {
    if (!user) return;
    await supabase.from('chat_messages').delete().eq('user_id', user.id);
    setChatMessages([]);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-saudi flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">المساعد المالي الذكي</h1>
            <p className="text-sm text-gray-500">مدعوم بالذكاء الاصطناعي - متاح 24/7</p>
          </div>
        </div>
        {chatMessages.length > 0 && (
          <button onClick={handleClear} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> مسح المحادثة
          </button>
        )}
      </div>

      <Card className="flex flex-col" style={{ height: 'calc(100vh - 220px)' } as React.CSSProperties}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-hide">
          {chatMessages.length === 0 && !thinking ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full gradient-saudi animate-pulse-soft" />
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-saudi-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">كيف يمكنني مساعدتك؟</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">اسألني أي سؤال عن الادخار، الميزانية، الاستثمار، أو إدارة أموالك</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="p-4 rounded-2xl bg-beige-50 hover:bg-beige-100 text-right text-sm font-medium text-ink-800 transition-all border border-transparent hover:border-saudi-200"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-saudi-400 flex-shrink-0" />
                      {q}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-beige-200 text-saudi-600' : 'gradient-saudi text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-saudi-50 text-ink-900 rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-ink-900 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-saudi flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-saudi-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-saudi-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-saudi-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 px-4 py-3.5 rounded-2xl border border-gray-200 focus:border-saudi-400 focus:ring-2 focus:ring-saudi-100 outline-none bg-beige-50 text-sm"
            />
            <Button onClick={() => handleSend()} disabled={!input.trim()} className="px-4 py-3.5">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
