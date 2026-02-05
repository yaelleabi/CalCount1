import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AddCalorieForm } from './components/AddCalorieForm'
import { CalorieList } from './components/CalorieList'
import { CalorieSummary } from './components/CalorieSummary'
import { CalorieProvider } from './contexts/CalorieContext'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoutes'
import { Header } from './components/Header'
import { LoginForm } from './components/LoginForm'
import { AdminRoute } from "./components/AdminRoute";
import { AdminTemplates } from "./components/AdminTemplates";
import { RegisterForm } from "./components/RegisterForm";
import { Home } from "./components/Home";

function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <AuthProvider>
        <CalorieProvider>
          <AppRoot />
        </CalorieProvider>
      </AuthProvider>
    </BrowserRouter>



  );
}
const AppRoot = () => {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route path="/" element={<Home />} />
        <Route path="/form" element={<ProtectedRoute><AddCalorieForm /></ProtectedRoute>} />
        <Route path="/list" element={<ProtectedRoute><CalorieList /></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><CalorieSummary /></ProtectedRoute>} />
        <Route path="/admin/templates" element={<AdminRoute><AdminTemplates /></AdminRoute>} />


        {/* Syntax with search params instead of path params <Route path="/details" element={<ApplianceDetails />} /> */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

    </>
  );
};




export default App
