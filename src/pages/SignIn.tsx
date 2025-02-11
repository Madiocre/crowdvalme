import { Box, Card, CardContent, CardHeader, Typography, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function SignInPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Card sx={{ width: '100%', maxWidth: 400, p: 2 }}>
        <CardHeader
          title={<Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', color: 'text.primary' }}>Sign In to Valme</Typography>}
        />
        <CardContent>
          <form className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="Your email"
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="Your password"
              required
              margin="normal"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign In
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" sx={{ color: 'primary.main' }}>
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}