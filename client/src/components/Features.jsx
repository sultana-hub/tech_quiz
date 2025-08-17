import { Box, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

const Features = () => {
  const cards = [
    { 
      title: "Practice Mode", 
      desc: "Try quizzes without affecting your score.", 
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png" 
    },
    { 
      title: "Leaderboard", 
      desc: "Compete with others and climb the ranks.", 
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
    },
    { 
      title: "Instant Feedback", 
      desc: "Get immediate results and explanations.", 
      img: "https://cdn-icons-png.flaticon.com/512/1903/1903226.png" 
    },
    { 
      title: "Multiple Categories", 
      desc: "Choose from different subjects to test your skills.", 
      img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png" 
    },
    { 
      title: "Track Progress", 
      desc: "Monitor your learning journey with stats & analytics.", 
      img: "https://cdn-icons-png.flaticon.com/512/4762/4762316.png" 
    },
    { 
      title: "Timed Quizzes", 
      desc: "Challenge yourself with countdown timers.", 
      img: "https://cdn-icons-png.flaticon.com/512/992/992700.png" 
    }
  ];

  return (
    <Box sx={{ mt: 6, maxWidth: "1200px", mx: "auto" }}>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                textAlign: "center", 
                borderRadius: 3, 
                boxShadow: 3, 
                height: "100%" 
              }}
            >
              <CardMedia
                component="img"
                image={card.img}
                alt={card.title}
                sx={{ width: 80, height: 80, objectFit: "contain", mx: "auto", mt: 2 }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>{card.title}</Typography>
                {card.desc.split(" ").slice(0, 6).join(" ") + (card.desc.split(" ").length > 6 ? "..." : "")}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;
