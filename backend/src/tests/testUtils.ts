import axios from 'axios';

// Base URL of your backend API
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend runs on a different port

// Fake user data generator
const generateFakeUser = (index: number) => ({
  email: `user${index}@test.com`,
  password: `password${index}`,
  displayName: `User ${index}`,
  photoURL: `https://i.pravatar.cc/150?img=${index}`,
});

// Fake idea data generator
const generateFakeIdea = (creatorId: string, index: number) => ({
  title: `Idea ${index}`,
  description: `This is a description for Idea ${index}. It's a great idea!`,
  category: ['technology', 'business', 'social', 'environment'][index % 4],
  tags: ['innovation', 'startup', 'sustainability'].slice(0, index % 3 + 1),
  imageUrl: `https://picsum.photos/200/300?random=${index}`,
  creatorId,
});

// Utility to create a user via API
const createUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error.response?.data || error.message);
    return null;
  }
};

// Utility to create an idea via API
const createIdea = async (ideaData: any, token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ideas`, ideaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating idea:', error.response?.data || error.message);
    return null;
  }
};

// Utility to log in a user and get a token
const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error logging in:', error.response?.data || error.message);
    return null;
  }
};

// Main function to populate the database with fake data
const populateDatabase = async () => {
  const NUM_USERS = 5; // Number of fake users to create
  const IDEAS_PER_USER = 3; // Number of fake ideas per user

  for (let i = 1; i <= NUM_USERS; i++) {
    // Create a user
    const userData = generateFakeUser(i);
    const user = await createUser(userData);

    if (user) {
      console.log(`Created user: ${user.email}`);

      // Log in the user to get a token
      const loginResponse = await loginUser(userData.email, userData.password);
      if (loginResponse && loginResponse.token) {
        const token = loginResponse.token;

        // Create ideas for the user
        for (let j = 1; j <= IDEAS_PER_USER; j++) {
          const ideaData = generateFakeIdea(user.uid, j);
          const idea = await createIdea(ideaData, token);

          if (idea) {
            console.log(`Created idea: ${idea.title} by ${user.email}`);
          }
        }
      }
    }
  }

  console.log('Database population complete!');
};

// Run the script
populateDatabase().catch((error) => {
  console.error('Error populating database:', error);
});