import { Tool, Booking, User } from "../types";
import { mockTools } from "../data/mockTools";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function mapToolPayload(payload: any): Tool {
  return {
    id: payload._id || payload.id,
    name: payload.title || payload.name,
    description: payload.description || "",
    category: payload.category || "General",
    imageUrl: payload.images?.[0] || "",
    owner: {
      id: payload.ownerId?._id || payload.ownerId || "unknown",
      name: payload.ownerId?.name || "Owner",
      email: payload.ownerId?.email || "",
      phone: "",
      location: {
        latitude: 0,
        longitude: 0,
        address: payload.location?.formattedAddress || "",
      },
      joinedDate: new Date(),
    },
    isBorrowed: payload.availability === "borrowed",
    distance: 1,
    postedDate: new Date(payload.createdAt || Date.now()),
  };
}

export const getAvailableTools = (): Tool[] => {
  return mockTools;
};

export const fetchAvailableTools = async (): Promise<Tool[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tools`);
    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    const data = await response.json();
    const payload = Array.isArray(data?.data) ? data.data : [];
    return payload.map(mapToolPayload);
  } catch {
    return mockTools;
  }
};

export const filterTools = (
  tools: Tool[],
  query: string,
  category: string,
  maxDistance: number,
): Tool[] => {
  const normalizedQuery = query.trim().toLowerCase();

  return tools.filter((tool) => {
    const matchesQuery =
      normalizedQuery === "" ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      category === "All" || tool.category === category;

    const withinDistance = tool.distance <= maxDistance;

    return matchesQuery && matchesCategory && withinDistance;
  });
};

export const createBooking = (tool: Tool, borrower: User): Booking => {
  return {
    id: crypto.randomUUID(),
    toolId: tool.id,
    borrowerId: borrower.id,
    ownerId: tool.owner.id,
    bookingDate: new Date(),
    status: "confirmed",
  };
};

export const validateUser = (user: User): boolean => {
  return Boolean(
    user.id &&
      user.name &&
      user.email &&
      user.phone &&
      user.location &&
      user.location.address &&
      typeof user.location.latitude === "number" &&
      typeof user.location.longitude === "number" &&
      user.joinedDate,
  );
};
