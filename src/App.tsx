// src/App.tsx
import { useEffect, useState } from 'react';
import './App.css';
import {GlobeComponent, CountryFeature, CountriesFeatureCollection } from './components/GlobeComponent';
import Sidebar from "./components/Sidebar";
import { Grid } from '@mui/material';

const geojsonURL = new URL('./assets/ne_110m_admin_0_countries.geojson', import.meta.url).href

function App() {
  const [countriesData, setCountriesData] = useState<CountriesFeatureCollection>({ type: "FeatureCollection", features: [] });
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [selectedCountry, setSelectedCountry] = useState<CountryFeature | null>(null);
  
  useEffect(() => {
    fetch(geojsonURL).then(res => res.json())
      .then((countries: CountriesFeatureCollection) => {
        const enrichedCountries = countries.features
          .map((feature: CountryFeature) => {
            return {
              ...feature, 
              properties: {
                ...feature.properties, 
                refugeeCount: {
                  ERI: 20000, 
                  SDN: 4000, 
                  COD: 1000, 
                  UKR: 33000,
                  SOM: 1000,
                }[feature.properties.ISO_A3],
                refugeeCountDisplay: {
                  ERI: "20,000", 
                  SDN: "4,000", 
                  COD: "1,000", 
                  UKR: "33,000",
                  SOM: "1,000",
                }[feature.properties.ISO_A3],
                info: {
                  ERI: ["Eritrea is a country in East Africa with a population of about six million. Despite its small population, the difficult living conditions in Eritrea make it one of the largest exporters of refugees in the world, and it is estimated that about 10% to 25% of its population have fled and live abroad."],
                  SDN: ["Sudan, located in Northeast Africa, is the third largest country on the continent, and one of the poorest countries in the world. It was liberated from British occupation in 1956, and during the first decades of its existence has suffered many revolutions and internal conflicts. In 1989 General Omar al-Bashir led a military coup, appointed himself president, and ruled Sudan for 30 years until 2019.",  "Al-Bashir's dictatorial rule was particularly cruel, and for years he pursued opponents of his regime. Demonstrations in the country often ended in the killing of protesters, mass arrests, and torture, carried out by the security forces with complete immunity."],
                  UKR: ["On February 24, 2022, Russia invaded Ukraine as a lengthy conflict between the two countries came to a peak. The conflict began in 2014 after government changes in Ukraine, the unilateral annexation of the Crimean Peninsula by Russia, and the takeover of territories in the Donbas region by pro-Russian separatists. Cities were bombed, and due to the extreme damage and thousands of deaths, innocent children, women, and men fled the fighting, leaving behind their homes, possessions, and often the people most dear to them. The war has resulted in international condemnation of Russia and extensive sanctions."],
                  COD: ["The Democratic Republic of the Congo (formerly known as Zaire) is located in Central Africa and is the second largest country on the continent. Between 1885 and 1960 it was ruled under an extremely brutal occupation by Belgium. This claimed the lives of about ten million Congolese citizens. Since independence in 1960, the Congo has failed to establish a democratic system of government, and to this day Congolese citizens suffer from armed violence, violation of human rights by both government and non-government bodies, corruption, and political oppression."],
                  SOM: ["Israel is refusing to grant asylum to four Somali citizens, contrary to the recommendation of the United Nations High Commissioner for Refugees (UNHCR). The request for asylum was rejected by the Interior Ministry and is now being appealed in the courts.", "The UNHCR recommends the granting of collective protection for Somali citizens originating in the south and central parts of the African country (the recommendation is based on a general decision from the committee advising on refugees). In Israel, however, the ministry’s decision to reject the asylum seekers’ application was based on out-of-date information."]
                }[feature.properties.ISO_A3],

              } 
            };
          });

        return { type: 'FeatureCollection', features: enrichedCountries };
      })
      .then((countries: CountriesFeatureCollection) => {
        setCountriesData(countries);

        setTimeout(() => {
          setTransitionDuration(0);
          setAltitude(() => feat => 1 );


          setTransitionDuration(1900);
          setAltitude(() => (feat: CountryFeature) => {
            if (feat.properties.refugeeCount ) {
              return 0.1 + feat.properties.refugeeCount /10000 * 0.1 + (Math.random()- 0.5) * 0.03;
            }

            return 0.03 + (Math.random()- 0.5) * 0.03;
          });
        }, 2000);
      });
  }, []);

  return (
    <div className="App">
    <Grid container spacing={0} className="grid-container">
      
      <Grid item xs={12} md={3.5} className="sidebar">
        <Sidebar selectedCountry={selectedCountry} />
      </Grid>
      <Grid item xs={12} md={8.5} className="main">
        <div className="globe-container">
          <GlobeComponent 
            countries={countriesData} 
            altitude={altitude} 
            transitionDuration={transitionDuration} 
            className="globe"
            setSelectedCountry={setSelectedCountry}
          />
        </div>
      </Grid>
    </Grid>
    </div>
  );
}

export default App;