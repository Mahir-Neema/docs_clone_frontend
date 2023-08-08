import React from 'react'
import TextEditor from './TextEditor'
import {BrowserRouter as Router, Routes ,Route, Navigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/docs_clone_frontend" exact element={<Navigate to={`/documents/${uuidV4()}`}/>} />
        <Route path="/docs_clone_frontend/documents/:id" element={<TextEditor/>} />
      </Routes>
    </Router>
  )
}

export default App