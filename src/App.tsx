import React, { useEffect, useState } from 'react';
import './App.css';
import {GlobeComponent, CountryFeature, CountriesFeatureCollection } from './components/GlobeComponent';

function normalizeLogarithmic(arr) {
  // Apply the logarithmic function to each element in the array
  const logArr = arr.map(x => Math.log(x));

  // Find the maximum and minimum values in the log array
  const max = Math.max(...logArr);
  const min = Math.min(...logArr);

  // Normalize the log array between 0 and 1
  const normLogArr = logArr.map(x => (x - min) / (max - min));

  // Apply the exponential function to each element in the normalized log array
  const normArr = normLogArr.map(x => Math.exp(x));

  return normArr;
}

function App() {
  const [countriesData, setCountriesData] = useState<CountriesFeatureCollection>({ type: "FeatureCollection", features: [] });
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);

  useEffect(() => {
    fetch('./datasets/ne_110m_admin_0_countries.geojson').then(res => res.json())
      .then((countries: CountriesFeatureCollection) => {
        const enrichedCountries = countries.features
          .map((feature: CountryFeature) => {
            const refugeeCount = {
              ERI: 20000, 
              SDN: 4000, 
              COD: 1000, 
              UKR: 33000,
              SOM: 1000,
            }[feature.properties.ISO_A3];
            
            const refugeeCountDisplay = {
              ERI: "20,000", 
              SDN: "4,000", 
              COD: "1,000", 
              UKR: "33,000",
              SOM: "1,000",
            }[feature.properties.ISO_A3]

            return {
              ...feature, 
              properties: {
                ...feature.properties, 
                refugeeCount: refugeeCount,
                refugeeCountDisplay: refugeeCountDisplay,
              } 
            };
          });

        return { type: 'FeatureCollection', features: enrichedCountries };
      })
      .then((countries: CountriesFeatureCollection) => {
        setCountriesData(countries);

        setTimeout(() => {
          setAltitude(() => feat => 0);

          setTransitionDuration(0);
          setTransitionDuration(2000);
          setAltitude(() => feat => {
            if (feat.properties.refugeeCount ) {
              return 0.1 + feat.properties.refugeeCount /10000 * 0.1;
            }

            return 0.03 + (Math.random()- 0.5) * 0.03;
          });
        }, 3000);
      });
  }, []);

  return (
    <div className="App">
      <GlobeComponent 
        countries={countriesData} 
        altitude={altitude} 
        transitionDuration={transitionDuration} 
      />
    </div>
  );
}

export default App;