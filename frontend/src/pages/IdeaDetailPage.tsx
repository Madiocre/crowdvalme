import { useParams } from "react-router-dom";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useIdeas } from "../hooks/useIdeas";

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { idea, loading, error } = useIdeas(id!);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!idea) return <Typography>Idea not found</Typography>;

  return (
    <Box sx={{ flex: 1, p: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            {idea.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "text.secondary", mb: 4 }}>
            <Typography variant="body2">by {idea.userId}</Typography>
            <Typography variant="body2">•</Typography>
            <Typography variant="body2">{idea.createdAt.toLocaleDateString()}</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {idea.description}
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ThumbsUp />
              <Typography variant="body2">{idea.voteCount} votes</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MessageCircle />
              <Typography variant="body2">{idea.commentCount || 0} comments</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}