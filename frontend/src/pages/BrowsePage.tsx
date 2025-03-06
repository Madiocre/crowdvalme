// import { useState, useEffect } from "react";
import { PlusCircle, ThumbsUp, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { useIdeas } from "../hooks/useIdeas";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUserVotes } from "../hooks/useUserVotes";
import { voteOnIdea } from "../services/ideaService";

export default function BrowsePage() {
  const navigate = useNavigate();
  const { ideas, loading: ideasLoading } = useIdeas();
  const { profile, loading: profileLoading } = useUserProfile();
  const votedIdeas = useUserVotes();

  const handleVote = async (ideaId: string) => {
    if (!profile || profile.tokens <= 0 || votedIdeas.includes(ideaId)) return;
    try {
      await voteOnIdea(profile.userId, ideaId);
      // Note: State updates might need to be handled via real-time listeners for accuracy
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (ideasLoading || profileLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Box sx={{ bgcolor: "background.paper", boxShadow: 1, p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
            Valme
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body1"
              sx={{
                px: 2,
                py: 1,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                borderRadius: 2,
              }}
            >
              {profile?.tokens || 0} tokens available
            </Typography>
            <Button
              variant="contained"
              startIcon={<PlusCircle />}
              onClick={() => navigate("/add-idea")}
            >
              New Project
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search ideas..."
          variant="outlined"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {ideas.map((project) => (
          <Card
            key={project.ideaId}
            sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
            onClick={() => navigate(`/idea/${project.ideaId}`)}
          >
            <CardMedia
              component="img"
              height="200"
              image={project.imageUrl || "https://via.placeholder.com/200"}
              alt={project.title}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {project.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                {project.description}
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  by {project.userId}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {project.createdAt.toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <IconButton
                  sx={{
                    color: votedIdeas.includes(project.ideaId) ? "text.disabled" : "text.secondary",
                  }}
                  disabled={votedIdeas.includes(project.ideaId) || profile?.tokens === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(project.ideaId);
                  }}
                >
                  <ThumbsUp />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {project.voteCount}
                  </Typography>
                </IconButton>
                <IconButton
                  sx={{ color: "text.secondary" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/idea/${project.ideaId}`);
                  }}
                >
                  <MessageCircle />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {project.commentCount || 0}
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