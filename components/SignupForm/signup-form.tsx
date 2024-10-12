"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

interface SignupFormValues {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  location: string;
  email: string;
  password: string;
  reenterPassword: string;
  privacyPolicy: boolean;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  userId?: string;
}

const locations = ['Kawit', 'Rosario', 'CaviteCity', 'Bacoor'];

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  birthday: Yup.date().required('Birthday is required').max(new Date(), 'Invalid date'),
  gender: Yup.string().required('Gender is required'),
  location: Yup.string().required('Location is required').oneOf(locations),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  reenterPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please re-enter your password'),
  privacyPolicy: Yup.boolean().oneOf([true], 'You must accept the privacy policy'),
});

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
);

export default function SignupForm() {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (
    values: SignupFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: () => void
  ) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.userId) {
        toast.success('Account created! Please check your email for a verification code.', { icon: '📧' });
        setUserId(data.userId);
        setIsVerificationModalOpen(true);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };

  const handleVerifyCode = async () => {
    if (!userId || !verificationCode) {
      toast.error('Verification code is required');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, verificationCode }),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        toast.success('Email verified successfully! You can now log in.', { icon: '✅' });
        setIsVerificationModalOpen(false);
        router.push('/signin'); // Redirect to /signin after successful verification
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff2d1] p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
      <GlowingBackground />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-80 p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl shadow-2xl w-full max-w-xl md:max-w-2xl lg:max-w-3xl relative z-10"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-8 text-center text-[#8B4513] font-serif"
          animate={{ textShadow: ["0 0 5px #fae8b4", "0 0 15px #fae8b4", "0 0 5px #fae8b4"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Embark on Your Adventure
        </motion.h1>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            birthday: '',
            gender: '',
            location: '',
            email: '',
            password: '',
            reenterPassword: '',
            privacyPolicy: false
          }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleSignup(values, setSubmitting, resetForm);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <Field name="firstName" type="text" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200" placeholder="John" />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <Field name="lastName" type="text" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200" placeholder="Doe" />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <Field name="birthday" type="date" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200" />
                <ErrorMessage name="birthday" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <Field as="select" name="gender" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Field as="select" name="location" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200">
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </Field>
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Field name="email" type="email" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200" placeholder="john@example.com" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Field name="password" type="password" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="reenterPassword" className="block text-sm font-medium text-gray-700 mb-1">Re-enter Password</label>
                <Field name="reenterPassword" type="password" className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200" />
                <ErrorMessage name="reenterPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex items-center space-x-2">
                <Field type="checkbox" name="privacyPolicy" className="rounded border-2 border-[#8B4513] text-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:ring-offset-0" />
                <label htmlFor="privacyPolicy" className="text-sm font-medium text-gray-700">
                  I agree to the{' '}
                  <button type="button" className="text-[#8B4513] underline hover:text-[#A0522D] transition duration-200" onClick={() => setIsPrivacyModalOpen(true)}>
                    privacy policy
                  </button>
                </label>
              </div>
              <ErrorMessage name="privacyPolicy" component="div" className="text-red-500 text-sm mt-1" />

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 border-2 border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#8B4513] hover:bg-[#A0522D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A0522D] transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
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
          Already have an account?{' '}
          <Link href="/signin" className="text-[#8B4513] hover:text-[#A0522D] underline transition duration-200">
            Sign In
          </Link>
        </motion.p>

        {/* Verification Modal */}
        {isVerificationModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-[#8B4513]">Verify Your Email</h2>
              <p className="mb-4 text-gray-700">
                A 6-digit code was sent to your email. Please enter it below to verify your account.
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 rounded-md border-2 border-[#8B4513] focus:ring-2 focus:ring-[#A0522D] focus:border-transparent transition duration-200 mb-4"
                placeholder="Enter verification code"
              />
              <motion.button
                onClick={handleVerifyCode}
                className="w-full py-3 px-6 border-2 border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#8B4513] hover:bg-[#A0522D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A0522D] transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Verify
              </motion.button>
              <motion.button
                onClick={() => setIsVerificationModalOpen(false)}
                className="mt-4 w-full py-3 px-6 border-2 border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* Privacy Policy Modal */}
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-[#8B4513]">Privacy Policy</h2>
              <p className="mb-4 text-gray-700">
                This is where you can add your privacy policy content.
              </p>
              <motion.button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="mt-4 w-full py-3 px-6 border-2 border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}