import React from 'react';
import { useForm } from '../../context/FormContext';

interface BasicInfoFormProps {
  onNext: () => void;
  onBack: () => void;
}

function BasicInfoForm({ onNext, onBack }: BasicInfoFormProps) {
  const { state, dispatch } = useForm();
  const { fullName, email } = state.basicInfo;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_BASIC_INFO',
      payload: { [name]: value },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={handleChange}
            required
            className="form-input mt-1"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            className="form-input mt-1"
            placeholder="Enter your email address"
          />
        </div>
      </div>
    </div>
  );
}

export default BasicInfoForm; 