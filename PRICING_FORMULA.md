# Final Pricing Formula

## Item Cost Calculation

**Simple Formula:**
```javascript
perKmRate = item.baseline_price / 299
cost = perKmRate × distanceKm × quantity
```

No weight multiplier - the baseline prices already account for item weight/complexity.

## Example Calculation

**Item:** Double-door Fridge
- baseline_price: R1,800
- weight_score: 3 (only used for trailer threshold)
- quantity: 1
- distance: 299 km (reference route)

**Calculation:**
```
perKmRate = 1800 / 299 = R6.02/km
cost = 6.02 × 299 × 1 = R1,800
```

For a different distance (e.g., 150 km):
```
cost = 6.02 × 150 × 1 = R903
```

## Trailer Logic

**Trigger:** Total weight > 50 points

**Cost:**
```javascript
trailerCost = max(R10,000, distanceKm × R35)
```

**Example:**
- Distance: 400 km
- Trailer cost = max(10,000, 400 × 35) = max(10,000, 14,000) = **R14,000**

- Distance: 200 km  
- Trailer cost = max(10,000, 200 × 35) = max(10,000, 7,000) = **R10,000** (minimum)

## Constants

- **BASELINE_DISTANCE**: 299 km
- **TRUCK_CAPACITY**: 50 weight points
- **MIN_TRAILER_COST**: R10,000
- **TRAILER_RATE_PER_KM**: R35

## Notes

- Baseline prices are for the reference route (The Reeds → Tzaneen, 299 km)
- Weight scores are only used to determine if a trailer is needed
- All costs are rounded to the nearest Rand
- Formula is linear: cost scales directly with distance

