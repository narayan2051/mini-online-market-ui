import PropTypes from "prop-types";
import React from "react";
import { Doughnut } from "react-chartjs-2";
export default function DoughnutChart({ chartData, ...props }) {
  const data = {
    labels: props.labels,
    datasets: [
      {
        data: chartData,
        backgroundColor: props.backgroundColor,
        hoverBackgroundColor: props.hoverBackgroundColor,
      }
    ]
  };

  return (
    <Doughnut data={data} options={props.options} />
  );
}

DoughnutChart.propTypes = {
  backgroundColor: PropTypes.array,
  hoverBackgroundColor: PropTypes.array,
  labels: PropTypes.array,
  chartData: PropTypes.array,
};

DoughnutChart.defaultProps = {
  backgroundColor: [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#2196f3",
    "#ff5722",
    "#009688",
    "#3f51b5",
    "#795548",
    "#689f38",
    "#37474f",
    "#ff3d00",
    "#4e342e",
    "#ff9100",
    "#ffea00",
  ],
  hoverBackgroundColor: [
    "#d32f2f",
    "#c2185b",
    "#7b1fa2",
    "#1976d2",
    "#e64a19",
    "#00796b",
    "#303f9f",
    "#ffeb3b",
    "#795548",
    "#33691e",
    "#263238",
    "#dd2c00",
    "#3e2723",
    "#ff6d00",
    "#ffd600",
  ],
  labels: [],
  chartData: []
};
