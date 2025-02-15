import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { Edit2, Mail, UserCircle } from "lucide-react";
import { User } from "../../../backend/src/types"; // Adjust path based on your setup
import { fetchWithAuth } from "../utils/api";
import { auth } from "../firebase";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth('/api/user');
        
        // Additional safety check
        if (response instanceof Error) throw response;
        
        setProfile(response);
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Show user-friendly error message
      }
    };
  
    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchProfile();
    });
  
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      setProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) return <Typography>Loading...</Typography>;

  function handleCancel(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

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
                  value={editedProfile.displayName || ""}
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
                  value={editedProfile.email || ""}
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
                    <Typography variant="body1" sx={{ color: "text.primary" }}>
                      {new Date(profile.createdAt).toLocaleDateString()}
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
                    {new Date(profile.lastTokenRefill).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
