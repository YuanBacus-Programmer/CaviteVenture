"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'

interface SigninValues {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string; // Adjust this if your API returns additional fields.
}

const SigninSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[#fff2d1] opacity-50"></div>
    <motion.div
      className="absolute inset-0 bg-gradient-radial from-[#fdf3d7] to-transparent"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    ></motion.div>
  </div>
)

export default function SigninForm() {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const router = useRouter()

  const handleSignIn = async (
    values: SigninValues,
    { setSubmitting }: FormikHelpers<SigninValues>
  ) => {
    setIsSigningIn(true)
    try {
      // API call to authenticate the user with type specification
      const response = await axios.post<SignInResponse>('/api/signin', values)
      
      // Check if the response is successful and handle token
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('authToken', response.data.token) // Store the token
        toast.success('Signed in successfully!', {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
        router.push('/home') // Navigate to the home page after successful sign-in
      } else {
        toast.error('Failed to sign in. Please check your credentials.')
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Sign in failed. Please try again later.')
    } finally {
      setIsSigningIn(false)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff2d1] p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
      <GlowingBackground />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-80 p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-[#8B4513] font-serif"
          animate={{ textShadow: ["0 0 5px #fae8b4", "0 0 15px #fae8b4", "0 0 5px #fae8b4"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Continue Your Adventure
        </motion.h1>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={SigninSchema}
          onSubmit={handleSignIn}
        >
          {() => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200"
                  placeholder="john@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <motion.button
                type="submit"
                disabled={isSigningIn}
                className="w-full py-3 px-6 border-2 border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#8B4513] hover:bg-[#A0522D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A0522D] transition duration-200 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSigningIn && (
                  <motion.div
                    className="absolute inset-0 bg-[#A0522D]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                )}
                <span className="relative z-10">
                  {isSigningIn ? 'Signing In...' : 'Sign In'}
                </span>
              </motion.button>
            </Form>
          )}
        </Formik>

        <motion.p 
          className="mt-8 text-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#8B4513] hover:text-[#A0522D] underline transition duration-200">
            Sign Up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}