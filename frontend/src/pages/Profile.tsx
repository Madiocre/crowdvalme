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
import { User } from "../../../backend/src/types"; // Adjust path based on your setup
import { fetchWithAuth } from "../utils/api";
import { auth } from "../firebase";
// import { Timestamp } from "firebase/firestore";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        
        // Get a fresh ID token to ensure it's valid
        const idToken = await user.getIdToken(true);
        localStorage.setItem("token", idToken);
        
        const response = await fetchWithAuth("/api/user");
        
        // The response already contains Timestamp objects, so no conversion needed
        setProfile(response);
        setError(null);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Failed to load profile. Please try signing in again.");
      } finally {
        setLoading(false);
      }
    };

    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchProfile();
      else setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      setError(null);
      
      // Only send fields that actually changed
      const changedFields: Partial<User> = {};
      if (editedProfile.displayName !== undefined && 
          editedProfile.displayName !== profile?.displayName) {
        changedFields.displayName = editedProfile.displayName;
      }
      if (editedProfile.email !== undefined && 
          editedProfile.email !== profile?.email) {
        changedFields.email = editedProfile.email;
      }
      
      // If nothing changed, just exit edit mode
      if (Object.keys(changedFields).length === 0) {
        setIsEditing(false);
        return;
      }
      
      const response = await fetchWithAuth("/api/user", {
        method: "PUT",
        body: JSON.stringify(changedFields),
      });
      
      // Response should already have Timestamp objects from the server
      setProfile(response);
      setIsEditing(false);
      setEditedProfile({});
      setSuccessMessage("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedProfile({});
    setIsEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  // Helper function to format Timestamp to local date string
  // const formatTimestamp = (timestamp: Timestamp) => {
  //   return timestamp.toDate().toLocaleDateString();
  // };

  if (loading) return <Typography>Loading...</Typography>;
  if (!profile && error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>No profile data available.</Typography>;

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Account Settings
        </Typography>
        {!isEditing && (
          <Button
            variant="outlined"
            startIcon={<Edit2 />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: 3,
        }}
      >
        {/* Profile Overview Card */}
        <Card>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="Portrait Holder"
              src={profile.photoURL || "https://assets.aceternity.com/manu.png"}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
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

        {/* Account Details Card */}
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
            >
              Account Details
            </Typography>
            {isEditing ? (
              <Box sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="Display Name"
                  value={editedProfile.displayName ?? profile.displayName ?? ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      displayName: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={editedProfile.email ?? profile.email ?? ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      email: e.target.value,
                    })
                  }
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
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
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Tokens
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.primary" }}>
                      {profile.tokens}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Member Since
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
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Success/Error Notifications */}
      <Snackbar 
        open={!!successMessage || !!error} 
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={successMessage ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </Box>
  );
}