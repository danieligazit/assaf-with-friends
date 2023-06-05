import React from "react";
import { CountryFeature } from "./types";
import "./Sidebar.css";

interface SidebarProps {
  hoveredCountry: CountryFeature | null;
}

const Sidebar: React.FC<SidebarProps> = ({ hoveredCountry }) => {
  return (
  
    <div className="sidebar">
      {hoveredCountry && hoveredCountry.properties.refugeeCountDisplay ? (
        <>
          <h2>{hoveredCountry.properties.ADMIN}</h2>
          <p>
            Population: {Math.round(+hoveredCountry.properties.POP_EST / 1e4) / 1e2}M
          </p>
          {hoveredCountry.properties.refugeeCountDisplay && (
            <p >
              Asylum Seekers in Israel: {hoveredCountry.properties.refugeeCountDisplay}
            </p>
          )}


          {hoveredCountry.properties.info && hoveredCountry.properties.info.map((item: string) => {
              return (
              <p>
                {item}
              </p>
              )
            })
          }

          <p >
            <a
              href="https://www.example.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </p>
        </>
      ) : (
        <>
          <h2>Refugess in Israel</h2>
          <p >

          According to data from the Population and Immigration Authority, there are currently about 25,500 asylum seekers living in Israel, mainly from Eritrea and Sudan (about 20,000 from Eritrea and about 4,000 from Sudan). In addition, according to estimates, about 8,000 children of asylum seekers are growing up in Israel, the majority of whom were born in Israel.
          </p>
          <p>
          Asylum seekers fled brutal dictatorships, wars, genocide, and other atrocities, forcing them to leave their homes and homelands. About 4,000 of them are survivors of the Sinai torture camps and carry the scars of cruel torture on their bodies and in their minds.
          </p>
          <p>
          Their living in Israel is regulated under a government policy of temporary protection – and the State of Israel recognizes the danger to their lives if they return to their countries of origin.
          </p>
          <p>
            <a
              href="https://assaf.org.il/en/refugees-in-israel"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </p>
        </> 
      )
      
      
      }
    </div>
  );
};

export default Sidebar;