import React from 'react';
import { useForm } from '../../context/FormContext';

const collegeTypeOptions = [
  'Liberal Arts College',
  'Research University',
  'Technical Institute',
  'Public University',
  'Private University',
  'Ivy League',
  'State College'
];

function CollegeGoalsForm() {
  const { state, dispatch } = useForm();
  const { collegeTypes, specificColleges } = state.collegeGoals;
  const [newCollege, setNewCollege] = React.useState('');

  const handleTypeChange = (type: string) => {
    const newTypes = collegeTypes.includes(type)
      ? collegeTypes.filter(t => t !== type)
      : [...collegeTypes, type];

    dispatch({
      type: 'UPDATE_COLLEGE_GOALS',
      payload: { collegeTypes: newTypes },
    });
  };

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollege.trim() && !specificColleges.includes(newCollege.trim())) {
      dispatch({
        type: 'UPDATE_COLLEGE_GOALS',
        payload: {
          specificColleges: [...specificColleges, newCollege.trim()],
        },
      });
      setNewCollege('');
    }
  };

  const handleRemoveCollege = (college: string) => {
    dispatch({
      type: 'UPDATE_COLLEGE_GOALS',
      payload: {
        specificColleges: specificColleges.filter(c => c !== college),
      },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">College Goals</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Types of Colleges You're Interested In
          </label>
          <div className="space-y-2">
            {collegeTypeOptions.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={collegeTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specific Colleges or Universities
          </label>
          <form onSubmit={handleAddCollege} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newCollege}
              onChange={(e) => setNewCollege(e.target.value)}
              className="form-input flex-1"
              placeholder="Enter college name"
            />
            <button
              type="submit"
              className="btn btn-secondary px-4 py-2"
            >
              Add
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {specificColleges.map(college => (
              <span
                key={college}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {college}
                <button
                  type="button"
                  onClick={() => handleRemoveCollege(college)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeGoalsForm; 