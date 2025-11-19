import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ChatMessage, MessageRole } from '../types';
import { User, Bot, Loader2, Image as ImageIcon } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  // Remove explicit <br> tags if they appear, replacing them with a space to prevent ugly text rendering
  const cleanContent = message.content ? message.content.replace(/<br\s*\/?>/gi, ' ') : '';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[95%] md:max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-studio-600' : 'bg-gradient-to-br from-studio-accent to-blue-600'}`}>
          {isUser ? <User className="w-5 h-5 text-gray-300" /> : <Bot className="w-5 h-5 text-white" />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}>
          <div className={`
            px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg w-full
            ${isUser 
              ? 'bg-studio-600 text-white rounded-tr-none' 
              : 'bg-studio-800 border border-studio-700 text-gray-100 rounded-tl-none'}
          `}>
            {message.isLoading ? (
              <div className="flex items-center space-x-2 text-studio-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI 正在思考 (Thinking)...</span>
              </div>
            ) : (
              <>
                {/* Uploaded User Image */}
                {message.image && (
                  <div className="mb-3 overflow-hidden rounded-lg border border-studio-500/30 max-w-xs">
                     <img src={message.image} alt="Uploaded context" className="w-full h-auto object-cover" />
                  </div>
                )}
                
                {/* Generated AI Preview Image */}
                {message.generatedImage && (
                  <div className="mb-4 overflow-hidden rounded-lg border border-studio-accent/50 shadow-[0_0_15px_rgba(0,210,255,0.15)] max-w-sm">
                     <div className="bg-studio-900 text-xs text-studio-400 px-2 py-1 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> 视觉参考图 (Visual Concept)
                     </div>
                     <img src={message.generatedImage} alt="Generated preview" className="w-full h-auto object-cover" />
                  </div>
                )}

                {/* Text Content */}
                <div className="markdown-body overflow-x-auto">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                  >
                    {cleanContent}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;