# 2024_GIS1_Abgabe
Codebase der Abgabeleistung für GIS1

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
    - Hitze


ChatGpt:
Hier findest Du einen möglichen Fahrplan, wie Du Dein Projekt „Auswirkungen des Kriegs in der Ukraine auf die Weizenproduktion“ mit Python umsetzen und am Ende in einer ArcGIS StoryMap präsentieren kannst:

---

## 1. Projektziel und Konzeption

1. **Ziel:**  
   - Du möchtest (geo-)statistisch und visuell aufzeigen, wie sich der Krieg in der Ukraine auf die Weizenproduktion auswirkt.  
   - Die Ergebnisse sollen kartografisch aufbereitet und am Ende in einer ArcGIS StoryMap präsentiert werden.

2. **Fragestellungen konkretisieren:**  
   - Wie hat sich die Weizenanbaufläche bzw. -ernte vor und nach Kriegsbeginn verändert?  
   - Welche Regionen sind besonders stark betroffen?  
   - Gibt es Verschiebungen in den Produktionsmengen oder Export-Routen?  
   - Welche zusätzlichen Faktoren (z. B. Bodendaten, NDVI-Satellitenindices, Wetterdaten) können die Entwicklung erklären oder beeinflussen?

3. **Welche Daten brauchst Du?**  
   - **Statistische Weizenproduktionsdaten** aus offiziellen Quellen (z. B. FAO, USDA, Statistiken des ukrainischen Landwirtschaftsministeriums, internationale Handelsdaten).  
   - **Geodaten der Ukraine** (Grenzen, Verwaltungsbezirke, landwirtschaftliche Nutzflächen). Oft verfügbar als Shapefile/GeoJSON (z. B. von GADM, Natural Earth, Open Data Portale).  
   - **Konfliktdaten**: Karten der umkämpften Regionen oder zerstörten Flächen (ggf. von Organisationen wie ACLED oder UNOCHA).  
   - **Satellitendaten (optional)**: Beispielsweise NDVI (Vegetationsindex) aus Sentinel/Landsat zur Ermittlung von Vegetations- und Ertragsindikatoren.  
   - **Zeitraum**: Du benötigst Daten für „Vor dem Krieg“ (z. B. 2018–2021) und „Nach Kriegsbeginn“ (ab 2022).

---

## 2. Datensammlung und -aufbereitung mit Python

1. **Python-Umgebung einrichten:**  
   - Nutze z. B. Anaconda oder Miniconda und erstelle ein virtuelles Environment mit den relevanten Bibliotheken:  
     ```bash
     conda create -n weizen-projekt python=3.9
     conda activate weizen-projekt
     conda install pandas geopandas matplotlib rasterio jupyter
     ```
   - *Optional:* Wenn Du Satellitendaten integrieren möchtest: `rasterio`, `rioxarray`, `earthengine-api` (falls Du Google Earth Engine nutzen willst), etc.

2. **Datenerhebung & -import:**  
   - **Produktionsdaten** (CSV, Excel) mittels `pandas` einlesen, säubern und für die Analyse aufbereiten.  
   - **Vektordaten** (Shapefiles, GeoJSON) über `geopandas` laden, z. B.  
     ```python
     import geopandas as gpd
     admin_ukraine = gpd.read_file("ukraine_admin.shp")
     ```
   - **Konfliktdaten**: Eventuell als vektorbasierte Datensätze (z. B. betroffene Gebiete), die ebenfalls mit `geopandas` verarbeitet werden können.  
   - **Satellitendaten**: Wenn nötig, mithilfe von `rasterio` oder über die Google Earth Engine Python API (ggf. Zeitserien extrahieren).

3. **Datenbereinigung, Transformation & Aggregation:**  
   - Prüfe Datenqualität (fehlende Werte, Ausreißer etc.).  
   - Falls Du Daten auf Oblast-Ebene (Verwaltungsbezirke) auswerten willst, musst Du die Produktionsdaten pro Oblast (oder Rayon) aggregieren.  
   - Verknüpfe Produktionswerte mit Deinem Geodatensatz (join/merge) anhand passender IDs oder Regionsnamen.  
   - *Tipp:* Achte auf Konsistenz in Schreibweisen (z. B. Kyrillisch/Romanisch) und auf die gleiche Projektion (CRS) bei geographischen Daten.

---

## 3. Geostatistische Analysen und Visualisierung mit Python

1. **Deskriptive Auswertungen (pandas, matplotlib):**  
   - Zeitreihenplot der Weizenproduktion (vor vs. nach Kriegsbeginn).  
   - Verlgleich von Durchschnittserträgen pro Hektar in betroffenen vs. nicht betroffenen Regionen.

2. **Räumliche Analysen (geopandas, shapely):**  
   - Erstelle Karten, die Produktionsunterschiede vor/nach 2022 zeigen (Choropleth-Karten).  
   - Markiere Gebiete, in denen Kämpfe stattgefunden haben, und ermittle, ob dort die Produktion besonders stark zurückgegangen ist.  

3. **(Optional) Integration von NDVI/GEO-Daten:**  
   - Mithilfe von NDVI-Daten (Sentinel/Landsat) könntest Du Vegetationsveränderungen nach Konfliktbeginn oder in bestimmten Zeitfenstern erkennen.  
   - Rasterdaten kannst Du in Python mit `rasterio` einlesen, statistisch auswerten und in georeferenzierte Form bringen, um sie mit den Umrissen einzelner Regionen zu verknüpfen.

4. **Aufbereitung der finalen Karten:**  
   - Entweder exportierst Du Deine Visualisierungen als statische PNG/SVG oder Du baust interaktive Karten (z. B. mit `folium`, `geopandas.GeoDataFrame.explore()` oder der *ArcGIS API for Python*).  
   - Speichere diese Zwischen-Ergebnisse (Maps/Layer) in einem für ArcGIS kompatiblen Format (z. B. GeoPackage, Shapefile) oder als WebMap-Services.

---

## 4. Veröffentlichung in ArcGIS StoryMap

1. **ArcGIS-Konto / Online-Zugang:**  
   - Um eine StoryMap zu erstellen, benötigst Du Zugriff auf ArcGIS Online. Falls Deine Organisation eine ArcGIS-Lizenz hat, solltest Du Dich dort anmelden können.  
   - Stelle sicher, dass Du das nötige Recht hast, Feature-Layer hochzuladen und StoryMaps zu veröffentlichen.

2. **Daten in ArcGIS Online hochladen oder verlinken:**  
   - Lade Deine vorbereiteten Shapefiles, GeoPackages oder CSVs in ArcGIS Online hoch und erstelle daraus Feature-Layer.  
   - Falls Du interaktive Karten direkt in ArcGIS Pro oder ArcGIS Online anlegst, kannst Du die Kartendarstellungen anpassen (Farbschema, Pop-ups, Legende etc.).

3. **StoryMap erstellen:**  
   - Gehe zu https://storymaps.arcgis.com/ und klicke auf „New Story“.  
   - Füge Titel, Texte, Bilder und beschreibende Abschnitte hinzu.  
   - Bette Deine Online-Karten (Web Map) in die Story ein. Du kannst mehrere Kartenschnitte, Slider oder Zeitvergleiche (vor/nach 2022) einbauen, um die Veränderungen sichtbar zu machen.  
   - Ergänze weitere Medien (z. B. Diagramme, Fotos, Infografiken) und eine zusammenfassende Bewertung der Daten.

4. **Gestaltung & Narration:**  
   - Erzähle eine kohärente Geschichte: Beginne mit der allgemeinen Bedeutung der Ukraine für den weltweiten Weizenmarkt, erkläre die Ausgangssituation (Produktion vor Kriegsbeginn), zeige daraufhin die durch den Krieg verursachten Einschnitte und liefere am Ende eine Einschätzung der aktuellen Lage.  
   - Nutze interaktive Elemente, damit sich die Zuschauer selbst ein Bild machen können (z. B. Hereinzoomen in bestimmte Regionen, Zeit-Slider).

---

## 5. Projektmanagement und Tipps

- **Zeitplan**: Plane genügend Zeit für die Datenrecherche und -bereinigung ein, da dieser Teil oft zeitaufwändiger ist als gedacht.  
- **Datenqualität**: Achte auf Transparenz hinsichtlich Deiner Datenquellen (z. B. Aktualität, Genauigkeit, eventuelle Unvollständigkeit).  
- **Dokumentation**: Nutze z. B. Jupyter Notebooks, um Deinen Workflow zu dokumentieren (Code, Kommentare, Visualisierungen). So kannst Du den Datenfluss später nachvollziehen und Ergebnisse reproduzieren.  
- **Storytelling**: Eine gute StoryMap lebt von der Verbindung aus Text, Bild, Karte und Interaktion. Überlege Dir, welche Kernaussagen Du vermitteln willst und strukturiere Deine Story dementsprechend.  
- **Eventuell weiterführend**:  
  - Integration von Handelspreisdaten (z. B. Weizenpreis-Entwicklung am Weltmarkt) zur Verknüpfung von Angebot/Nachfrage-Effekten.  
  - Einbeziehung von Prognosen/Modellen (z. B. mithilfe von Zeitreihenprognosen in Python), sofern die Datenlage ausreichend ist.

---

## Zusammenfassung

1. **Daten beschaffen:** Offizielle Produktionsdaten, Konfliktdaten, ggf. Sat-Daten.  
2. **Daten in Python aufbereiten:** Pandas/GeoPandas zur Tabellen- und Geodatenverarbeitung, Berechnung relevanter Kennzahlen (z. B. Produktion pro Region).  
3. **Analysieren & Visualisieren:** Räumliche und zeitliche Veränderungen untersuchen, Karten/Choropleths oder interaktive Karten erstellen.  
4. **ArcGIS StoryMap:** Finale Präsentation der Ergebnisse, Kombination aus Text, Karten, Diagrammen, Medien.  

Damit hast Du ein schlüssiges Vorgehen, um die Auswirkungen des Krieges in der Ukraine auf die Weizenproduktion zu untersuchen und Deine Ergebnisse professionell in einer StoryMap zu präsentieren. Viel Erfolg!







Links:



Zeit: Russland schneidet Pokrowsk von wichtigen Straßen ab

https://www.zeit.de/politik/ausland/karte-ukraine-krieg-russland-frontverlauf-truppenbewegungen


Arc GIS story maps: Interactive Map: Ukraine's Incursion into Kursk Oblast

https://storymaps.arcgis.com/stories/83a2f24901c941d581c0c523ecd2619b



NZZ: Erntezeit im Krieg: Den einen Bauern brennen die Felder ab, die anderen wissen nicht, wohin mit ihrem Korn

From <https://www.nzz.ch/international/ukraine-der-krieg-zerstoert-felder-und-blockiert-getreide-export-ld.1695644> 



nau: Ukraine-Krieg: Hier bombardieren Russen ukrainische Weizen-Felder

From <https://www.nau.ch/news/europa/ukraine-krieg-hier-bombardieren-russen-ukrainische-weizen-felder-66224734> 


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


Test