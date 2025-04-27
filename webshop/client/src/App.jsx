import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Termekek from './pages/Termekek';
import Termek from './components/Termek';
import Rendeles from './pages/Rendeles';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilAdatok from './pages/ProfilAdatok';
import AdminPanel from './pages/AdminPanel';
import Header from './components/Header';

export const ThemeContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'true';
  });

  const [kosar, setKosar] = useState(() => {
    const savedKosar = localStorage.getItem('kosar');
    return savedKosar ? JSON.parse(savedKosar) : []; // Initialize as an empty array if no data exists
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1f1f1f' : '#ffffff',
      },
    },
  });

  const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.role) {
      return <Navigate to="/" />; // Redirect to homepage if not admin
    }
    return children;
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
        <Header kosar={kosar} setKosar={setKosar} /> {/* Pass kosar state to Header */}
          <Routes>
            <Route path="/" element={<Termekek kosar={kosar} setKosar={setKosar} />} /> {/* Pass kosar state to Termekek */}
            <Route path="/termek/:id" element={<Termek kosar={kosar} setKosar={setKosar} />} />
            <Route path="/rendeles" element={<Rendeles kosar={kosar} setKosar={setKosar} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profil-adatok" element={<ProfilAdatok />} /> {/* New route */}
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}/>
          </Routes>
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;