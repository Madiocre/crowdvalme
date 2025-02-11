import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { FC } from 'react';

const NotFound: FC = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="text-xl text-gray-400 mb-4">Page Not Found</p>
        <Button variant="contained" startIcon={<HomeIcon />} onClick={() => window.location.href = "/"} color="primary">
          Go Home
        </Button>
      </div>
    );
};

export default NotFound;