import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "./App.css";

const LinearChart = () => {
  const [dataset1, setDataset1] = useState([]);
  const [dataset2, setDataset2] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data for both datasets
    const fetchData = async () => {
      try {
        const response1 = await fetch("/data.json");
        const jsonData1 = await response1.json();
        const response2 = await fetch("/data2.json");
        const jsonData2 = await response2.json();

        setDataset1(jsonData1);
        setDataset2(jsonData2);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Trace for the first dataset (area chart)
  const trace1 = {
    x: dataset1.map((point) => point.time),
    y: dataset1.map((point) => point.data),
    mode: "lines",
    fill: "tozeroy", // Area chart fill
    type: "scatter",
    name: "Dataset 1", // Legend name
    fillcolor: "rgba(255, 100, 0, .3)",
    line: {
      color: "rgba(255, 100, 0, 1)",
    },
  };

  // Trace for the second dataset (area chart)
  const trace2 = {
    x: dataset2.map((point) => point.time),
    y: dataset2.map((point) => point.data),
    mode: "lines",
    fill: "tozeroy", // Area chart fill
    type: "scatter",
    name: "Dataset 2", // Legend name
    fillcolor: "rgba(125, 0, 0, .3)",
    line: {
      color: "rgba(125, 0, 0, 1)",
    },
  };

  // Layout for Plotly
  const layout = {
    title: "Large Dataset Visualization - Area Charts",
    xaxis: { title: "X Axis" },
    yaxis: { title: "Y Axis" },
    autosize: true,
  };

  // Config for enabling zoom
  const config = {
    responsive: true,
    scrollZoom: true, // Enable zoom
    displaylogo: false, // Remove Plotly logo from the toolbar
  };

  return (
    // <div className="chart-container">
    <div>
      <Plot
        data={[trace1, trace2]}
        layout={layout}
        config={config}
        seResizeHandler={true}
      />
    </div>
  );
};

export default LinearChart;
