import { useState, useEffect } from "react";
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
import { Idea } from "../../../backend/src/types"; // Adjust path
import { auth } from "../firebase";

export default function BrowsePage() {
  const [projects, setProjects] = useState<Idea[]>([]);
  const [userTokens, setUserTokens] = useState(0);
  const [votedIdeas, setVotedIdeas] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();

        const [ideasRes, userRes] = await Promise.all([
          fetch("/api/ideas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!ideasRes.ok || !userRes.ok)
          throw new Error("Failed to fetch data");

        // ... rest of the data handling ...
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleVote = async (ideaId: string) => {
    if (userTokens > 0 && !votedIdeas.includes(ideaId)) {
      try {
        const response = await fetch(`/api/ideas/${ideaId}/vote`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to submit vote");

        const result = await response.json();
        setUserTokens(result.remainingTokens);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === ideaId ? { ...p, totalVotes: p.totalVotes + 1 } : p
          )
        );
        setVotedIdeas((prev) => [...prev, ideaId]);
      } catch (error) {
        console.error("Error voting:", error);
      }
    }
  };

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ bgcolor: "background.paper", boxShadow: 1, p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
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
              {userTokens} tokens available
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

      {/* Search Bar */}
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

      {/* Main Content */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.id}
            sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
            onClick={() => navigate(`/idea/${project.id}`)}
          >
            <CardMedia
              component="img"
              height="200"
              image={project.imageUrl || "https://via.placeholder.com/200"}
              alt={project.title}
            />
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "text.primary" }}
              >
                {project.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1 }}
              >
                {project.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  by {project.creatorId}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <IconButton
                  sx={{
                    color: votedIdeas.includes(project.id)
                      ? "text.disabled"
                      : "text.secondary",
                  }}
                  disabled={votedIdeas.includes(project.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(project.id);
                  }}
                >
                  <ThumbsUp />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {project.totalVotes}
                  </Typography>
                </IconButton>
                <IconButton
                  sx={{ color: "text.secondary" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/idea/${project.id}`);
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
