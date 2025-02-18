/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { useState } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
  
      // Update user profile
      await updateProfile(userCredential.user, { displayName: name });
  
      // Call backend login endpoint
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
  
      if (!loginResponse.ok) throw new Error('Login failed');
  
      // Redirect to home page
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 2 }}>
        <CardHeader
          title={
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "text.primary",
              }}
            >
              Sign Up for Valme
            </Typography>
          }
        />
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              type="text"
              placeholder="Your name"
              required
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="Your email"
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="Your password"
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign Up
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
          >
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/signin"
              sx={{ color: "primary.main" }}
            >
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}