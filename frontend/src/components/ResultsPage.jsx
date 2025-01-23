import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ResultsPage = () => {
  const { state } = useLocation();
  const { totalQuestions, correctAnswers, wrongQuestions, category, quizName, score } = state;  
  console.log(totalQuestions, correctAnswers, wrongQuestions, category, quizName, score);
  
  const [progress, setProgress] = useState([]);
  const [previousTests, setPreviousTests] = useState([]); // New state for previous tests
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      console.log('Token for fetching progress:', token); // Debugging token presence
      if (!token) {
        console.error('No token found. User may not be logged in.');
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/progress`, { // Updated port
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setProgress(res.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    const fetchPreviousTests = async () => { // New function to fetch previous tests
      const token = localStorage.getItem('token');
      console.log('Token for fetching previous tests:', token); // Debugging token presence
      if (!token) {
        console.error('No token found. User may not be logged in.');
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/previous-tests`, { // Updated port
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPreviousTests(res.data); // Set the previous tests data
      } catch (error) {
        console.error('Error fetching previous tests:', error);
      }
    };

    const saveProgress = async () => {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('username');
      const wrongAnswersCount = wrongQuestions.length;

      console.log('Sending progress data:', { userName, category, quizName, correctAnswers, wrongAnswers: wrongAnswersCount });

      if (!token) {
        console.error('No token found. User may not be logged in.');
        return;
      }

      try {
        // Check if progress already exists
        const existingProgress = await axios.get(`${API_URL}/progress`, { // Updated port
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const progressExists = existingProgress.data.some(progress => 
          progress.quizName === quizName && progress.userName === userName
        );

        if (progressExists) {
          console.log('Progress already exists for this quiz. Updating instead of creating a new entry.');
          // Update logic can be added here if needed
        } else {
          await axios.post(`${API_URL}/save-progress`, { // Updated port
            userName,
            category,
            quizName,
            correctAnswers,
            wrongAnswers: wrongAnswersCount,
            score
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    fetchProgress();
    fetchPreviousTests(); // Call the new function to fetch previous tests
    saveProgress();

  }, [correctAnswers, wrongQuestions]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Quiz Results</h1>
        <p className="text-lg font-medium mb-4">Category: {category}</p>
        <p className="text-lg font-medium mb-4">Quiz Name: {quizName}</p>
        <p className="text-lg font-medium mb-4">Total Questions: {totalQuestions}</p>
        <p className="text-lg font-medium mb-4">Correct Answers: {correctAnswers}</p>
        <h2 className="text-xl font-bold mb-4">Wrong Questions:</h2>
        <ul className="space-y-4">
          {wrongQuestions.map((q, i) => (
            <li key={i} className="bg-gray-100 p-4 rounded-lg border">
              <p>
                <strong>Question:</strong> {q.question}
              </p>
              <p>
                <strong>Your Answer:</strong> {q.selectedAnswer}
              </p>
              <p>
                <strong>Correct Answer:</strong> {q.correctAnswer}
              </p>
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-bold mb-4">Previous Tests:</h2>
        <ul className="space-y-4">
          {previousTests.map((test, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg border">
              <p>
                <strong>Quiz Name:</strong> {test.quizName}
              </p>
              <p>
                <strong>Score:</strong> {test.score}
              </p>
              <p>
                <strong>Date:</strong> {new Date(test.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsPage;
