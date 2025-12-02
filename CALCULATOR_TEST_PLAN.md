# Moving Cost Calculator - End-to-End Test Plan

## Test Environment Setup

### Prerequisites
1. ✅ All JavaScript files loaded correctly
2. ✅ Google Maps API key configured (or test in fallback mode)
3. ✅ Browser console open for error checking
4. ✅ All dependencies available

### Required Files Check
- [ ] `js/moving-calculator-types.js` - CONFIG constants
- [ ] `js/items-catalog.js` - Item catalog (83 items)
- [ ] `js/distance-service.js` - Distance calculation
- [ ] `js/pricing-engine.js` - Price calculation
- [ ] `js/moving-calculator.js` - Main controller
- [ ] `js/calculator-ui.js` - UI controller
- [ ] `js/google-maps-service.js` - Google Maps wrapper
- [ ] `js/map-picker.js` - Map picker component

## Test Scenarios

### Test 1: Calculator Initialization ✅
**Objective**: Verify calculator loads without errors

**Steps**:
1. Open website
2. Navigate to Calculator section
3. Check browser console for errors

**Expected Results**:
- ✅ Calculator section displays
- ✅ No JavaScript errors in console
- ✅ Items catalog loads and displays
- ✅ Location inputs are visible

**Pass/Fail**: ___

---

### Test 2: Item Catalog Display ✅
**Objective**: Verify all items load and display correctly

**Steps**:
1. Scroll to calculator section
2. Verify items are displayed in categories
3. Check category filter dropdown

**Expected Results**:
- ✅ All 83 items displayed
- ✅ Items organized by category (Appliances, Electronics, Living Room, etc.)
- ✅ Category filter dropdown populated
- ✅ Item cards show name and weight score
- ✅ Quantity controls (+/- buttons) visible

**Pass/Fail**: ___

---

### Test 3: Item Selection ✅
**Objective**: Verify users can select items and quantities

**Steps**:
1. Click "+" button on an item
2. Verify quantity increases
3. Click "-" button
4. Verify quantity decreases
5. Select multiple items

**Expected Results**:
- ✅ Quantity updates when buttons clicked
- ✅ Item card highlights when quantity > 0
- ✅ Selected items appear in "Selected Items" section
- ✅ Can select multiple items
- ✅ Can remove items using X button

**Pass/Fail**: ___

---

### Test 4: Search Functionality ✅
**Objective**: Verify item search works

**Steps**:
1. Type in search box (e.g., "fridge")
2. Verify items filter
3. Clear search
4. Verify all items show again

**Expected Results**:
- ✅ Search filters items in real-time
- ✅ Shows matching items across categories
- ✅ Clearing search shows all items

**Pass/Fail**: ___

---

### Test 5: Category Filter ✅
**Objective**: Verify category filtering works

**Steps**:
1. Select a category from dropdown
2. Verify only that category shows
3. Select "All Categories"
4. Verify all items show

**Expected Results**:
- ✅ Category filter works
- ✅ Only selected category items visible
- ✅ Can reset to show all

**Pass/Fail**: ___

---

### Test 6: Location Input - Autocomplete (With Google Maps API) ✅
**Objective**: Verify Google Places autocomplete works

**Steps**:
1. Click in "Pick-up Location" field
2. Start typing an address (e.g., "The Reeds")
3. Verify dropdown suggestions appear
4. Select a suggestion
5. Repeat for "Delivery Destination"

**Expected Results**:
- ✅ Autocomplete dropdown appears
- ✅ Suggestions show as typing
- ✅ Selecting suggestion populates address
- ✅ Address details section appears
- ✅ Address fields auto-populated

**Pass/Fail**: ___

---

### Test 7: Location Input - Manual Entry (Without Google Maps API) ✅
**Objective**: Verify manual address entry works

**Steps**:
1. Type full address manually in "Pick-up Location"
2. Type full address manually in "Delivery Destination"
3. Verify addresses accepted

**Expected Results**:
- ✅ Can type addresses manually
- ✅ No errors with manual entry
- ✅ Addresses saved correctly

**Pass/Fail**: ___

---

### Test 8: Address Details - Auto-Population ✅
**Objective**: Verify address fields populate from Google Places

**Steps**:
1. Select address from autocomplete
2. Click "Add/Edit Address Details"
3. Verify fields are populated

**Expected Results**:
- ✅ Street Address populated
- ✅ Suburb populated (if available)
- ✅ City populated
- ✅ Province populated
- ✅ Postal Code populated (if available)

**Pass/Fail**: ___

---

### Test 9: Address Details - Manual Editing ✅
**Objective**: Verify address fields can be edited

**Steps**:
1. Select address from autocomplete
2. Open address details
3. Edit street address
4. Edit city
5. Add building/unit info

**Expected Results**:
- ✅ All fields editable
- ✅ Changes persist
- ✅ Can add building/unit details

**Pass/Fail**: ___

---

### Test 10: Map Picker Modal ✅
**Objective**: Verify interactive map picker works

**Steps**:
1. Click "Map" button next to location input
2. Verify map modal opens
3. Search for address in map search
4. Click on map to place marker
5. Drag marker to adjust
6. Click "Use This Location"
7. Verify address populated

**Expected Results**:
- ✅ Map modal opens
- ✅ Can search addresses in map
- ✅ Can click map to place marker
- ✅ Marker is draggable
- ✅ Address populated when confirmed
- ✅ Address fields auto-populated

**Pass/Fail**: ___

---

### Test 11: Distance Calculation ✅
**Objective**: Verify distance calculates correctly

**Steps**:
1. Enter pick-up location: "The Reeds, Centurion"
2. Enter delivery location: "Tzaneen"
3. Select at least one item
4. Click "Calculate Cost"
5. Verify distance shows in results

**Expected Results**:
- ✅ Distance calculated (~299 km for test route)
- ✅ Distance displayed in results
- ✅ Loading state shown during calculation
- ✅ Results appear after calculation

**Pass/Fail**: ___

---

### Test 12: Price Calculation ✅
**Objective**: Verify prices calculate correctly

**Steps**:
1. Use test route: "The Reeds, Centurion" → "Tzaneen" (~299 km)
2. Select items:
   - Double-door Fridge (1x) - weight 3, baseline R1800
   - Small Box (1x) - weight 1, baseline R250
   - Office Chair (1x) - weight 2, baseline R200
3. Calculate cost
4. Verify item costs in results

**Expected Results**:
- ✅ Item costs calculated correctly
- ✅ Subtotal calculated correctly
- ✅ Costs rounded to nearest rand
- ✅ Breakdown table shows all items

**Pass/Fail**: ___

---

### Test 13: Trailer Logic ✅
**Objective**: Verify trailer requirement logic works

**Steps**:
1. Select items totaling > 50 weight points
2. Calculate cost
3. Verify trailer required

**Expected Results**:
- ✅ Trailer required message shown
- ✅ Trailer cost calculated (min R10,000)
- ✅ Trailer cost added to total
- ✅ Total includes trailer cost

**Pass/Fail**: ___

---

### Test 14: Results Display ✅
**Objective**: Verify results display correctly

**Steps**:
1. Complete a calculation
2. Review results section

**Expected Results**:
- ✅ Origin and destination shown
- ✅ Distance displayed
- ✅ Items breakdown table shown
- ✅ Subtotal displayed
- ✅ Trailer info shown (if applicable)
- ✅ Total cost displayed
- ✅ Print and Download JSON buttons visible

**Pass/Fail**: ___

---

### Test 15: Print Functionality ✅
**Objective**: Verify print works correctly

**Steps**:
1. Complete a calculation
2. Click "Print Results"
3. Review print preview

**Expected Results**:
- ✅ Print dialog opens
- ✅ Only results visible (website hidden)
- ✅ Results formatted correctly for printing
- ✅ Date/time shown on print

**Pass/Fail**: ___

---

### Test 16: JSON Download ✅
**Objective**: Verify JSON download works

**Steps**:
1. Complete a calculation
2. Click "Download JSON"
3. Open downloaded file

**Expected Results**:
- ✅ JSON file downloads
- ✅ File contains invoice data
- ✅ JSON is properly formatted
- ✅ All data present (origin, destination, items, costs)

**Pass/Fail**: ___

---

### Test 17: Reset Functionality ✅
**Objective**: Verify reset clears everything

**Steps**:
1. Enter locations
2. Select items
3. Calculate cost
4. Click "Reset Calculator"
5. Verify everything cleared

**Expected Results**:
- ✅ Location inputs cleared
- ✅ Address detail fields cleared
- ✅ Address detail sections hidden
- ✅ Item quantities reset to 0
- ✅ Selected items cleared
- ✅ Results hidden
- ✅ Search cleared
- ✅ Category filter reset

**Pass/Fail**: ___

---

### Test 18: Form Validation ✅
**Objective**: Verify validation works

**Steps**:
1. Try to calculate without locations
2. Try to calculate without items
3. Try to calculate with only origin
4. Try to calculate with only destination

**Expected Results**:
- ✅ Error message for missing origin
- ✅ Error message for missing destination
- ✅ Error message for no items selected
- ✅ Error messages are clear

**Pass/Fail**: ___

---

### Test 19: Error Handling ✅
**Objective**: Verify error handling works

**Steps**:
1. Enter invalid addresses
2. Try calculation with network issues
3. Check error messages

**Expected Results**:
- ✅ Errors handled gracefully
- ✅ Error messages shown to user
- ✅ Calculator doesn't crash
- ✅ Can recover from errors

**Pass/Fail**: ___

---

### Test 20: Mobile Responsiveness ✅
**Objective**: Verify calculator works on mobile

**Steps**:
1. Resize browser to mobile size
2. Test all functionality
3. Verify layout is responsive

**Expected Results**:
- ✅ Layout adapts to mobile
- ✅ Inputs are usable
- ✅ Maps display correctly
- ✅ Buttons are accessible
- ✅ Results are readable

**Pass/Fail**: ___

---

## Test Results Summary

**Total Tests**: 20
**Passed**: ___
**Failed**: ___
**Pass Rate**: ___%

### Critical Issues Found:
1. 
2. 
3. 

### Minor Issues Found:
1. 
2. 
3. 

### Notes:

---

## Quick Test Checklist

For quick verification, test these critical paths:

- [ ] Calculator loads without errors
- [ ] Items display correctly
- [ ] Can select items and set quantities
- [ ] Location autocomplete works (if API key configured)
- [ ] Can enter addresses manually
- [ ] Address fields populate correctly
- [ ] Distance calculates
- [ ] Price calculates correctly
- [ ] Trailer logic works (weight > 50)
- [ ] Results display correctly
- [ ] Print works
- [ ] JSON download works
- [ ] Reset clears everything
- [ ] Validation works

---

**Test Date**: __________
**Tested By**: __________
**Browser**: __________
**API Key Configured**: Yes / No

