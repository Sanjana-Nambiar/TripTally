import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = ({ user }) => {
  const [trips, setTrips] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, tripId: null });

  useEffect(() => {
    axios
      .get("/api/trips", { withCredentials: true })
      .then((response) => setTrips(response.data.trips))
      .catch((error) => console.error(error));

    axios
      .get("/api/expenses/summary", { withCredentials: true })
      .then((response) => setExpenseSummary(response.data.expenses))
      .catch((error) => console.error("Failed to fetch expense summary:", error));
  }, []);

  const handleDeleteTrip = async () => {
    const { tripId } = deleteConfirmation;
    try {
      await axios.delete(`/api/trip/${tripId}`, { withCredentials: true });
      alert("Trip deleted successfully!");
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId)); // Update UI
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Failed to delete trip:", error);
      alert("Error deleting the trip. Please try again.");
    }
  };  

  const openDeleteConfirmation = (tripId) => {
    setDeleteConfirmation({ show: true, tripId });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ show: false, tripId: null });
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-image"></div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h1>Welcome to Travel Budgeting Tool</h1>
          <p>Easily plan, track, and manage your travel expenses.</p>
        </div>
      </div>

      <div className="container mt-4">
        <div className="header mb-4 d-flex justify-content-between align-items-center">
          <h2>Welcome, {user?.username}!</h2>
          <Link to="/trip/add" className="btn btn-primary" style={{ backgroundColor: "#ffd700", color: "#121212", fontWeight: "bold" }}>
            + Add New Trip
          </Link>
        </div>

        {/* Graph Section */}
        <div className="graph-container mb-4">
          <h3>Your Total Expenses Over Time:</h3>
          {expenseSummary.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={expenseSummary} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="totalAmount" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p>No expense data available. Start by adding a trip!</p>
          )}
        </div>

        {/* Trips Section */}
        <h3>Your Trips:</h3>
        {trips.length > 0 ? (
          <div className="trips row">
            {trips.map((trip) => (
              <div key={trip._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="trip-card p-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #ffd700", borderRadius: "10px", color: "white" }}>
                  <h4>{trip.title}</h4>
                  <p><strong>Destination:</strong> {trip.destination}</p>
                  <p>
                    <strong>Dates:</strong>{" "}
                    {new Date(trip.dates.start).toLocaleDateString()} -{" "}
                    {new Date(trip.dates.end).toLocaleDateString()}
                  </p>
                  <p><strong>Budget:</strong> ${trip.estimatedBudget}</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <Link to={`/trip/${trip.slug}`} className="btn btn-secondary">
                      View Details
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => openDeleteConfirmation(trip._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no trips yet. Start by adding one!</p>
        )}
      </div>

      {deleteConfirmation.show && (
      <div className="modal-overlay">
          <div className="modal-content">
            <h5>Confirm Deletion</h5>
            <p>Are you sure you want to delete this trip and all related data?</p>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={closeDeleteConfirmation}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteTrip}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
  
    </div>
  );
};

export default Home;
