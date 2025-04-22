import './config.mjs';
import './db.mjs';
import sanitize from 'mongo-sanitize';
import * as auth from './auth.mjs';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { Trip, User, Expense } from './db.mjs';
import cors from 'cors';
import mongoose from 'mongoose';
import { SessionManager } from './session.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: 'lax' },
  })
);

app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});

app.use( cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// Higher-Order Function for Authentication
const requireAuth = (handler) => {
  return async (req, res, next) => {
    if (!SessionManager.checkSession(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Routes
app.get('/api/session', requireAuth((req, res) => {
    res.json({ user: req.session.user });
  })
);

app.get( '/api/trips', requireAuth(async (req, res) => {
    try {
      const trips = await Trip.find({ participants: req.session.user._id });
      res.json({ trips });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch trips' });
    }
  })
);

app.post('/api/register', async (req, res) => {
  try {
    const newUser = await auth.register(
      sanitize(req.body.username),
      sanitize(req.body.email),
      req.body.password
    );
    SessionManager.startSession(req, newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Registration error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await auth.login(sanitize(req.body.username), req.body.password);
    SessionManager.startSession(req, user);
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Login failed' });
  }
});

app.get( '/api/users', requireAuth(async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: req.session.user._id } });
      res.json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  })
);

app.post( '/api/logout', requireAuth((req, res) => {
    SessionManager.destroySession(req);
    res.json({ message: 'Logout successful' });
  })
);

app.post('/api/trip/add', requireAuth(async (req, res) => {
    try {
      const { title, destination, start_date, end_date, estimated_budget, participants } = req.body;
      const participantIds = [req.session.user._id, ...(Array.isArray(participants) ? participants : [participants])];

      const newTrip = new Trip({
        title,
        destination,
        dates: {
          start: new Date(start_date),
          end: new Date(end_date),
        },
        estimatedBudget: estimated_budget,
        participants: participantIds,
      });

      await newTrip.save();
      res.status(201).json({ message: 'Trip added successfully', trip: newTrip });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add trip' });
    }
  })
);

app.get('/api/trip/:slug', requireAuth(async (req, res) => {
    try {
      const trip = await Trip.findOne({ slug: req.params.slug })
        .populate('participants', 'username')
        .populate({
          path: 'expenses',
          populate: { path: 'payer', select: 'username' },
        });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });

      // Aggregate expense data
      const expenseSummary = await Expense.aggregate([
        { $match: { trip: trip._id } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalExpense: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      let remainingBudget = trip.estimatedBudget;
      const expenseTimeline = [
        {
          date: trip.dates.start.toISOString().split('T')[0],
          remainingBudget: trip.estimatedBudget,
        },
        ...expenseSummary.map((entry) => {
          remainingBudget -= entry.totalExpense;
          return { date: entry._id, remainingBudget };
        }),
      ];

      res.json({ trip, expenseTimeline });
    } catch (err) {
      console.error('Failed to fetch trip details:', err);
      res.status(500).json({ error: 'Failed to fetch trip details' });
    }
  })
);

app.post( '/api/expense/add', requireAuth(async (req, res) => {
    try {
      const { description, amount, payer, splitAmong, tripSlug } = req.body;

      const trip = await Trip.findOne({ slug: tripSlug });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });

      const newExpense = new Expense({ description, amount, payer, splitAmong, trip: trip._id });
      await newExpense.save();

      trip.expenses.push(newExpense._id);
      await trip.save();

      res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ error: 'Failed to add expense' });
    }
  })
);

app.get( '/api/expenses/summary', requireAuth(async (req, res) => {
    try {
      const expenses = await Expense.aggregate([
        {
          $lookup: {
            from: 'trips',
            localField: 'trip',
            foreignField: '_id',
            as: 'tripData',
          },
        },
        {
          $match: {
            'tripData.participants': new mongoose.Types.ObjectId(req.session.user._id),
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalAmount: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.json({ expenses });
    } catch (error) {
      console.error('Error in /api/expenses/summary:', error);
      res.status(500).json({ error: 'Failed to fetch expense summary' });
    }
  })
);

app.delete( '/api/trip/:id', requireAuth(async (req, res) => {
    try {
      const tripId = req.params.id;
      const trip = await Trip.findById(tripId);
      if (!trip) return res.status(404).json({ error: 'Trip not found' });

      await Expense.deleteMany({ trip: tripId });
      await Trip.findByIdAndDelete(tripId);

      res.status(200).json({ message: 'Trip and related data deleted successfully' });
    } catch (error) {
      console.error('Error deleting trip:', error);
      res.status(500).json({ error: 'Failed to delete trip' });
    }
  })
);

app.delete( '/api/expense/:id', requireAuth(async (req, res) => {
    try {
      const expenseId = req.params.id;
      const expense = await Expense.findByIdAndDelete(expenseId);
      if (!expense) return res.status(404).json({ error: 'Expense not found' });

      await Trip.findByIdAndUpdate(expense.trip, { $pull: { expenses: expenseId } });
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  })
);

app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

export default app;
