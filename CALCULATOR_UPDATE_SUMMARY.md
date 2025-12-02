# Calculator Update Summary

## Changes Made

The calculator has been updated to match the new catalog and pricing specifications:

### 1. Updated Constants (`js/moving-calculator-types.js`)

- **BASELINE_DISTANCE**: Changed from 365 km → **299 km**
- **TRUCK_CAPACITY**: Changed from 20 → **50 weight points**
- **TRAILER_MIN_COST**: Remains **R10,000**
- **TRAILER_RATE_PER_KM**: Added **R35 per km** for trailer cost calculation
- **WEIGHT_FACTOR**: Added **0.85** multiplier

### 2. New Item Catalog (`js/items-catalog.js`)

- **Replaced entire catalog** with 83 new items
- **New structure**: Items now have `id`, `name`, `category`, `weight_score`, and `baseline_price`
- **Categories**: 
  - Appliances
  - Electronics
  - Living Room
  - Bedroom
  - Dining Room
  - Outdoor & Garage
  - Boxes
  - Miscellaneous

### 3. Updated Pricing Formula (`js/pricing-engine.js`)

**Old Formula:**
```
itemCost = (perKmRate × distanceKm) × weightScore × quantity
```

**New Formula:**
```
perKmRate = baseline_price / 299
distanceCost = perKmRate × distanceKm
weightMultiplier = weightScore × 0.85
finalItemCost = distanceCost × weightMultiplier × quantity
```

**Trailer Cost:**
```
trailerCost = max(R10,000, distanceKm × R35)
```

### 4. Key Differences

| Aspect | Old | New |
|--------|-----|-----|
| Reference Distance | 365 km | 299 km |
| Truck Capacity | 20 points | 50 points |
| Weight Factor | N/A | 0.85 |
| Trailer Calculation | Complex | Simple: max(R10K, distance × R35) |
| Item Structure | name only | id + name |
| Price Field | base_reference_price | baseline_price |

## Testing

To verify the calculator works correctly:

1. **Test with reference route:**
   - Origin: "The Reeds, Centurion"
   - Destination: "Tzaneen"
   - Distance: ~299 km

2. **Test pricing:**
   - Double-door Fridge (baseline: R1,800, weight: 3)
   - Should calculate: (1800/299) × 299 × (3 × 0.85) × 1 = R1,530

3. **Test trailer:**
   - Add items totaling > 50 weight points
   - Should trigger trailer requirement
   - Trailer cost = max(R10,000, distance × R35)

## Migration Notes

- All existing functionality preserved
- UI remains unchanged (still uses item names)
- Backward compatible (finds items by name)
- New items automatically available in UI

## Next Steps

1. Test calculator with new catalog
2. Verify pricing calculations match expectations
3. Test trailer logic with weight > 50
4. Update documentation if needed

