import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import PostForm from './pages/PostForm'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/new" element={<PostForm />} />
      <Route path="/posts/:id/edit" element={<PostForm />} />
    </Routes>
  )
}

export default App