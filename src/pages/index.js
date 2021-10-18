import { graphql } from "gatsby";
import React from "react";
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function WhatToCook({ data }) {
  const [allFood, setAllFood] = React.useState([]);
  const [currentFood, setCurrentFood] = React.useState("");
  React.useEffect(() => {
    const foodData = data.allFoodCsv.nodes;
    setAllFood(foodData);
    setCurrentFood(foodData[Math.floor(Math.random() * foodData.length)].name);
  }, [data]);
  const font = "'Bebas Neue', cursive";
  const theme = createTheme({
    typography: {
      fontFamily: font,
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box mt={20}>
          <Grid
            container
            spacing={8}
            direction="column"
            alignItems="center"
            alignContent="center"
          >
            <Grid item xs={12}>
              <Typography variant="h4">{currentFood}</Typography>
            </Grid>
            <Grid item xs={4} alignItems="center" justifyContent="center">
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  window.open(
                    `https://www.google.com/search?q=${currentFood}+recipe`,
                    "_blank"
                  )
                }
              >
                I want to make this
              </Button>
            </Grid>
            <Grid item xs={4} alignItems="center" justifyContent="center">
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  setCurrentFood(
                    allFood[Math.floor(Math.random() * allFood.length)].name
                  )
                }
              >
                I don't like it
              </Button>
            </Grid>
            <Grid item xs={4} alignItems="center" justifyContent="center">
              <Button
                variant="contained"
                color="warning"
                onClick={() => {
                  const vegFood = allFood.filter(
                    (food) => food.meat === "false"
                  );
                  setAllFood(vegFood);
                  setCurrentFood(
                    vegFood[Math.floor(Math.random() * vegFood.length)].name
                  );
                }}
              >
                I don't eat meat
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export const IndexQuery = graphql`
  query {
    allFoodCsv {
      nodes {
        name
        meat
      }
    }
  }
`;
