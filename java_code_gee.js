// This script calculates monthly mean NDVI from 2020-2024,
// clips the results to a user-defined focus region,
// and exports the resulting rasters to Google Drive.

// ----------------- SETUP -----------------
// Import the shapefile for the focus region
// You will need to replace this with your actual asset path after uploading your shapefile

// Define the time range
var startDate = '2020-01-01';
var endDate = '2024-12-31';

// ----------------- FUNCTIONS -----------------
// Function to calculate NDVI from Sentinel-2 imagery
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

// Function to mask clouds in Sentinel-2 images using the SCL band
// (Scene Classification Layer)
function maskS2clouds(image) {
  var scl = image.select('SCL');
  var mask = scl.gte(4).and(scl.lte(7));  // Keep vegetation, soil, water
  return image.updateMask(mask);
}

// ----------------- DATA PREPARATION -----------------
// Load Sentinel-2 Surface Reflectance collection
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterDate(startDate, endDate)
  .filterBounds(focusRegion)
  .map(maskS2clouds)
  .map(addNDVI);

// Generate a list of months between start and end dates
var startMonth = ee.Date(startDate);
var endMonth = ee.Date(endDate);
var months = ee.List.sequence(0, endMonth.difference(startMonth, 'month').round());

print('Number of months:', months.size());

// Display the focus region on the map
Map.centerObject(focusRegion, 10);
Map.addLayer(focusRegion, {color: 'red'}, 'Focus Region');

// // Display one monthly NDVI composite for visualization
// var sampleMonth = months.get(0);
// var sampleStart = startMonth.advance(sampleMonth, 'month');
// var sampleEnd = sampleStart.advance(1, 'month');
// var sampleNDVI = s2.filterDate(sampleStart, sampleEnd)
//   .select('NDVI')
//   .mean()
//   .clip(focusRegion);
// Map.addLayer(sampleNDVI, {min: 0.0, max: 0.8, palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718']}, 'Sample Monthly NDVI');

// ----------------- MONTHLY COMPOSITES -----------------
// Function to create monthly composites
var createMonthlyComposite = function(monthOffset) {
  var start = startMonth.advance(monthOffset, 'month');
  var end = start.advance(1, 'month');
  
  // Filter the collection to the specific month and calculate the mean NDVI
  var monthlyImgs = s2.filterDate(start, end);
  var monthlyNDVIComposite = monthlyImgs.select('NDVI').mean();
  
  // Get year and month as strings for naming the export
  var yearStr = start.get('year').format('%04d');
  var monthStr = start.get('month').format('%02d');
  
  // Add properties for export naming
  return monthlyNDVIComposite
    .set('year', yearStr)
    .set('month', monthStr)
    .set('date', ee.String(yearStr).cat('_').cat(monthStr))
    .clip(focusRegion);
};

// Create a list of monthly NDVI composites
var monthlyNDVI = months.map(createMonthlyComposite);

// ----------------- EXPORT -----------------
// Function to export each monthly composite
var exportMonthlyNDVI = function(image) {
  var image_exp = ee.Image(image);
  var dateStr = image_exp.get('date').getInfo();

  print('Exporting NDVI for:', dateStr);
  print('Image ID:', image_exp.id());

  
  // Export the image to Google Drive
  Export.image.toDrive({
    image: image_exp,
    description: 'NDVI_' + dateStr,
    folder: 'GEE_NDVI_Exports',
    scale: 100,  // 100m resolution due to data limitations
    region: focusRegion.geometry().bounds(),
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF',
    formatOptions: {
      cloudOptimized: true
    }
  });
  
  return image_exp;
};

// Apply the export function to each monthly composite
monthlyNDVI.map(exportMonthlyComposite);

// ----------------- VISUALIZATION -----------------
// For visualization purposes, show the latest monthly NDVI composite
var latestNDVI = ee.Image(monthlyNDVI.get(monthlyNDVI.size().subtract(1)));
var ndviVis = {
  min: 0.0,
  max: 0.8,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
    '74A901', '66A000', '529400', '3E8601', '207401', '056201',
    '004C00', '023B01', '012E01', '011D01', '011301'
  ]
};

Map.centerObject(focusRegion, 10);
Map.addLayer(latestNDVI, ndviVis, 'Latest Monthly NDVI');
Map.addLayer(focusRegion, {color: 'red'}, 'Focus Region');

// Print information about the exports
print('Total number of monthly exports:', monthlyNDVI.size());

