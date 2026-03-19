import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollableMessageContainer } from '@/components/ui/scrollable-message-container';
import {
  ThreadContent,
  ThreadContentMessages,
} from '@/components/ui/thread-content';
import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from '@/components/ui/message-input';

interface ChatSidebarProps {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}

export function ChatSidebar({ isChatOpen, setIsChatOpen }: ChatSidebarProps) {
  return (
    <>
      {/* Chat Sidebar */}
      <div
        className={`${
          isChatOpen ? 'w-80' : 'w-0'
        } fixed right-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-l border-gray-200 bg-white transition-all duration-300`}
      >
        {isChatOpen && (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Chat Assistant
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Try: &quot;Change the name to John Doe&quot; or &quot;Add a Link&quot;
              </p>
            </div>

            <ScrollableMessageContainer className="flex-1 p-4">
              <ThreadContent variant="default">
                <ThreadContentMessages />
              </ThreadContent>
            </ScrollableMessageContainer>

            <div className="p-4 text-black">
              <MessageInput contextKey="portfolio-editor" variant="bordered">
                <MessageInputTextarea placeholder="Update the name..." />
                <MessageInputToolbar>
                  <MessageInputSubmitButton />
                </MessageInputToolbar>
              </MessageInput>
            </div>
          </>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`${
          isChatOpen ? 'right-80' : 'right-0'
        } fixed top-1/2 z-50 -translate-y-1/2 rounded-l-lg border border-gray-200 bg-white p-2 transition-all duration-300 hover:bg-gray-50`}
      >
        {isChatOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </>
  );
}
