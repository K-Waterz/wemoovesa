/**
 * Moving Cost Calculator - Configuration Example
 * 
 * Copy this file to calculator-config.js and add your API keys
 * Make sure to add calculator-config.js to .gitignore to avoid committing API keys
 */

// Distance Service Configuration
// Uncomment and configure ONE of the following options:

// Option 1: OpenRouteService (Recommended - Free tier available)
// Sign up at https://openrouteservice.org/
/*
DistanceService.configure({
    provider: 'openrouteservice',
    openRouteServiceApiKey: 'YOUR_OPENROUTESERVICE_API_KEY_HERE'
});
*/

// Option 2: Google Distance Matrix API
// Get API key from https://console.cloud.google.com/
/*
DistanceService.configure({
    provider: 'google',
    googleApiKey: 'YOUR_GOOGLE_API_KEY_HERE'
});
*/

// Option 3: Fallback (No API key required, but less accurate)
/*
DistanceService.configure({
    provider: 'fallback'
});
*/

// Example: Using OpenRouteService with API key
// Replace 'YOUR_API_KEY_HERE' with your actual API key

document.addEventListener('DOMContentLoaded', () => {
    // Configure distance service BEFORE initializing calculator
    DistanceService.configure({
        provider: 'openrouteservice',
        openRouteServiceApiKey: 'YOUR_OPENROUTESERVICE_API_KEY_HERE' // Replace with your key
    });
    
    // Calculator UI will be initialized automatically in calculator-ui.js
});

