import DashboardLayout from '../../components/DashboardLayout';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, StarIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSupplements: 0,
    takenToday: 0,
    streak: 0,
  });
  const [supplements, setSupplements] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });
  const [takenSupplements, setTakenSupplements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch supplements
      const suppsRes = await fetch('/api/supplements', {
        credentials: 'include',
      });
      const suppsData = await suppsRes.json();

      // Group supplements by time of day
      const grouped = suppsData.reduce(
        (acc, supp) => {
          supp.dosages.forEach((dosage) => {
            if (!acc[dosage.timeOfDay]) {
              acc[dosage.timeOfDay] = [];
            }
            acc[dosage.timeOfDay].push({
              ...supp,
              currentDosage: dosage,
            });
          });
          return acc;
        },
        { morning: [], afternoon: [], evening: [] }
      );

      setSupplements(grouped);

      // Fetch taken supplements.
      const takenRes = await fetch('/api/supplements/taken-today', {
        credentials: 'include',
      });
      if (takenRes.ok) {
        const takenData = await takenRes.json();
        setTakenSupplements(takenData.map((t) => t.supplementId));
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
        setTakenSupplements((prev) => [...prev, supplementId]);
        fetchData(); // Refresh all data
      }
    } catch (error) {
      console.error('Error tracking supplement:', error);
    }
  };

  const TimeBlock = ({
    title,
    supplements,
    icon: Icon,
    bgColor,
    borderColor,
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${borderColor}`}
    >
      <div className="flex items-center mb-4">
        <Icon className="h-6 w-6 mr-2" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supplements.map((supplement) => (
          <div
            key={supplement._id}
            className={`p-4 rounded-lg border ${
              takenSupplements.includes(supplement._id)
                ? 'bg-green-50 border-green-200'
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{supplement.name}</h3>
                <p className="text-sm text-gray-600">
                  {supplement.currentDosage.amount}{' '}
                  {supplement.currentDosage.unit}
                </p>
              </div>
              <button
                onClick={() => handleTakeDose(supplement._id)}
                disabled={takenSupplements.includes(supplement._id)}
                className={`p-2 rounded-full ${
                  takenSupplements.includes(supplement._id)
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : `${bgColor} text-white hover:opacity-90`
                }`}
              >
                {takenSupplements.includes(supplement._id) ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <PlusIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        ))}
        {supplements.length === 0 && (
          <p className="text-gray-500 col-span-2">
            No supplements scheduled for this time
          </p>
        )}
      </div>
    </div>
  );

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
        {/* Stats Grid */}
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

        {/* Time-based Supplement Groups */}
        <div className="space-y-6">
          <TimeBlock
            title="Morning Supplements"
            supplements={supplements.morning}
            icon={SunIcon}
            bgColor="bg-yellow-500"
            borderColor="border-yellow-500"
          />
          <TimeBlock
            title="Afternoon Supplements"
            supplements={supplements.afternoon}
            icon={MoonIcon}
            bgColor="bg-blue-500"
            borderColor="border-blue-500"
          />
          <TimeBlock
            title="Evening Supplements"
            supplements={supplements.evening}
            icon={StarIcon}
            bgColor="bg-indigo-500"
            borderColor="border-indigo-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);
