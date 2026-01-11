'use client';

import { useRealtimeData } from '@/app/hooks/useRealtimeData';

interface HardwareData {
  status: string;
  value: number;
  lastUpdate: number;
}

export default function HardwareMonitor() {
  const { data, loading } = useRealtimeData<HardwareData>('hardware/device1');

  if (loading) return <div>Connecting...</div>;

  return (
    <div className="p-6 bg-gray-100 rounded">
      <h2 className="text-xl font-bold">Hardware Monitor</h2>
      {data ? (
        <div>
          <p>Status: {data.status}</p>
          <p>Value: {data.value}</p>
          <p>Last Update: {new Date(data.lastUpdate).toLocaleString()}</p>
        </div>
      ) : (
        <p>No data received</p>
      )}
    </div>
  );
}