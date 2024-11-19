import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  SunIcon,
  MoonIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Supplements() {
  const [supplements, setSupplements] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSupplement, setEditingSupplement] = useState(null)
  const [labels, setLabels] = useState([])
  const [newSupplement, setNewSupplement] = useState({
    name: '',
    description: '',
    category: 'vitamin',
    labelIds: [],
    dosages: [
      {
        amount: '',
        unit: 'mg',
        timeOfDay: 'morning'
      }
    ]
  })

  useEffect(() => {
    fetchSupplements()
    fetchLabels()
  }, [])

  const fetchSupplements = async () => {
    try {
      const response = await fetch('/api/supplements', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setSupplements(data)
      }
    } catch (error) {
      console.error('Failed to fetch supplements:', error)
    }
  }

  const fetchLabels = async () => {
    try {
      const response = await fetch('/api/supplements/labels')
      if (response.ok) {
        const data = await response.json()
        setLabels(data)
      }
    } catch (error) {
      console.error('Failed to fetch labels:', error)
    }
  }

  const handleAddSupplement = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/supplements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newSupplement)
      })

      if (response.ok) {
        setShowAddForm(false)
        setNewSupplement({
          name: '',
          description: '',
          category: 'vitamin',
          labelIds: [],
          dosages: [
            {
              amount: '',
              unit: 'mg',
              timeOfDay: 'morning'
            }
          ]
        })
        fetchSupplements()
      }
    } catch (error) {
      console.error('Failed to adds supplement:', error)
    }
  }

  const handleLabelToggle = (labelId) => {
    setNewSupplement((prev) => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter((id) => id !== labelId)
        : [...prev.labelIds, labelId]
    }))
  }

  const getTimeIcon = (timeOfDay) => {
    switch (timeOfDay) {
      case 'morning':
        return <SunIcon className='h-4 w-4 text-yellow-500' />
      case 'evening':
        return <MoonIcon className='h-4 w-4 text-indigo-500' />
      default:
        return <ClockIcon className='h-4 w-4 text-gray-500' />
    }
  }

  const handleEdit = (supplement) => {
    setEditingSupplement(supplement)
    setNewSupplement({
      name: supplement.name,
      description: supplement.description,
      category: supplement.category,
      labelIds: supplement.labelIds || [],
      dosages: supplement.dosages
    })
    setShowAddForm(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `/api/supplements/${editingSupplement._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(newSupplement)
        }
      )

      if (response.ok) {
        setShowAddForm(false)
        setEditingSupplement(null)
        setNewSupplement({
          name: '',
          description: '',
          category: 'vitamin',
          labelIds: [],
          dosages: [
            {
              amount: '',
              unit: 'mg',
              timeOfDay: 'morning'
            }
          ]
        })
        fetchSupplements()
      }
    } catch (error) {
      console.error('Failed to update supplement:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>My Supplements</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center'
          >
            <PlusIcon className='h-5 w-5 mr-2' />
            Add New Supplement
          </button>
        </div>

        {/* Add Supplement Form */}
        {showAddForm && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full'>
              <h2 className='text-xl font-semibold mb-4'>Add New Supplement</h2>
              <form
                onSubmit={
                  editingSupplement ? handleUpdate : handleAddSupplement
                }
                className='space-y-4'
              >
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Name
                  </label>
                  <input
                    type='text'
                    value={newSupplement.name}
                    onChange={(e) =>
                      setNewSupplement({
                        ...newSupplement,
                        name: e.target.value
                      })
                    }
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <textarea
                    value={newSupplement.description}
                    onChange={(e) =>
                      setNewSupplement({
                        ...newSupplement,
                        description: e.target.value
                      })
                    }
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    rows='2'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Category
                  </label>
                  <select
                    value={newSupplement.category}
                    onChange={(e) =>
                      setNewSupplement({
                        ...newSupplement,
                        category: e.target.value
                      })
                    }
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  >
                    <option value='vitamin'>Vitamin</option>
                    <option value='mineral'>Mineral</option>
                    <option value='supplement'>Supplement</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Dosage
                  </label>
                  <div className='mt-1 grid grid-cols-3 gap-2'>
                    <input
                      type='number'
                      value={newSupplement.dosages[0].amount}
                      onChange={(e) =>
                        setNewSupplement({
                          ...newSupplement,
                          dosages: [
                            {
                              ...newSupplement.dosages[0],
                              amount: e.target.value
                            }
                          ]
                        })
                      }
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      placeholder='Amount'
                      required
                    />
                    <select
                      value={newSupplement.dosages[0].unit}
                      onChange={(e) =>
                        setNewSupplement({
                          ...newSupplement,
                          dosages: [
                            {
                              ...newSupplement.dosages[0],
                              unit: e.target.value
                            }
                          ]
                        })
                      }
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    >
                      <option value='mg'>mg</option>
                      <option value='mcg'>mcg</option>
                      <option value='IU'>IU</option>
                      <option value='g'>g</option>
                    </select>
                    <select
                      value={newSupplement.dosages[0].timeOfDay}
                      onChange={(e) =>
                        setNewSupplement({
                          ...newSupplement,
                          dosages: [
                            {
                              ...newSupplement.dosages[0],
                              timeOfDay: e.target.value
                            }
                          ]
                        })
                      }
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    >
                      <option value='morning'>Morning</option>
                      <option value='afternoon'>Afternoon</option>
                      <option value='evening'>Evening</option>
                    </select>
                  </div>
                </div>

                {/* Labels Section */}
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Labels
                  </label>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {labels.map((label) => (
                      <button
                        key={label._id}
                        type='button'
                        onClick={() => handleLabelToggle(label._id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                          ${
                            newSupplement.labelIds.includes(label._id)
                              ? `bg-${label.color}-100 text-${label.color}-800 border-${label.color}-300`
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          } border`}
                      >
                        {label.name}
                        {newSupplement.labelIds.includes(label._id) && (
                          <XMarkIcon className='w-4 h-4 ml-1' />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex justify-end space-x-3 mt-6'>
                  <button
                    type='button'
                    onClick={() => setShowAddForm(false)}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                  >
                    {editingSupplement ? 'Update Supplement' : 'Add Supplement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Supplements List */}
        <div className='grid grid-cols-1 gap-4'>
          {supplements.map((supplement) => (
            <div
              key={supplement._id}
              className='bg-white rounded-lg shadow-sm p-6'
            >
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-lg font-medium text-gray-900'>
                    {supplement.name}
                  </h3>
                  <p className='text-sm text-gray-500 mt-1'>
                    {supplement.description}
                  </p>
                  <div className='mt-3'>
                    {supplement.dosages.map((dosage, index) => (
                      <div
                        key={index}
                        className='flex items-center text-sm text-gray-600 mt-1'
                      >
                        {getTimeIcon(dosage.timeOfDay)}
                        <span className='ml-2'>
                          {dosage.amount} {dosage.unit} - {dosage.timeOfDay}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => handleEdit(supplement)}
                    className='text-blue-600 hover:text-blue-800'
                  >
                    <PencilIcon className='h-5 w-5' />
                  </button>
                  <button
                    onClick={() => handleDelete(supplement._id)}
                    className='text-red-600 hover:text-red-800'
                  >
                    <TrashIcon className='h-5 w-5' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
