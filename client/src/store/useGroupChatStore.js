// store/useGroupChatStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupChatStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  isGroupsLoading: false,
  isGroupMessagesLoading: false,
  groupMessages: [],

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups", groupData);
      set({ groups: [...get().groups, res.data] });
      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/${groupId}/messages`);
      set({ groupMessages: res.data });
      console.log(res.data);
      
      
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    try {
      const res = await axiosInstance.post(
        `/groups/${selectedGroup._id}/messages`,
        messageData
      );
      set({ groupMessages: [...groupMessages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/leave`);
      set({
        groups: get().groups.filter((group) => group._id !== groupId),
        selectedGroup: null,
      });
      toast.success("Left group successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newGroupMessage", (newMessage) => {
      if (newMessage.groupId !== selectedGroup._id) return;

      set({
        groupMessages: [...get().groupMessages, newMessage],
      });
    });
  },

  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
  },

  setSelectedGroup: (group) => set({ selectedGroup: group }),
}));