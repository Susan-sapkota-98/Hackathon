"use client";

import { useEffect, useRef } from "react";

interface PhaseGaugeProps {
  data: { R: number; Y: number; B: number };
  unit: string;
  max: number;
}

export default function PhaseGauge({ data, unit, max }: PhaseGaugeProps) {
  const canvasRRef = useRef<HTMLCanvasElement>(null);
  const canvasYRef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);

  const drawGauge = (
    canvas: HTMLCanvasElement | null,
    value: number,
    color: string,
    label: string,
    maxValue: number
  ) => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "#e0e0e0";
    ctx.stroke();

    // Value arc
    const normalizedValue = Math.min(value / maxValue, 1);
    const angle = 0.75 * Math.PI + normalizedValue * 1.5 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, angle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#f9f9f9";
    ctx.fill();

    // Value text
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(value.toFixed(1), centerX, centerY - 5);

    // Unit text
    ctx.font = "14px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText(unit, centerX, centerY + 15);

    // Label text
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = color;
    ctx.fillText(label, centerX, centerY + 40);
  };

  useEffect(() => {
    drawGauge(canvasRRef.current, data.R || 0, "#ff4444", "R", max);
    drawGauge(canvasYRef.current, data.Y || 0, "#ffaa00", "Y", max);
    drawGauge(canvasBRef.current, data.B || 0, "#4444ff", "B", max);
  }, [data, unit, max]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: "30px",
        padding: "20px",
      }}
    >
      <canvas ref={canvasRRef} width={220} height={220} />
      <canvas ref={canvasYRef} width={220} height={220} />
      <canvas ref={canvasBRef} width={220} height={220} />
    </div>
  );
}
