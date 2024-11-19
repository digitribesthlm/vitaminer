import DashboardLayout from '../../components/DashboardLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSupplements: 0,
    takenToday: 0,
    streak: 0
  });
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [takenSupplements, setTakenSupplements] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/dashboard/stats', {
        credentials: 'include'
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch supplements
      const suppsRes = await fetch('/api/supplements', {
        credentials: 'include'
      });
      const suppsData = await suppsRes.json();
      setSupplements(suppsData);

      // Fetch today's taken supplements
      const takenRes = await fetch('/api/supplements/taken-today', {
        credentials: 'include'
      });
      if (takenRes.ok) {
        const takenData = await takenRes.json();
        setTakenSupplements(takenData.map(t => t.supplementId));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeDose = async (supplementId) => {
    try {
      const response = await fetch('/api/supplements/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          supplementId,
          dosageIndex: 0,
        }),
      });

      if (response.ok) {
        // Update local state
        setTakenSupplements(prev => [...prev, supplementId]);
        // Refresh stats
        fetchData();
      }
    } catch (error) {
      console.error('Error tracking supplement:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-600 mb-1">Total Supplements</div>
            <div className="text-3xl font-bold">{stats.totalSupplements}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-600 mb-1">Taken Today</div>
            <div className="text-3xl font-bold">{stats.takenToday}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-600 mb-1">Current Streak</div>
            <div className="text-3xl font-bold">{stats.streak} days</div>
          </div>
        </div>

        {/* Supplements Quick View */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Supplements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supplements.map((supplement) => (
              <div 
                key={supplement._id} 
                className={`border rounded-lg p-4 ${
                  takenSupplements.includes(supplement._id) 
                    ? 'bg-green-50 border-green-200' 
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-medium">{supplement.name}</h3>
                <p className="text-sm text-gray-600">
                  {supplement.dosages[0].amount} {supplement.dosages[0].unit}
                </p>
                <button
                  onClick={() => handleTakeDose(supplement._id)}
                  disabled={takenSupplements.includes(supplement._id)}
                  className={`mt-2 px-4 py-2 rounded-lg ${
                    takenSupplements.includes(supplement._id)
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {takenSupplements.includes(supplement._id) ? 'Taken' : 'Take Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 