// pages/profile.tsx
import { useState, useRef } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Image from 'next/image';

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    birthday: user?.birthday || '',
    location: user?.location || '',
    gender: user?.gender || '',
  });
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '/default-profile.png');
  const [imageFile, setImageFile] = useState<File | null>(null); // Store selected image file
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for the hidden file input

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setProfilePicture(URL.createObjectURL(file)); // Preview the uploaded image
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      birthday: user.birthday,
      location: user.location,
      gender: user.gender,
    });
    setProfilePicture(user.profilePicture || '/default-profile.png'); // Reset profile picture to original
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token found');

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('firstname', formData.firstname);
      formDataToSubmit.append('lastname', formData.lastname);
      formDataToSubmit.append('birthday', formData.birthday);
      formDataToSubmit.append('location', formData.location);
      formDataToSubmit.append('gender', formData.gender);

      if (imageFile) {
        formDataToSubmit.append('profilePicture', imageFile);
      }

      const response = await axios.patch('/api/user', formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setEditMode(false);
        window.location.reload(); // Reload the page to get updated user info
      }
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulate a click on the hidden file input
    }
  };

  return (
    <PrivateRoute>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold">Profile</h1>

        {/* Profile Picture Upload */}
        <div className="relative">
          <Image
            src={profilePicture} // Fetch profile picture from user data
            alt="Profile"
            width={128} // Set width for the image
            height={128} // Set height for the image
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
            onClick={handleImageClick} // Trigger the hidden file input when clicked
          />
          {editMode && (
            <input
              ref={fileInputRef} // Reference the input field
              type="file"
              onChange={handleFileChange}
              className="hidden" // Hide the file input
            />
          )}
        </div>

        <div className="mt-4">
          {editMode ? (
            <>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="border p-2 rounded mt-2"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="border p-2 rounded mt-2"
                placeholder="Last Name"
              />
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="border p-2 rounded mt-2"
                placeholder="Birthday"
              />
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="border p-2 rounded mt-2"
              >
                <option value="">Select Location</option>
                <option value="Kawit">Kawit</option>
                <option value="Bacoor">Bacoor</option>
                <option value="Cavite City">Cavite City</option>
                <option value="Rosario">Rosario</option>
              </select>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="border p-2 rounded mt-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>First Name:</strong> {user.firstname}</p>
              <p><strong>Last Name:</strong> {user.lastname}</p>
              <p><strong>Birthday:</strong> {user.birthday}</p>
              <p><strong>Location:</strong> {user.location}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button
                onClick={handleEdit}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
};

export default Profile;
