'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import Image from 'next/image'
import useSWR from 'swr'
import { Eye, EyeOff, Camera } from 'lucide-react'
import Navbar from '../components/Navbar';

interface User {
  firstname: string
  lastname: string
  birthday: string
  location: string
  gender: string
  role: string
  email: string
  profilePicture: string
}

const fetcher = (url: string) =>
  axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }).then((res) => res.data)

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [formData, setFormData] = useState<User>({
    firstname: '',
    lastname: '',
    birthday: '',
    location: '',
    gender: '',
    role: '',
    email: '',
    profilePicture: '',
  })
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [profilePicture, setProfilePicture] = useState('/default-profile.png')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: updatedUser, mutate } = useSWR<User>('/api/user', fetcher)

  useEffect(() => {
    if (updatedUser) {
      setUser(updatedUser)
      setFormData(updatedUser)
      setProfilePicture(updatedUser.profilePicture || '/default-profile.png')
      setEmail(updatedUser.email)
    }
  }, [updatedUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setProfilePicture(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No auth token found')

      const formDataToSubmit = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value)
      })

      if (imageFile) {
        formDataToSubmit.append('profilePicture', imageFile)
      }

      const response = await axios.patch('/api/user', formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 200) {
        setEditMode(false)
        mutate()
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update user details:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post('/api/sendVerificationCode', { email })
      if (response.status === 200) {
        setShowEmailModal(false)
        setShowVerificationModal(true)
        toast.success('Verification code sent to your email!')
      }
    } catch (error) {
      console.error('Failed to send verification code:', error)
      toast.error('Failed to send verification code. Please try again.')
    }
  }

  const handleVerificationSubmit = async () => {
    try {
      const response = await axios.post('/api/verifyCode', { email, code: verificationCode })
      if (response.status === 200) {
        setShowVerificationModal(false)
        setShowPasswordModal(true)
        toast.success('Email verified successfully!')
      }
    } catch (error) {
      console.error('Failed to verify code:', error)
      toast.error('Invalid verification code. Please try again.')
    }
  }

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowPasswordModal(false)
      toast.success('Password updated successfully!')
    } catch (error) {
      console.error('Failed to update password:', error)
      toast.error('Failed to update password. Please try again.')
    }
  }

  return (
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8"
    >
      <Navbar />
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <Image src={profilePicture} alt="Profile picture" width={128} height={128} className="object-cover" />
              </div>
              {editMode && (
                <button
                  className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full"
                  onClick={handleImageClick}
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <AnimatePresence mode="wait">
              {editMode ? (
                <motion.div
                  key="edit-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 w-full"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
                    <input
                      id="birthday"
                      name="birthday"
                      type="date"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2 w-full"
                >
                  <p><strong>Name:</strong> {user?.firstname} {user?.lastname}</p>
                  <p><strong>Birthday:</strong> {user?.birthday}</p>
                  <p><strong>Location:</strong> {user?.location}</p>
                  <p><strong>Gender:</strong> {user?.gender}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Change Password
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your email to receive a verification code.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter your email"
                />
              </div>
              <button
                onClick={handleEmailSubmit}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Verification Code
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Enter Verification Code</h3>
            <p className="text-sm text-gray-500 mb-4">
              We&apos;ve sent a verification code to your email. Please enter it below.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code</label>
                <input
                  id="verificationCode"
                  
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter verification code"
                />
              </div>
              <button
                onClick={handleVerificationSubmit}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify Code
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reset Your Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter your new password below.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={passwordVisible ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={passwordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handlePasswordSubmit}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}