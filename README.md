# 2024_GIS1_Abgabe
Codebase der Abgabeleistung für GIS1

1. Projektziel und Konzeption
a) Ziel:  
   - (Geo-)Statistische und visuelle Darstellung, wie sich der Krieg in der Ukraine auf die Weizenproduktion auswirkt  
   - Kartografisch aufbereitetete ergebnisseund Darstellung als ArcGIS StoryMap
b) Fragestellungen konkretisieren:  
   - Wie hat sich die Weizenanbaufläche bzw. -ernte vor und nach Kriegsbeginn verändert?  
   - Welche Regionen betroffen?  
   - Änderungen in den Produktionsmengen oder Export-Routen?  
   - Welche zusätzlichen Faktoren (z. B. Bodendaten, NDVI-Satellitenindices, Wetterdaten) 
C) Welche Daten?
   - Statistische Weizenproduktionsdaten aus offiziellen Quellen (z. B. FAO, USDA, Statistiken des ukrainischen Landwirtschaftsministeriums, internationale Handelsdaten)
   - Geodaten der Ukraine (Grenzen, Verwaltungsbezirke, landwirtschaftliche Nutzflächen)   
   - Konfliktdaten: Karten der umkämpften Regionen oder zerstörten Flächen  
   - Satellitendaten: zB NDVI aus Sentinel/Landsat  
   - Zeitraum: Vorher-Nachher-Daten

2. Datensammlung und -aufbereitung mit Python
a) Python-Umgebung einrichten:  
   - Github
   - Jupyter-Notebook
b) Datenerhebung & -import:  
   - Produktionsdaten (CSV, Excel) - pandas 
   - Vektordaten (Shapefiles, GeoJSON) - geopandas 
   - Konfliktdaten: Eventuell vektorbasierte Datensätze (Fokusregion), - geopandas  
   - Satellitendaten:  rasterio oder GEE

3. Geostatistische Analyse und Visualisierung mit Python
a) Deskriptive Auswertungen (pandas, matplotlib):  
   - Zeitreihenplot der Weizenproduktion (vorher-nachher)  
   - Verlgleich von Durchschnittserträgen in betroffenen und nicht betroffenen Regionen
b) Räumliche Analysen (geopandas, shapely):  
   - Karten zu Produktionsunterschieden vor/nach 2022 zeigen  
   - Produktionsrückgang in Gebieten nahe der Front?
c) Integration von NDVI/GEO-Daten:
   - Vegetationsveränderungen mit NDVI-Daten (Sentinel/Landsat) vorher-nachher  
   - Rasterdaten mit Regionsshapes verknüpfen
d) Aufbereitung von finalen Karten:
   - Exportiert als Bilddateien
   - Maps/Layer für ArcGIS 

4. Veröffentlichung in ArcGIS StoryMap
a) ArcGIS-Konto / Online-Zugang:
   - StoryMap über ArcGIS Online 
b) Daten in ArcGIS Online hochladen oder verlinken:
   - Shapefiles, GeoPackages, CSVs in ArcGIS Online hochladen zu Feature-Layern  
c) StoryMap erstellen:
   - https://storymaps.arcgis.com/  
   - Titel, Texte, Bilder 
   - Online-Karten, Slider, Zeitvergleiche (vorher-nachher)
   - Diagramme, Fotos, Infografiken
d) Gestaltung & Story:  
   - Bedeutung der Ukraine für den weltweiten Weizenmarkt, Ausgangssituation Weizenproduktion, Veränderung durch Krieg, Ausblick

5. Projektmanagement
   - Zeitplan: 6 Wochen
   - Aktuelle Daten
   - Dokumentation
   - Story, Aufbau, Ziele
   - Abgabe vorbereiten

# Links:
Zeit: Russland schneidet Pokrowsk von wichtigen Straßen ab
https://www.zeit.de/politik/ausland/karte-ukraine-krieg-russland-frontverlauf-truppenbewegungen

Arc GIS story maps: Interactive Map: Ukraine's Incursion into Kursk Oblast
https://storymaps.arcgis.com/stories/83a2f24901c941d581c0c523ecd2619b

NZZ: Erntezeit im Krieg: Den einen Bauern brennen die Felder ab, die anderen wissen nicht, wohin mit ihrem Korn
From <https://www.nzz.ch/international/ukraine-der-krieg-zerstoert-felder-und-blockiert-getreide-export-ld.1695644> 

nau: Ukraine-Krieg: Hier bombardieren Russen ukrainische Weizen-Felder
From <https://www.nau.ch/news/europa/ukraine-krieg-hier-bombardieren-russen-ukrainische-weizen-felder-66224734> 


# Notizen
Weizen Ukraine 
- Region (Luhansk?) 
- Wie beeinflusst der Krieg die Weizenproduktion in der umkämpften Region 
    - Ggfs. Ganze Ukraine 
- NDVI Maps 
- Copernicus (aktuelle Aufnahmen vorhanden) 
- Shape files der Front 
    - Grobe Linie 
    - Hypothetisch 
- Deltakarte 
    - Monatliche / Jährlich 
    - Mittelwertvergleiche 
- Pufferzone in der Frontzone 
- Gibt es noch einen Index, der Weizen besser darstellt? 
- Faktoren 
    - Jahreszeiten, Klima

Anmerkungen Rienow
-yield expectation estimation
-prxy indices
-iu college?
-wie haben sich die Werte im Buffer entwickelt?
-ROI 
-Gee in jupyter Notebook
-bis nächster Woche: was zeigt der NDVI
    -unterteilt evtl in N/S/E/W
-mehr Datenpunkte al 12
-Copernicus compare feature
    -copernicus acc
