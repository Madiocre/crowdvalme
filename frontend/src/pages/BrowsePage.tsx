import { useState } from 'react';
import { PlusCircle, ThumbsUp, MessageCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import ideas from '../data/ideas.json'; // Import ideas from JSON

export default function BrowsePage() {
  const [projects, setProjects] = useState(ideas);
  const [userTokens, setUserTokens] = useState(30);
  const [votedIdeas, setVotedIdeas] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleVote = (projectId: number) => {
    if (userTokens > 0 && !votedIdeas.includes(projectId)) {
      setUserTokens(prev => prev - 1);
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId
            ? { ...p, votes: p.votes + 1 }
            : p
        )
      );
      setVotedIdeas(prev => [...prev, projectId]);
    }
  };

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', boxShadow: 1, p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Valme
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ px: 2, py: 1, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
              {userTokens} tokens available
            </Typography>
            <Button
              variant="contained"
              startIcon={<PlusCircle />}
              onClick={() => navigate('/add-idea')}
            >
              New Project
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search ideas..."
          variant="outlined"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {projects.map(project => (
          <Card
            key={project.id}
            sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
            onClick={() => navigate(`/idea/${project.id}`)}
          >
            <CardMedia
              component="img"
              height="200"
              image={project.imageUrl}
              alt={project.title}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {project.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                {project.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  by {project.creator}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {project.createdAt}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <IconButton
                  sx={{ color: votedIdeas.includes(project.id) ? 'text.disabled' : 'text.secondary' }}
                  disabled={votedIdeas.includes(project.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(project.id);
                  }}
                >
                  <ThumbsUp />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {project.votes}
                  </Typography>
                </IconButton>
                <IconButton
                  sx={{ color: 'text.secondary' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/idea/${project.id}`);
                  }}
                >
                  <MessageCircle />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {project.commentCount}
                  </Typography>
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}