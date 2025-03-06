/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Card, CardContent, CardHeader, Typography, TextField, Button, Link } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
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
              sx={{ textAlign: "center", fontWeight: "bold", color: "text.primary" }}
            >
              Sign In to Valme
            </Typography>
          }
        />
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              Sign In
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/signup" sx={{ color: "primary.main" }}>
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}