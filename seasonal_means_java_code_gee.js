// Google Earth Engine script to create seasonal Sentinel-2 means (all bands) for 2020-2024
// Using existing focus region geometry
var geometry = focusRegion;

// Function to create seasonal Sentinel-2 mean composite for a specific year and season
function createSeasonalS2Mean(year, season) {
  // Define season date ranges
  var seasonDates = {
    '1_spring': [ee.Date.fromYMD(year, 3, 1), ee.Date.fromYMD(year, 5, 31)],
    '2_summer': [ee.Date.fromYMD(year, 6, 1), ee.Date.fromYMD(year, 8, 31)],
    '3_autumn': [ee.Date.fromYMD(year, 9, 1), ee.Date.fromYMD(year, 11, 30)],
    '4_winter': [ee.Date.fromYMD(year, 12, 1), ee.Date.fromYMD(year + 1, 2, 28)]
  };
  
  // Handle winter season that spans two years
  var startDate, endDate;
  if (season === 'winter' && year === 2024) {
    // For winter 2024, we can only use December data (up to our knowledge cutoff)
    startDate = seasonDates[season][0];
    endDate = ee.Date.fromYMD(year, 12, 31);
  } else {
    startDate = seasonDates[season][0];
    endDate = seasonDates[season][1];
  }
  
  // Get Sentinel-2 imagery for the time period with reduced cloud cover threshold
  var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(startDate, endDate)
    .filterBounds(geometry)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15)); // Reduced to 15% cloud cover
  
  // Calculate the mean of all bands for the season
  var seasonalMean = s2.mean();
  
  // Add properties for identification
  return seasonalMean.clip(geometry).set({
    'system:time_start': startDate.millis(),
    'year': year,
    'season': season,
    'description': 'S2_Mean_' + year + '_' + season
  });
}

// Define years and seasons
var years = [2020, 2021, 2022, 2023, 2024];
var seasons = ['1_spring', '2_summer', '3_autumn', '4_winter'];

// Create seasonal means for each year
var seasonalMeans = {};
years.forEach(function(year) {
  seasons.forEach(function(season) {
    // Skip winter 2024-2025 if it's beyond our processing capability
    if (!(season === 'winter' && year === 2024)) {
      var key = 'S2_' + year + '_' + season;
      seasonalMeans[key] = createSeasonalS2Mean(year, season);
    }
  });
});

// Get projection information from one of the original images
var sample = ee.Image(ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .first());
var projection = sample.projection();

// Iterate over the keys and export each seasonal mean image to Google Drive
var resolution = 100; // Set the resolution to 100 meters
Object.keys(seasonalMeans).forEach(function(key) {
  Export.image.toDrive({
    image: seasonalMeans[key],
    description: key,
    folder: 'EarthEngineExports_SeasonalS2_V2.1',
    fileNamePrefix: key,
    region: geometry,
    maxPixels: 1e9,
    scale: resolution,
  });
});

// Display the first seasonal mean as an example (RGB visualization)
// Map.centerObject(geometry, 10);
// var firstKey = Object.keys(seasonalMeans)[0];
// Map.addLayer(seasonalMeans[firstKey], {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, firstKey + '_RGB');