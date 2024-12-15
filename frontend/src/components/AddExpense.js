import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddExpense = () => {
  const { slug } = useParams(); // Get the trip slug from URL
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [splitAmong, setSplitAmong] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch trip details to get participants
    axios.get(`/api/trip/${slug}`, { withCredentials: true })
      .then((response) => setParticipants(response.data.trip.participants))
      .catch((err) => console.error('Error fetching participants:', err));
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`/api/expense/add`, {
      description,
      amount,
      payer,
      splitAmong,
      tripSlug: slug, // Pass the trip slug to associate the expense
    }, { withCredentials: true })
      .then(() => {
        alert('Expense added successfully');
        navigate(`/trip/${slug}`); // Navigate back to trip details
      })
      .catch((err) => {
        console.error('Error adding expense:', err);
        setError('Failed to add expense');
      });
  };

  return (
    <div className="container mt-5 main-card">
      <h2 className="text-center">Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="payer" className="form-label">Payer</label>
          <select
            className="form-control"
            id="payer"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            required
          >
            <option value="">Select Payer</option>
            {participants.map((participant) => (
              <option key={participant._id} value={participant._id}>
                {participant.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Split Among</label>
          <div>
            {participants.map((participant) => (
              <div key={participant._id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`splitAmong-${participant._id}`}
                  value={participant._id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSplitAmong((prev) => [...prev, e.target.value]);
                    } else {
                      setSplitAmong((prev) => prev.filter((id) => id !== e.target.value));
                    }
                  }}
                />
                <label
                  htmlFor={`splitAmong-${participant._id}`}
                  className="form-check-label"
                >
                  {participant.username}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary w-100">Add Expense</button>
      </form>
      {error && <p className="text-danger text-center mt-3">{error}</p>}
    </div>
  );
};

export default AddExpense;
