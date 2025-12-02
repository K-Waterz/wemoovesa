/**
 * Map Picker Component
 * Handles interactive map for picking locations with draggable markers
 */

/**
 * Map Picker Class
 * Manages the map modal and location picking functionality
 */
class MapPicker {
    constructor() {
        this.map = null;
        this.marker = null;
        this.geocoder = null;
        this.currentInput = null;
        this.currentType = null; // 'origin' or 'destination'
        this.selectedPlace = null;
        this.modal = null;
        this.searchInput = null;
        this.init();
    }

    /**
     * Initialize the map picker
     */
    async init() {
        this.modal = document.getElementById('mapModal');
        this.searchInput = document.getElementById('mapSearchInput');
        
        if (!this.modal) return;

        // Wait for Google Maps API to load
        try {
            await GoogleMapsService.waitForLoad(10000);
            this.geocoder = new google.maps.Geocoder();
        } catch (error) {
            console.warn('Google Maps API not available:', error);
        }

        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Open map buttons
        document.getElementById('pickOriginMap')?.addEventListener('click', () => {
            this.openMap('origin');
        });

        document.getElementById('pickDestinationMap')?.addEventListener('click', () => {
            this.openMap('destination');
        });

        // Close map modal
        document.getElementById('closeMapModal')?.addEventListener('click', () => {
            this.closeMap();
        });

        document.getElementById('cancelMapBtn')?.addEventListener('click', () => {
            this.closeMap();
        });

        // Confirm location button
        document.getElementById('confirmMapBtn')?.addEventListener('click', () => {
            this.confirmLocation();
        });

        // Map search
        document.getElementById('mapSearchBtn')?.addEventListener('click', () => {
            this.searchLocation();
        });

        this.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchLocation();
            }
        });

        // Close on outside click
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeMap();
            }
        });
    }

    /**
     * Open map modal for picking location
     * @param {string} type - 'origin' or 'destination'
     */
    async openMap(type) {
        if (!this.modal) return;

        this.currentType = type;
        
        // Get the corresponding input field
        const inputId = type === 'origin' ? 'calculatorOrigin' : 'calculatorDestination';
        this.currentInput = document.getElementById(inputId);
        
        if (!this.currentInput) return;

        // Show search bar
        const searchBar = document.querySelector('.map-search-bar');
        if (searchBar) searchBar.style.display = 'flex';

        // Update modal title
        const title = document.getElementById('mapModalTitle');
        if (title) {
            title.textContent = `Pick ${type === 'origin' ? 'Pick-up' : 'Delivery'} Location on Map`;
        }

        // Show modal
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Reset map for location picking (remove route if showing)
        if (this.map) {
            // Clear any existing route
            const directionsRenderer = this.map.directionsRenderer;
            if (directionsRenderer) {
                directionsRenderer.setMap(null);
            }

            // Reinitialize marker for picking
            if (!this.marker) {
                this.marker = new google.maps.Marker({
                    map: this.map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    title: 'Drag to set exact location'
                });

                this.marker.addListener('dragend', () => {
                    this.reverseGeocode(this.marker.getPosition());
                });
            } else {
                this.marker.setMap(this.map);
                this.marker.setDraggable(true);
            }
        }

        // Initialize map if not already initialized
        if (!this.map) {
            await this.initializeMap();
        } else {
            // Center map on current location if available
            const currentAddress = this.currentInput.value.trim();
            if (currentAddress) {
                await this.geocodeAddress(currentAddress);
            } else {
                // Center on South Africa
                this.map.setCenter({ lat: -25.7479, lng: 28.2293 });
                this.map.setZoom(8);
            }
        }

        // Update instructions
        const instructions = document.querySelector('.map-instructions');
        if (instructions) {
            instructions.innerHTML = `
                <p><i class="fas fa-info-circle"></i> Enter an address above or click on the map to set location. Drag the marker to adjust the exact spot.</p>
                <div class="selected-location-info">
                    <strong>Selected Location:</strong>
                    <span id="selectedLocationAddress">No location selected</span>
                </div>
            `;
        }

        // Focus search input
        setTimeout(() => {
            this.searchInput?.focus();
        }, 100);
    }

    /**
     * Initialize Google Map
     */
    async initializeMap() {
        if (!window.google || !window.google.maps) {
            console.error('Google Maps API not loaded');
            return;
        }

        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;

        // Initialize map centered on South Africa
        this.map = new google.maps.Map(mapContainer, {
            zoom: 8,
            center: { lat: -25.7479, lng: 28.2293 }, // Centurion, South Africa
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true
        });

        // Initialize marker
        this.marker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: 'Drag to set exact location'
        });

        // Add click listener to map
        this.map.addListener('click', (e) => {
            this.setMarkerPosition(e.latLng);
            this.reverseGeocode(e.latLng);
        });

        // Add marker drag listener
        this.marker.addListener('dragend', () => {
            this.reverseGeocode(this.marker.getPosition());
        });

        // Try to get current address from input
        const currentAddress = this.currentInput?.value.trim();
        if (currentAddress) {
            await this.geocodeAddress(currentAddress);
        }
    }

    /**
     * Set marker position
     * @param {google.maps.LatLng} position
     */
    setMarkerPosition(position) {
        if (this.marker && position) {
            this.marker.setPosition(position);
            this.map.setCenter(position);
            this.map.setZoom(15);
        }
    }

    /**
     * Search for location and move marker
     */
    async searchLocation() {
        const query = this.searchInput?.value.trim();
        if (!query) return;

        await this.geocodeAddress(query);
    }

    /**
     * Geocode address and set marker
     * @param {string} address
     */
    async geocodeAddress(address) {
        if (!this.geocoder || !this.map) return;

        this.geocoder.geocode({ address: address + ', South Africa' }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                this.setMarkerPosition(location);
                
                // Store place information
                this.selectedPlace = {
                    address: results[0].formatted_address,
                    location: location,
                    place_id: results[0].place_id,
                    placeResult: results[0] // Store full result for address parsing
                };

                this.updateSelectedLocationDisplay(results[0].formatted_address);
            } else {
                alert('Location not found. Please try a different address.');
            }
        });
    }

    /**
     * Reverse geocode coordinates to get address
     * @param {google.maps.LatLng} position
     */
    reverseGeocode(position) {
        if (!this.geocoder || !position) return;

        this.geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const result = results[0];
                const address = result.formatted_address;
                
                // Create a place-like object from geocoder result
                const placeResult = {
                    formatted_address: address,
                    geometry: { location: position },
                    place_id: result.place_id,
                    address_components: result.address_components
                };
                
                this.selectedPlace = {
                    address: address,
                    location: position,
                    place_id: result.place_id,
                    placeResult: placeResult
                };
                this.updateSelectedLocationDisplay(address);
            }
        });
    }

    /**
     * Update selected location display
     * @param {string} address
     */
    updateSelectedLocationDisplay(address) {
        const display = document.getElementById('selectedLocationAddress');
        if (display) {
            display.textContent = address;
        }
    }

    /**
     * Confirm selected location
     */
    async confirmLocation() {
        if (this.selectedPlace && this.currentInput) {
            const address = this.selectedPlace.address;
            this.currentInput.value = address;
            
            // Populate address fields if place result is available
            if (this.selectedPlace.placeResult && window.calculatorUI) {
                const type = this.currentType; // 'origin' or 'destination'
                window.calculatorUI.populateAddressFields(type, this.selectedPlace.placeResult);
            } else if (this.selectedPlace.place_id && window.calculatorUI) {
                // Try to get full place details if not already available
                try {
                    const service = new google.maps.places.PlacesService(this.map);
                    service.getDetails({
                        placeId: this.selectedPlace.place_id,
                        fields: ['formatted_address', 'address_components', 'geometry']
                    }, (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                            const type = this.currentType; // 'origin' or 'destination'
                            window.calculatorUI.populateAddressFields(type, place);
                        }
                    });
                } catch (error) {
                    console.warn('Could not get place details:', error);
                }
            }
            
            // Trigger input event to update any autocomplete listeners
            this.currentInput.dispatchEvent(new Event('input'));
            
            // Update map preview if both locations are set
            this.updateMapPreview();
        }
        
        this.closeMap();
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
     * Close map modal
     */
    closeMap() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        // Clear search
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        
        this.selectedPlace = null;
        this.currentInput = null;
        this.currentType = null;
    }

    /**
     * View route on map (show both locations)
     */
    async viewRoute() {
        const origin = document.getElementById('calculatorOrigin')?.value.trim();
        const destination = document.getElementById('calculatorDestination')?.value.trim();
        
        if (!origin || !destination) return;

        // Open map in a larger view showing both locations
        await this.openRouteMap(origin, destination);
    }

    /**
     * Open map showing route between two locations
     * @param {string} origin
     * @param {string} destination
     */
    async openRouteMap(origin, destination) {
        if (!this.modal) return;

        // Update modal title
        const title = document.getElementById('mapModalTitle');
        if (title) {
            title.textContent = 'Route Preview';
        }

        // Hide search bar for route view
        const searchBar = document.querySelector('.map-search-bar');
        if (searchBar) searchBar.style.display = 'none';

        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Initialize map if needed
        if (!this.map) {
            await this.initializeMap();
        }

        // Clear existing marker
        if (this.marker) {
            this.marker.setMap(null);
        }

        // Geocode both addresses and show route
        await this.showRoute(origin, destination);
    }

    /**
     * Show route between two locations
     * @param {string} origin
     * @param {string} destination
     */
    async showRoute(origin, destination) {
        if (!this.geocoder || !this.map) return;

        // Geocode both addresses
        Promise.all([
            new Promise((resolve, reject) => {
                this.geocoder.geocode({ address: origin + ', South Africa' }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        resolve(results[0].geometry.location);
                    } else {
                        reject('Origin not found');
                    }
                });
            }),
            new Promise((resolve, reject) => {
                this.geocoder.geocode({ address: destination + ', South Africa' }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        resolve(results[0].geometry.location);
                    } else {
                        reject('Destination not found');
                    }
                });
            })
        ]).then(([originLocation, destLocation]) => {
            // Create markers
            const originMarker = new google.maps.Marker({
                position: originLocation,
                map: this.map,
                title: 'Pick-up Location',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                }
            });

            const destMarker = new google.maps.Marker({
                position: destLocation,
                map: this.map,
                title: 'Delivery Location',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
            });

            // Fit bounds to show both markers
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(originLocation);
            bounds.extend(destLocation);
            this.map.fitBounds(bounds);

            // Draw route using Directions Service
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
                map: this.map,
                suppressMarkers: false
            });

            directionsService.route({
                origin: originLocation,
                destination: destLocation,
                travelMode: google.maps.TravelMode.DRIVING
            }, (result, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(result);
                }
            });

            // Update instructions
            const instructions = document.querySelector('.map-instructions');
            if (instructions) {
                instructions.innerHTML = `
                    <p><i class="fas fa-route"></i> Route preview showing pick-up and delivery locations with driving route.</p>
                `;
            }
        }).catch((error) => {
            alert('Could not display route: ' + error);
        });
    }
}

// Initialize map picker when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mapPicker = new MapPicker();
});

