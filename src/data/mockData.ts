export type ReactionValue = "yes" | "not_for_me" | null;

export type Member = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type HotelOption = {
  id: string;
  name: string;
  type: "hotel";
  image: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  location: string;
  addedBy: string;
  addedAtLabel: string;
  availability: "available" | "unavailable";
  description: string;
};

export type ReactionMap = Record<string, ReactionValue>;

export type OptionWithReactions = HotelOption & {
  reactionsByMember: ReactionMap;
};

export type GroupTrip = {
  id: string;
  name: string;
  destination: string;
  dates: string;
  guests: number;
};

export const groupTrip: GroupTrip = {
  id: "trip-vegas-aug-15-18",
  name: "Vegas Weekend",
  destination: "Las Vegas",
  dates: "Aug 15–18",
  guests: 6,
};

export const members: Member[] = [
  { id: "alex",   name: "Alex",   initials: "A", color: "bg-[#1F4E8C] text-white" },
  { id: "maya",   name: "Maya",   initials: "M", color: "bg-[#7A3E97] text-white" },
  { id: "jordan", name: "Jordan", initials: "J", color: "bg-[#0A7C66] text-white" },
  { id: "sam",    name: "Sam",    initials: "S", color: "bg-[#B8651B] text-white" },
  { id: "priya",  name: "Priya",  initials: "P", color: "bg-[#B5365F] text-white" },
  { id: "leo",    name: "Leo",    initials: "L", color: "bg-[#1B4575] text-white" },
];

export const currentUserId = "alex";

export const hotelCatalog: HotelOption[] = [
  {
    id: "wynn",
    name: "Wynn Las Vegas",
    type: "hotel",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    rating: 4.8,
    reviewCount: 6421,
    pricePerNight: 349,
    location: "North Strip",
    addedBy: "maya",
    addedAtLabel: "Added by Maya · 2h ago",
    availability: "available",
    description:
      "Refined luxury on the North Strip with award-winning dining and a serene spa.",
  },
  {
    id: "venetian",
    name: "The Venetian Resort",
    type: "hotel",
    image:
      "https://images.unsplash.com/photo-1605346475498-9182a4ce0a25?auto=format&fit=crop&w=1600&q=80",
    rating: 4.7,
    reviewCount: 8932,
    pricePerNight: 289,
    location: "Center Strip",
    addedBy: "alex",
    addedAtLabel: "Added by Alex · 3h ago",
    availability: "available",
    description:
      "All-suite resort steps from the action on the center of the Strip.",
  },
  {
    id: "mgm",
    name: "MGM Grand",
    type: "hotel",
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1600&q=80",
    rating: 4.4,
    reviewCount: 12410,
    pricePerNight: 189,
    location: "South Strip",
    addedBy: "jordan",
    addedAtLabel: "Added just now",
    availability: "available",
    description:
      "High-energy resort with the largest pool complex on the Strip.",
  },
];

export const initialAddedOptionIds = ["wynn", "venetian"];

export const initialReactions: Record<string, ReactionMap> = {
  wynn: {
    alex: "yes",
    maya: "yes",
    jordan: "yes",
    sam: "not_for_me",
    priya: "yes",
    leo: null,
  },
  venetian: {
    alex: "yes",
    maya: "not_for_me",
    jordan: "yes",
    sam: null,
    priya: null,
    leo: null,
  },
};

export const memberById = (id: string) =>
  members.find((m) => m.id === id) ?? members[0];

export const hotelById = (id: string) =>
  hotelCatalog.find((h) => h.id === id);
