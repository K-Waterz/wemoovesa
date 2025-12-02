/**
 * Moving Cost Calculator - UI Controller
 * Handles all UI interactions and form management
 */

/**
 * Calculator UI Controller
 * Manages the calculator form and displays results
 */
class CalculatorUI {
    constructor() {
        this.selectedItems = [];
        this.invoice = null;
        this.isCalculating = false;
        this.init();
    }

    /**
     * Initialize the calculator UI
     */
    async init() {
        this.loadItemsIntoUI();
        this.attachEventListeners();
        this.updateSelectedItemsDisplay();
        await this.initGoogleMapsAutocomplete();
    }

    /**
     * Initialize Google Maps Places Autocomplete for location inputs
     */
    async initGoogleMapsAutocomplete() {
        try {
            // Wait for Google Maps API to load
            await GoogleMapsService.waitForLoad(10000);
            
            const originInput = document.getElementById('calculatorOrigin');
            const destinationInput = document.getElementById('calculatorDestination');
            
            if (originInput && destinationInput) {
                // Ensure inputs are properly configured for autocomplete
                originInput.setAttribute('autocomplete', 'off');
                destinationInput.setAttribute('autocomplete', 'off');
                
                // Initialize autocomplete for origin
                try {
                    this.originAutocomplete = GoogleMapsService.initAutocomplete(originInput);
                    
                    // Add place changed listeners
                    this.originAutocomplete.addListener('place_changed', () => {
                        const place = this.originAutocomplete.getPlace();
                        if (place && place.geometry) {
                            originInput.value = GoogleMapsService.getFormattedAddress(place);
                            this.populateAddressFields('origin', place);
                            this.updateMapPreview();
                        }
                    });
                } catch (error) {
                    console.warn('Could not initialize origin autocomplete:', error);
                }
                
                // Initialize autocomplete for destination
                try {
                    this.destinationAutocomplete = GoogleMapsService.initAutocomplete(destinationInput);
                    
                    // Add place changed listeners
                    this.destinationAutocomplete.addListener('place_changed', () => {
                        const place = this.destinationAutocomplete.getPlace();
                        if (place && place.geometry) {
                            destinationInput.value = GoogleMapsService.getFormattedAddress(place);
                            this.populateAddressFields('destination', place);
                            this.updateMapPreview();
                        }
                    });
                } catch (error) {
                    console.warn('Could not initialize destination autocomplete:', error);
                }
            }

            // Address fields are always visible now - no toggles needed

            // Listen for input changes to update map preview
            originInput?.addEventListener('input', () => {
                this.updateMapPreview();
            });

            destinationInput?.addEventListener('input', () => {
                this.updateMapPreview();
            });

            // View route button
            document.getElementById('viewMapBtn')?.addEventListener('click', () => {
                if (window.mapPicker) {
                    const origin = originInput?.value.trim();
                    const destination = destinationInput?.value.trim();
                    if (origin && destination) {
                        window.mapPicker.openRouteMap(origin, destination);
                    }
                }
            });
        } catch (error) {
            console.warn('Google Maps Autocomplete not available:', error);
            // Continue without autocomplete - users can still type addresses
        }
    }

    /**
     * Populate address detail fields from Google Places result
     * @param {string} type - 'origin' or 'destination'
     * @param {google.maps.places.PlaceResult} place
     */
    populateAddressFields(type, place) {
        const addressData = GoogleMapsService.parseAddressComponents(place);
        const prefix = type === 'origin' ? 'origin' : 'destination';

        // Populate fields (they're always visible now)
        const streetAddress = document.getElementById(`${prefix}StreetAddress`);
        const buildingUnit = document.getElementById(`${prefix}BuildingUnit`);
        const suburb = document.getElementById(`${prefix}Suburb`);
        const city = document.getElementById(`${prefix}City`);
        const province = document.getElementById(`${prefix}Province`);
        const postalCode = document.getElementById(`${prefix}PostalCode`);

        if (streetAddress) streetAddress.value = addressData.streetAddress || '';
        if (buildingUnit) buildingUnit.value = addressData.buildingUnit || '';
        if (suburb) suburb.value = addressData.suburb || '';
        if (city) city.value = addressData.city || '';
        if (province) province.value = addressData.province || '';
        if (postalCode) postalCode.value = addressData.postalCode || '';
    }

    /**
     * Setup toggle buttons for address details
     */
    setupAddressDetailsToggles() {
        const toggleOrigin = document.getElementById('toggleOriginDetails');
        const toggleDestination = document.getElementById('toggleDestinationDetails');

        toggleOrigin?.addEventListener('click', () => {
            this.toggleAddressDetails('origin');
        });

        toggleDestination?.addEventListener('click', () => {
            this.toggleAddressDetails('destination');
        });
    }

    /**
     * Toggle address details section
     * @param {string} type - 'origin' or 'destination'
     */
    toggleAddressDetails(type) {
        const prefix = type === 'origin' ? 'origin' : 'destination';
        const content = document.getElementById(`${prefix}DetailsContent`);
        const button = document.getElementById(`toggle${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Details`);
        const icon = button?.querySelector('i');

        if (content && button) {
            const isExpanded = content.style.display !== 'none';
            
            if (isExpanded) {
                content.style.display = 'none';
                if (icon) {
                    icon.className = 'fas fa-chevron-down';
                }
                button.classList.remove('expanded');
            } else {
                content.style.display = 'block';
                if (icon) {
                    icon.className = 'fas fa-chevron-up';
                }
                button.classList.add('expanded');
            }
        }
    }

    /**
     * Update map preview button visibility
     */
    updateMapPreview() {
        const origin = document.getElementById('calculatorOrigin')?.value.trim();
        const destination = document.getElementById('calculatorDestination')?.value.trim();
        const previewContainer = document.getElementById('mapPreviewContainer');
        
        if (previewContainer) {
            if (origin && destination) {
                previewContainer.style.display = 'block';
            } else {
                previewContainer.style.display = 'none';
            }
        }
    }

    /**
     * Load items from catalog into the UI
     */
    loadItemsIntoUI() {
        const itemsContainer = document.getElementById('calculatorItems');
        if (!itemsContainer) return;

        // Get all categories
        const categories = ItemCatalogService.getCategories();
        
        // Populate category filter dropdown
        const categoryFilter = document.getElementById('calculatorCategoryFilter');
        if (categoryFilter) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }

        // Group items by category
        const itemsByCategory = {};
        categories.forEach(category => {
            itemsByCategory[category] = ItemCatalogService.getItemsByCategory(category);
        });

        // Build HTML
        let html = '';
        categories.forEach(category => {
            html += `<div class="calculator-category">
                <h4 class="calculator-category-title">${category}</h4>
                <div class="calculator-items-grid">`;

            itemsByCategory[category].forEach(item => {
                html += `
                    <div class="calculator-item-card" data-item-name="${item.name}">
                        <div class="calculator-item-info">
                            <div class="calculator-item-name">${item.name}</div>
                            <div class="calculator-item-weight">Weight: ${item.weight_score}</div>
                        </div>
                        <div class="calculator-item-controls">
                            <button type="button" class="btn-quantity" data-action="decrease" data-item="${item.name}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="item-quantity" data-item="${item.name}">0</span>
                            <button type="button" class="btn-quantity" data-action="increase" data-item="${item.name}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
        });

        itemsContainer.innerHTML = html;
    }

    /**
     * Attach event listeners to calculator form
     */
    attachEventListeners() {
        // Quantity buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-quantity')) {
                const button = e.target.closest('.btn-quantity');
                const action = button.dataset.action;
                const itemName = button.dataset.item;
                this.handleQuantityChange(itemName, action === 'increase' ? 1 : -1);
            }
        });

        // Calculate button
        const calculateBtn = document.getElementById('calculateMoveBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCalculate();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('resetCalculatorBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleReset();
            });
        }

        // Item search
        const searchInput = document.getElementById('calculatorSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter by category
        const categoryFilter = document.getElementById('calculatorCategoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.handleCategoryFilter(e.target.value);
            });
        }
    }

    /**
     * Handle quantity change for an item
     * @param {string} itemName
     * @param {number} delta - Change amount (1 or -1)
     */
    handleQuantityChange(itemName, delta) {
        const quantityElement = document.querySelector(`.item-quantity[data-item="${itemName}"]`);
        if (!quantityElement) return;

        let currentQuantity = parseInt(quantityElement.textContent) || 0;
        const newQuantity = Math.max(0, currentQuantity + delta);

        quantityElement.textContent = newQuantity;

        // Update selected items array
        const existingIndex = this.selectedItems.findIndex(item => item.itemName === itemName);

        if (newQuantity > 0) {
            if (existingIndex >= 0) {
                this.selectedItems[existingIndex].quantity = newQuantity;
            } else {
                this.selectedItems.push({
                    itemName: itemName,
                    quantity: newQuantity
                });
            }
        } else {
            if (existingIndex >= 0) {
                this.selectedItems.splice(existingIndex, 1);
            }
        }

        // Update UI
        this.updateSelectedItemsDisplay();
        this.updateItemCardState(itemName, newQuantity);
    }

    /**
     * Update visual state of item card based on quantity
     * @param {string} itemName
     * @param {number} quantity
     */
    updateItemCardState(itemName, quantity) {
        const itemCard = document.querySelector(`.calculator-item-card[data-item-name="${itemName}"]`);
        if (itemCard) {
            if (quantity > 0) {
                itemCard.classList.add('selected');
            } else {
                itemCard.classList.remove('selected');
            }
        }
    }

    /**
     * Update selected items display
     */
    updateSelectedItemsDisplay() {
        const selectedContainer = document.getElementById('selectedItemsList');
        if (!selectedContainer) return;

        if (this.selectedItems.length === 0) {
            selectedContainer.innerHTML = '<p class="no-items-message">No items selected. Add items using the buttons above.</p>';
            return;
        }

        let html = '<ul class="selected-items-list">';
        this.selectedItems.forEach(selected => {
            const catalogItem = ItemCatalogService.findItemByName(selected.itemName);
            html += `
                <li class="selected-item">
                    <span class="selected-item-name">${selected.itemName}</span>
                    <span class="selected-item-quantity">x${selected.quantity}</span>
                    <button type="button" class="btn-remove-item" data-item="${selected.itemName}">
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            `;
        });
        html += '</ul>';

        selectedContainer.innerHTML = html;

        // Attach remove buttons
        selectedContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemName = btn.dataset.item;
                this.handleQuantityChange(itemName, -999); // Remove all
            });
        });
    }

    /**
     * Build full address from address detail fields
     * @param {string} type - 'origin' or 'destination'
     * @returns {string} Full formatted address
     */
    buildFullAddress(type) {
        const prefix = type === 'origin' ? 'origin' : 'destination';
        
        // Get main search input address
        const mainAddress = document.getElementById(`calculator${type === 'origin' ? 'Origin' : 'Destination'}`)?.value.trim() || '';
        
        // Get address detail fields
        const streetAddress = document.getElementById(`${prefix}StreetAddress`)?.value.trim() || '';
        const buildingUnit = document.getElementById(`${prefix}BuildingUnit`)?.value.trim() || '';
        const suburb = document.getElementById(`${prefix}Suburb`)?.value.trim() || '';
        const city = document.getElementById(`${prefix}City`)?.value.trim() || '';
        const province = document.getElementById(`${prefix}Province`)?.value.trim() || '';
        const postalCode = document.getElementById(`${prefix}PostalCode`)?.value.trim() || '';
        
        // If address details are filled, build from details
        if (streetAddress || city) {
            const addressParts = [];
            
            if (buildingUnit) addressParts.push(buildingUnit);
            if (streetAddress) addressParts.push(streetAddress);
            if (suburb) addressParts.push(suburb);
            if (city) addressParts.push(city);
            if (province) addressParts.push(province);
            if (postalCode) addressParts.push(postalCode);
            
            return addressParts.join(', ') || mainAddress;
        }
        
        // Otherwise use main search input
        return mainAddress;
    }

    /**
     * Handle calculate button click
     */
    async handleCalculate() {
        // Build full addresses from detail fields
        const origin = this.buildFullAddress('origin');
        const destination = this.buildFullAddress('destination');

        // Validate
        if (!origin || origin.trim() === '') {
            this.showError('Please enter pick-up location.');
            return;
        }

        if (!destination || destination.trim() === '') {
            this.showError('Please enter delivery destination.');
            return;
        }

        if (this.selectedItems.length === 0) {
            this.showError('Please select at least one item to move.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);
        this.clearError();

        try {
            // Calculate
            const invoice = await MovingCalculator.calculateMove(
                origin,
                destination,
                this.selectedItems
            );

            this.invoice = invoice;
            this.displayResults(invoice);
            this.scrollToResults();
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError(`Error calculating cost: ${error.message || 'Please check your inputs and try again.'}`);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Display calculation results
     * @param {MovingInvoice} invoice
     */
    displayResults(invoice) {
        const resultsContainer = document.getElementById('calculatorResults');
        if (!resultsContainer) return;

        let html = `
            <div class="calculator-results-content">
                <h3 class="results-title">Moving Cost Estimate</h3>
                
                <div class="results-summary">
                    <div class="result-row">
                        <span class="result-label">Origin:</span>
                        <span class="result-value">${invoice.origin}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Destination:</span>
                        <span class="result-value">${invoice.destination}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">Distance:</span>
                        <span class="result-value">${invoice.distance_km} km</span>
                    </div>
                </div>

                <div class="results-items">
                    <h4>Items Breakdown</h4>
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Weight Score</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        invoice.items.forEach(item => {
            html += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.weight_score}</td>
                    <td>R${item.item_cost.toLocaleString()}</td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-totals">
                    <div class="total-row">
                        <span class="total-label">Subtotal:</span>
                        <span class="total-value">R${invoice.subtotal.toLocaleString()}</span>
                    </div>
        `;

        if (invoice.trailer_required) {
            html += `
                    <div class="total-row trailer-row">
                        <span class="total-label">Trailer Required:</span>
                        <span class="total-value">Yes</span>
                    </div>
                    <div class="total-row trailer-row">
                        <span class="total-label">Trailer Cost:</span>
                        <span class="total-value">R${invoice.trailer_cost.toLocaleString()}</span>
                    </div>
            `;
        }

        html += `
                    <div class="total-row final-total">
                        <span class="total-label">Total Cost:</span>
                        <span class="total-value">R${invoice.total_cost.toLocaleString()}</span>
                    </div>
                </div>

                <div class="results-actions">
                    <button type="button" class="btn btn-secondary" id="downloadJSONBtn">
                        <i class="fas fa-download"></i> Download JSON
                    </button>
                    <button type="button" class="btn btn-primary" id="printResultsBtn">
                        <i class="fas fa-print"></i> Print Results
                    </button>
                </div>
            </div>
        `;

        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
        
        // Add print date attribute for print styles
        const now = new Date();
        resultsContainer.setAttribute('data-print-date', now.toLocaleString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }));

        // Attach action buttons
        document.getElementById('downloadJSONBtn')?.addEventListener('click', () => {
            this.downloadJSON();
        });

        document.getElementById('printResultsBtn')?.addEventListener('click', () => {
            this.printResults();
        });
    }

    /**
     * Print calculator results only
     */
    printResults() {
        // Open print dialog
        window.print();
    }

    /**
     * Handle reset button click
     */
    handleReset() {
        this.selectedItems = [];
        this.invoice = null;
        
        // Clear main location inputs
        document.getElementById('calculatorOrigin').value = '';
        document.getElementById('calculatorDestination').value = '';
        
        // Clear all address detail fields (always visible now)
        ['origin', 'destination'].forEach(prefix => {
            const streetAddress = document.getElementById(`${prefix}StreetAddress`);
            const buildingUnit = document.getElementById(`${prefix}BuildingUnit`);
            const suburb = document.getElementById(`${prefix}Suburb`);
            const city = document.getElementById(`${prefix}City`);
            const province = document.getElementById(`${prefix}Province`);
            const postalCode = document.getElementById(`${prefix}PostalCode`);
            
            if (streetAddress) streetAddress.value = '';
            if (buildingUnit) buildingUnit.value = '';
            if (suburb) suburb.value = '';
            if (city) city.value = '';
            if (province) province.value = '';
            if (postalCode) postalCode.value = '';
        });
        
        // Reset all quantities
        document.querySelectorAll('.item-quantity').forEach(el => {
            el.textContent = '0';
        });

        // Reset item cards
        document.querySelectorAll('.calculator-item-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Clear map preview
        const previewContainer = document.getElementById('mapPreviewContainer');
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }

        // Clear results
        const resultsContainer = document.getElementById('calculatorResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
        }

        // Clear search and filter
        const searchInput = document.getElementById('calculatorSearch');
        if (searchInput) searchInput.value = '';
        
        const categoryFilter = document.getElementById('calculatorCategoryFilter');
        if (categoryFilter) categoryFilter.value = '';
        
        // Show all items and categories
        document.querySelectorAll('.calculator-item-card').forEach(card => {
            card.style.display = '';
        });
        
        document.querySelectorAll('.calculator-category').forEach(category => {
            category.style.display = '';
        });

        // Clear errors
        this.clearError();
        this.updateSelectedItemsDisplay();
        this.updateMapPreview();
    }

    /**
     * Handle search input
     * @param {string} searchTerm
     */
    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase();
        document.querySelectorAll('.calculator-item-card').forEach(card => {
            const itemName = card.dataset.itemName.toLowerCase();
            const category = card.closest('.calculator-category')?.querySelector('.calculator-category-title')?.textContent.toLowerCase() || '';
            
            if (itemName.includes(term) || category.includes(term)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Handle category filter
     * @param {string} category
     */
    handleCategoryFilter(category) {
        document.querySelectorAll('.calculator-category').forEach(categoryEl => {
            if (category === '' || categoryEl.querySelector('.calculator-category-title').textContent === category) {
                categoryEl.style.display = '';
            } else {
                categoryEl.style.display = 'none';
            }
        });
    }

    /**
     * Set loading state
     * @param {boolean} isLoading
     */
    setLoadingState(isLoading) {
        this.isCalculating = isLoading;
        const calculateBtn = document.getElementById('calculateMoveBtn');
        const resultsContainer = document.getElementById('calculatorResults');

        if (calculateBtn) {
            calculateBtn.disabled = isLoading;
            if (isLoading) {
                calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
            } else {
                calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate Cost';
            }
        }

        if (isLoading && resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    /**
     * Show error message
     * @param {string} message
     */
    showError(message) {
        const errorContainer = document.getElementById('calculatorError');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
        }
    }

    /**
     * Clear error message
     */
    clearError() {
        const errorContainer = document.getElementById('calculatorError');
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.textContent = '';
        }
    }

    /**
     * Scroll to results section
     */
    scrollToResults() {
        const resultsContainer = document.getElementById('calculatorResults');
        if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Download invoice as JSON
     */
    downloadJSON() {
        if (!this.invoice) return;

        const json = MovingCalculator.formatInvoiceAsJSON(this.invoice);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `moving-quote-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize calculator UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('movingCalculator')) {
        window.calculatorUI = new CalculatorUI();
    }
});

