"use client";

interface SystemStatusProps {
  fault: boolean;
}

export default function SystemStatus({ fault }: SystemStatusProps) {
  return (
    <div
      style={{
        backgroundColor: fault ? "#ffebee" : "#e8f5e9",
        border: `3px solid ${fault ? "#f44336" : "#4caf50"}`,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "30px",
        textAlign: "center",
        boxShadow: fault
          ? "0 0 30px rgba(244,67,54,0.3)"
          : "0 2px 8px rgba(0,0,0,0.1)",
        animation: fault ? "pulse 2s infinite" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: fault ? "#f44336" : "#4caf50",
            boxShadow: fault ? "0 0 20px #f44336" : "0 0 10px #4caf50",
            animation: fault ? "blink 1s infinite" : "none",
          }}
        />
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              color: fault ? "#c62828" : "#2e7d32",
            }}
          >
            {fault ? "⚠️ SYSTEM FAULT DETECTED" : "✅ SYSTEM NORMAL"}
          </h2>
          <p
            style={{
              margin: "5px 0 0 0",
              fontSize: "14px",
              color: "#666",
            }}
          >
            {fault
              ? "Power factor below threshold - Backup activated"
              : "All parameters within normal range"}
          </p>
        </div>
      </div>
    </div>
  );
}
