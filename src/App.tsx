import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout"
import { ButtonDemo } from "@/pages/button-demo"
import { CardDemo } from "@/pages/card-demo"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/button" replace />} />
          <Route path="button" element={<ButtonDemo />} />
          <Route path="card" element={<CardDemo />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
