'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';

// Define the Event interface
interface Event {
  _id: string; // Use string because MongoDB IDs are strings
  image: string;
  title: string;
  location: string;
  date: string;
  description: string;
  approved: boolean;
}

export default function ApprovedEventsPage() {
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]); // Initialize as an empty array
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApprovedEvents() {
      try {
        const response = await fetch('/api/approved-events');
        const data = await response.json();

        // Check if the data is an array before setting it
        if (Array.isArray(data)) {
          setApprovedEvents(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError('Failed to fetch approved events');
        console.error(err);
      }
    }

    fetchApprovedEvents();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Approved Events</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {approvedEvents.length > 0 ? (
          approvedEvents.map(event => (
            <div key={event._id} className="border rounded p-4">
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              {event.image && (
                <Image
                  src={event.image}
                  alt={event.title}
                  width={500} // You can adjust the width as needed
                  height={300} // Adjust the height as well
                  className="w-full h-48 object-cover mb-4"
                />
              )}
              <p className="mb-2"><strong>Location:</strong> {event.location}</p>
              <p className="mb-2"><strong>Date:</strong> {event.date}</p>
              <p className="mb-4"><strong>Description:</strong> {event.description}</p>
            </div>
          ))
        ) : (
          <p>No approved events available.</p>
        )}
      </div>
    </div>
  );
}
