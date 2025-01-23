// 'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircle, MinusCircle } from 'lucide-react';
import axios from 'axios';

export default function AddQuestionPage() {
  const [quizName, setQuizName] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([]); // State to hold all questions

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const addQuestionToBatch = () => {
    if (!question.trim() || options.filter(opt => opt.trim() !== '').length < 2 || !correctAnswer.trim()) {
      toast.error('Please fill out all fields correctly to add the question.');
      return;
    }

    const newQuestion = {
      question,
      options: options.filter(opt => opt.trim() !== ''),
      correctAnswer,
    };

    setQuestions([...questions, newQuestion]);
    // Reset question form
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();

    if (!quizName.trim() || !category.trim() || questions.length === 0) {
      toast.error('Please complete the form and add at least one question.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/add-question`, {
        quizName,
        category,
        questions,
      });
      toast.success(response.data.message);
      // Reset form
      setQuizName('');
      setCategory('');
      setQuestions([]);
    } catch (error) {
      toast.error('Failed to submit quiz. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg py-4 px-6">
            <CardTitle className="text-3xl font-bold text-center">Add New Quiz</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quizName" className="text-lg font-semibold text-gray-700">Quiz Name</Label>
                <Input
                  id="quizName"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  required
                  className="w-full border-2 border-purple-200 focus:border-purple-500 rounded-md p-2"
                  placeholder="Enter quiz name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-lg font-semibold text-gray-700">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border-2 border-purple-200 focus:border-purple-500 rounded-md p-2"
                >
                  <option value="">Select a category</option>
                  <option value="Core Java">Core Java</option>
                  <option value="Advanced Java">Advanced Java</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question" className="text-lg font-semibold text-gray-700">Question</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  className="w-full border-2 border-purple-200 focus:border-purple-500 rounded-md p-2"
                  placeholder="Enter question"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-700">Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      required
                      className="w-full border-2 border-purple-200 focus:border-purple-500 rounded-md p-2"
                      placeholder={`Option ${index + 1}`}
                    />
                    {index > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeOption(index)}
                        variant="outline"
                        size="icon"
                        className="p-2 border-2 border-purple-200 text-red-500 hover:bg-purple-100 hover:border-red-500 rounded-md"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addOption}
                  variant="outline"
                  className="w-full m-2 p-3 border-dashed border-2 border-purple-200 text-purple-500 hover:bg-purple-100 hover:border-purple-500 rounded-md flex items-center justify-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="correctAnswer" className="text-lg font-semibold text-gray-700">Correct Answer</Label>
                <Input
                  id="correctAnswer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  required
                  className="w-full border-2 border-purple-200 focus:border-purple-500 rounded-md p-2"
                  placeholder="Enter correct answer"
                />
              </div>
              <Button
                type="button"
                onClick={addQuestionToBatch}
                className="w-full bg-blue-500 text-white py-2 rounded-md"
              >
                Save Question
              </Button>
              <Button
                type="submit"
                onClick={handleSubmitQuiz}
                className="w-full bg-green-500 text-white py-2 rounded-md"
              >
                Submit Quiz
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
