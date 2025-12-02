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
     * Calculate per-km rate from baseline price
     * Uses reference: "The Reeds, Centurion" → "Tzaneen" = 299 km
     * @param {number} baselinePrice - Baseline price for reference route (299km)
     * @returns {number} Per-kilometer rate
     */
    static calculatePerKmRate(baselinePrice) {
        if (!baselinePrice || baselinePrice <= 0) {
            throw new Error('Invalid baseline price');
        }
        
        return baselinePrice / CONFIG.BASELINE_DISTANCE;
    }

    /**
     * Calculate cost for a single item using the new formula
     * Formula: distanceCost * weightMultiplier * quantity
     * where weightMultiplier = weightScore * WEIGHT_FACTOR
     * @param {CatalogItem} item - Item from catalog
     * @param {number} quantity - Quantity of item
     * @param {number} distanceKm - Distance in kilometers
     * @returns {number} Total cost for this item
     */
    static calculateItemCost(item, quantity, distanceKm) {
        if (!item || quantity <= 0 || distanceKm <= 0) {
            return 0;
        }

        // Per-km rate derived from baseline anchor (for BASELINE_DISTANCE km)
        const perKmRate = this.calculatePerKmRate(item.baseline_price);

        // Base distance scaled cost
        const distanceCost = perKmRate * distanceKm;

        // Weight multiplier
        const weightMultiplier = item.weight_score * CONFIG.WEIGHT_FACTOR;

        // Final item cost for quantity
        const finalItemCost = distanceCost * weightMultiplier * quantity;
        
        return this.roundToNearestRand(finalItemCost);
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
     * Formula: max(MIN_TRAILER_COST, distanceKm * TRAILER_RATE_PER_KM)
     * @param {number} distanceKm - Distance in kilometers
     * @returns {number} Trailer cost in Rands
     */
    static calculateTrailerCost(distanceKm) {
        const calculatedCost = distanceKm * CONFIG.TRAILER_RATE_PER_KM;
        const trailerCost = Math.max(CONFIG.TRAILER_MIN_COST, calculatedCost);
        
        return this.roundToNearestRand(trailerCost);
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
            trailerCost = this.calculateTrailerCost(distanceKm);
        }

        // Calculate total
        const totalCost = this.roundToNearestRand(roundedSubtotal + trailerCost);

        return {
            origin: origin,
            destination: destination,
            distance_km: Number(distanceKm.toFixed(1)),
            items: invoiceItems,
            subtotal: roundedSubtotal,
            trailer_required: trailerRequired,
            trailer_cost: trailerCost,
            total_cost: totalCost
        };
    }
}
