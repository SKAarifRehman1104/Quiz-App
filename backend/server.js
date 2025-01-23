const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt
const secret = process.env.JWT_SECRET;
const app = express();
const port = process.env.PORT; // Updated port number
const mongoURI = process.env.MONGO_URI;
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection with error handling
mongoose.connect(`${mongoURI}`)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Verify connection status
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

const quizSchema = new mongoose.Schema({
  quizName: String,
  category: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
  }],
});

const Quiz = mongoose.model('Quiz', quizSchema);

app.post('/add-question', async (req, res) => {
  try {
    const { quizName, category, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid questions array' });
    }

    // Check if the quiz already exists
    const existingQuiz = await Quiz.findOne({ quizName });

    if (existingQuiz) {
      // Append the questions to the existing quiz
      existingQuiz.questions.push(...questions);
      await existingQuiz.save();
      res.status(200).json({
        message: 'Questions added to existing quiz successfully!',
        quiz: existingQuiz,
      });
    } else {
      // Create a new quiz
      const newQuiz = new Quiz({ quizName, category, questions });
      await newQuiz.save();
      res.status(201).json({
        message: 'New quiz created and question(s) added successfully!',
        quiz: newQuiz,
      });
    }
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Failed to add question', details: error.message });
  }
});

app.get('/categories', async (req, res) => {
  const categories = await Question.distinct('category');
  res.json(categories);
});

app.get('/api/quiz/quizId/:id', async (req, res) => {
  const { id } = req.params; // Ensure the ID is extracted
  console.log("Received ID in API:", id); // Log the received ID

  try {
    const quiz = await Quiz.findById(_id=id); // Directly use `id` here
    if (!quiz) {
      return res.status(404).send({ message: 'Quiz not found' });
    }
    res.status(200).send(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get quizzes by category
app.get('/api/quizzes', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ username, password: hashedPassword, role }); // Save hashed password
    await newUser.save();
    res.send('User registered!');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Error registering user');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) { // Compare hashed password
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.json({ 
      token, role: user.role, userId: user._id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error logging in');
  }
});

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized');
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
};

const progressSchema = new mongoose.Schema({
  userName: String,
  userId: mongoose.Schema.Types.ObjectId,
  category: String,
  quizName: String,
  correctAnswers: Number,
  wrongAnswers: Number,
  score: Number, // New field for score
  date: { type: Date, default: Date.now } // New field for date
});

const Progress = mongoose.model('Progress', progressSchema);

app.post('/save-progress', authenticate, async (req, res) => {
  try {
    const { correctAnswers, wrongAnswers, category,
      quizName, score } = req.body; // Include score in the request body
      console.log(correctAnswers, wrongAnswers, category,
        quizName, score);
      
    const progress = new Progress({
      userName: req.body.userName,
      userId: req.userId,
      category,
      quizName,
      correctAnswers,
      wrongAnswers,
      score, // Save the score
    });
    
    await progress.save();
    res.status(201).json({ 
      message: 'Progress saved successfully',
      progress 
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ 
      error: 'Failed to save progress',
      details: error.message 
    });
  }
});

app.get('/progress', authenticate, async (req, res) => {
  const progress = await Progress.find({ userId: req.userId });
  res.json(progress);
});

// New endpoint to fetch previous tests for the authenticated user
app.get('/previous-tests', authenticate, async (req, res) => {
  try {
    const previousTests = await Progress.find({ userId: req.userId });
    res.json(previousTests);
  } catch (error) {
    console.error('Error fetching previous tests:', error);
    res.status(500).json({ error: 'Failed to fetch previous tests', details: error.message });
  }
});

// New endpoint to check admin user
app.get('/check-admin', async (req, res) => {
  try {
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(404).send('Admin user not found');
    }
    res.json({ username: adminUser.username, role: adminUser.role, password: adminUser.password });
  } catch (error) {
    console.error('Error fetching admin user:', error);
    res.status(500).send('Error fetching admin user');
  }
});

app.get('/', (req, res) => {
  res.send('Yay!! Backend of quiz app is now accessible');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
