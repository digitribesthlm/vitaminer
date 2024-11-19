import DashboardLayout from '../../components/DashboardLayout';
import { useState, useEffect } from 'react';

export default function Supplements() {
  const [supplements, setSupplements] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplement, setNewSupplement] = useState({
    name: '',
    description: '',
    category: 'vitamin',
    dosages: [{
      amount: '',
      unit: 'mg',
      timeOfDay: 'morning'
    }]
  });

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const response = await fetch('/api/supplements', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setSupplements(data);
      }
    } catch (error) {
      console.error('Failed to fetch supplements:', error);
    }
  };

  const handleAddSupplement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/supplements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newSupplement),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewSupplement({
          name: '',
          description: '',
          category: 'vitamin',
          dosages: [{
            amount: '',
            unit: 'mg',
            timeOfDay: 'morning'
          }]
        });
        fetchSupplements();
      }
    } catch (error) {
      console.error('Failed to add supplement:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Supplements</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Supplement
          </button>
        </div>

        {/* Add Supplement Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Add New Supplement</h2>
              <form onSubmit={handleAddSupplement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newSupplement.name}
                    onChange={(e) => setNewSupplement({...newSupplement, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newSupplement.description}
                    onChange={(e) => setNewSupplement({...newSupplement, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newSupplement.category}
                    onChange={(e) => setNewSupplement({...newSupplement, category: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="vitamin">Vitamin</option>
                    <option value="mineral">Mineral</option>
                    <option value="supplement">Supplement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={newSupplement.dosages[0].amount}
                      onChange={(e) => setNewSupplement({
                        ...newSupplement,
                        dosages: [{
                          ...newSupplement.dosages[0],
                          amount: e.target.value
                        }]
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Amount"
                      required
                    />
                    <select
                      value={newSupplement.dosages[0].unit}
                      onChange={(e) => setNewSupplement({
                        ...newSupplement,
                        dosages: [{
                          ...newSupplement.dosages[0],
                          unit: e.target.value
                        }]
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="mg">mg</option>
                      <option value="mcg">mcg</option>
                      <option value="IU">IU</option>
                      <option value="g">g</option>
                    </select>
                    <select
                      value={newSupplement.dosages[0].timeOfDay}
                      onChange={(e) => setNewSupplement({
                        ...newSupplement,
                        dosages: [{
                          ...newSupplement.dosages[0],
                          timeOfDay: e.target.value
                        }]
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Supplement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Supplements List */}
        <div className="grid grid-cols-1 gap-4">
          {supplements.map((supplement) => (
            <div key={supplement._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{supplement.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{supplement.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {supplement.category}
                    </span>
                  </div>
                  <div className="mt-3">
                    {supplement.dosages.map((dosage, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {dosage.amount} {dosage.unit} - {dosage.timeOfDay}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(supplement._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
); 