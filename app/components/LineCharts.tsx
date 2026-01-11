"use client";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  voltageData: number[];
  currentData: number[];
}

export default function LineChart({
  labels,
  voltageData,
  currentData,
}: LineChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Voltage (V)",
        data: voltageData,
        borderColor: "#ff4444",
        backgroundColor: "rgba(255, 68, 68, 0.3)",
        tension: 0.3,
      },
      {
        label: "Current (A)",
        data: currentData,
        borderColor: "#4444ff",
        backgroundColor: "rgba(68, 68, 255, 0.3)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Voltage & Current Trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line options={options} data={data} />;
}
