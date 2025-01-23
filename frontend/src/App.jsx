import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './App.css'
import Verify from './components/Verify'
import Layout from './Layout'
import Home from './components/Home'
import AddQuestion from './components/AddQuestion'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/Dashboard'
import QuizPage from './components/QuizPage'
import ResultsPage from './components/ResultsPage'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/' element = {<Layout/>}>
      <Route path=""  element={<Home/>}/>
      <Route path="verify"  element={<Verify/>}/>
      <Route path="add-question" element={<AddQuestion/>}/>
      <Route path="dashboard" element={<PrivateRoute element={Dashboard}/>}/>
      <Route path="quiz/quizId/:id" element={<QuizPage/>} />\
      <Route path="results" element={<ResultsPage/>} />
    </Route>
  )
) 
function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
