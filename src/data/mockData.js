// Shared mock data for FoundIt (Phase 1 - frontend only).
// Please don't edit directly.

export const categories = ["Electronics", "Bags", "Documents", "Keys", "Clothing", "Other"];

export const users = [
  { id: 1, name: "Amina Wanjiru", email: "amina@example.com" },
  { id: 2, name: "Brian Otieno", email: "brian@example.com" },
  { id: 3, name: "Grace Mwangi", email: "grace@example.com" },
];

export const items = [
  { id: 1, itemName: "Black Backpack", reportType: "lost", category: "Bags",
    description: "Black JanSport backpack with a red keychain and a laptop inside.",
    date: "2026-09-28", location: { name: "Sarit Centre, Westlands", lat: -1.2615, lon: 36.8025 },
    photo: "", status: "active", reportedBy: 1 },
  { id: 2, itemName: "Black Backpack", reportType: "found", category: "Bags",
    description: "Black backpack found near the food court. Has a keychain attached.",
    date: "2026-09-28", location: { name: "Westgate Mall, Westlands", lat: -1.2567, lon: 36.803 },
    photo: "", status: "active", reportedBy: 2 },
  { id: 3, itemName: "Samsung Phone", reportType: "lost", category: "Electronics",
    description: "Samsung Galaxy A54 in a blue case with a cracked screen protector.",
    date: "2026-09-25", location: { name: "Kenyatta Avenue, Nairobi CBD", lat: -1.2841, lon: 36.8255 },
    photo: "", status: "active", reportedBy: 3 },
  { id: 4, itemName: "Phone in Blue Case", reportType: "found", category: "Electronics",
    description: "Samsung phone in a blue case found on a matatu bench.",
    date: "2026-09-26", location: { name: "Archives Stage, Nairobi CBD", lat: -1.2849, lon: 36.8243 },
    photo: "", status: "active", reportedBy: 1 },
  { id: 5, itemName: "National ID Card", reportType: "lost", category: "Documents",
    description: "Kenyan national ID card, lost together with a brown wallet.",
    date: "2026-09-22", location: { name: "Yaya Centre, Kilimani", lat: -1.2925, lon: 36.7874 },
    photo: "", status: "active", reportedBy: 2 },
  { id: 6, itemName: "ID Card", reportType: "found", category: "Documents",
    description: "National ID card found at the parking entrance.",
    date: "2026-09-23", location: { name: "The Junction Mall, Ngong Road", lat: -1.2986, lon: 36.7625 },
    photo: "", status: "active", reportedBy: 3 },
  { id: 7, itemName: "Car Keys", reportType: "lost", category: "Keys",
    description: "Toyota car key with a small green bottle-opener keyring.",
    date: "2026-09-20", location: { name: "Two Rivers Mall, Limuru Road", lat: -1.2105, lon: 36.7955 },
    photo: "", status: "resolved", reportedBy: 1 },
  { id: 8, itemName: "Grey Hoodie", reportType: "found", category: "Clothing",
    description: "Grey hoodie, size M, left on a bench near the lake.",
    date: "2026-09-27", location: { name: "Uhuru Park, Nairobi", lat: -1.2885, lon: 36.8165 },
    photo: "", status: "active", reportedBy: 2 },
  { id: 9, itemName: "Wireless Earbuds", reportType: "lost", category: "Electronics",
    description: "White earbuds in a charging case with a sticker on the lid.",
    date: "2026-09-29", location: { name: "Garden City Mall, Thika Road", lat: -1.2322, lon: 36.8786 },
    photo: "", status: "active", reportedBy: 3 },
  { id: 10, itemName: "Water Bottle", reportType: "found", category: "Other",
    description: "Silver metal water bottle found on the walking trail.",
    date: "2026-09-26", location: { name: "Karura Forest, Nairobi", lat: -1.24, lon: 36.833 },
    photo: "", status: "active", reportedBy: 1 },
];

