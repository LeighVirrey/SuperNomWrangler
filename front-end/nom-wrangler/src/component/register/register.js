import React, { useState } from 'react';
import React from 'react';
import './register.css';


        const [formData, setFormData] = useState({
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Form submitted:', formData);
        };
    



const Register = () => {
  return (
    <div className="min-h-screen bg-[#2b2118] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#264443] rounded-2xl p-8 shadow-lg">
        <h2 className="text-center text-4xl font-bold text-[#f5f0e1] mb-6 border-b-2 border-[#d95d39] pb-4">
          Sign Up
        </h2>
        <form className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-[#f5f0e1] font-bold text-lg">
                *Username:
              </label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full mt-1 p-2 rounded bg-white text-gray-700"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-[#f5f0e1] font-bold text-lg">
                First Name:
              </label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full mt-1 p-2 rounded bg-white text-gray-700"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-[#f5f0e1] font-bold text-lg">
                Last Name:
              </label>
              <input
                type="text"
                placeholder="Placeholder"
                className="w-full mt-1 p-2 rounded bg-white text-gray-700"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#f5f0e1] font-bold text-lg">
              *Email:
            </label>
            <input
              type="email"
              placeholder="Placeholder"
              className="w-full mt-1 p-2 rounded bg-white text-gray-700"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label className="text-[#f5f0e1] font-bold text-lg">
                *Password:
              </label>
              <input
                type="password"
                placeholder="Placeholder"
                className="w-full mt-1 p-2 rounded bg-white text-gray-700"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-[#f5f0e1] font-bold text-lg">
                *Confirm Password:
              </label>
              <input
                type="password"
                placeholder="Placeholder"
                className="w-full mt-1 p-2 rounded bg-white text-gray-700"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-[#b7410e] hover:bg-[#a2380d] text-white font-bold py-3 px-8 rounded"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
