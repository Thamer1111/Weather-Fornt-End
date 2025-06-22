import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface WeatherData {
  source: string;
  coordinates: { lat: number; lon: number };
  tempC: number;
  humidity: number;
  description: string;
  fetchedAt: string;
}

export const WeatherPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [lat, setLat] = useState('24.71');
  const [lon, setLon] = useState('46.68');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    try {
      const response = await axios.get(`https://weather-project-fuwi.onrender.com/api/weather?lat=${lat}&lon=${lon}`);
      setWeatherData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeather();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <p className="text-center p-8 text-gray-700">Please sign in to view weather data.</p>;
  }

  return (
    <div className="container mx-auto p-4 py-8 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Current Weather</h2>
      {error && <ErrorMessage message={error} />}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <input
          type="number"
          step="0.01"
          placeholder="Latitude (e.g., 24.71)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          min="-90" max="90"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Longitude (e.g., 46.68)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          min="-180" max="180"
          required
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
          disabled={loading || !lat || !lon}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {weatherData && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-inner">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Weather Details</h3>
          <p><strong>Location:</strong> {weatherData.coordinates.lat}, {weatherData.coordinates.lon}</p>
          <p><strong>Temperature:</strong> {weatherData.tempC}°C</p>
          <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
          <p><strong>Description:</strong> {weatherData.description}</p>
          <p className="text-sm text-gray-500 mt-4">
            Fetched from {weatherData.source} at {new Date(weatherData.fetchedAt).toLocaleString()}
          </p>
        </div>
      )}
      {!weatherData && !loading && !error && <p className="text-center text-gray-600">Enter coordinates and click "Get Weather" to see data.</p>}
    </div>
  );
};
