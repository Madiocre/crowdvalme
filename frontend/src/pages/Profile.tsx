import { useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, TextField } from '@mui/material';
import { Edit2, Save, Mail, UserCircle } from 'lucide-react';
import users from '../data/users.json'; // Import users from JSON

interface UserProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  lastLogin: string;
  joinDate: string;
  accountType: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(users[0]); // Use the first user for testing
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
        {/* Profile Overview Card */}
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              alt="Portrait Holder"
              src="https://assets.aceternity.com/manu.png"
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {profile.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {profile.role}
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Mail sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {profile.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <UserCircle sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  @{profile.username}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
              Account Details
            </Typography>
            {isEditing ? (
              <Box sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={editedProfile.username}
                  onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Account Type
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                      {profile.accountType}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Member Since
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                      {profile.joinDate}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {profile.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Last Login
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary' }}>
                    {profile.lastLogin}
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