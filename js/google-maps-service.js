/**
 * Google Maps Service
 * Handles Google Maps Places Autocomplete and Distance Matrix integration
 */

/**
 * Google Maps Service
 * Manages Google Maps API integration
 */
class GoogleMapsService {
    /**
     * Check if Google Maps API is loaded
     * @returns {boolean}
     */
    static isLoaded() {
        return typeof google !== 'undefined' && 
               typeof google.maps !== 'undefined' &&
               typeof google.maps.places !== 'undefined';
    }

    /**
     * Initialize Places Autocomplete for an input field
     * @param {HTMLInputElement} inputElement - Input element to attach autocomplete to
     * @param {Object} options - Autocomplete options
     * @returns {google.maps.places.Autocomplete} Autocomplete instance
     */
    static initAutocomplete(inputElement, options = {}) {
        if (!this.isLoaded()) {
            throw new Error('Google Maps API is not loaded. Please check your API key.');
        }

        const defaultOptions = {
            componentRestrictions: { country: 'za' }, // Restrict to South Africa
            fields: ['formatted_address', 'geometry', 'name', 'address_components', 'place_id'],
            types: ['address', 'establishment']
        };

        const autocomplete = new google.maps.places.Autocomplete(
            inputElement,
            { ...defaultOptions, ...options }
        );

        return autocomplete;
    }

    /**
     * Get formatted address from place
     * @param {google.maps.places.PlaceResult} place
     * @returns {string}
     */
    static getFormattedAddress(place) {
        if (!place) return '';
        
        return place.formatted_address || place.name || '';
    }

    /**
     * Parse address components from Google Places result
     * @param {google.maps.places.PlaceResult} place
     * @returns {Object} Parsed address components
     */
    static parseAddressComponents(place) {
        if (!place || !place.address_components) {
            return {
                streetNumber: '',
                route: '',
                streetAddress: '',
                buildingUnit: '',
                suburb: '',
                city: '',
                province: '',
                postalCode: '',
                formattedAddress: this.getFormattedAddress(place)
            };
        }

        const components = place.address_components;
        const parsed = {
            streetNumber: '',
            route: '',
            streetAddress: '',
            buildingUnit: '',
            suburb: '',
            city: '',
            province: '',
            postalCode: '',
            formattedAddress: place.formatted_address || ''
        };

        components.forEach(component => {
            const types = component.types;

            if (types.includes('street_number')) {
                parsed.streetNumber = component.long_name;
            }

            if (types.includes('route')) {
                parsed.route = component.long_name;
            }

            if (types.includes('subpremise')) {
                parsed.buildingUnit = component.long_name;
            }

            if (types.includes('premise')) {
                parsed.buildingUnit = component.long_name;
            }

            if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
                parsed.suburb = component.long_name;
            }

            if (types.includes('locality')) {
                parsed.city = component.long_name;
            }

            if (types.includes('administrative_area_level_1')) {
                parsed.province = component.short_name;
            }

            if (types.includes('postal_code')) {
                parsed.postalCode = component.long_name;
            }
        });

        // Combine street number and route
        if (parsed.streetNumber && parsed.route) {
            parsed.streetAddress = `${parsed.streetNumber} ${parsed.route}`;
        } else if (parsed.route) {
            parsed.streetAddress = parsed.route;
        } else if (parsed.streetNumber) {
            parsed.streetAddress = parsed.streetNumber;
        }

        return parsed;
    }

    /**
     * Calculate distance using Google Distance Matrix API
     * @param {string} origin - Origin address
     * @param {string} destination - Destination address
     * @param {string} apiKey - Google Maps API key
     * @returns {Promise<{distance: number, duration: string}>} Distance in km and duration
     */
    static async calculateDistance(origin, destination, apiKey) {
        if (!this.isLoaded()) {
            // Fallback to Distance Matrix REST API if JavaScript API not available
            return await this.calculateDistanceREST(origin, destination, apiKey);
        }

        return new Promise((resolve, reject) => {
            const service = new google.maps.DistanceMatrixService();
            
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false,
                },
                (response, status) => {
                    if (status === google.maps.DistanceMatrixStatus.OK) {
                        const result = response.rows[0].elements[0];
                        
                        if (result.status === google.maps.DistanceMatrixElementStatus.OK) {
                            const distanceKm = result.distance.value / 1000; // Convert meters to km
                            const duration = result.duration.text;
                            
                            resolve({
                                distance: Math.round(distanceKm * 10) / 10, // Round to 1 decimal
                                duration: duration
                            });
                        } else {
                            reject(new Error(`Could not calculate distance: ${result.status}`));
                        }
                    } else {
                        reject(new Error(`Distance Matrix request failed: ${status}`));
                    }
                }
            );
        });
    }

    /**
     * Calculate distance using REST API (fallback)
     * @param {string} origin
     * @param {string} destination
     * @param {string} apiKey
     * @returns {Promise<{distance: number, duration: string}>}
     */
    static async calculateDistanceREST(origin, destination, apiKey) {
        if (!apiKey) {
            throw new Error('Google Maps API key is required');
        }

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${apiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Google API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.status !== 'OK' || !data.rows[0] || data.rows[0].elements[0].status !== 'OK') {
            throw new Error('Could not calculate distance. Please check the addresses.');
        }

        const element = data.rows[0].elements[0];
        const distanceKm = element.distance.value / 1000; // Convert meters to km
        
        return {
            distance: Math.round(distanceKm * 10) / 10, // Round to 1 decimal
            duration: element.duration.text
        };
    }

    /**
     * Wait for Google Maps API to load
     * @param {number} timeout - Maximum wait time in milliseconds
     * @returns {Promise<void>}
     */
    static async waitForLoad(timeout = 10000) {
        if (this.isLoaded()) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkInterval = setInterval(() => {
                if (this.isLoaded()) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error('Google Maps API failed to load within timeout'));
                }
            }, 100);
        });
    }
}

