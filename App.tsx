import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, X, Wand2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import WizardSidebar from './components/WizardSidebar';
import MessageBubble from './components/MessageBubble';
import { ChatMessage, MessageRole, Step, QuickOption } from './types';
import { createChatSession, sendMessageToGemini, generateVisualPreview } from './services/geminiService';

export default function App() {
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  
  // Logic State
  const [currentStep, setCurrentStep] = useState<Step>(Step.SUBJECT);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
      
      // Initial greeting
      const initialMessage: ChatMessage = {
        id: 'init-1',
        role: MessageRole.MODEL,
        content: `欢迎来到 **Visual Prompt Studio (视觉工坊)**。我是您的 AI 提示词向导。

我会帮助您创作专业的 Midjourney 或 Stable Diffusion 提示词，并为您**解释每个参数的含义**。

**您想如何开始？**
* 👈 直接点击左侧 **创作向导** 开始
* 📎 **上传图片** 进行风格分析与反推
`
      };
      setMessages([initialMessage]);
    } catch (e) {
      setApiKeyError(true);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string = inputValue, image: string | null = selectedImage) => {
    if ((!text.trim() && !image) || isTyping || !chatSession) return;

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: MessageRole.USER,
      content: text,
      image: image || undefined
    };

    // Optimistic UI update
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setSelectedImage(null);
    setIsTyping(true);

    // Determine Step Advancement Logic
    if (!isReverseMode && currentStep < Step.DONE) {
        if (currentStep !== Step.SUBJECT || text.length > 0) { 
             setCurrentStep(prev => Math.min(prev + 1, Step.DONE));
        }
    }

    try {
      // Loading indicator
      const loadingMsgId = 'loading-' + Date.now();
      setMessages(prev => [...prev, { id: loadingMsgId, role: MessageRole.MODEL, content: '', isLoading: true }]);

      // Send to Gemini
      const responseText = await sendMessageToGemini(chatSession, text, image || undefined);

      // If user asked for a visual demo/preview explicitly
      let generatedPreview = undefined;
      const lowerText = text.toLowerCase();
      if (lowerText.includes('generate') && (lowerText.includes('preview') || lowerText.includes('image') || lowerText.includes('show me') || text.includes('预览') || text.includes('生成'))) {
          generatedPreview = await generateVisualPreview(text) || undefined;
      }

      // Remove loading, add real response
      setMessages(prev => prev.filter(m => m.id !== loadingMsgId).concat({
        id: Date.now().toString(),
        role: MessageRole.MODEL,
        content: responseText,
        generatedImage: generatedPreview
      }));

    } catch (error) {
      console.error("Chat Error", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setIsReverseMode(true); // Switch to reverse mode automatically
        setCurrentStep(Step.DONE); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickOption = (option: QuickOption) => {
      handleSendMessage(option.value);
  };

  if (apiKeyError) {
    return (
      <div className="flex items-center justify-center h-screen bg-studio-900 text-white">
        <div className="p-8 bg-studio-800 rounded-xl border border-red-500/50 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">配置错误 (Configuration Error)</h2>
          <p className="text-studio-300">
            缺少 API Key。请确保环境变量 <code>process.env.API_KEY</code> 已正确设置有效的 Gemini API 密钥。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-studio-900 text-gray-100 font-sans overflow-hidden">
      
      {/* Left Sidebar - Wizard Steps */}
      <WizardSidebar currentStep={currentStep} onOptionSelect={handleQuickOption} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Header (Mobile Only) */}
        <div className="md:hidden p-4 border-b border-studio-700 bg-studio-800 flex items-center justify-between">
           <span className="font-bold text-lg">Visual Prompt 视觉工坊</span>
           <span className="text-xs px-2 py-1 bg-studio-700 rounded text-studio-300">Gemini 3 Pro</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {/* Widen the box to max-w-7xl */}
          <div className="max-w-7xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-studio-900/95 backdrop-blur border-t border-studio-700 z-10">
          <div className="max-w-7xl mx-auto relative">
            
            {/* Image Preview */}
            {selectedImage && (
              <div className="absolute bottom-full mb-4 left-0 p-2 bg-studio-800 rounded-lg border border-studio-600 shadow-xl animate-in slide-in-from-bottom-2">
                <div className="relative">
                  <img src={selectedImage} alt="Preview" className="h-24 w-auto rounded-md" />
                  <button 
                    onClick={() => { setSelectedImage(null); setIsReverseMode(false); }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="mt-1 text-xs text-studio-300 text-center">反向模式</div>
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-end gap-3 bg-studio-800 p-3 rounded-2xl border border-studio-600 focus-within:border-studio-accent focus-within:ring-1 focus-within:ring-studio-accent transition-all shadow-lg">
              
              {/* Upload Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-studio-400 hover:text-studio-accent transition-colors rounded-lg hover:bg-studio-700"
                title="上传图片进行分析"
              >
                <Paperclip className="w-5 h-5" />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageSelect}
                />
              </button>

              {/* Text Input */}
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isReverseMode ? "关于这张图您想了解什么？" : "描述您的创意，或使用左侧菜单..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-studio-500 resize-none py-2 max-h-32 min-h-[2.5rem]"
                rows={1}
              />

              {/* Visualize Button */}
              {inputValue.length > 5 && (
                 <button
                    onClick={() => handleSendMessage(inputValue + " (请为此生成预览图)")}
                    className="hidden md:flex items-center gap-1 p-2 text-xs text-studio-400 hover:text-pink-400 transition-colors rounded-lg hover:bg-studio-700"
                    title="生成预览图"
                 >
                    <Wand2 className="w-4 h-4" />
                    <span>预览</span>
                 </button>
              )}

              {/* Send Button */}
              <button 
                onClick={() => handleSendMessage()}
                disabled={(!inputValue.trim() && !selectedImage) || isTyping}
                className="p-3 bg-studio-accent text-studio-900 rounded-xl hover:bg-[#00b8e6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-2 text-center">
                 <span className="text-[10px] text-studio-500">
                    AI 可能会犯错，请核对生成结果。| 由 Gemini 3 Pro 驱动
                 </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}