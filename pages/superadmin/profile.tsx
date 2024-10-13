"use client"

import { useState, useRef, useEffect } from 'react'
import PrivateRoute from '../../components/PrivateRoute'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import Image from 'next/image'
import useSWR from 'swr'
import Modal from '../../components/Modal'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { User, Mail, Lock, Eye, EyeOff, Camera, Calendar, MapPin, Users, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const fetcher = (url: string) =>
  axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }).then((res) => res.data)

const GlowingBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute h-px w-px bg-[#fae8b4]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: '0 0 20px 2px #fae8b4',
            animation: `glowingLine ${Math.random() * 3 + 2}s infinite alternate`,
          }}
        />
      ))}
    </div>
  </div>
)

const Navbar = () => {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/superadmin/dashboard', label: 'Dashboard', icon: User },
    { href: '/superadmin/exhibit', label: 'Exhibit', icon: Image },
    { href: '/superadmin/events', label: 'Events', icon: Calendar },
    { href: '/superadmin/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="bg-[#fae8b4] text-gray-800 shadow-lg rounded-full mx-4 my-4 p-2 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/superadmin/dashboard" className="flex-shrink-0">
              <span className="text-xl font-bold">SuperAdmin</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      pathname === item.href
                        ? 'bg-amber-200 text-amber-800'
                        : 'text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                    } transition-colors duration-200`}
                  >
                    <motion.div
                      className="flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <motion.button
              onClick={signOut}
              className="px-4 py-2 rounded-full text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </motion.button>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? 'bg-amber-200 text-amber-800'
                      : 'text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                  } transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                   
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false)
                  signOut()
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const Profile = () => {
  const { user } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    birthday: user?.birthday || '',
    location: user?.location || '',
    gender: user?.gender || '',
  })
  const [email, setEmail] = useState(user?.email || '')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '/default-profile.png')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: updatedUser, mutate } = useSWR('/api/user', fetcher)

  useEffect(() => {
    if (updatedUser) {
      setFormData({
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        birthday: updatedUser.birthday,
        location: updatedUser.location,
        gender: updatedUser.gender,
      })
      setProfilePicture(updatedUser.profilePicture || '/default-profile.png')
    }
  }, [updatedUser])

  if (!user) return null

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
      toast.success('Profile picture updated')
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    const savePromise = new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('No auth token found')

        const formDataToSubmit = new FormData()
        formDataToSubmit.append('firstname', formData.firstname)
        formDataToSubmit.append('lastname', formData.lastname)
        formDataToSubmit.append('birthday', formData.birthday)
        formDataToSubmit.append('location', formData.location)
        formDataToSubmit.append('gender', formData.gender)

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
          resolve('Profile updated successfully')
        } else {
          reject('Failed to update profile')
        }
      } catch (error) {
        console.error('Failed to update user details:', error)
        reject('Failed to update profile')
      } finally {
        setIsLoading(false)
      }
    })

    toast.promise(savePromise, {
      loading: 'Updating profile...',
      success: 'Profile updated successfully',
      error: 'Failed to update profile',
    })
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleEmailSubmit = async () => {
    const emailPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post('/api/sendVerificationCode', { email })
        if (response.status === 200) {
          setShowEmailModal(false)
          setShowVerificationModal(true)
          resolve('Verification code sent')
        } else {
          reject('Failed to send verification code')
        }
      } catch (error) {
        console.error('Failed to send verification code:', error)
        reject('Failed to send verification code')
      }
    })

    toast.promise(emailPromise, {
      loading: 'Sending verification code...',
      success: 'Verification code sent',
      error: 'Failed to send verification code',
    })
  }

  const handleVerificationSubmit = async () => {
    const verificationPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post('/api/verifyCode', { email, code: verificationCode })
        if (response.status === 200) {
          setShowVerificationModal(false)
          setShowPasswordModal(true)
          resolve('Code verified successfully')
        } else {
          reject('Failed to verify code')
        }
      } catch (error) {
        console.error('Failed to verify code:', error)
        reject('Failed to verify code')
      }
    })

    toast.promise(verificationPromise, {
      loading: 'Verifying code...',
      success: 'Code verified successfully',
      error: 'Failed to verify code',
    })
  }

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    const passwordPromise = new Promise(async (resolve, reject) => {
      try {
        // Simulate password change API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setShowPasswordModal(false)
        resolve('Password updated successfully')
      } catch (error) {
        console.error('Failed to update password:', error)
        reject('Failed to update password')
      }
    })

    toast.promise(passwordPromise, {
      loading: 'Updating password...',
      success: 'Password updated successfully',
      error: 'Failed to update password',
    })
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-900 relative">
        <GlowingBackground />
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10"
        >
          <Toaster position="top-right" />
          <h1 className="text-4xl font-bold mb-8 text-white">Profile</h1>

          <motion.div
            className="relative mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={profilePicture}
              alt="Profile"
              width={200}
              height={200}
              className="w-48 h-48 rounded-full  object-cover border-4 border-[#fae8b4] cursor-pointer shadow-lg"
              onClick={handleImageClick}
            />
            {editMode && (
              <motion.div
                className="absolute bottom-0 right-0 bg-[#fae8b4] rounded-full p-3 cursor-pointer shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleImageClick}
              >
                <Camera className="text-gray-800" size={24} />
              </motion.div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>

          <motion.div
            className="w-full max-w-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {editMode ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstname" className="block text-sm font-medium text-gray-200 mb-1">First Name</label>
                      <input
                        id="firstname"
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-200 mb-1">Last Name</label>
                      <input
                        id="lastname"
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="birthday" className="block text-sm font-medium text-gray-200 mb-1">Birthday</label>
                    <input
                      id="birthday"
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-1">Location</label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                      placeholder="Location"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-200 mb-1">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <motion.button
                      onClick={handleSave}
                      className="flex-1 px-6 py-3 bg-[#fae8b4] text-gray-900 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                    <motion.button
                      onClick={() => setEditMode(false)}
                      className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-white"
                >
                  <div className="flex items-center space-x-4 text-xl">
                    <User className="text-[#fae8b4]" size={24} />
                    <p><strong>Name:</strong> {updatedUser?.firstname} {updatedUser?.lastname}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xl">
                    <Mail className="text-[#fae8b4]" size={24} />
                    <p><strong>Email:</strong> {updatedUser?.email}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xl">
                    <Calendar className="text-[#fae8b4]" size={24} />
                    <p><strong>Birthday:</strong> {updatedUser?.birthday}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xl">
                    <MapPin className="text-[#fae8b4]" size={24} />
                    <p><strong>Location:</strong> {updatedUser?.location}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xl">
                    <Users className="text-[#fae8b4]" size={24} />
                    <p><strong>Gender:</strong> {updatedUser?.gender}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xl">
                    <Lock className="text-[#fae8b4]" size={24} />
                    <p><strong>Role:</strong> {updatedUser?.role}</p>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <motion.button
                      onClick={() => setEditMode(true)}
                      className="flex-1 px-6 py-3 bg-[#fae8b4] text-gray-900 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      onClick={() => setShowEmailModal(true)}
                      className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Change Password
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showEmailModal && (
            <Modal onClose={() => setShowEmailModal(false)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800 p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-4 text-white">Enter your Email</h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50 mb-4"
                  placeholder="Email"
                />
                <motion.button
                  onClick={handleEmailSubmit}
                  className="w-full px-6 py-3 bg-[#fae8b4] text-gray-900 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Verification Code
                </motion.button>
              </motion.div>
            </Modal>
          )}

          {showVerificationModal && (
            <Modal onClose={() => setShowVerificationModal(false)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800 p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-4 text-white">Enter Verification Code</h2>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50 mb-4"
                  placeholder="Verification Code"
                />
                <motion.button
                  onClick={handleVerificationSubmit}
                  className="w-full px-6 py-3 bg-[#fae8b4] text-gray-900 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Verify Code
                </motion.button>
              </motion.div>
            </Modal>
          )}

          {showPasswordModal && (
            <Modal onClose={() => setShowPasswordModal(false)}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800 p-8 rounded-xl"
              >
                <h2 className="text-2xl font-bold mb-4 text-white">Reset Your Password</h2>
                <div className="relative mb-4">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50"
                    placeholder="New Password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 px-3 py-2 text-gray-400"
                  >
                    {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-[#fae8b4] focus:ring focus:ring-[#fae8b4] focus:ring-opacity-50 mb-4"
                  placeholder="Confirm Password"
                />
                <motion.button
                  onClick={handlePasswordSubmit}
                  className="w-full px-6 py-3 bg-[#fae8b4] text-gray-900 rounded-md hover:bg-opacity-90 transition text-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Password
                </motion.button>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </PrivateRoute>
  )
}

export default Profile