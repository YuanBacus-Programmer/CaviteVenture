'use client'

import { useState } from 'react'
import Navbar from "@/components/NavbarAdmin"

export default function EventPage() {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    location: '',
    date: '',
    description: ''
  })

  const [loading, setLoading] = useState(false); // To track form submission state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      }
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Event submitted for approval');
        setFormData({ image: '', title: '', location: '', date: '', description: '' });
      } else {
        const error = await response.json();
        alert('Error submitting event: ' + error.message);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while submitting the event.');
    }
    setLoading(false); // Reset loading state
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar/>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="image" className="block mb-2 font-bold">Event Image</label>
          <input
            id="image"
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-bold">Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block mb-2 font-bold">Location</label>
          <input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-2 font-bold">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 font-bold">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Event'}
        </button>
      </form>
    </div>
  );
}
