/**
 * Moving Cost Calculator - Item Catalog
 * Full catalog with baseline prices for The Reeds (Centurion) -> Tzaneen (~299 km)
 */

/**
 * @type {CatalogItem[]}
 * Item catalog with id, name, category, weight_score (1-5), and baseline_price
 */
const ITEMS_CATALOG = [
  // Appliances
  { id: "laptop", name: "Laptop", category: "Appliances", weight_score: 1, baseline_price: 300 },
  { id: "office_chair", name: "Office Chair", category: "Appliances", weight_score: 2, baseline_price: 200 },
  { id: "bar_fridge", name: "Bar Fridge", category: "Appliances", weight_score: 2, baseline_price: 1025 },
  { id: "single_door_fridge", name: "Single-door Fridge", category: "Appliances", weight_score: 3, baseline_price: 1800 },
  { id: "double_door_fridge", name: "Double-door Fridge", category: "Appliances", weight_score: 3, baseline_price: 1800 },
  { id: "side_by_side_fridge", name: "Side-by-side Fridge", category: "Appliances", weight_score: 4, baseline_price: 2100 },
  { id: "chest_freezer_sm_md", name: "Chest Freezer (Small/Medium)", category: "Appliances", weight_score: 2, baseline_price: 1025 },
  { id: "upright_freezer", name: "Upright Freezer", category: "Appliances", weight_score: 3, baseline_price: 1800 },
  { id: "washing_machine", name: "Washing Machine", category: "Appliances", weight_score: 3, baseline_price: 1800 },
  { id: "tumble_dryer", name: "Tumble Dryer", category: "Appliances", weight_score: 3, baseline_price: 1800 },
  { id: "dishwasher", name: "Dishwasher", category: "Appliances", weight_score: 3, baseline_price: 1800 },
  { id: "microwave", name: "Microwave", category: "Appliances", weight_score: 1, baseline_price: 250 },

  // Electronics
  { id: "tv_small", name: "Small TV (32–40 inch)", category: "Electronics", weight_score: 1, baseline_price: 250 },
  { id: "tv_medium", name: "Medium TV (50–55 inch)", category: "Electronics", weight_score: 2, baseline_price: 1025 },
  { id: "tv_large", name: "Large TV (65+ inch)", category: "Electronics", weight_score: 3, baseline_price: 1800 },
  { id: "desktop_computer", name: "Desktop Computer", category: "Electronics", weight_score: 1, baseline_price: 250 },
  { id: "printer", name: "Printer", category: "Electronics", weight_score: 1, baseline_price: 250 },
  { id: "home_theatre", name: "Home Theatre System", category: "Electronics", weight_score: 2, baseline_price: 1025 },
  { id: "speakers", name: "Speakers", category: "Electronics", weight_score: 1, baseline_price: 250 },
  { id: "gaming_console", name: "Gaming Console", category: "Electronics", weight_score: 1, baseline_price: 250 },
  { id: "monitor", name: "Monitor", category: "Electronics", weight_score: 1, baseline_price: 250 },

  // Living Room
  { id: "couch_1_seater", name: "1-seater Couch", category: "Living Room", weight_score: 2, baseline_price: 1025 },
  { id: "couch_2_seater", name: "2-seater Couch", category: "Living Room", weight_score: 2, baseline_price: 1025 },
  { id: "couch_3_seater", name: "3-seater Couch", category: "Living Room", weight_score: 3, baseline_price: 1800 },
  { id: "l_shaped_small", name: "L-Shaped Couch (Small)", category: "Living Room", weight_score: 3, baseline_price: 1800 },
  { id: "l_shaped_large", name: "L-Shaped / U-Shaped Couch (Large)", category: "Living Room", weight_score: 4, baseline_price: 2100 },
  { id: "recliner", name: "Recliner", category: "Living Room", weight_score: 2, baseline_price: 1025 },
  { id: "ottoman", name: "Ottoman", category: "Living Room", weight_score: 1, baseline_price: 250 },
  { id: "coffee_table", name: "Coffee Table", category: "Living Room", weight_score: 1, baseline_price: 250 },
  { id: "tv_stand", name: "TV Stand", category: "Living Room", weight_score: 2, baseline_price: 1025 },
  { id: "bookshelf_small", name: "Bookshelf (Small)", category: "Living Room", weight_score: 2, baseline_price: 1025 },
  { id: "bookshelf_large", name: "Bookshelf (Large)", category: "Living Room", weight_score: 3, baseline_price: 1800 },

  // Bedroom
  { id: "mattress_single", name: "Single Bed Mattress", category: "Bedroom", weight_score: 2, baseline_price: 1025 },
  { id: "mattress_34", name: "Three-Quarter Mattress", category: "Bedroom", weight_score: 2, baseline_price: 1025 },
  { id: "mattress_double", name: "Double Mattress", category: "Bedroom", weight_score: 3, baseline_price: 1800 },
  { id: "mattress_queen", name: "Queen Mattress", category: "Bedroom", weight_score: 3, baseline_price: 1800 },
  { id: "mattress_king", name: "King Mattress", category: "Bedroom", weight_score: 3, baseline_price: 1800 },
  { id: "bed_frame_headboard", name: "Bed Frame / Headboard", category: "Bedroom", weight_score: 3, baseline_price: 1800 },
  { id: "bunk_bed", name: "Bunk Bed", category: "Bedroom", weight_score: 3, baseline_price: 1800 },
  { id: "wardrobe_2door", name: "Wardrobe (2-door)", category: "Bedroom", weight_score: 3, baseline_price: 1800 },
  { id: "wardrobe_4door", name: "Wardrobe (4-door Large)", category: "Bedroom", weight_score: 4, baseline_price: 2100 },
  { id: "chest_drawers_small", name: "Chest of Drawers (Small)", category: "Bedroom", weight_score: 2, baseline_price: 1025 },
  { id: "chest_drawers_large", name: "Chest of Drawers (Large)", category: "Bedroom", weight_score: 3, baseline_price: 1800 },

  // Dining Room
  { id: "dining_table_small", name: "Dining Table (2–4 seater)", category: "Dining Room", weight_score: 2, baseline_price: 1025 },
  { id: "dining_table_large", name: "Dining Table (6–8 seater)", category: "Dining Room", weight_score: 3, baseline_price: 1800 },
  { id: "dining_chair", name: "Dining Chair", category: "Dining Room", weight_score: 1, baseline_price: 250 },
  { id: "bar_stool", name: "Bar Stool", category: "Dining Room", weight_score: 1, baseline_price: 250 },

  // Outdoor and Garage
  { id: "patio_table", name: "Patio Table", category: "Outdoor & Garage", weight_score: 2, baseline_price: 1025 },
  { id: "patio_chairs", name: "Patio Chairs (each)", category: "Outdoor & Garage", weight_score: 1, baseline_price: 250 },
  { id: "braai_small", name: "Braai (Small)", category: "Outdoor & Garage", weight_score: 1, baseline_price: 250 },
  { id: "braai_large", name: "Braai (Large / Built-in)", category: "Outdoor & Garage", weight_score: 3, baseline_price: 1800 },
  { id: "lawnmower_small", name: "Lawnmower (Small)", category: "Outdoor & Garage", weight_score: 2, baseline_price: 1025 },
  { id: "lawnmower_rideon", name: "Lawnmower (Ride-on)", category: "Outdoor & Garage", weight_score: 4, baseline_price: 2100 },
  { id: "bicycle", name: "Bicycle", category: "Outdoor & Garage", weight_score: 1, baseline_price: 250 },
  { id: "motorbike", name: "Motorbike", category: "Outdoor & Garage", weight_score: 4, baseline_price: 2100 },
  { id: "wheelbarrow", name: "Wheelbarrow", category: "Outdoor & Garage", weight_score: 2, baseline_price: 1025 },
  { id: "toolbox", name: "Toolbox", category: "Outdoor & Garage", weight_score: 1, baseline_price: 250 },

  // Miscellaneous
  { id: "box_small", name: "Small Box", category: "Boxes", weight_score: 1, baseline_price: 250 },
  { id: "box_medium", name: "Medium Box", category: "Boxes", weight_score: 2, baseline_price: 1025 },
  { id: "box_large", name: "Large Box", category: "Boxes", weight_score: 3, baseline_price: 1800 },
  { id: "box_xl", name: "XL Box", category: "Boxes", weight_score: 3, baseline_price: 1800 },
  { id: "wardrobe_box", name: "Wardrobe Box", category: "Boxes", weight_score: 2, baseline_price: 1025 },
  { id: "mirror_small", name: "Mirror (Small)", category: "Miscellaneous", weight_score: 1, baseline_price: 250 },
  { id: "mirror_large", name: "Mirror (Large)", category: "Miscellaneous", weight_score: 3, baseline_price: 1800 },
  { id: "rug_small", name: "Rug (Small Rolled)", category: "Miscellaneous", weight_score: 1, baseline_price: 250 },
  { id: "rug_large", name: "Rug (Large Rolled)", category: "Miscellaneous", weight_score: 3, baseline_price: 1800 },
  { id: "safe_small", name: "Safe (Small)", category: "Miscellaneous", weight_score: 3, baseline_price: 1800 },
  { id: "safe_large", name: "Safe (Large / Heavy)", category: "Miscellaneous", weight_score: 4, baseline_price: 2100 },
  { id: "treadmill", name: "Treadmill", category: "Miscellaneous", weight_score: 4, baseline_price: 2100 }
];

/**
 * Item Catalog Service
 * Provides methods to interact with the item catalog
 */
class ItemCatalogService {
    /**
     * Get all items from the catalog
     * @returns {CatalogItem[]}
     */
    static getAllItems() {
        return ITEMS_CATALOG;
    }

    /**
     * Get items by category
     * @param {string} category
     * @returns {CatalogItem[]}
     */
    static getItemsByCategory(category) {
        return ITEMS_CATALOG.filter(item => item.category === category);
    }

    /**
     * Get all unique categories
     * @returns {string[]}
     */
    static getCategories() {
        const categories = new Set(ITEMS_CATALOG.map(item => item.category));
        return Array.from(categories).sort();
    }

    /**
     * Find item by name (case-insensitive)
     * @param {string} itemName
     * @returns {CatalogItem|null}
     */
    static findItemByName(itemName) {
        return ITEMS_CATALOG.find(
            item => item.name.toLowerCase() === itemName.toLowerCase()
        ) || null;
    }

    /**
     * Find item by ID
     * @param {string} itemId
     * @returns {CatalogItem|null}
     */
    static findItemById(itemId) {
        return ITEMS_CATALOG.find(
            item => item.id === itemId
        ) || null;
    }

    /**
     * Search items by name or category
     * @param {string} searchTerm
     * @returns {CatalogItem[]}
     */
    static searchItems(searchTerm) {
        const term = searchTerm.toLowerCase();
        return ITEMS_CATALOG.filter(
            item => 
                item.name.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term) ||
                item.id.toLowerCase().includes(term)
        );
    }
}
