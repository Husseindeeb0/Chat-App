import { useEffect, useRef, type FC } from "react";
import useChatStore from "../../store/useChatStore";
import ChatHeader from "../ChatHeader";
import MessageInput from "../MessageInput";
import MessageSkeleton from "../Skeletons/MessageSkeleton";
import useAuthStore from "../../store/useAuthStore";
import formatMessageTime from "../../lib/utils";
import { MessageSquare } from "lucide-react";
import type { Message } from "../../types";

const ChatContainer: FC = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    getMessages(selectedUser?._id ?? "");
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef && messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {safeMessages.length > 0 ? (
          messages.map((message: Message) => (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser?._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser?._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              Start the conversation and your messages will appear here.
            </p>
          </div>
        )}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
