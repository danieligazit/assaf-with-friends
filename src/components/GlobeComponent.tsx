// src/components/GlobeComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { GeoJSON } from 'geojson';
import * as d3 from 'd3'

interface CountryFeature {
  type: "Feature";
  properties: {
    scalerank: number;
    featurecla: string;
    refugeeCount: null | number;
    refugeeDisplay: null | string;
    LABELRANK: number;
    SOVEREIGNT: string;
    SOV_A3: string;
    ADM0_DIF: number;
    LEVEL: number;
    TYPE: string;
    ADMIN: string;
    ADM0_A3: string;
    GEOU_DIF: number;
    GEOUNIT: string;
    GU_A3: string;
    SU_DIF: number;
    SUBUNIT: string;
    SU_A3: string;
    BRK_DIFF: number;
    NAME: string;
    NAME_LONG: string;
    BRK_A3: string;
    BRK_NAME: string;
    BRK_GROUP: null | any;
    ABBREV: string;
    POSTAL: string;
    FORMAL_EN: string;
    FORMAL_FR: null | any;
    NAME_CIAWF: string;
    NOTE_ADM0: null | any;
    NOTE_BRK: null | any;
    NAME_SORT: string;
    NAME_ALT: null | any;
    MAPCOLOR7: number;
    MAPCOLOR8: number;
    MAPCOLOR9: number;
    MAPCOLOR13: number;
    POP_EST: number;
    POP_RANK: number;
    GDP_MD_EST: number;
    POP_YEAR: number;
    LASTCENSUS: number;
    GDP_YEAR: number;
    ECONOMY: string;
    INCOME_GRP: string;
    WIKIPEDIA: number;
    FIPS_10_: string;
    ISO_A2: string;
    ISO_A3: string;
    ISO_A3_EH: string;
    ISO_N3: string;
    UN_A3: string;
    WB_A2: string;
    WB_A3: string;
    WOE_ID: number;
    WOE_ID_EH: number;
    WOE_NOTE: string;
    ADM0_A3_IS: string;
    ADM0_A3_US: string;
    ADM0_A3_UN: number;
    ADM0_A3_WB: number;
    CONTINENT: string;
    REGION_UN: string;
    SUBREGION: string;
    REGION_WB: string;
    NAME_LEN: number;
    LONG_LEN: number;
    ABBREV_LEN: number;
    TINY: number;
    HOMEPART: number;
    MIN_ZOOM: number;
    MIN_LABEL: number;
    MAX_LABEL: number;
  };
  bbox: [number, number, number, number];
  geometry: {
    type: "Polygon";
    // coordinates: [[[number, number], [number, number], ...]];
  };
}

interface CountriesFeatureCollection extends GeoJSON.FeatureCollection {
  features: CountryFeature[];
}

interface GlobeComponentProps {
  countries: CountriesFeatureCollection;
  altitude: number;
  transitionDuration: number;
}

const GlobeComponent: React.FC<GlobeComponentProps> = ({ countries, altitude, transitionDuration}) => {
  const globeEl = useRef<Globe>(null);
  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
  const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
  const [hoverD, setHoverD] = useState();

  const getColor = (feat: CountryFeature) => {
    if (feat === hoverD) {
      return 'steelblue';
    }
    
    if (feat.properties.refugeeCount){
      return 'red';
    }

    return colorScale(getVal(feat))
  }

  
  const getSideColor = (feat: CountryFeature) => {
    if (feat === hoverD) {
      return 'rgba(0, 0, 0, 0)';
    }
    
    if (feat.properties.refugeeCount){
      return 'rgba(200, 0, 0, 0.6)';
    }

    return 'rgba(1, 1, 1, 0.2)';
  }

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 16, lng: 10, altitude: 2 }, 3000);
    }
  }, [globeEl]);

  const globeImageUrl = './assets/water_16k.png';
  return (
    <Globe
      ref={globeEl}
    //   globeImageUrl="//shadedrelief.com/natural3/ne3_data/16200/masks/water_16k.png"
      globeImageUrl={globeImageUrl}
      backgroundColor="rgb(252,252,246)"
      showAtmosphere={false}
    
    //   backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonAltitude={altitude}
      polygonCapColor={getColor}

      polygonSideColor={getSideColor}
      // polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties: d }) => `
          <div style="color: white; background-color: rgba(1, 1, 1, 0.4); padding: 4px;">
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i> <br />
          ${d.refugeeCountDisplay ? `Asylum Seekers: <i>${d.refugeeCountDisplay}</i>`: ``}
          </div>
      `}
      polygonsTransitionDuration={transitionDuration}
      nPolygonHover={setHoverD}
    />
  );
};

export {GlobeComponent, CountryFeature, CountriesFeatureCollection};