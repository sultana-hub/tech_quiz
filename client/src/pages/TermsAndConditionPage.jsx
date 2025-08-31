import React, { useState } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Container,
    Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
const TermsAndConditionsPage = () => {
    const navigate = useNavigate()
    const [accepted, setAccepted] = useState(false);
    const token = sessionStorage.getItem('token');
    const handleAccept = () => {
        setAccepted(true);
        Swal.fire({
            title: 'Good job!',
            text: ' You have accepted the TechQuiz Terms & Conditions!',
            icon: 'success',
        });
        if (token) {
            navigate('/startQuiz')
        }
        else {
            alert("opps something went wrong!")
        }
    };

    // const navigateToStartQuiz = () => {
    //     if (token) {
    //         navigate('/startQuiz')
    //     }
    //     else {
    //         alert("opps something went wrong!")
    //     }
    // }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 3, sm: 5 },
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #f8faff, #ffffff)",
                }}
            >
                {/* Title */}
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ color: "#000033", fontWeight: "bold" }}
                >
                    TechQuiz Terms & Conditions
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    paragraph
                >
                    Please read our terms carefully before participating in TechQuiz.
                </Typography>

                {/* Sections */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">1. General Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            TechQuiz is an online platform for testing technical knowledge.
                            By participating, you agree to abide by these terms and
                            conditions.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">2. Participation Policy</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Participants must register with accurate information and adhere
                            to fair play policies. Cheating or misuse may result in
                            disqualification.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">3. Scoring & Rewards</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Scores are calculated based on accuracy and speed. Rewards, if
                            any, are subject to terms specified during quiz registration.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">4. Privacy & Data Security</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            We value your privacy. All personal data provided during
                            registration is securely stored and used only for quiz-related
                            purposes.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Accept Button */}
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                        onClick={handleAccept}
                        variant="contained"
                        sx={{ bgcolor: "#000033", px: 4, py: 1.2, borderRadius: 2 }}
                        disabled={accepted}

                    >
                        {accepted ? "✅ Accepted" : "Accept Terms"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default TermsAndConditionsPage;
