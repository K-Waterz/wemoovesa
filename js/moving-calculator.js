/**
 * Moving Cost Calculator - Main Controller
 * Orchestrates the entire calculation process
 */

/**
 * Moving Calculator Controller
 * Main controller that coordinates all services
 */
class MovingCalculator {
    /**
     * Calculate moving cost from user inputs
     * @param {string} origin - Starting location
     * @param {string} destination - Final destination
     * @param {Array<{itemName: string, quantity: number}>} selectedItems - Selected items with quantities
     * @returns {Promise<MovingInvoice>} Complete invoice
     */
    static async calculateMove(origin, destination, selectedItems) {
        // Validate inputs
        this.validateInputs(origin, destination, selectedItems);

        // Convert item names to catalog items
        const catalogItems = this.getCatalogItems(selectedItems);

        // Calculate distance
        const distanceKm = await DistanceService.calculateDistance(origin, destination);

        // Prepare items for pricing engine
        const itemsForPricing = catalogItems.map((catalogItem, index) => ({
            item: catalogItem,
            quantity: selectedItems[index].quantity
        }));

        // Calculate invoice
        const invoice = PricingEngine.calculateInvoice(
            origin,
            destination,
            distanceKm,
            itemsForPricing
        );

        return invoice;
    }

    /**
     * Validate user inputs
     * @param {string} origin
     * @param {string} destination
     * @param {Array} selectedItems
     * @throws {Error} If validation fails
     */
    static validateInputs(origin, destination, selectedItems) {
        if (!origin || typeof origin !== 'string' || origin.trim() === '') {
            throw new Error('Origin location is required');
        }

        if (!destination || typeof destination !== 'string' || destination.trim() === '') {
            throw new Error('Destination location is required');
        }

        if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
            throw new Error('At least one item must be selected');
        }

        selectedItems.forEach((selected, index) => {
            if (!selected.itemName || typeof selected.itemName !== 'string') {
                throw new Error(`Invalid item name at position ${index + 1}`);
            }

            if (!selected.quantity || typeof selected.quantity !== 'number' || selected.quantity <= 0) {
                throw new Error(`Invalid quantity for item "${selected.itemName}"`);
            }

            if (selected.quantity % 1 !== 0) {
                throw new Error(`Quantity must be a whole number for item "${selected.itemName}"`);
            }
        });
    }

    /**
     * Get catalog items from selected item names
     * @param {Array<{itemName: string, quantity: number}>} selectedItems
     * @returns {CatalogItem[]}
     * @throws {Error} If any item is not found
     */
    static getCatalogItems(selectedItems) {
        const catalogItems = [];

        selectedItems.forEach(selected => {
            const catalogItem = ItemCatalogService.findItemByName(selected.itemName);
            
            if (!catalogItem) {
                throw new Error(`Item "${selected.itemName}" not found in catalog`);
            }

            catalogItems.push(catalogItem);
        });

        return catalogItems;
    }

    /**
     * Get formatted invoice as JSON string
     * @param {MovingInvoice} invoice
     * @returns {string} JSON string
     */
    static formatInvoiceAsJSON(invoice) {
        return JSON.stringify(invoice, null, 2);
    }

    /**
     * Get human-readable invoice summary
     * @param {MovingInvoice} invoice
     * @returns {string} Formatted summary
     */
    static formatInvoiceSummary(invoice) {
        const lines = [
            `Origin: ${invoice.origin}`,
            `Destination: ${invoice.destination}`,
            `Distance: ${invoice.distance_km} km`,
            '',
            'Items:',
            ...invoice.items.map(item => 
                `  • ${item.name} (x${item.quantity}) - Weight: ${item.weight_score} - Cost: R${item.item_cost.toLocaleString()}`
            ),
            '',
            `Subtotal: R${invoice.subtotal.toLocaleString()}`
        ];

        if (invoice.trailer_required) {
            lines.push(`Trailer Required: Yes`);
            lines.push(`Trailer Cost: R${invoice.trailer_cost.toLocaleString()}`);
        }

        lines.push(`Total Cost: R${invoice.total_cost.toLocaleString()}`);

        return lines.join('\n');
    }
}

