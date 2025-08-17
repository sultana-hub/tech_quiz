import React, { useState } from "react";
import { Modal, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Fade } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TermsAndConditionsModal = ({ open, handleClose }) => {
    const [accepted, setAccepted] = useState(false);
  
    const handleAccept = () => {
      setAccepted(true);
      alert("You have accepted the TechQuiz Terms & Conditions!");
      handleClose();
    };
  
    return (
      <Modal open={open} onClose={handleClose} closeAfterTransition keepMounted>
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 600 }, // Adjusted width for tech quiz
              bgcolor: "white",
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" align="center" gutterBottom sx={{ color: "#000033" }}>
              TechQuiz Terms & Conditions
            </Typography>
  
            <Typography variant="body2" align="center" color="text.secondary" paragraph>
              Please read our terms carefully before participating in TechQuiz.
            </Typography>
  
            {/* Terms Sections */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">1. General Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  TechQuiz is an online platform for testing technical knowledge. By participating, you agree to abide by these terms and conditions.
                </Typography>
              </AccordionDetails>
            </Accordion>
  
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">2. Participation Policy</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Participants must register with accurate information and adhere to fair play policies. Cheating or misuse may result in disqualification.
                </Typography>
              </AccordionDetails>
            </Accordion>
  
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">3. Scoring & Rewards</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Scores are calculated based on accuracy and speed. Rewards, if any, are subject to terms specified during quiz registration.
                </Typography>
              </AccordionDetails>
            </Accordion>
  
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">4. Privacy & Data Security</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We value your privacy. All personal data provided during registration is securely stored and used only for quiz-related purposes.
                </Typography>
              </AccordionDetails>
            </Accordion>
  
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                position: "sticky",
                bottom: 0,
                bgcolor: "white",
                py: 2,
              }}
            >
              <Button onClick={handleClose} color="error" variant="outlined">
                Close
              </Button>
              <Button onClick={handleAccept} sx={{ bgcolor: "#000033" }} variant="contained" disabled={accepted}>
                {accepted ? "Accepted" : "Accept"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    );
};
  
export default TermsAndConditionsModal;