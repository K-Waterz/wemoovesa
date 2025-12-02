/**
 * Moving Cost Calculator - Pricing Engine
 * Handles all price calculations including per-km rates and trailer logic
 */

/**
 * Pricing Engine
 * Calculates moving costs based on distance and items
 */
class PricingEngine {
    /**
     * Calculate per-km rate from reference price
     * Uses reference: "The Reeds, Centurion" → "Tzaneen" = 365 km
     * @param {number} baseReferencePrice - Base reference price for 365km
     * @returns {number} Per-kilometer rate
     */
    static calculatePerKmRate(baseReferencePrice) {
        if (!baseReferencePrice || baseReferencePrice <= 0) {
            throw new Error('Invalid base reference price');
        }
        
        return baseReferencePrice / CONFIG.REFERENCE_DISTANCE_KM;
    }

    /**
     * Calculate cost for a single item
     * @param {CatalogItem} item - Item from catalog
     * @param {number} quantity - Quantity of item
     * @param {number} distanceKm - Distance in kilometers
     * @returns {number} Total cost for this item
     */
    static calculateItemCost(item, quantity, distanceKm) {
        if (!item || quantity <= 0 || distanceKm <= 0) {
            return 0;
        }

        const perKmRate = this.calculatePerKmRate(item.base_reference_price);
        const itemCost = (perKmRate * distanceKm) * item.weight_score;
        
        return this.roundToNearestRand(itemCost * quantity);
    }

    /**
     * Calculate total weight score for all selected items
     * @param {Array<{item: CatalogItem, quantity: number}>} selectedItems
     * @returns {number} Total weight score
     */
    static calculateTotalWeightScore(selectedItems) {
        return selectedItems.reduce((total, selected) => {
            return total + (selected.item.weight_score * selected.quantity);
        }, 0);
    }

    /**
     * Check if trailer is required
     * @param {number} totalWeightScore
     * @returns {boolean}
     */
    static isTrailerRequired(totalWeightScore) {
        return totalWeightScore > CONFIG.TRUCK_CAPACITY;
    }

    /**
     * Calculate trailer cost
     * @param {number} distanceKm - Distance in kilometers
     * @param {number} perKmRate - Base per-km rate
     * @returns {number} Trailer cost in Rands
     */
    static calculateTrailerCost(distanceKm, perKmRate) {
        // Trailer cost = max(10,000, (distance_km * per_km_rate * 20))
        const calculatedCost = distanceKm * perKmRate * CONFIG.TRUCK_CAPACITY;
        const trailerCost = Math.max(CONFIG.TRAILER_MIN_COST, calculatedCost);
        
        return this.roundToNearestRand(trailerCost);
    }

    /**
     * Calculate the average per-km rate from all selected items
     * Uses the average of all item per-km rates
     * @param {Array<{item: CatalogItem, quantity: number}>} selectedItems
     * @returns {number} Average per-km rate
     */
    static calculateAveragePerKmRate(selectedItems) {
        if (!selectedItems || selectedItems.length === 0) {
            return 0;
        }

        const totalRate = selectedItems.reduce((sum, selected) => {
            const itemRate = this.calculatePerKmRate(selected.item.base_reference_price);
            return sum + itemRate;
        }, 0);

        return totalRate / selectedItems.length;
    }

    /**
     * Round to nearest whole Rand
     * @param {number} amount
     * @returns {number}
     */
    static roundToNearestRand(amount) {
        return Math.round(amount);
    }

    /**
     * Calculate complete invoice for a move
     * @param {string} origin - Starting location
     * @param {string} destination - Final destination
     * @param {number} distanceKm - Distance in kilometers
     * @param {Array<{item: CatalogItem, quantity: number}>} selectedItems
     * @returns {MovingInvoice} Complete invoice object
     */
    static calculateInvoice(origin, destination, distanceKm, selectedItems) {
        if (!origin || !destination) {
            throw new Error('Origin and destination are required');
        }

        if (!selectedItems || selectedItems.length === 0) {
            throw new Error('At least one item must be selected');
        }

        if (distanceKm <= 0) {
            throw new Error('Invalid distance');
        }

        // Calculate item costs
        const invoiceItems = selectedItems.map(selected => {
            const itemCost = this.calculateItemCost(selected.item, selected.quantity, distanceKm);
            
            return {
                name: selected.item.name,
                quantity: selected.quantity,
                weight_score: selected.item.weight_score,
                item_cost: itemCost
            };
        });

        // Calculate subtotal
        const subtotal = invoiceItems.reduce((sum, item) => sum + item.item_cost, 0);
        const roundedSubtotal = this.roundToNearestRand(subtotal);

        // Calculate total weight score
        const totalWeightScore = this.calculateTotalWeightScore(selectedItems);

        // Check if trailer is required
        const trailerRequired = this.isTrailerRequired(totalWeightScore);

        // Calculate trailer cost if needed
        let trailerCost = 0;
        if (trailerRequired) {
            // Use average per-km rate for trailer calculation
            const avgPerKmRate = this.calculateAveragePerKmRate(selectedItems);
            trailerCost = this.calculateTrailerCost(distanceKm, avgPerKmRate);
        }

        // Calculate total
        const totalCost = this.roundToNearestRand(roundedSubtotal + trailerCost);

        return {
            origin: origin,
            destination: destination,
            distance_km: distanceKm,
            items: invoiceItems,
            subtotal: roundedSubtotal,
            trailer_required: trailerRequired,
            trailer_cost: trailerCost,
            total_cost: totalCost
        };
    }
}

