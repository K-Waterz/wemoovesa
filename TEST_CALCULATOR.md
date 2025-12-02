# Calculator End-to-End Testing Guide

## Quick Start Testing

### 1. Open the Website
1. Open `index.html` in your browser
2. Navigate to the "Moving Cost Calculator" section
3. Open browser Developer Tools (F12) → Console tab

### 2. Verify Calculator Loads
**Check Console:**
- Should see NO red errors
- Calculator should initialize silently

**Check Visual:**
- ✅ Calculator section visible
- ✅ Location input fields visible (Pick-up & Delivery)
- ✅ Items catalog displays below
- ✅ Calculate button visible

### 3. Test Item Selection (Easiest to test first)

**Steps:**
1. Scroll to items list
2. Click "+" button on "Laptop" (should see quantity change to 1)
3. Click "+" again (quantity = 2)
4. Click "-" (quantity = 1)
5. Check "Selected Items" section shows "Laptop x1"

**Expected:** Items can be added/removed, quantities update, selected items display

---

## Full Test Procedure

### Test A: Basic Item Selection
1. **Select 3 items:**
   - Double-door Fridge (1x)
   - Small Box (2x)
   - Office Chair (1x)

2. **Verify:**
   - Items appear in "Selected Items" section
   - Quantities are correct
   - Can remove items using X button

**Pass/Fail**: ___ ✅/❌

---

### Test B: Location Input (Without Google Maps API)
**If you don't have Google Maps API key configured:**

1. **Manual Entry:**
   - Pick-up: Type "The Reeds, Centurion"
   - Delivery: Type "Tzaneen"

2. **Verify:**
   - Addresses accept text input
   - No errors appear
   - Fields can be cleared

**Pass/Fail**: ___ ✅/❌

---

### Test C: Location Input (With Google Maps API)
**If you have Google Maps API key configured:**

1. **Autocomplete Test:**
   - Click in "Pick-up Location" field
   - Type "The Reeds"
   - Should see dropdown suggestions
   - Select a suggestion
   - Verify address fills in

2. **Address Details:**
   - Click "Add/Edit Address Details"
   - Verify fields populated (street, suburb, city, etc.)
   - Try editing fields
   - Verify changes saved

**Pass/Fail**: ___ ✅/❌

---

### Test D: Map Picker (With Google Maps API)
1. Click "Map" button next to location input
2. Map modal should open
3. Try searching for an address in the map
4. Click on the map to place a marker
5. Drag marker to adjust position
6. Click "Use This Location"
7. Verify address populated in input field

**Pass/Fail**: ___ ✅/❌

---

### Test E: Distance Calculation
**Use this test route:**
- Origin: "The Reeds, Centurion"
- Destination: "Tzaneen"
- **Expected distance:** ~299 km

**Steps:**
1. Enter both locations
2. Select at least one item
3. Click "Calculate Cost"
4. Check results show distance

**Expected Results:**
- ✅ Loading spinner appears
- ✅ Distance shows in results (~299 km)
- ✅ Results section displays

**Pass/Fail**: ___ ✅/❌

---

### Test F: Price Calculation
**Test Data:**
- Route: "The Reeds, Centurion" → "Tzaneen" (299 km)
- Items:
  - Double-door Fridge: 1x (weight 3, baseline R1800)
  - Small Box: 1x (weight 1, baseline R250)

**Expected Calculation:**
- Per-km rate for Fridge: 1800 / 299 = ~6.02 R/km
- Per-km rate for Box: 250 / 299 = ~0.84 R/km
- Fridge cost: 6.02 × 299 × 1 = ~1,800 R
- Box cost: 0.84 × 299 × 1 = ~251 R
- Subtotal: ~2,051 R

**Steps:**
1. Enter test data
2. Calculate
3. Verify costs match expectations (approximately)

**Pass/Fail**: ___ ✅/❌

---

### Test G: Trailer Logic
**Test Data:**
- Route: Any (300+ km recommended)
- Items: Select items totaling > 50 weight points
  - Example: 20x "Small Box" (20 × 1 = 20 points)
  - Plus: 10x "Double-door Fridge" (10 × 3 = 30 points)
  - Total: 50 points → Need more!
  - Add: 1x "Double-door Fridge" = 53 points total

**Expected:**
- ✅ "Trailer Required: Yes" shown
- ✅ Trailer cost: max(10000, 300 × 35) = R10,000 (minimum)
- ✅ Total includes trailer cost

**Pass/Fail**: ___ ✅/❌

---

### Test H: Results Display
After calculation, verify:
- ✅ Origin and destination shown
- ✅ Distance displayed correctly
- ✅ Items breakdown table shows:
  - Item name
  - Quantity
  - Weight score
  - Cost
- ✅ Subtotal displayed
- ✅ Trailer info (if applicable)
- ✅ Total cost displayed
- ✅ "Print Results" button visible
- ✅ "Download JSON" button visible

**Pass/Fail**: ___ ✅/❌

---

### Test I: Print Functionality
1. Complete a calculation
2. Click "Print Results"
3. Check print preview

**Expected:**
- ✅ Only results visible (website hidden)
- ✅ Results formatted nicely
- ✅ Date/time shown

**Pass/Fail**: ___ ✅/❌

---

### Test J: JSON Download
1. Complete a calculation
2. Click "Download JSON"
3. Open downloaded file in text editor

**Expected JSON structure:**
```json
{
  "origin": "...",
  "destination": "...",
  "distance_km": 299.0,
  "items": [
    {
      "name": "...",
      "quantity": 1,
      "weight_score": 3,
      "item_cost": 1800
    }
  ],
  "subtotal": 2051,
  "trailer_required": false,
  "trailer_cost": 0,
  "total_cost": 2051
}
```

**Pass/Fail**: ___ ✅/❌

---

### Test K: Reset Function
1. Enter locations
2. Select items
3. Calculate
4. Click "Reset Calculator"

**Verify everything clears:**
- ✅ Location inputs empty
- ✅ Address detail fields empty
- ✅ Item quantities = 0
- ✅ Selected items section empty
- ✅ Results hidden
- ✅ Search cleared
- ✅ Category filter reset

**Pass/Fail**: ___ ✅/❌

---

### Test L: Form Validation
**Test missing inputs:**

1. **No locations:**
   - Try to calculate with empty locations
   - ✅ Should show error: "Please enter pick-up location" or "Please enter delivery destination"

2. **No items:**
   - Enter locations only
   - Try to calculate
   - ✅ Should show error: "Please select at least one item to move"

**Pass/Fail**: ___ ✅/❌

---

### Test M: Error Handling
**Test invalid scenarios:**

1. Enter addresses that might not be found
2. Check error messages are helpful
3. Verify calculator doesn't crash
4. Can retry after error

**Pass/Fail**: ___ ✅/❌

---

### Test N: Search & Filter
1. **Search Test:**
   - Type "fridge" in search box
   - ✅ Only fridge items show
   - Clear search
   - ✅ All items show again

2. **Category Filter:**
   - Select "Appliances" category
   - ✅ Only appliances show
   - Select "All Categories"
   - ✅ All items show

**Pass/Fail**: ___ ✅/❌

---

### Test O: Mobile Responsiveness
1. Resize browser to mobile size (375px width)
2. Test all functionality
3. Verify:
   - ✅ Layout adapts
   - ✅ Inputs usable
   - ✅ Buttons accessible
   - ✅ Results readable

**Pass/Fail**: ___ ✅/❌

---

## Critical Path Test (Quick 5-Minute Test)

For a quick sanity check, test this flow:

1. ✅ Calculator loads (no console errors)
2. ✅ Select 2-3 items (verify quantities work)
3. ✅ Enter locations manually (e.g., "Centurion" → "Pretoria")
4. ✅ Click Calculate (verify results appear)
5. ✅ Check distance and costs shown
6. ✅ Click Reset (verify everything clears)

**If all pass, calculator is working!** ✅

---

## Common Issues & Solutions

### Issue: Calculator doesn't load
**Check:**
- Browser console for errors
- All JavaScript files loaded
- Network tab for 404 errors

### Issue: Items don't display
**Check:**
- `items-catalog.js` loaded
- `ItemCatalogService` available in console
- No JavaScript errors

### Issue: Autocomplete doesn't work
**Check:**
- Google Maps API key configured
- Places API enabled in Google Cloud Console
- Check browser console for API errors

### Issue: Distance calculation fails
**Check:**
- Google Maps API key configured
- Distance Matrix API enabled
- Network connectivity
- Check error message for details

### Issue: Price calculation wrong
**Check:**
- Verify item baseline prices in catalog
- Check CONFIG.BASELINE_DISTANCE = 299
- Check calculation formula

---

## Test Results Template

**Test Date:** __________
**Browser:** __________
**API Key Configured:** Yes / No

| Test | Status | Notes |
|------|--------|-------|
| A: Item Selection | ✅/❌ | |
| B: Location Input (Manual) | ✅/❌ | |
| C: Location Input (Autocomplete) | ✅/❌ | |
| D: Map Picker | ✅/❌ | |
| E: Distance Calculation | ✅/❌ | |
| F: Price Calculation | ✅/❌ | |
| G: Trailer Logic | ✅/❌ | |
| H: Results Display | ✅/❌ | |
| I: Print | ✅/❌ | |
| J: JSON Download | ✅/❌ | |
| K: Reset | ✅/❌ | |
| L: Validation | ✅/❌ | |
| M: Error Handling | ✅/❌ | |
| N: Search & Filter | ✅/❌ | |
| O: Mobile | ✅/❌ | |

**Overall Status:** ✅ Working / ⚠️ Some Issues / ❌ Not Working

**Issues Found:**
1. 
2. 
3. 

---

## Ready to Test!

Follow the test procedures above. Start with the "Critical Path Test" for a quick check, then do full testing if everything looks good.

**Good luck!** 🚀

