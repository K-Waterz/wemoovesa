/**
 * Moving Cost Calculator - Type Definitions
 * Data models and interfaces for the calculator system
 */

/**
 * @typedef {Object} CatalogItem
 * @property {string} name - Name of the item
 * @property {string} category - Category of the item
 * @property {number} weight_score - Weight score (1-4)
 * @property {number} base_reference_price - Base price used for per-km rate calculation
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
    TRUCK_CAPACITY: 20, // weight points
    TRAILER_MIN_COST: 10000, // R10,000 minimum
    REFERENCE_DISTANCE_KM: 365, // "The Reeds, Centurion" → "Tzaneen"
    REFERENCE_ORIGIN: "The Reeds, Centurion",
    REFERENCE_DESTINATION: "Tzaneen"
};

