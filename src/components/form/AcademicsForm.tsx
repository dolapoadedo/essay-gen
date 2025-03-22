import React from 'react';
import { useForm } from '../../context/FormContext';

const classRankOptions = [
  'Top 1%',
  'Top 5%',
  'Top 10%',
  'Top 25%',
  'Top 50%',
  'Top 75%',
  'Bottom of the class',
  'Unranked'
];

function AcademicsForm() {
  const { state, dispatch } = useForm();
  const { classRank, gpa, subjects, majors } = state.academics;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_ACADEMICS',
      payload: { [name]: value },
    });
  };

  const handleArrayChange = (name: 'subjects' | 'majors', value: string) => {
    const currentArray = state.academics[name];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    dispatch({
      type: 'UPDATE_ACADEMICS',
      payload: { [name]: newArray },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Academic Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="classRank" className="block text-sm font-medium text-gray-700">
            Which best describes your class rank: *
          </label>
          <select
            id="classRank"
            name="classRank"
            value={classRank}
            onChange={handleChange}
            required
            className="form-input mt-1"
          >
            <option value="">Select class rank</option>
            {classRankOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="gpa" className="block text-sm font-medium text-gray-700">
            GPA (Optional)
          </label>
          <input
            type="text"
            id="gpa"
            name="gpa"
            value={gpa}
            onChange={handleChange}
            className="form-input mt-1"
            placeholder="e.g., 3.8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Subjects of Interest
          </label>
          <div className="space-y-2">
            {['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Arts', 'Languages'].map(subject => (
              <label key={subject} className="flex items-center">
                <input
                  type="checkbox"
                  checked={subjects.includes(subject)}
                  onChange={() => handleArrayChange('subjects', subject)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Potential College Majors
          </label>
          <div className="space-y-2">
            {['Computer Science', 'Engineering', 'Business', 'Biology', 'Psychology', 'English', 'Political Science'].map(major => (
              <label key={major} className="flex items-center">
                <input
                  type="checkbox"
                  checked={majors.includes(major)}
                  onChange={() => handleArrayChange('majors', major)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{major}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademicsForm; 