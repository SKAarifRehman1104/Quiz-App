import React from 'react';

export function QuizCard({ quiz }) {
  return (
    <div className="w-full max-w-md shadow-md bg-white rounded">
      <div className="p-4 bg-gray-100 rounded-t">
        <h2 className="text-lg font-bold">{quiz.title}</h2>
        <p className="text-sm text-gray-600">{quiz.description}</p>
      </div>
      <div className="p-4">
        <p>Number of questions: {quiz.questionCount}</p>
      </div>
    </div>
  );
}
