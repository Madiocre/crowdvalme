/* eslint-disable react-refresh/only-export-components */
import { JSX, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import ProfilePage from "./pages/Profile";
import AddIdeaPage from "./pages/AddIdeaPage";
import IdeaDetailPage from "./pages/IdeaDetailPage";
import { darkTheme, lightTheme } from "./assets/theme";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

// Route guard component for protected routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};

const App = () => {
  const isDarkMode = false; // Set this dynamically based on user preference
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

          {/* App Routes with AppLayout */}
          <Route element={<AppLayout />}>
            {/* Public routes */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            
            {/* Protected routes */}
            <Route path="/add-idea" element={
              <RequireAuth>
                <AddIdeaPage />
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
            <Route path="/idea/:id" element={<IdeaDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);