import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { csv } from "d3-fetch";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const MapChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // https://www.bls.gov/lau/
    csv("/unemployment-by-county-2017.csv").then((counties) => {
      console.log(JSON.stringify(counties));
      setData(counties);
    });
  }, []);

  const colorScale = scaleQuantile()
    .domain(data.map((d) => d.unemployment_rate))
    .range([
      "#b1b7b0",
      "#ae9089",
      "#a57c73",
      "#734a4b",
      "#6d5368",
      "#6b4f70",
      "#61456c",
      "#573866",
      "#46255e"
    ]);

  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const cur = data.find((s) => s.id === geo.id);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={cur ? colorScale(cur.unemployment_rate) : "#EEE"}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
