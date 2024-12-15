import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const AddTrip = () => {
  const [users, setUsers] = useState([]);
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    estimated_budget: '',
    participants: []
  });

  // Fetch available users
  useEffect(() => {
    axios.get('/api/users', { withCredentials: true })
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle participant selection
  const handleParticipantsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const participantIds = selectedOptions.map(option => option.value);
    setTripData((prev) => ({ ...prev, participants: participantIds }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/trip/add', tripData, { withCredentials: true })
      .then(() => window.location.href = '/')
      .catch((error) => console.error('Error adding trip:', error));
  };

  return (
    <div className="center-container">
      <main className="main-card">
        <h2 className="text-center">Add New Trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Trip Title</label>
            <input type="text" className="form-control" id="title" name="title" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="destination" className="form-label">Destination</label>
            <input type="text" className="form-control" id="destination" name="destination" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="start_date" className="form-label">Start Date</label>
            <input type="date" className="form-control" id="start_date" name="start_date" min={new Date().toISOString().split("T")[0]} onChange={handleChange} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="end_date" className="form-label">End Date</label>
            <input type="date" className="form-control" id="end_date" name="end_date" min={tripData.start_date || new Date().toISOString().split("T")[0]} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="estimated_budget" className="form-label">Estimated Budget</label>
            <input type="number" className="form-control" id="estimated_budget" name="estimated_budget" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Invite Participants</label>
            <div>
              {users.map((user) => (
                <div key={user._id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`participant-${user._id}`}
                    value={user._id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTripData((prev) => ({
                          ...prev,
                          participants: [...prev.participants, e.target.value],
                        }));
                      } else {
                        setTripData((prev) => ({
                          ...prev,
                          participants: prev.participants.filter((id) => id !== e.target.value),
                        }));
                      }
                    }}
                  />
                  <label
                    htmlFor={`participant-${user._id}`}
                    className="form-check-label"
                  >
                    {user.username}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Add Trip</button>
        </form>
      </main>
    </div>
  );
};

export default AddTrip;
