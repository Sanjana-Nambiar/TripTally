import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TripDetails = () => {
  const { slug } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenseTimeline, setExpenseTimeline] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, expenseId: null });

  useEffect(() => {
    axios
      .get(`/api/trip/${slug}`, { withCredentials: true })
      .then((response) => {
        setTrip(response.data.trip);
        setExpenseTimeline(response.data.expenseTimeline);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trip details:", err);
        setError(
          err.response?.status === 401
            ? "Unauthorized"
            : "Failed to load trip details"
        );
        setLoading(false);
      });
  }, [slug]);

  const openDeleteModal = (expenseId) => {
    console.log("Opening delete modal for expense:", expenseId);
    setDeleteConfirmation({ show: true, expenseId });
  };
  
  const closeDeleteModal = () => {
    console.log("Closing delete modal");
    setDeleteConfirmation({ show: false, expenseId: null });
  };
  
  const handleDeleteExpense = async () => {
    console.log("Deleting expense:", deleteConfirmation.expenseId);
    try {
      await axios.delete(`/api/expense/${deleteConfirmation.expenseId}`, { withCredentials: true });
      setTrip((prevTrip) => ({
        ...prevTrip,
        expenses: prevTrip.expenses.filter((expense) => expense._id !== deleteConfirmation.expenseId),
      }));
      alert("Expense deleted successfully!");
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense. Please try again.");
      closeDeleteModal();
    }
  };  

  if (loading) return <div>Loading trip details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: "bold", color: "#fff" }}>{trip.title}</h2>
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = `/trip/${slug}/add-expense`)}
          style={{
            background: "linear-gradient(45deg, #ffd700, #e5c100)",
            color: "#121212",
            fontWeight: "bold",
            borderRadius: "25px",
          }}
        >
          + Add Expense
        </button>
      </div>

      {/* Graph Section */}
      <div className="mb-4">
        <p style={{ color: "#ffd700" }}> Remaining Budget Over Time:</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={expenseTimeline}
            margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="remainingBudget"
              stroke="#82ca9d"
              fill="url(#colorBudget)"
            />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trip Information */}
      <div className="mb-4">
        <h4 style={{ fontWeight: "bold", color: "#ffd700" }}>Trip Information</h4>
        <table className="table table-bordered table-dark">
          <tbody>
            <tr>
              <th>Destination</th>
              <td>{trip.destination}</td>
            </tr>
            <tr>
              <th>Dates</th>
              <td>
                {new Date(trip.dates.start).toLocaleDateString()} -{" "}
                {new Date(trip.dates.end).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <th>Estimated Budget</th>
              <td>${trip.estimatedBudget}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <h4 style={{ fontWeight: "bold", color: "#ffd700" }}>Participants</h4>
        <ul className="list-group">
          {trip.participants.map((participant) => (
            <li
              key={participant._id}
              className="list-group-item"
              style={{ backgroundColor: "#1a1a1a", color: "#f8f9fa" }}
            >
              {participant.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Expenses */}
      <div className="mb-4">
        <h4 style={{ fontWeight: "bold", color: "#ffd700" }}>Expenses</h4>
        {trip.expenses.length > 0 ? (
          <table className="table table-bordered table-dark">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Payer</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trip.expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.description}</td>
                  <td>${expense.amount}</td>
                  <td>{expense.payer.username}</td>
                  <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => openDeleteModal(expense._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses added yet.</p>
        )}
      </div>

      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Confirm Deletion</h5>
            <p>Are you sure you want to delete this expense?</p>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteExpense}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="text-center">
        <a
          href="/"
          className="btn btn-secondary"
          style={{
            background: "#1a1a1a",
            color: "#ffd700",
            fontWeight: "bold",
            borderRadius: "25px",
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default TripDetails;
