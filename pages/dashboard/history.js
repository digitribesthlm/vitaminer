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
import { BeakerIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const History = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  const prepareChartData = useCallback((data) => {
    if (!data || data.length === 0) {
      setChartData(null);
      return;
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const datasets = {};
    sortedData.forEach((entry) => {
      entry.supplements.forEach((supp) => {
        const key = `${supp.name} (${supp.unit || 'units'})`;
        if (!datasets[key]) {
          datasets[key] = {
            label: key,
            data: [],
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            tension: 0.4,
            fill: false,
            pointRadius: 4,
          };
        }
      });
    });

    const labels = sortedData.map((entry) =>
      new Date(entry.date).toLocaleDateString()
    );

    // Initialize all datasets with 0 values for all dates
    Object.values(datasets).forEach(dataset => {
      dataset.data = new Array(labels.length).fill(0);
    });

    // Fill in actual values
    sortedData.forEach((entry, index) => {
      entry.supplements.forEach((supp) => {
        const key = `${supp.name} (${supp.unit || 'units'})`;
        if (datasets[key]) {
          datasets[key].data[index] = parseInt(supp.amount) || 0;
        }
      });
    });

    setChartData({
      labels,
      datasets: Object.values(datasets),
    });
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/supplements/history', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Received history data:', data);
        prepareChartData(data);
      } else {
        console.error('Failed to fetch history:', await response.text());
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, [prepareChartData]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRangeChange = (range) => {
    setDateRange(range);
    setLoading(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <BeakerIcon className="w-8 h-8 animate-bounce text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Supplement History</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleRangeChange('week')}
              className={`px-4 py-2 rounded ${
                dateRange === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleRangeChange('month')}
              className={`px-4 py-2 rounded ${
                dateRange === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleRangeChange('year')}
              className={`px-4 py-2 rounded ${
                dateRange === 'year'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          {chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Supplement Intake Over Time',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data available for the selected time range
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;
