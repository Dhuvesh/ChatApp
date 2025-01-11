import { useEffect, useRef } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore";
import { useAuthStore } from "../store/useAuthStore";
import GroupChatHeader from "./GroupChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const GroupChatContainer = () => {
  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    selectedGroup,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedGroup) {
      getGroupMessages(selectedGroup._id);
      subscribeToGroupMessages();
    }

    return () => unsubscribeFromGroupMessages();
  }, [selectedGroup, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  useEffect(() => {
    if (messageEndRef.current && groupMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);

  if (!selectedGroup) return null;

  if (isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupChatHeader />
        <MessageSkeleton />
        <MessageInput isGroup />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <GroupChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(groupMessages) && groupMessages.map((message) => {
          // Ensure message is properly structured
          if (!message || typeof message !== 'object') return null;

          // Handle sender information
          const isAuthUser = message.senderId?._id === authUser?._id;
          const sender = isAuthUser ? authUser : message.senderId;

          console.log("Message:", message);
          console.log("Sender:", sender);

          
          return (
            <div
              key={message._id}
              className={`chat ${isAuthUser ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={sender?.profilePic || "/avatar.png"}
                    alt={sender?.fullName || "User"}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <span className="font-medium mr-2">
                  {sender?.fullName || "Unknown User"}
                </span>
                <time className="text-xs opacity-50">
                  {message.createdAt ? formatMessageTime(message.createdAt) : ""}
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
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput isGroup />
    </div>
  );
};

export default GroupChatContainer;

