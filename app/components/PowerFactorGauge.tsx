"use client";

import { useEffect, useRef } from "react";

interface PowerFactorGaugeProps {
  value: number;
}

export default function PowerFactorGauge({ value }: PowerFactorGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGauge = (canvas: HTMLCanvasElement | null, pf: number) => {
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
    ctx.lineWidth = 18;
    ctx.strokeStyle = "#e0e0e0";
    ctx.stroke();

    // Determine color
    let gaugeColor = "#ff4444"; // poor
    if (pf >= 0.95) gaugeColor = "#44ff44"; // excellent
    else if (pf >= 0.9) gaugeColor = "#ffaa00"; // good

    // Value arc
    const angle = 0.75 * Math.PI + pf * 1.5 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, angle);
    ctx.lineWidth = 18;
    ctx.strokeStyle = gaugeColor;
    ctx.lineCap = "round";
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 25, 0, 2 * Math.PI);
    ctx.fillStyle = "#f9f9f9";
    ctx.fill();

    // Value text
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(pf.toFixed(2), centerX, centerY);

    // Status text
    ctx.font = "14px Arial";
    let status = pf >= 0.95 ? "Excellent" : pf >= 0.9 ? "Good" : "Poor";
    ctx.fillStyle = gaugeColor;
    ctx.fillText(status, centerX, centerY + 30);
  };

  useEffect(() => {
    drawGauge(canvasRef.current, value || 0);
  }, [value]);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <canvas ref={canvasRef} width={200} height={200} />
    </div>
  );
}
