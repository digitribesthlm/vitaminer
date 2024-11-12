import DashboardLayout from '../../components/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's an overview of your topics and recent activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-600 mb-1">Total Topics</div>
            <div className="text-3xl font-bold">24</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-600 mb-1">Active Topics</div>
            <div className="text-3xl font-bold">12</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-600 mb-1">Completed Topics</div>
            <div className="text-3xl font-bold">8</div>
          </div>
        </div>

        {/* Recent Topics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Topics</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Topic Name {item}</h3>
                  <p className="text-sm text-gray-600">Last updated 2 days ago</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700">View Details</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 text-left hover:bg-gray-50 rounded-lg">
              <h3 className="font-medium">Create New Topic</h3>
              <p className="text-sm text-gray-600">Start a new topic from scratch</p>
            </button>
            <button className="p-4 text-left hover:bg-gray-50 rounded-lg">
              <h3 className="font-medium">Import Topics</h3>
              <p className="text-sm text-gray-600">Import topics from external sources</p>
            </button>
            <button className="p-4 text-left hover:bg-gray-50 rounded-lg">
              <h3 className="font-medium">Generate Report</h3>
              <p className="text-sm text-gray-600">Create a summary report</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 