'use client';

import { useEffect, useState } from 'react';
import { useRealtimeData } from '@/app/hooks/useRealtimeData';
import { writeData, updateData, deleteData, pushData } from '@/app/firebase';

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: number;
}

interface DashboardData {
  [key: string]: SensorData;
}

export default function RealtimeDashboard() {
  const { data, loading, error } = useRealtimeData<DashboardData>('sensors');
  const [newTemp, setNewTemp] = useState('');
  const [newHumidity, setNewHumidity] = useState('');

  // Write new data
  const handleAddData = async () => {
    try {
      const newData: SensorData = {
        temperature: parseFloat(newTemp),
        humidity: parseFloat(newHumidity),
        timestamp: Date.now()
      };
      
      await pushData('sensors', newData);
      setNewTemp('');
      setNewHumidity('');
    } catch (err) {
      console.error('Error adding data:', err);
    }
  };

  // Update existing data
  const handleUpdateData = async (key: string) => {
    try {
      await updateData(`sensors/${key}`, {
        temperature: 25.5,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };

  // Delete data
  const handleDeleteData = async (key: string) => {
    try {
      await deleteData(`sensors/${key}`);
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Realtime Dashboard</h1>
      
      {/* Add New Data Form */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl mb-2">Add New Sensor Data</h2>
        <input
          type="number"
          placeholder="Temperature"
          value={newTemp}
          onChange={(e) => setNewTemp(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Humidity"
          value={newHumidity}
          onChange={(e) => setNewHumidity(e.target.value)}
          className="border p-2 mr-2"
        />
        <button 
          onClick={handleAddData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Data
        </button>
      </div>

      {/* Display Data */}
      <div className="grid gap-4">
        {data && Object.entries(data).map(([key, value]) => (
          <div key={key} className="border p-4 rounded shadow">
            <p><strong>Temperature:</strong> {value.temperature}°C</p>
            <p><strong>Humidity:</strong> {value.humidity}%</p>
            <p><strong>Time:</strong> {new Date(value.timestamp).toLocaleString()}</p>
            <div className="mt-2">
              <button 
                onClick={() => handleUpdateData(key)}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                Update
              </button>
              <button 
                onClick={() => handleDeleteData(key)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!data && <p>No data available</p>}
      </div>
    </div>
  );
}