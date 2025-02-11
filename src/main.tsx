import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProfilePage from './pages/Profile';
import AddIdeaPage from './pages/AddIdeaPage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import { darkTheme, lightTheme } from './assets/theme'; // Import your theme

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const isDarkMode = true; // Set this dynamically based on user preference
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/home" />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/add-idea" element={<AddIdeaPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/idea/:id" element={<IdeaDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);