import { Tool, Booking, User } from "../types";
import { mockTools } from "../data/mockTools";

export const getAvailableTools = (): Tool[] => {
  return mockTools;
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
