import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
        Welcome to Valme
      </Typography>
      <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
        Discover, support, and share innovative ideas.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/browse')}
      >
        Explore Ideas
      </Button>
    </Box>
  );
}