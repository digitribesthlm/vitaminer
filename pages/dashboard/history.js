import DashboardLayout from '../../components/DashboardLayout';
import { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartBarIcon, BeakerIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function History() {
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/supplements/history?range=${dateRange}`,
        {
          credentials: 'include',
        }
      );
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
        prepareChartData(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const prepareChartData = (data) => {
    // Group data by date
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.timeStamp).toLocaleDateString();
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
      return acc;
    }, {});

    setChartData({
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'Supplements Taken',
          data: Object.values(grouped),
          fill: false,
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1,
        },
      ],
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Tracking History</h1>
          <div className='flex space-x-2'>
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg ${
                dateRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-lg ${
                dateRange === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-4 py-2 rounded-lg ${
                dateRange === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <ChartBarIcon className='h-5 w-5 mr-2' />
            Intake Overview
          </h2>
          {chartData && (
            <div className='h-64'>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-xl shadow-sm p-6'>
            <div className='flex items-center text-gray-600 mb-1'>
              <BeakerIcon className='h-5 w-5 mr-2' />
              Total Tracked
            </div>
            <div className='text-3xl font-bold'>{history.length}</div>
          </div>
          <div className='bg-white rounded-xl shadow-sm p-6'>
            <div className='text-gray-600 mb-1'>Unique Supplements</div>
            <div className='text-3xl font-bold'>
              {new Set(history.map((h) => h.supplementId)).size}
            </div>
          </div>
          <div className='bg-white rounded-xl shadow-sm p-6'>
            <div className='text-gray-600 mb-1'>Daily Average</div>
            <div className='text-3xl font-bold'>
              {history.length > 0
                ? (
                    history.length /
                    (dateRange === 'week'
                      ? 7
                      : dateRange === 'month'
                        ? 30
                        : 365)
                  ).toFixed(1)
                : '0'}
            </div>
          </div>
        </div>

        {/* History List */}
        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold'>Detailed History</h2>
          </div>
          <div className='divide-y divide-gray-200'>
            {history.map((item) => (
              <div
                key={item._id}
                className='px-6 py-4 flex items-center justify-between'
              >
                <div>
                  <h3 className='font-medium'>{item.supplementName}</h3>
                  <p className='text-sm text-gray-600'>
                    {item.dosages[0].amount} {item.dosages[0].unit}
                  </p>
                </div>
                <div className='text-right'>
                  <div className='text-sm text-gray-900'>
                    {formatDate(item.timeStamp)}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {item.dosages[0].timeOfDay}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
