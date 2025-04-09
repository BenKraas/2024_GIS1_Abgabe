// Google Earth Engine script to create monthly NDVI mean rasters for June (2020-2024)

// Define a region of interest (you'll need to replace this with your actual geometry)
// For demonstration, I'll use a point and buffer it to create a region
var geometry = focusRegion

// Function to calculate NDVI
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// Function to create monthly NDVI mean for a specific year and month
function createMonthlyNDVI(year, month) {
  // Set date range for the month
  var startDate = ee.Date.fromYMD(year, month, 1);
  var endDate = startDate.advance(1, 'month');
  
  // Get Sentinel-2 imagery for the time period
  var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(startDate, endDate)
    .filterBounds(geometry)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)); // Filter cloudy images
  
  // Calculate NDVI for each image
  var withNDVI = s2.map(addNDVI);
  
  // Calculate the mean NDVI for the month
  var ndviMean = withNDVI.select('NDVI').mean();
  
  // Add properties for identification
  return ndviMean.clip(geometry).set({
    'system:time_start': startDate.millis(),
    'year': year,
    'month': month,
    'description': 'NDVI_Mean_' + year + '_' + month
  });
}

// Create NDVI means for June and December of each year (2020-2024)
var ndviMeans = {};
[2020, 2021, 2022, 2023, 2024].forEach(function(year) {
  [3, 6, 9, 12].forEach(function(month) {
    var key = 'ndvi_' + year + '_' + (month < 10 ? '0' + month : month);
    ndviMeans[key] = createMonthlyNDVI(year, month);
  });
});

// Visualization parameters for NDVI
var ndviParams = {
  min: -0.2,
  max: 0.8,
  palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901', '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01', '012E01', '011D01', '011301']
};

// Display the NDVI means (should be disabled for better performance)
// Map.centerObject(geometry, 10);
// // addLayer for each NDVI mean
// Object.keys(ndviMeans).forEach(function(key) {
//   var ndviImage = ndviMeans[key];
//   Map.addLayer(ndviImage, ndviParams, key);
// });

// Get projection information from one of the original images
var sample = ee.Image(ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .first());
var projection = sample.projection();

// Iterate over the keys and export each NDVI mean image to Google Drive
// Note: This will create a folder named 'EarthEngineExports_NDVI' in your Google Drive

var resolution = 100; // Set the resolution to 100 meters

Object.keys(ndviMeans).forEach(function(key) {
  Export.image.toDrive({
    image: ndviMeans[key],
    description: key,
    folder: 'EarthEngineExports_NDVI',
    fileNamePrefix: key,
    region: geometry,
    maxPixels: 1e9,
    scale: resolution,
  });
});

// Unfortunately, Google Earth Engine does not allow programmatic starting of export tasks from JavaScript in the Code Editor. 
// All export tasks must be manually started by the user.