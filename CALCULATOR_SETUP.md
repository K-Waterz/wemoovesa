# Moving Cost Calculator - Setup Guide

## Overview

The Moving Cost Calculator is a comprehensive system that calculates moving costs based on:
- Starting and final destination locations
- Selected items from a predefined catalog
- Distance-based pricing
- Trailer requirements for heavy loads

## System Architecture

The calculator is built with a modular architecture:

### Core Modules

1. **`moving-calculator-types.js`** - Type definitions and constants
2. **`items-catalog.js`** - Item catalog service and data
3. **`distance-service.js`** - Distance calculation service
4. **`pricing-engine.js`** - Pricing calculations and trailer logic
5. **`moving-calculator.js`** - Main calculator controller
6. **`calculator-ui.js`** - User interface controller

## Configuration

### Distance API Setup

The calculator supports multiple distance calculation providers:

#### Option 1: OpenRouteService (Recommended - Free Tier Available)

1. Sign up at https://openrouteservice.org/
2. Get your free API key
3. Configure in your code:

```javascript
DistanceService.configure({
    provider: 'openrouteservice',
    openRouteServiceApiKey: 'YOUR_API_KEY_HERE'
});
```

#### Option 2: Google Distance Matrix API

1. Get an API key from Google Cloud Console
2. Enable the Distance Matrix API
3. Configure in your code:

```javascript
DistanceService.configure({
    provider: 'google',
    googleApiKey: 'YOUR_API_KEY_HERE'
});
```

#### Option 3: Fallback (No API Required)

The system includes a fallback method that uses free geocoding services. However, it's less accurate:

```javascript
DistanceService.configure({
    provider: 'fallback'
});
```

### Configuration Location

Add the configuration code in `calculator-ui.js` or create a separate config file loaded before the calculator:

```javascript
// Add this before the calculator initialization
document.addEventListener('DOMContentLoaded', () => {
    // Configure distance service
    DistanceService.configure({
        provider: 'openrouteservice',
        openRouteServiceApiKey: 'YOUR_API_KEY_HERE'
    });
    
    // Initialize calculator UI
    if (document.getElementById('movingCalculator')) {
        window.calculatorUI = new CalculatorUI();
    }
});
```

## How It Works

### Price Calculation Logic

1. **Per-KM Rate Calculation**:
   - Uses reference route: "The Reeds, Centurion" → "Tzaneen" = 365 km
   - Per-km rate = base_reference_price / 365

2. **Item Cost**:
   - Total item cost = (per_km_rate × distance_km) × weight_score × quantity

3. **Trailer Logic**:
   - Truck capacity = 20 weight points
   - If total weight > 20: trailer required
   - Trailer cost = max(R10,000, (distance_km × per_km_rate × 20))

### Example Calculation

For a move from "Pretoria" to "Johannesburg" (50 km) with:
- 1x Large Sofa (weight_score: 4, base_price: R4,500)
- 2x Box (Small) (weight_score: 1, base_price: R800)

**Step 1**: Calculate per-km rates
- Sofa: 4500 / 365 = R12.33/km
- Box: 800 / 365 = R2.19/km

**Step 2**: Calculate item costs
- Sofa: (12.33 × 50) × 4 × 1 = R2,466
- Boxes: (2.19 × 50) × 1 × 2 = R219

**Step 3**: Check trailer
- Total weight: (4 × 1) + (1 × 2) = 6 weight points
- 6 < 20, so no trailer needed

**Step 4**: Final total
- Subtotal: R2,466 + R219 = R2,685
- Trailer: R0
- **Total: R2,685**

## Adding/Modifying Items

Edit `js/items-catalog.js` to add or modify items:

```javascript
{
    name: "Item Name",
    category: "Category Name",
    weight_score: 1-4,  // 1=light, 4=very heavy
    base_reference_price: 4500  // Price for reference route (365km)
}
```

## Output Format

The calculator returns a structured JSON invoice:

```json
{
  "origin": "Pretoria",
  "destination": "Johannesburg",
  "distance_km": 50,
  "items": [
    {
      "name": "Large Sofa",
      "quantity": 1,
      "weight_score": 4,
      "item_cost": 2466
    }
  ],
  "subtotal": 2466,
  "trailer_required": false,
  "trailer_cost": 0,
  "total_cost": 2466
}
```

## Constants

Key constants can be adjusted in `moving-calculator-types.js`:

```javascript
const CONFIG = {
    TRUCK_CAPACITY: 20,              // Weight points
    TRAILER_MIN_COST: 10000,         // Minimum trailer cost (R)
    REFERENCE_DISTANCE_KM: 365,      // Reference route distance
    REFERENCE_ORIGIN: "The Reeds, Centurion",
    REFERENCE_DESTINATION: "Tzaneen"
};
```

## Troubleshooting

### Distance Calculation Not Working

- Verify API key is correctly configured
- Check browser console for API errors
- Ensure API quotas haven't been exceeded
- Fallback method will be used if API fails

### Prices Seem Incorrect

- Verify base_reference_price values in item catalog
- Check that reference distance (365km) matches your pricing model
- Ensure weight_score values are appropriate (1-4)

### Items Not Appearing

- Check that items are properly formatted in `items-catalog.js`
- Verify item names match exactly (case-sensitive)
- Check browser console for JavaScript errors

## Testing

To test the calculator:

1. Open the website
2. Navigate to the Calculator section
3. Enter origin and destination
4. Select items and quantities
5. Click "Calculate Cost"
6. Review the detailed breakdown

## Production Considerations

1. **API Rate Limiting**: Implement caching for distance calculations
2. **Error Handling**: Add user-friendly error messages
3. **Validation**: Validate all inputs before calculation
4. **Security**: Never expose API keys in client-side code (use a backend proxy)
5. **Performance**: Consider lazy-loading item catalog
6. **Backup**: Keep fallback distance calculation as backup

## Support

For issues or questions, check:
- Browser console for errors
- Network tab for API call failures
- Item catalog format
- API key configuration

