import { useState, useRef, useEffect } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Image from 'next/image';
import useSWR from 'swr';
import Modal from '../components/Modal';

const fetcher = (url: string) =>
  axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }).then((res) => res.data);

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    birthday: user?.birthday || '',
    location: user?.location || '',
    gender: user?.gender || '',
  });
  const [email, setEmail] = useState(user?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '/default-profile.png');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: updatedUser, mutate } = useSWR('/api/user', fetcher);

  useEffect(() => {
    if (updatedUser) {
      setFormData({
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        birthday: updatedUser.birthday,
        location: updatedUser.location,
        gender: updatedUser.gender,
      });
      setProfilePicture(updatedUser.profilePicture || '/default-profile.png');
    }
  }, [updatedUser]);

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
      setProfilePicture(URL.createObjectURL(file));
    }
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
        mutate(); // Re-fetch user data
      }
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Send the verification code to the user's email
  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post('/api/sendVerificationCode', { email });
      if (response.status === 200) {
        setShowEmailModal(false);
        setShowVerificationModal(true);
      }
    } catch (error) {
      console.error('Failed to send verification code:', error);
    }
  };

  // Verify the entered code
  const handleVerificationSubmit = async () => {
    try {
      const response = await axios.post('/api/verifyCode', { email, code: verificationCode });
      if (response.status === 200) {
        setShowVerificationModal(false);
        setShowPasswordModal(true);
      }
    } catch (error) {
      console.error('Failed to verify code:', error);
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      // Simulate password change API call
      setShowPasswordModal(false);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  return (
    <PrivateRoute>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold">Profile</h1>

        <div className="relative">
          <Image
            src={profilePicture}
            alt="Profile"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
            onClick={handleImageClick}
          />
          {editMode && (
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
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

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Change Password
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>First Name:</strong> {updatedUser?.firstname || user.firstname}</p>
              <p><strong>Last Name:</strong> {updatedUser?.lastname || user.lastname}</p>
              <p><strong>Birthday:</strong> {updatedUser?.birthday || user.birthday}</p>
              <p><strong>Location:</strong> {updatedUser?.location || user.location}</p>
              <p><strong>Gender:</strong> {updatedUser?.gender || user.gender}</p>
              <p><strong>Role:</strong> {updatedUser?.role || user.role}</p>
              <p><strong>Email:</strong> {updatedUser?.email || user.email}</p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <Modal onClose={() => setShowEmailModal(false)}>
          <h2 className="text-xl font-bold mb-4">Enter your Email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded mt-2 w-full"
            placeholder="Email"
          />
          <button
            onClick={handleEmailSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full"
          >
            Send Verification Code
          </button>
        </Modal>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <Modal onClose={() => setShowVerificationModal(false)}>
          <h2 className="text-xl font-bold mb-4">Enter Verification Code</h2>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border p-2 rounded mt-2 w-full"
            placeholder="Verification Code"
          />
          <button
            onClick={handleVerificationSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full"
          >
            Verify Code
          </button>
        </Modal>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded mt-2 w-full"
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
            >
              👁️
            </button>
          </div>
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded mt-2 w-full"
            placeholder="Confirm Password"
          />
          <button
            onClick={handlePasswordSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full"
          >
            Reset Password
          </button>
        </Modal>
      )}
    </PrivateRoute>
  );
};

export default Profile;
