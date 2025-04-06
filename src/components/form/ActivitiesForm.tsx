import React from 'react';
import { useForm } from '../../context/FormContext';

const activityCategories = [
  { value: 'sports', label: 'Sports (Basketball, Soccer, Swimming, etc.)' },
  { value: 'performing_arts', label: 'Performing Arts (Theater, Band, Choir, etc.)' },
  { value: 'academic_clubs', label: 'Academic Clubs (Debate, Math Team, Science Olympiad, etc.)' },
  { value: 'community_service', label: 'Community Service' },
  { value: 'student_government', label: 'Student Government' },
  { value: 'work_experience', label: 'Work Experience' },
  { value: 'religious', label: 'Religious Activities' },
  { value: 'other', label: 'Other' },
];

const hoursPerWeekOptions = [
  { value: '1', label: '1 hour' },
  { value: '2', label: '2 hours' },
  { value: '3', label: '3 hours' },
  { value: '4', label: '4 hours' },
  { value: '5', label: '5 hours' },
  { value: '6', label: '6 hours' },
  { value: '7', label: '7 hours' },
  { value: '8', label: '8 hours' },
  { value: '9', label: '9 hours' },
  { value: '10', label: '10 hours' },
  { value: '10+', label: 'More than 10 hours' },
];

interface ActivitiesFormProps {
  onNext: () => void;
  onBack: () => void;
  isStandalone?: boolean;
}

export function ActivitiesForm({ onNext, onBack, isStandalone = false }: ActivitiesFormProps) {
  const { state, dispatch } = useForm();
  const activities = state.activitiesAndInvolvement.activities;

  const addActivity = () => {
    dispatch({
      type: 'UPDATE_ACTIVITIES_AND_INVOLVEMENT',
      payload: {
        activities: [...activities, {
          category: '',
          years: [],
          leadership: '',
          description: '',
          hoursPerWeek: '',
        }],
      },
    });
  };

  const updateActivity = (index: number, field: string, value: any) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    dispatch({
      type: 'UPDATE_ACTIVITIES_AND_INVOLVEMENT',
      payload: { activities: newActivities },
    });
  };

  const deleteActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    dispatch({
      type: 'UPDATE_ACTIVITIES_AND_INVOLVEMENT',
      payload: { activities: newActivities },
    });
  };

  return (
    <div className="p-6">
      <p className="text-lg mb-6">
        This section is optional but helps us generate more personalized essay topics.
      </p>

      <div className="space-y-8">
        {activities.map((activity, index) => (
          <div key={index} className="p-6 border rounded-lg bg-white shadow-sm relative">
            <button
              onClick={() => deleteActivity(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              aria-label="Delete activity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Category
              </label>
              <select
                className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={activity.category}
                onChange={(e) => updateActivity(index, 'category', e.target.value)}
              >
                <option value="">Select activity category</option>
                {activityCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {activity.category === 'other' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specify Activity
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter activity name"
                  value={activity.otherCategory}
                  onChange={(e) => updateActivity(index, 'otherCategory', e.target.value)}
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Participation
              </label>
              <div className="grid grid-cols-4 gap-4">
                {['9th', '10th', '11th', '12th'].map((year) => (
                  <label key={year} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      checked={activity.years.includes(year)}
                      onChange={(e) => {
                        const newYears = e.target.checked
                          ? [...activity.years, year]
                          : activity.years.filter(y => y !== year);
                        updateActivity(index, 'years', newYears);
                      }}
                    />
                    <span className="text-sm text-gray-700">{year}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leadership Position (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Team Captain, Club President"
                value={activity.leadership}
                onChange={(e) => updateActivity(index, 'leadership', e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your involvement and achievements"
                value={activity.description}
                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours per Week
              </label>
              <select
                className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={activity.hoursPerWeek}
                onChange={(e) => updateActivity(index, 'hoursPerWeek', e.target.value)}
              >
                <option value="">Select hours per week</option>
                {hoursPerWeekOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          onClick={addActivity}
          className="w-full py-3 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Another Activity
        </button>
      </div>

      {isStandalone && (
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="py-2 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 