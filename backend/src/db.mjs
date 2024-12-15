import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

// Connect to MongoDB
mongoose.connect(process.env.DSN)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
});

// Trip Schema
const TripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  dates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  estimatedBudget: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  createdAt: { type: Date, default: Date.now }
});

// Expense Schema
const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  amount: { type: Number, required: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  splitAmong: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Add slug plugin
UserSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=username%>' });
TripSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' });
ExpenseSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=description%>' });

// Compile schemas into models and export
const User = mongoose.model('User', UserSchema);
const Trip = mongoose.model('Trip', TripSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

export { User, Trip, Expense };