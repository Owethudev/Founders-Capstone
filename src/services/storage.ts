import { Tool, User } from "../types";

const CURRENT_USER_KEY = "currentUser";
const USER_TOOLS_KEY = "userTools";

export const getSavedUser = (): User | null => {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as User;
    return {
      ...parsed,
      joinedDate: new Date(parsed.joinedDate),
    };
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
};

export const saveUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getSavedUserTools = (): Tool[] => {
  const saved = localStorage.getItem(USER_TOOLS_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved) as Tool[];
  } catch {
    localStorage.removeItem(USER_TOOLS_KEY);
    return [];
  }
};

export const saveUserTools = (tools: Tool[]): void => {
  localStorage.setItem(USER_TOOLS_KEY, JSON.stringify(tools));
};
