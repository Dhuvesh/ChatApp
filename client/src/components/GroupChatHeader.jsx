import { X, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChatStore.JS";

const GroupChatHeader = () => {
  const { selectedGroup, setSelectedGroup, leaveGroup } = useGroupChatStore();

  const handleLeaveGroup = async () => {
    await leaveGroup(selectedGroup._id);
    setSelectedGroup(null);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="size-6" />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedGroup.name}</h3>
            <p className="text-sm text-base-content/70">
              {selectedGroup.participants.length} members
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleLeaveGroup}
            className="btn btn-sm btn-ghost"
          >
            Leave Group
          </button>
          <button onClick={() => setSelectedGroup(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatHeader;