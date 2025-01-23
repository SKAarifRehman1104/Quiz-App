import React from 'react';

export default function categoryQuiz({ quizzes, onSelectQuiz }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="flex flex-col justify-between shadow-md bg-white rounded"
        >
          <div className="p-4 bg-gray-100 rounded-t">
            <h2 className="text-lg font-bold">{quiz.title}</h2>
            <p className="text-sm text-gray-600">{quiz.description}</p>
          </div>
          <div className="p-4 flex flex-col justify-end">
            <p className="mb-2">Questions: {quiz.questionCount}</p>
            <button
              onClick={() => onSelectQuiz(quiz)}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Start Quiz
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
