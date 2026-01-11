"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase/firebase";
import PhaseGauge from "./components/PhaseGauge";
import PowerFactorGauge from "./components/PowerFactorGauge";
import LineChart from "./components/LineCharts";

interface PhaseData {
  R: number;
  Y: number;
  B: number;
}

interface PowerFactorData {
  R: number;
  Y: number;
  B: number;
}

export default function Dashboard() {
  const [voltage, setVoltage] = useState<PhaseData>({ R: 0, Y: 0, B: 0 });
  const [current, setCurrent] = useState<PhaseData>({ R: 0, Y: 0, B: 0 });
  const [powerFactor, setPowerFactor] = useState<PowerFactorData>({ R: 0, Y: 0, B: 0 });
  const [fault, setFault] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [voltageHistory, setVoltageHistory] = useState<PhaseData[]>([]);
  const [currentHistory, setCurrentHistory] = useState<PhaseData[]>([]);

  useEffect(() => {
    console.log("🔥 Connecting to Firebase...");

    // Listen to voltage data
    const voltageRef = ref(database, "data/voltage");
    const unsubVoltage = onValue(voltageRef, (snapshot) => {
      const data = snapshot.val();
      console.log("📊 Voltage data:", data);
      if (data) {
        setVoltage(data);
        setVoltageHistory((prev) => [...prev.slice(-9), data]);
        setIsConnected(true);
        
        setTimeLabels((prev) => {
          const time = new Date().toLocaleTimeString();
          return [...prev.slice(-9), time];
        });
      }
    });

    // Listen to current data
    const currentRef = ref(database, "data/current");
    const unsubCurrent = onValue(currentRef, (snapshot) => {
      const data = snapshot.val();
      console.log("⚡ Current data:", data);
      if (data) {
        setCurrent(data);
        setCurrentHistory((prev) => [...prev.slice(-9), data]);
        setIsConnected(true);
      }
    });

    // Listen to power factor data
    const pfRef = ref(database, "data/pf");
    const unsubPF = onValue(pfRef, (snapshot) => {
      const data = snapshot.val();
      console.log("🔋 Power Factor data:", data);
      if (data) {
        setPowerFactor(data);
        setIsConnected(true);
      }
    });

    // Listen to fault status
    const faultRef = ref(database, "data/fault");
    const unsubFault = onValue(faultRef, (snapshot) => {
      const data = snapshot.val();
      console.log("⚠️ Fault status:", data);
      if (data !== null) {
        setFault(data);
      }
    });

    return () => {
      unsubVoltage();
      unsubCurrent();
      unsubPF();
      unsubFault();
    };
  }, []);

  const avgVoltageHistory = voltageHistory.map((v) => (v.R + v.Y + v.B) / 3);
  const avgCurrentHistory = currentHistory.map((c) => (c.R + c.Y + c.B) / 3);
  
  const avgPowerFactor = (powerFactor.R + powerFactor.Y + powerFactor.B) / 3;

  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 20 
      }}>
        <h1>3 Phase Power Dashboard</h1>
        <div style={{ display: "flex", gap: 10 }}>
          {fault && (
            <div style={{
              padding: "8px 16px",
              borderRadius: 4,
              backgroundColor: "#ff9800",
              color: "white",
              fontWeight: "bold"
            }}>
              ⚠️ FAULT DETECTED
            </div>
          )}
          <div style={{
            padding: "8px 16px",
            borderRadius: 4,
            backgroundColor: isConnected ? "#4caf50" : "#f44336",
            color: "white",
            fontWeight: "bold"
          }}>
            {isConnected ? "● Connected" : "● Disconnected"}
          </div>
        </div>
      </div>

      <h2>Voltage (Volts)</h2>
      <PhaseGauge data={voltage} unit="V" max={260} />

      <h2>Current (Amps)</h2>
      <PhaseGauge data={current} unit="A" max={100} />

      <h2>Power Factor</h2>
      <PowerFactorGauge value={avgPowerFactor} />
      
      <div style={{ 
        display: "flex", 
        justifyContent: "space-around", 
        marginTop: 20,
        padding: 15,
        backgroundColor: "#f5f5f5",
        borderRadius: 8
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#f44336", fontWeight: "bold" }}>Phase R</div>
          <div style={{ fontSize: 24 }}>{powerFactor.R.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#ff9800", fontWeight: "bold" }}>Phase Y</div>
          <div style={{ fontSize: 24 }}>{powerFactor.Y.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#2196f3", fontWeight: "bold" }}>Phase B</div>
          <div style={{ fontSize: 24 }}>{powerFactor.B.toFixed(2)}</div>
        </div>
      </div>

      <h2>Voltage & Current Trends</h2>
      {timeLabels.length > 0 ? (
        <LineChart
          labels={timeLabels}
          voltageData={avgVoltageHistory}
          currentData={avgCurrentHistory}
        />
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: 40, 
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          color: "#666" 
        }}>
          📊 Waiting for data...
        </div>
      )}

      <div style={{ marginTop: 40 }}>
        <h3>Current Readings</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: 20,
          marginTop: 20
        }}>
          <div style={{ 
            padding: 20, 
            backgroundColor: "#fff", 
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h4 style={{ marginTop: 0 }}>Voltage</h4>
            <div><strong style={{ color: "#f44336" }}>R:</strong> {voltage.R.toFixed(1)} V</div>
            <div><strong style={{ color: "#ff9800" }}>Y:</strong> {voltage.Y.toFixed(1)} V</div>
            <div><strong style={{ color: "#2196f3" }}>B:</strong> {voltage.B.toFixed(1)} V</div>
          </div>

          <div style={{ 
            padding: 20, 
            backgroundColor: "#fff", 
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h4 style={{ marginTop: 0 }}>Current</h4>
            <div><strong style={{ color: "#f44336" }}>R:</strong> {current.R.toFixed(2)} A</div>
            <div><strong style={{ color: "#ff9800" }}>Y:</strong> {current.Y.toFixed(2)} A</div>
            <div><strong style={{ color: "#2196f3" }}>B:</strong> {current.B.toFixed(2)} A</div>
          </div>

          <div style={{ 
            padding: 20, 
            backgroundColor: "#fff", 
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h4 style={{ marginTop: 0 }}>Power Factor</h4>
            <div><strong style={{ color: "#f44336" }}>R:</strong> {powerFactor.R.toFixed(2)}</div>
            <div><strong style={{ color: "#ff9800" }}>Y:</strong> {powerFactor.Y.toFixed(2)}</div>
            <div><strong style={{ color: "#2196f3" }}>B:</strong> {powerFactor.B.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <details style={{ marginTop: 40 }}>
        <summary style={{ 
          cursor: "pointer", 
          padding: 10, 
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          fontWeight: "bold"
        }}>
          🔍 Debug Information
        </summary>
        <div style={{ 
          padding: 20, 
          backgroundColor: "#f5f5f5", 
          borderRadius: 4,
          marginTop: 10
        }}>
          <pre style={{ 
            backgroundColor: "#fff", 
            padding: 15, 
            borderRadius: 4,
            overflow: "auto"
          }}>
            {JSON.stringify({
              voltage,
              current,
              powerFactor,
              fault,
              isConnected,
              dataPoints: timeLabels.length
            }, null, 2)}
          </pre>
        </div>
      </details>
    </main>
  );
}
