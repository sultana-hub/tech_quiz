import React from "react";
import { Box, Container, Typography, Card, CardContent, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import QuizIcon from "@mui/icons-material/Quiz";
import GroupIcon from "@mui/icons-material/Group";
import VerifiedIcon from "@mui/icons-material/Verified";

const AboutUs = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?technology')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000033",
          textAlign: "center",
          mt: "15px",
          py: 10,
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
          About TechQuiz
        </Typography>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* Our Mission */}
        <Typography variant="h4" fontWeight="bold" align="center" mb={2}>
          Our Mission
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={4}>
          At TechQuiz, we aim to empower individuals to test and enhance their technical knowledge through engaging and challenging quizzes. Our platform fosters learning and growth in the tech community.
        </Typography>

        {/* Meet Our Team */}
        <Typography variant="h4" fontWeight="bold" align="center" mb={3}>
          Our Core Members
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { name: "Parveen Sultana", role: "Founder & Lead Developer", img: "assets/parveen.jpeg" },
            { name: "Yahya Mohammad", role: "Content Strategist", img: "assets/yahya.jpeg" },
            { name: "Haiqa Parveen", role: "UI/UX Designer", img: "assets/haiqa.jpeg" },
          ].map((person, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: "center", py: 3, borderRadius: 2, boxShadow: 3 }}>
                <Avatar src={person.img} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {person.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {person.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Why Choose Us? */}
        <Typography variant="h4" fontWeight="bold" align="center" mt={5} mb={3}>
          Why Choose TechQuiz?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { icon: <QuizIcon fontSize="large" />, title: "Engaging Quizzes", desc: "Our quizzes are designed to challenge and educate tech enthusiasts." },
            { icon: <GroupIcon fontSize="large" />, title: "Community Driven", desc: "Join a vibrant community of learners and tech professionals." },
            { icon: <VerifiedIcon fontSize="large" />, title: "Trusted Content", desc: "All quiz content is curated by experts to ensure accuracy." },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ textAlign: "center", p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2, color: "#000033" }}>{item.icon}</Box>
                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;