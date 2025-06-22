import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface HistoryEntry {
  lat: number;
  lon: number;
  requestedAt: string;
  weather: {
    source: string;
    tempC: number;
    description: string;
    fetchedAt: string;
  };
}

export const HistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('-requestedAt');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filterLat, setFilterLat] = useState('');
  const [filterLon, setFilterLon] = useState('');

  const fetchHistory = async (fetchCount: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (fetchCount) {
        queryParams.append('count', 'true');
      } else {
        queryParams.append('skip', skip.toString());
        queryParams.append('limit', limit.toString());
        queryParams.append('sort', sort);
      }

      if (from) queryParams.append('from', new Date(from).toISOString());
      if (to) queryParams.append('to', new Date(to).toISOString());
      if (filterLat) queryParams.append('lat', filterLat);
      if (filterLon) queryParams.append('lon', filterLon);
      
      const response = await axios.get(`https://weather-project-fuwi.onrender.com/api/history?${queryParams.toString()}`);

      if (fetchCount) {
        setTotalCount(response.data.total);
      } else {
        setHistoryList(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
      fetchHistory(true);
    }
  }, [isAuthenticated, skip, limit, sort]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSkip(0);
    fetchHistory();
    fetchHistory(true);
  };

  if (!isAuthenticated) {
    return <p className="text-center p-8 text-gray-700">Please sign in to view history.</p>;
  }

  return (
    <div className="container mx-auto p-4 py-8 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Request History</h2>
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">From Date</label>
          <input type="date" id="from" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">To Date</label>
          <input type="date" id="to" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="filterLat" className="block text-sm font-medium text-gray-700">Latitude</label>
          <input type="number" step="0.01" id="filterLat" placeholder="e.g. 24.71" value={filterLat} onChange={(e) => setFilterLat(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="filterLon" className="block text-sm font-medium text-gray-700">Longitude</label>
          <input type="number" step="0.01" id="filterLon" placeholder="e.g. 46.68" value={filterLon} onChange={(e) => setFilterLon(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort By</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            <option value="-requestedAt">Date (Newest first)</option>
            <option value="requestedAt">Date (Oldest first)</option>
            <option value="-lat">Lat (High to Low)</option>
            <option value="lat">Lat (Low to High)</option>
          </select>
        </div>
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700">Items per page</label>
          <input type="number" id="limit" value={limit} onChange={(e) => setLimit(parseInt(e.target.value, 10))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex items-end justify-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50" disabled={loading}>
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </form>

      {totalCount !== null && (
        <p className="text-lg text-gray-800 mb-4 text-center">Total Requests: {totalCount}</p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : historyList.length > 0 ? (
        <div className="space-y-4">
          {historyList.map((entry, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
              <p><strong>Location:</strong> {entry.lat}, {entry.lon}</p>
              <p><strong>Requested At:</strong> {new Date(entry.requestedAt).toLocaleString()}</p>
              {entry.weather && (
                <div className="ml-4 text-gray-700">
                  <p><strong>Source:</strong> {entry.weather.source}</p>
                  <p><strong>Temp:</strong> {entry.weather.tempC}°C</p>
                  <p><strong>Description:</strong> {entry.weather.description}</p>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setSkip(prev => Math.max(0, prev - limit))}
              disabled={skip === 0 || loading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">Page {Math.floor(skip / limit) + 1}</span>
            <button
              onClick={() => setSkip(prev => prev + limit)}
              disabled={loading || (totalCount !== null && skip + limit >= totalCount)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No history data found for your filters.</p>
      )}
    </div>
  );
};
