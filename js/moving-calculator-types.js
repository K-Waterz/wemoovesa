/**
 * Moving Cost Calculator - Type Definitions
 * Data models and interfaces for the calculator system
 */

/**
 * @typedef {Object} CatalogItem
 * @property {string} id - Unique identifier for the item
 * @property {string} name - Display name of the item
 * @property {string} category - Category of the item
 * @property {number} weight_score - Weight score (1-5)
 * @property {number} baseline_price - Baseline price for reference route (299 km)
 */

/**
 * @typedef {Object} SelectedItem
 * @property {string} name - Name of the item
 * @property {number} quantity - Quantity selected
 * @property {number} weight_score - Weight score per unit
 * @property {number} item_cost - Calculated cost for this item
 */

/**
 * @typedef {Object} InvoiceItem
 * @property {string} name - Item name
 * @property {number} quantity - Quantity
 * @property {number} weight_score - Weight score
 * @property {number} item_cost - Item cost
 */

/**
 * @typedef {Object} MovingInvoice
 * @property {string} origin - Starting location
 * @property {string} destination - Final destination
 * @property {number} distance_km - Distance in kilometers
 * @property {InvoiceItem[]} items - Array of items with costs
 * @property {number} subtotal - Subtotal before trailer
 * @property {boolean} trailer_required - Whether trailer is needed
 * @property {number} trailer_cost - Trailer cost if required
 * @property {number} total_cost - Final total cost
 */

/**
 * Constants
 */
const CONFIG = {
    BASELINE_DISTANCE: 299, // Baseline distance (reference route: The Reeds, Centurion -> Tzaneen)
    TRUCK_CAPACITY: 50, // weight points (1-ton Kia threshold)
    TRAILER_MIN_COST: 10000, // R10,000 minimum when trailer is required
    TRAILER_RATE_PER_KM: 35, // Per-km rate for trailer cost calculation
    REFERENCE_ORIGIN: "The Reeds, Centurion",
    REFERENCE_DESTINATION: "Tzaneen"
};

