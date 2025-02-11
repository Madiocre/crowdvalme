import React, { useState } from 'react';
import { Box, Typography, TextField, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';

// Custom styles for the file upload input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const AddIdeaPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., save the idea)
    console.log({ title, description, image, videoUrl, tags });
    navigate('/'); // Redirect to home or another page after submission
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Add New Idea
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" mb={1}>
            Upload an Image
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
          >
            Upload Image
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Button>
        </Box>
        <TextField
          fullWidth
          label="Video Embed URL (optional)"
          variant="outlined"
          margin="normal"
          placeholder="Paste a YouTube or Vimeo link"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <TextField
          fullWidth
          label="Tags"
          variant="outlined"
          margin="normal"
          placeholder="Add tags separated by commas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')} // Redirect to home or cancel
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddIdeaPage;