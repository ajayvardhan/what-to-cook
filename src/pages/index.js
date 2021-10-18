import { graphql } from "gatsby";
import React from "react";
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SEO from "./seo";

export default function WhatToCook({ data }) {
  const [allFood, setAllFood] = React.useState([]);
  const [vegFood, setVegFood] = React.useState([]);
  const [currentFood, setCurrentFood] = React.useState("");
  const [veg, setVeg] = React.useState(false);
  React.useEffect(() => {
    const foodData = data.allFoodCsv.nodes;
    const vegFoodData = foodData.filter((food) => food.meat === "FALSE");
    setAllFood(foodData);
    setVegFood(vegFoodData);
    setCurrentFood(foodData[Math.floor(Math.random() * foodData.length)].name);
  }, [data]);
  const font = "'Bebas Neue', cursive";
  const theme = createTheme({
    typography: {
      fontFamily: font,
    },
  });
  const changeFood = () => {
    const food = veg ? vegFood : allFood;
    setCurrentFood(food[Math.floor(Math.random() * food.length)].name);
  };
  const filterVeg = () => {
    setVeg(true);
    setCurrentFood(vegFood[Math.floor(Math.random() * vegFood.length)].name);
  };
  const filterMeat = () => {
    setVeg(false);
    setCurrentFood(allFood[Math.floor(Math.random() * allFood.length)].name);
  };
  return (
    <ThemeProvider theme={theme}>
      <SEO />
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
              <Typography textAlign="center" variant="h4">
                {currentFood}
              </Typography>
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
              <Button variant="contained" color="error" onClick={changeFood}>
                I don't like it
              </Button>
            </Grid>
            {veg ? (
              <Grid item xs={4} alignItems="center" justifyContent="center">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={filterMeat}
                >
                  I eat meat
                </Button>
              </Grid>
            ) : (
              <Grid item xs={4} alignItems="center" justifyContent="center">
                <Button variant="contained" color="warning" onClick={filterVeg}>
                  I don't eat meat
                </Button>
              </Grid>
            )}
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
