import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit2, Mail, UserCircle } from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { updateDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "../firebase";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { profile, loading: profileLoading, error: fetchError } = useUserProfile();

  useEffect(() => {
    if (profile) {
      setEditedDisplayName(profile.displayName);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    try {
      setError(null);
      if (editedDisplayName === profile.displayName) {
        setIsEditing(false);
        return;
      }
      const userRef = doc(db, "users", profile.userId);
      await updateDoc(userRef, { displayName: editedDisplayName });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: editedDisplayName });
      }
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedDisplayName(profile?.displayName || "");
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  if (profileLoading) return <Typography>Loading...</Typography>;
  if (fetchError) return <Typography color="error">{fetchError}</Typography>;
  if (!profile) return <Typography>No profile data available.</Typography>;

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Account Settings
        </Typography>
        {!isEditing && (
          <Button variant="outlined" startIcon={<Edit2 />} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 3 }}>
        <Card>
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar
              alt="Portrait Holder"
              src={profile.photoURL || "https://assets.aceternity.com/manu.png"}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
              {profile.displayName || "Anonymous"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              {profile.email}
            </Typography>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Mail sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {profile.email}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <UserCircle sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  @{profile.displayName?.toLowerCase().replace(/\s+/g, "")}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
              Account Details
            </Typography>
            {isEditing ? (
              <Box sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="Display Name"
                  value={editedDisplayName}
                  onChange={(e) => setEditedDisplayName(e.target.value)}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "grid", gap: 2 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Tokens
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary" }}>
                      {profile.tokens}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Member Since
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary" }}>
                      {profile.createdAt.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {profile.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Last Token Refill
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {profile.lastTokenRefill.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </Box>
  );
}