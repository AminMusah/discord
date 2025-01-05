import { create } from "zustand";

export const useModal = create((set) => ({
  type:
    "createServer" ||
    "invite" ||
    "editServer" ||
    "members" ||
    "createChannel" ||
    "leaveServer" ||
    "deleteServer" ||
    "deleteChannel" ||
    "editChannel" ||
    "messageFile" ||
    "deleteMessage" ||
    "profile" ||
    "getMessage" ||
    null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
  getData: (type, data = {}) => set({ type, data }),
}));
