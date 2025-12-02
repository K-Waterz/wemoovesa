/**
 * Moving Cost Calculator - Item Catalog
 * Contains the predefined JSON list of items available for moving
 */

/**
 * @type {CatalogItem[]}
 * Item catalog with name, category, weight_score (1-4), and base_reference_price
 */
const ITEMS_CATALOG = [
    // Furniture - Heavy items (weight_score: 4)
    { name: "Large Sofa", category: "Furniture", weight_score: 4, base_reference_price: 4500 },
    { name: "Dining Table (6-seater)", category: "Furniture", weight_score: 4, base_reference_price: 4200 },
    { name: "King Size Bed", category: "Furniture", weight_score: 4, base_reference_price: 4800 },
    { name: "Large Wardrobe", category: "Furniture", weight_score: 4, base_reference_price: 5000 },
    { name: "Refrigerator", category: "Appliances", weight_score: 4, base_reference_price: 3800 },
    { name: "Washing Machine", category: "Appliances", weight_score: 4, base_reference_price: 3600 },
    
    // Furniture - Medium-heavy items (weight_score: 3)
    { name: "Queen Size Bed", category: "Furniture", weight_score: 3, base_reference_price: 3800 },
    { name: "Medium Wardrobe", category: "Furniture", weight_score: 3, base_reference_price: 3500 },
    { name: "Desk", category: "Furniture", weight_score: 3, base_reference_price: 2800 },
    { name: "Bookcase", category: "Furniture", weight_score: 3, base_reference_price: 2700 },
    { name: "Dining Chairs (set of 4)", category: "Furniture", weight_score: 3, base_reference_price: 2500 },
    { name: "TV Stand", category: "Furniture", weight_score: 3, base_reference_price: 2200 },
    { name: "Dishwasher", category: "Appliances", weight_score: 3, base_reference_price: 3200 },
    { name: "Tumble Dryer", category: "Appliances", weight_score: 3, base_reference_price: 3100 },
    { name: "Oven", category: "Appliances", weight_score: 3, base_reference_price: 3300 },
    
    // Furniture - Medium items (weight_score: 2)
    { name: "Single Bed", category: "Furniture", weight_score: 2, base_reference_price: 2400 },
    { name: "Coffee Table", category: "Furniture", weight_score: 2, base_reference_price: 1800 },
    { name: "Side Table", category: "Furniture", weight_score: 2, base_reference_price: 1500 },
    { name: "Office Chair", category: "Furniture", weight_score: 2, base_reference_price: 1600 },
    { name: "Small Wardrobe", category: "Furniture", weight_score: 2, base_reference_price: 2000 },
    { name: "TV (55 inch)", category: "Electronics", weight_score: 2, base_reference_price: 1900 },
    { name: "Microwave", category: "Appliances", weight_score: 2, base_reference_price: 1700 },
    { name: "Piano (Upright)", category: "Furniture", weight_score: 2, base_reference_price: 4200 },
    
    // Light items (weight_score: 1)
    { name: "Box (Small)", category: "Boxes", weight_score: 1, base_reference_price: 800 },
    { name: "Box (Medium)", category: "Boxes", weight_score: 1, base_reference_price: 1000 },
    { name: "Box (Large)", category: "Boxes", weight_score: 1, base_reference_price: 1200 },
    { name: "Lamp", category: "Furniture", weight_score: 1, base_reference_price: 900 },
    { name: "Picture Frame", category: "Decor", weight_score: 1, base_reference_price: 600 },
    { name: "Plant Pot", category: "Decor", weight_score: 1, base_reference_price: 700 },
    { name: "Small Appliance", category: "Appliances", weight_score: 1, base_reference_price: 1100 },
    { name: "Bicycle", category: "Miscellaneous", weight_score: 1, base_reference_price: 1500 },
    { name: "Suitcase", category: "Miscellaneous", weight_score: 1, base_reference_price: 950 },
    { name: "TV (32 inch)", category: "Electronics", weight_score: 1, base_reference_price: 1300 }
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
     * Search items by name or category
     * @param {string} searchTerm
     * @returns {CatalogItem[]}
     */
    static searchItems(searchTerm) {
        const term = searchTerm.toLowerCase();
        return ITEMS_CATALOG.filter(
            item => 
                item.name.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term)
        );
    }
}

