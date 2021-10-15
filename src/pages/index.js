import { graphql } from "gatsby";
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function WhatToCook({ data }) {
  const foodData = data.allFoodCsv.nodes;
  const random = Math.floor(Math.random() * foodData.length);
  const [currentFood, setCurrentFood] = React.useState(
    foodData[random].TranslatedRecipeName
  );
  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {currentFood}
        </Typography>
        <Button
          onClick={() => setCurrentFood(foodData[random].TranslatedRecipeName)}
        >
          Change
        </Button>
      </Box>
    </Container>
  );
}

export const IndexQuery = graphql`
  query {
    allFoodCsv {
      nodes {
        TranslatedRecipeName
        Diet
      }
    }
  }
`;
