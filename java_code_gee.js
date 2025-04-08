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

// Create NDVI means for June of each year (2020-2024)
var ndvi_2020_06 = createMonthlyNDVI(2020, 6);
var ndvi_2021_06 = createMonthlyNDVI(2021, 6);
var ndvi_2022_06 = createMonthlyNDVI(2022, 6);
var ndvi_2023_06 = createMonthlyNDVI(2023, 6);
var ndvi_2024_06 = createMonthlyNDVI(2024, 6);

// Visualization parameters for NDVI
var ndviParams = {
  min: -0.2,
  max: 0.8,
  palette: ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901', '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01', '012E01', '011D01', '011301']
};

// Display the NDVI means
Map.centerObject(geometry, 10);
Map.addLayer(ndvi_2020_06, ndviParams, 'NDVI June 2020');
Map.addLayer(ndvi_2021_06, ndviParams, 'NDVI June 2021');
Map.addLayer(ndvi_2022_06, ndviParams, 'NDVI June 2022');
Map.addLayer(ndvi_2023_06, ndviParams, 'NDVI June 2023');
Map.addLayer(ndvi_2024_06, ndviParams, 'NDVI June 2024');

// Get projection information from one of the original images
var sample = ee.Image(ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .first());
var projection = sample.projection();

// Export the NDVI means to assets
// Export the NDVI means to Drive
Export.image.toDrive({
  image: ndvi_2020_06,
  description: 'NDVI_Mean_2020_06',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'NDVI_Mean_2020_06',
  crs: 'EPSG:4326',
  region: geometry,
  maxPixels: 1e9,
  scale: 10
});

Export.image.toDrive({
  image: ndvi_2021_06,
  description: 'NDVI_Mean_2021_06',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'NDVI_Mean_2021_06',
  crs: 'EPSG:4326',
  region: geometry,
  maxPixels: 1e9,
  scale: 10
});

Export.image.toDrive({
  image: ndvi_2022_06,
  description: 'NDVI_Mean_2022_06',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'NDVI_Mean_2022_06',
  crs: 'EPSG:4326',
  region: geometry,
  maxPixels: 1e9,
  scale: 10
});

Export.image.toDrive({
  image: ndvi_2023_06,
  description: 'NDVI_Mean_2023_06',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'NDVI_Mean_2023_06',
  crs: 'EPSG:4326',
  region: geometry,
  maxPixels: 1e9,
  scale: 10
});

Export.image.toDrive({
  image: ndvi_2024_06,
  description: 'NDVI_Mean_2024_06',
  folder: 'EarthEngineExports',
  fileNamePrefix: 'NDVI_Mean_2024_06',
  crs: 'EPSG:4326',
  region: geometry,
  maxPixels: 1e9,
  scale: 10
});
