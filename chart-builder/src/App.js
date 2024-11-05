import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ChartBuilder from './pages/ChartBuilder';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chart-builder" element={<ChartBuilder />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
