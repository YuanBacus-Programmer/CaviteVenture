'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import Image from 'next/image'
import useSWR from 'swr'
import { Eye, EyeOff, Camera} from 'lucide-react'
import Navbar from '../components/Navbar'

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
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-white to-[#fae8b4] shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-[#cbbd93] p-8 border-r border-[#80775c]">
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src={profilePicture}
                    alt="Profile picture"
                    width={160}
                    height={160}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  {editMode && (
                    <button
                      className="absolute bottom-0 right-0 bg-[#574a24] text-white p-2 rounded-full shadow-md"
                      onClick={handleImageClick}
                    >
                      <Camera className="h-5 w-5" />
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
                <h2 className="mt-4 text-2xl font-semibold text-[#574a24]">{user?.firstname} {user?.lastname}</h2>
                <p className="text-[#80775c]">{user?.role}</p>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="w-full px-4 py-2 bg-[#574a24] text-white rounded-md hover:bg-[#80775c] transition duration-300"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <h3 className="text-3xl font-semibold mb-6 text-[#574a24]">Profile Information</h3>
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div
                    key="edit-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-[#574a24]">First Name</label>
                        <input
                          id="firstname"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastname" className="block text-sm font-medium text-[#574a24]">Last Name</label>
                        <input
                          id="lastname"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#574a24]">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-[#574a24]">Location</label>
                      <input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="birthday" className="block text-sm font-medium text-[#574a24]">Birthday</label>
                      <input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-[#574a24]">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#574a24] text-white rounded-md hover:bg-[#80775c] transition duration-300"
                      >
                        Save Changes
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <ProfileItem label="Name" value={`${user?.firstname} ${user?.lastname}`} />
                    <ProfileItem label="Email" value={user?.email} />
                    <ProfileItem label="Location" value={user?.location} />
                    <ProfileItem label="Birthday" value={user?.birthday} />
                    <ProfileItem label="Gender" value={user?.gender} />
                    <div className="pt-4">
                      <button
                        onClick={() => setShowEmailModal(true)}
                        className="text-[#574a24] hover:text-[#80775c] transition duration-300"
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
      </div>

      {/* Modals */}
      {showEmailModal && (
        <Modal title="Change Password" onClose={() => setShowEmailModal(false)}>
          <p className="text-sm text-[#80775c] mb-4">
            Enter your email to receive a verification code.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#574a24]">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                placeholder="Enter your email"
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              className="w-full px-4 py-2 bg-[#574a24] text-white rounded-md hover:bg-[#80775c] transition duration-300"
            >
              Send Verification Code
            </button>
          </div>
        </Modal>
      )}

      {showVerificationModal && (
        <Modal title="Enter Verification Code" onClose={() => setShowVerificationModal(false)}>
          <p className="text-sm text-[#80775c] mb-4">
            We've sent a verification code to your email. Please enter it below.
          
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-[#574a24]">Verification Code</label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                placeholder="Enter verification code"
              />
            </div>
            
            <button
              onClick={handleVerificationSubmit}
              className="w-full px-4 py-2 bg-[#574a24] text-white rounded-md hover:bg-[#80775c] transition duration-300"
            >
              Verify Code
            </button>
          </div>
        </Modal>
      )}

      {showPasswordModal && (
        <Modal title="Reset Your Password" onClose={() => setShowPasswordModal(false)}>
          <p className="text-sm text-[#80775c] mb-4">
            Enter your new password below.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-[#574a24]">New Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={passwordVisible ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff className="h-5 w-5 text-[#80775c]" /> : <Eye className="h-5 w-5 text-[#80775c]" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#574a24]">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-[#cbbd93] shadow-sm focus:border-[#80775c] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                placeholder="Confirm new password"
              />
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="w-full px-4 py-2 bg-[#574a24] text-white rounded-md hover:bg-[#80775c] transition duration-300"
            >
              Reset Password
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ProfileItem({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#cbbd93]">
      <span className="text-[#80775c]">{label}</span>
      <span className="font-medium text-[#574a24]">{value || 'Not set'}</span>
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[#574a24]">{title}</h3>
          <button onClick={onClose} className="text-[#80775c] hover:text-[#574a24]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}