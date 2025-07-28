import { Socket } from "socket.io-client";

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  profilePic: string;
}

export interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt: string;
}

export interface AuthStore {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (formData: SignupFormData) => Promise<void>;
  login: (formData: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (formData: UpdateProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface ThemeStore {
  theme: string | null,
  setTheme: (theme: string) => void,
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  image: string;
  text: string | null;
  createdAt: string;
}

export interface newMessage {
  text: string;
  image: string | null;
}

export interface ChatStore {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: newMessage) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User | null) => void;
}