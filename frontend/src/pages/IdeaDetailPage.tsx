import { useParams } from 'react-router-dom';
import { ThumbsUp, MessageCircle } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "Eco-Friendly Water Bottle",
    description: "A sustainable water bottle that's completely biodegradable.",
    creator: "Alex Green",
    votes: 45,
    commentCount: 12,
    createdAt: "2024-01-15",
    imageUrl: "https://via.placeholder.com/600x400", // Example image URL
    details: "This water bottle is made from 100% biodegradable materials, making it an eco-friendly alternative to plastic bottles. It's designed to decompose within 6 months after disposal.",
  },
  {
    id: 2,
    title: "Local Food Delivery App",
    description: "Connect local restaurants directly with customers, cutting out the middleman.",
    creator: "Sarah Chen",
    votes: 28,
    commentCount: 8,
    createdAt: "2024-01-20",
    imageUrl: "https://via.placeholder.com/600x400", // Example image URL
    details: "This app connects local restaurants with customers, allowing them to order directly without third-party fees. It also supports local farmers by sourcing ingredients locally.",
  }
];

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>by {project.creator}</span>
          <span>•</span>
          <span>{project.createdAt}</span>
        </div>

        {/* Image */}
        {project.imageUrl && (
          <div className="mb-6">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 mb-6">{project.description}</p>

        {/* Detailed Description */}
        <p className="text-gray-700 mb-6">{project.details}</p>

        {/* Voting and Comments */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
            <ThumbsUp className="w-5 h-5" />
            <span>{project.votes} votes</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <MessageCircle className="w-5 h-5" />
            <span>{project.commentCount} comments</span>
          </button>
        </div>
      </div>
    </div>
  );
}