import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // To get the id and navigate
import axios from "axios";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  // Prevent navigation away from the quiz
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      // Modern browsers require setting returnValue to trigger the dialog
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Block browser back button
    const blockBackNavigation = () => {
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", blockBackNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", blockBackNavigation);
    };
  }, []);

  // Fetch quiz data
  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/quiz/quizId/${id}`);
      console.log(response.data);
      
      setQuiz(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quiz:", error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  // UseEffect to fetch quiz on component mount
  useEffect(() => {
    fetchQuiz();
  }, [id]);

  // Handle answer selection
  const handleOptionSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Handle navigation
  const handleNext = () => {
    if (!selectedAnswers[quiz.questions[currentQuestionIndex]._id]) {
      alert("Please select an answer before proceeding to the next question.");
      return;
    }
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate the score and navigate to results page
  const handleSubmit = () => {
    const correctAnswers = quiz.questions.reduce((acc, question) => {
      const isCorrect =
        selectedAnswers[question._id] === question.correctAnswer;
      return isCorrect ? acc + 1 : acc;
    }, 0);

    const wrongQuestions = quiz.questions.filter(
      (question) =>
        selectedAnswers[question._id] !== question.correctAnswer
    );

    const resultData = {
      totalQuestions: quiz.questions.length,
      correctAnswers: correctAnswers,
      wrongQuestions: wrongQuestions.map((q) => ({
        question: q.question,
        selectedAnswer: selectedAnswers[q._id] || "No answer",
        correctAnswer: q.correctAnswer,
      })),
      category: quiz.category, // Include the category here
      quizName: quiz.quizName, // Include the quiz name here
      score: quiz.questions.length - wrongQuestions.length || 0
    };

    console.log('Result Data:', resultData); // Debugging log

    // Navigate to the results page with the result data
    navigate("/results", { state: resultData });

    // Allow back navigation to the dashboard page
    window.history.pushState(null, "", "/dashboard");
    window.addEventListener("popstate", () => {
      navigate("/dashboard");
    });
  };

  // Render loading or error states
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;

  // Current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border-2 border-black">
        <h1 className="text-2xl font-bold text-center mb-6">{quiz.quizName}</h1>
        <h4 className="text-lg font-semibold mb-4">
          {`Question ${currentQuestionIndex + 1} of ${quiz.questions.length}`}
        </h4>
        {currentQuestion && (
          <div>
            <h2 className="text-lg font-normal mb-8">{currentQuestion.question}</h2>
            <ul className="space-y-4">
              {currentQuestion.options.map((option, i) => (
                <li key={i}>
                  <label className="flex items-center bg-gray-100 p-4 rounded-lg border hover:bg-blue-50 hover:border-blue-500 cursor-pointer transition">
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      value={option}
                      checked={selectedAnswers[currentQuestion._id] === option}
                      onChange={() => handleOptionSelect(currentQuestion._id, option)}
                      className="mr-4 w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-2 text-white font-medium rounded-lg shadow ${
                  currentQuestionIndex === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-600"
                }`}
              >
                Back
              </button>
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswers[currentQuestion._id]} // Disable if no answer is selected
                  className={`px-6 py-2 text-white font-medium rounded-lg shadow ${
                    !selectedAnswers[currentQuestion._id]
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500"
                  }`}
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQuestion._id]} // Disable if no answer is selected
                  className={`px-6 py-2 text-white font-medium rounded-lg shadow ${
                    !selectedAnswers[currentQuestion._id]
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-600"
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
