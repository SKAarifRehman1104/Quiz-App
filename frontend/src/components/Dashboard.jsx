// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function Dashboard() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   useEffect(() => {
//     if (selectedCategory) {
//       axios
//         .get(`http://localhost:3001/api/quizzes?category=${selectedCategory}`)
//         .then((res) => {
//           setQuizzes(res.data);
//           console.log("Quizzes:", res.data);
//         })
//         .catch((err) => console.error(err));
//     }
//   }, [selectedCategory]);

//   const handleCategorySelect = (categoryId) => {
//     setSelectedCategory(categoryId);
//   };

//   const handleQuizSelect = (quiz) => {
//     console.log(`Starting quiz: ${quiz.quizName}`);
//   };

//   return (
//     <div className="h-screen w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center">
//       <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-3xl">
//         <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
//           Quiz Selector
//         </h1>
//         <div className="flex flex-col items-center">
//           <select
//             value={selectedCategory}
//             onChange={(e) => handleCategorySelect(e.target.value)}
//             className="block w-full max-w-md p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-6"
//           >
//             <option value="" disabled>
//               Select a category
//             </option>
//             <option value="HTML">HTML</option>
//             <option value="CSS">CSS</option>
//             <option value="JavaScript">JavaScript</option>
//             <option value="Testing">Testing</option>
//           </select>

//           {quizzes.length > 0 && (
//             <div className="mt-6 w-full">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//                 {selectedCategory} Quizzes
//               </h2>
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {quizzes.map((quiz) => (
//                   <div
//                     key={quiz._id}
//                     className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                   >
//                     <h3 className="text-lg font-bold text-gray-800">
//                       {quiz.quizName}
//                     </h3>
//                     <button
//                       onClick={() => handleQuizSelect(quiz)}
//                       className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
//                     >
//                       Start Quiz
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`${API_URL}/api/quizzes?category=${selectedCategory}`)
        .then((res) => {
          setQuizzes(res.data);
          console.log("Quizzes:", res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  

  const handleQuizSelect = (quiz) => {
    console.log(`Starting quiz: ${quiz.quizName} with ID: ${quiz._id}`);
    navigate(`/quiz/quizId/${quiz._id}`); 
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Quiz Selector
        </h1>
        <div className="flex flex-col items-center">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="block w-full max-w-md p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-6"
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Core Java">Core Java</option>
            <option value="Advanced Java">Advanced Java</option>
            <option value="Data Science">Data Science</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>

          {quizzes.length > 0 && (
            <div className="mt-6 w-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                {selectedCategory} Quizzes
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-bold text-gray-800">
                      {quiz.quizName}
                    </h3>
                    <button
                      onClick={() => handleQuizSelect(quiz)}
                      className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
