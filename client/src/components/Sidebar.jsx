import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Plus, UserCircle, UsersRound } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading
  } = useChatStore();

  const {
    groups,
    getGroups,
    selectedGroup,
    setSelectedGroup,
    isGroupsLoading
  } = useGroupChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "groups"

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 btn btn-sm ${
                activeTab === "users" ? "btn-primary" : "btn-ghost"
              }`}
            >
              <UserCircle className="size-4 lg:mr-2" />
              <span className="hidden lg:inline">Users</span>
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex-1 btn btn-sm ${
                activeTab === "groups" ? "btn-primary" : "btn-ghost"
              }`}
            >
              <UsersRound className="size-4 lg:mr-2" />
              <span className="hidden lg:inline">Groups</span>
            </button>
          </div>

          {activeTab === "users" ? (
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">Contacts</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersRound className="size-6" />
                <span className="font-medium hidden lg:block">Groups</span>
              </div>
              <button
                onClick={() => setIsCreateGroupOpen(true)}
                className="btn btn-sm btn-ghost"
              >
                <Plus className="size-4" />
                <span className="hidden lg:inline">New Group</span>
              </button>
            </div>
          )}

          {/* Online filter toggle - only show for users tab */}
          {activeTab === "users" && (
            <div className="mt-3 hidden lg:flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm">Show online only</span>
              </label>
              <span className="text-xs text-zinc-500">
                ({onlineUsers.length - 1} online)
              </span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto w-full py-3">
          {activeTab === "users" ? (
            // Users List
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors
                  ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 
                      rounded-full ring-2 ring-zinc-900"
                    />
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))
          ) : (
            // Groups List
            groups.map((group) => (
              <button
                key={group._id}
                onClick={() => handleGroupSelect(group)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors
                  ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UsersRound className="size-6" />
                  </div>
                </div>

                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{group.name}</div>
                  <div className="text-sm text-zinc-400">
                    {group.participants.length} members
                  </div>
                </div>
              </button>
            ))
          )}

          {activeTab === "users" && filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}

          {activeTab === "groups" && groups.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No groups yet</div>
          )}
        </div>
      </aside>

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
    </>
  );
};

export default Sidebar;