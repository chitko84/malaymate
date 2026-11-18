# Malaysia adventure map

The map's country silhouette was extracted from the Malaysia feature in Natural Earth's 1:50m Admin 0 Countries GeoJSON:

https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson

Natural Earth is public-domain data. Source terms: https://www.naturalearthdata.com/about/terms-of-use/

`src/malaysia-outline.json` contains the projected SVG outlines. The two regions are arranged and scaled separately for an illustrated learning map. Learning-stop positions are approximate city placements; this map is not for geographic navigation. Trees, buildings, mountains, beaches, trails and boats are original SVG elements in `CampaignMap.tsx`. The level markers are accessible HTML buttons aligned over that SVG and rendered from existing saved level progress. The landing-page flag map artwork remains separate.
