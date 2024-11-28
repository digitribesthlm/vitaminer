import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect, useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { BeakerIcon } from '@heroicons/react/24/outline'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function History() {
  const [history, setHistory] = useState([])
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('week')

  const prepareChartData = useCallback((data) => {
    if (!data || data.length === 0) {
      setChartData(null)
      return
    }

    const datasets = {}
    data.forEach((entry) => {
      entry.supplements.forEach((supp) => {
        if (!datasets[supp.name]) {
          datasets[supp.name] = {
            label: supp.name,
            data: [],
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            tension: 0.4
          }
        }
      })
    })

    const labels = data.map((entry) => new Date(entry.date).toLocaleDateString())
    const chartDatasets = Object.values(datasets).map((dataset) => {
      dataset.data = data.map((entry) => {
        const supplement = entry.supplements.find((s) => s.name === dataset.label)
        return supplement ? supplement.amount : 0
      })
      return dataset
    })

    setChartData({
      labels,
      datasets: chartDatasets
    })
  }, [])

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/supplements/history?range=${dateRange}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
        prepareChartData(data)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange, prepareChartData])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleRangeChange = (range) => {
    setDateRange(range)
    setLoading(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <BeakerIcon className="w-8 h-8 animate-bounce text-blue-500" />
        </div>
      </DashboardLayout>
    )
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
                    position: 'top'
                  },
                  title: {
                    display: true,
                    text: 'Supplement Intake Over Time'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
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
  )
}
