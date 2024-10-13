'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/NavbarSuperAdmin';
import Image from 'next/image';

// Define the Event interface
interface Event {
  _id: string; // MongoDB ID
  image: string;
  title: string;
  location: string;
  date: string;
  description: string;
  approved: boolean;
}

export default function PendingEventsPage() {
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPendingEvents() {
      try {
        const response = await fetch('/api/pendingevents', {
          method: 'GET',
        });

        if (response.ok) {
          const data: Event[] = await response.json();
          setPendingEvents(data);
        } else {
          throw new Error('Failed to fetch pending events');
        }
      } catch (error) {
        setError('Error fetching pending events');
        console.error(error);
      }
    }

    fetchPendingEvents();
  }, []);

  // Handle event approval
  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/pendingevents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const approvedEvent = await response.json();

        // After approving, post the event to the approved-events API
        await fetch('/api/approved-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: approvedEvent.image,
            title: approvedEvent.title,
            location: approvedEvent.location,
            date: approvedEvent.date,
            description: approvedEvent.description,
          }),
        });

        // Remove the event from the pending list
        setPendingEvents(pendingEvents.filter(event => event._id !== id));
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  // Handle event cancellation
  const handleCancel = async (id: string) => {
    try {
      const response = await fetch(`/api/pendingevents?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPendingEvents(pendingEvents.filter(event => event._id !== id));
      }
    } catch (error) {
      console.error('Error canceling event:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Pending Events</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pendingEvents.map(event => (
          <div key={event._id} className="border rounded p-4">
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                width={500} // Set default width
                height={300} // Set default height
                className="w-full h-48 object-cover mb-4"
              />
            )}
            <p className="mb-2"><strong>Location:</strong> {event.location}</p>
            <p className="mb-2"><strong>Date:</strong> {event.date}</p>
            <p className="mb-4"><strong>Description:</strong> {event.description}</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleApprove(event._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleCancel(event._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
