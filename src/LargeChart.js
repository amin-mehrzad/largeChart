import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const LinearChart = () => {
  const [originalData, setOriginalData] = useState([]); // Store full dataset
  const [chartData, setChartData] = useState(null); // Current chart data
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null); // Reference to the chart instance

  const MAX_INITIAL_POINTS = 1000; // Number of points to show initially
  const MAX_POINTS_ON_ZOOM = 5000; // Number of points to load when zoomed in

  // Function to aggregate or downsample data
  const aggregateData = (data, maxPoints) => {
    const step = Math.ceil(data.length / maxPoints); // Calculate sampling step
    return data.filter((_, index) => index % step === 0); // Downsample by picking every nth point
  };

  // Function to get a subset of the data within a range
  const getSubset = (data, startTime, endTime) => {
    const filteredData = data.filter(
      (item) =>
        new Date(item.time).getTime() >= startTime &&
        new Date(item.time).getTime() <= endTime
    );
    return filteredData.length > 0 ? filteredData : data; // Fall back to full data if filtered data is empty
  };

  useEffect(() => {
    // Fetch the full dataset
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setOriginalData(data); // Save the full dataset
        const aggregatedData = aggregateData(data, MAX_INITIAL_POINTS); // Show initial aggregated data
        setChartData({
          labels: aggregatedData.map((item) => item.time),
          datasets: [
            {
              label: "Data over Time",
              data: aggregatedData.map((item) => item.data),
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              tension: 0.1,
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleZoom = () => {
    const chart = chartRef.current; // Access the chart instance
    if (!chart) return;

    const xScale = chart.scales.x;
    if (!xScale.min || !xScale.max) {
      console.error("Invalid scale bounds:", xScale);
      return;
    }

    const startTime = new Date(xScale.min).getTime();
    const endTime = new Date(xScale.max).getTime();

    const detailedData = getSubset(originalData, startTime, endTime);
    if (detailedData.length === 0) {
      console.warn("No data in zoom range. Reverting to current data.");
      return;
    }

    const aggregatedData = aggregateData(detailedData, MAX_POINTS_ON_ZOOM);

    setChartData({
      labels: aggregatedData.map((item) => item.time),
      datasets: [
        {
          label: "Random Data Over Time",
          data: aggregatedData.map((item) => item.data),
          fill: false,
          borderColor: "rgba(85,139,139,1)",
          tension: 0.1,
        },
      ],
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chartData) {
    return <div>No data available</div>;
  }

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Data",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Data: ${tooltipItem.raw}`;
          },
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true, // Enable zooming with the mouse wheel
          },
          pinch: {
            enabled: true, // Enable zooming with pinch gestures on touch devices
          },
          mode: "x", // Allow zooming in the x-direction only
          onZoomComplete: handleZoom, // Triggered after a zoom action
        },
        pan: {
          enabled: true, // Enable panning
          mode: "x", // Allow panning in the x-direction only
        },
      },
    },
  };

  return (
    <div>
      <h2>Linear Chart with Dynamic Data Loading</h2>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default LinearChart;
