import { useState } from "react";
import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChatStore";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { users } = useChatStore();
  const { createGroup } = useGroupChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length < 2) return;

    await createGroup({
      name: groupName.trim(),
      participants: selectedUsers,
    });
    
    onClose();
    setGroupName("");
    setSelectedUsers([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className=" bg-base-100 rounded-lg w-full max-w-md">
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create New Group</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter group name..."
              required
            />
          </div>

          <div>
            <label className="label">Select Participants</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <label key={user._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user._id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
                      }
                    }}
                  />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!groupName.trim() || selectedUsers.length < 2}
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;