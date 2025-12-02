/**
 * Moving Cost Calculator - Distance Service
 * Handles distance calculation between two locations
 */

/**
 * Distance Service
 * Calculates driving distance between two locations using various APIs
 */
class DistanceService {
    /**
     * Configuration for distance calculation
     */
    static config = {
        // Use Google Maps by default for better accuracy
        provider: 'google', // 'google' | 'openrouteservice' | 'fallback'
        
        // Google Distance Matrix API key (required for Google provider)
        googleApiKey: '',
        
        // OpenRouteService API key (get from https://openrouteservice.org/)
        openRouteServiceApiKey: '',
        
        // Fallback: use a simple calculation based on coordinates
        // This requires geocoding first, but we'll provide a simple fallback
    };

    /**
     * Calculate distance between two locations
     * @param {string} origin - Starting location
     * @param {string} destination - Final destination
     * @returns {Promise<number>} Distance in kilometers
     */
    static async calculateDistance(origin, destination) {
        if (!origin || !destination) {
            throw new Error('Origin and destination are required');
        }

        // Get API key from window object if not configured
        if (!this.config.googleApiKey && window.GOOGLE_MAPS_API_KEY && window.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
            this.config.googleApiKey = window.GOOGLE_MAPS_API_KEY;
        }

        try {
            switch (this.config.provider) {
                case 'google':
                    if (this.config.googleApiKey) {
                        return await this.calculateDistanceGoogle(origin, destination);
                    }
                    // Fall through to fallback if no API key
                    console.warn('Google Maps API key not configured, using fallback');
                    return await this.calculateDistanceFallback(origin, destination);
                case 'openrouteservice':
                    return await this.calculateDistanceOpenRouteService(origin, destination);
                default:
                    return await this.calculateDistanceFallback(origin, destination);
            }
        } catch (error) {
            console.warn('Distance calculation failed, using fallback:', error);
            return await this.calculateDistanceFallback(origin, destination);
        }
    }

    /**
     * Calculate distance using OpenRouteService API
     * @param {string} origin
     * @param {string} destination
     * @returns {Promise<number>}
     */
    static async calculateDistanceOpenRouteService(origin, destination) {
        if (!this.config.openRouteServiceApiKey) {
            throw new Error('OpenRouteService API key not configured');
        }

        // Geocode addresses first
        const originCoords = await this.geocodeAddress(origin);
        const destCoords = await this.geocodeAddress(destination);

        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${this.config.openRouteServiceApiKey}&start=${originCoords[0]},${originCoords[1]}&end=${destCoords[0]},${destCoords[1]}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`OpenRouteService API error: ${response.statusText}`);
        }

        const data = await response.json();
        const distanceMeters = data.features[0].properties.segments[0].distance;
        return Math.round((distanceMeters / 1000) * 10) / 10; // Convert to km and round to 1 decimal
    }

    /**
     * Calculate distance using Google Distance Matrix API
     * @param {string} origin
     * @param {string} destination
     * @returns {Promise<number>}
     */
    static async calculateDistanceGoogle(origin, destination) {
        if (!this.config.googleApiKey) {
            throw new Error('Google API key not configured');
        }

        // Try using Google Maps JavaScript API first, then fall back to REST API
        try {
            const result = await GoogleMapsService.calculateDistance(
                origin,
                destination,
                this.config.googleApiKey
            );
            return result.distance;
        } catch (error) {
            console.warn('Google Maps JS API failed, trying REST API:', error);
            // Fall back to REST API
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${this.config.googleApiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Google API error: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== 'OK' || !data.rows[0] || data.rows[0].elements[0].status !== 'OK') {
                throw new Error('Could not calculate distance. Please check the addresses.');
            }

            const distanceMeters = data.rows[0].elements[0].distance.value;
            return Math.round((distanceMeters / 1000) * 10) / 10; // Convert to km and round to 1 decimal
        }
    }

    /**
     * Fallback distance calculation
     * Uses a simple estimation based on known distances or coordinate calculation
     * @param {string} origin
     * @param {string} destination
     * @returns {Promise<number>}
     */
    static async calculateDistanceFallback(origin, destination) {
        // For production, you should implement a proper geocoding and distance calculation
        // This is a placeholder that returns a reasonable default
        console.warn('Using fallback distance calculation. Consider configuring an API key for accurate distances.');
        
        // Try to get coordinates using a free geocoding service
        try {
            const originCoords = await this.geocodeAddressFree(origin);
            const destCoords = await this.geocodeAddressFree(destination);
            
            if (originCoords && destCoords) {
                return this.calculateHaversineDistance(originCoords, destCoords);
            }
        } catch (error) {
            console.warn('Geocoding failed, using default estimate:', error);
        }
        
        // Default: return a moderate distance estimate (can be improved with better logic)
        return 250; // Default to 250km - should be replaced with better estimation
    }

    /**
     * Geocode address to coordinates (for OpenRouteService)
     * @param {string} address
     * @returns {Promise<[number, number]>} [longitude, latitude]
     */
    static async geocodeAddress(address) {
        if (!this.config.openRouteServiceApiKey) {
            throw new Error('API key required for geocoding');
        }

        const url = `https://api.openrouteservice.org/geocoding/search?api_key=${this.config.openRouteServiceApiKey}&text=${encodeURIComponent(address)}&boundary.country=ZA`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();
        if (data.features && data.features.length > 0) {
            return data.features[0].geometry.coordinates; // [lon, lat]
        }
        
        throw new Error('Address not found');
    }

    /**
     * Free geocoding using Nominatim (OpenStreetMap)
     * @param {string} address
     * @returns {Promise<[number, number]|null>} [latitude, longitude] or null
     */
    static async geocodeAddressFree(address) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', South Africa')}&limit=1`;
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'WeMooveSACalculator/1.0'
                }
            });
            
            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            if (data && data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
            
            return null;
        } catch (error) {
            console.warn('Free geocoding failed:', error);
            return null;
        }
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {[number, number]} coord1 - [latitude, longitude]
     * @param {[number, number]} coord2 - [latitude, longitude]
     * @returns {number} Distance in kilometers
     */
    static calculateHaversineDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(coord2[0] - coord1[0]);
        const dLon = this.toRad(coord2[1] - coord1[1]);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(coord1[0])) * Math.cos(this.toRad(coord2[0])) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return Math.round(distance * 10) / 10; // Round to 1 decimal place
    }

    /**
     * Convert degrees to radians
     * @param {number} deg
     * @returns {number}
     */
    static toRad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Set API configuration
     * @param {Object} config
     */
    static configure(config) {
        this.config = { ...this.config, ...config };
    }
}

