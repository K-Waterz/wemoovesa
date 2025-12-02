# Google Maps Integration Setup Guide

## Overview

The calculator now uses Google Maps for:
1. **Location Input** - Google Places Autocomplete for easy address entry
2. **Distance Calculation** - Google Distance Matrix API for accurate distance calculation

## Setup Instructions

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API** (for address autocomplete)
   - **Distance Matrix API** (for distance calculation)
   - **Maps JavaScript API** (for loading the API libraries)

### Step 2: Enable Required APIs

In Google Cloud Console:

1. Navigate to **APIs & Services** > **Library**
2. Search for and enable:
   - **Places API**
   - **Distance Matrix API**
   - **Maps JavaScript API**

### Step 3: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key
4. (Recommended) Restrict the API key:
   - Click on the API key to edit it
   - Under **Application restrictions**, select **HTTP referrers**
   - Add your website domain (e.g., `yourdomain.com/*`)
   - Under **API restrictions**, select **Restrict key**
   - Choose: Places API, Distance Matrix API, Maps JavaScript API

### Step 4: Configure API Key in Website

**Option 1: Direct Configuration (Simple)**

Edit `index.html` and replace the API key:

```html
<!-- Find this line around line 26 -->
window.GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

<!-- Replace with your actual key -->
window.GOOGLE_MAPS_API_KEY = 'AIzaSyYourActualAPIKeyHere';
```

**Option 2: Environment Variable (Production)**

For production, use environment variables or a configuration file that's not committed to version control.

### Step 5: Test the Integration

1. Open your website
2. Navigate to the Calculator section
3. Click on the "Pick-up Location" or "Delivery Destination" field
4. Start typing an address - you should see Google Maps suggestions
5. Select an address from the suggestions
6. The calculator will automatically use Google Maps to calculate distance

## Features

### Google Places Autocomplete

- **Smart Suggestions**: As users type, Google Maps provides address suggestions
- **South Africa Focus**: Results are prioritized for South African addresses
- **Address Validation**: Only valid addresses can be selected
- **Auto-complete**: Speeds up data entry for users

### Distance Calculation

- **Accurate Distances**: Uses actual driving routes, not straight-line distance
- **Real-time**: Calculates distance when "Calculate Cost" is clicked
- **Error Handling**: Falls back to alternative methods if Google API is unavailable

## Cost Considerations

### Google Maps API Pricing (as of 2024)

- **Places API (Autocomplete)**: 
  - First $200/month free (40,000 requests)
  - Then $2.83 per 1,000 requests
  
- **Distance Matrix API**:
  - First $200/month free (40,000 elements)
  - Then $5.00 per 1,000 elements

**Note**: 1 element = 1 origin-destination pair

### Free Tier

- $200 free credit per month
- Typically covers 40,000 requests for most APIs
- Perfect for small to medium businesses

### Cost Optimization Tips

1. **Cache Results**: Store common origin-destination distances
2. **Rate Limiting**: Limit requests per user/IP
3. **Monitor Usage**: Set up billing alerts in Google Cloud Console

## Troubleshooting

### Autocomplete Not Working

**Issue**: Address suggestions don't appear when typing

**Solutions**:
1. Check that Google Maps API is loaded (check browser console)
2. Verify API key is correct
3. Ensure Places API is enabled in Google Cloud Console
4. Check API key restrictions allow your domain

### Distance Calculation Fails

**Issue**: Error when calculating distance

**Solutions**:
1. Verify Distance Matrix API is enabled
2. Check API key has correct permissions
3. Verify addresses are valid
4. Check browser console for specific error messages

### API Key Errors

**Error**: "Google Maps API error: This API project is not authorized to use this API"

**Solution**: Enable the required APIs in Google Cloud Console:
- Places API
- Distance Matrix API
- Maps JavaScript API

### Billing Not Enabled

**Error**: "Billing must be enabled"

**Solution**: 
1. Go to Google Cloud Console
2. Navigate to Billing
3. Enable billing (free tier still applies)

## Fallback Behavior

If Google Maps API is not configured or fails:

1. **Address Input**: Users can still type addresses manually
2. **Distance Calculation**: Falls back to alternative calculation method
3. **Calculator**: Still functions, just without Google Maps features

## Security Best Practices

1. **Restrict API Key**: Use HTTP referrer restrictions
2. **Limit APIs**: Only enable APIs you need
3. **Monitor Usage**: Set up billing alerts
4. **Rotate Keys**: Regularly update API keys
5. **Never Commit Keys**: Keep API keys out of public repositories

## Support

For issues:
1. Check browser console for error messages
2. Verify API key configuration
3. Check Google Cloud Console for API status
4. Review Google Maps API documentation

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Distance Matrix API Documentation](https://developers.google.com/maps/documentation/distance-matrix)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

