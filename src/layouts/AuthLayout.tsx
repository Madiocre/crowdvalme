import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CssBaseline />
      <Container maxWidth="sm">
        <Outlet /> {/* This will render the SignInPage or SignUpPage */}
      </Container>
    </Box>
  );
};

export default AuthLayout;