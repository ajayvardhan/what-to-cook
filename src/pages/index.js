import { graphql } from "gatsby";
import React from "react";
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import SEO from "./seo";

export default function WhatToCook({ data }) {
  const [allFood, setAllFood] = React.useState([]);
  const [vegFood, setVegFood] = React.useState([]);
  const [meatFood, setMeatFood] = React.useState([]);
  const [currentFood, setCurrentFood] = React.useState("");
  const [veg, setVeg] = React.useState(true);
  React.useEffect(() => {
    const foodData = data.allFoodCsv.nodes;
    const vegFoodData = foodData.filter((food) => food.meat === "FALSE");
    const meatFoodData = foodData.filter((food) => food.meat === "TRUE");
    setAllFood(foodData);
    setVegFood(vegFoodData);
    setMeatFood(meatFoodData);
    setCurrentFood(
      vegFoodData[Math.floor(Math.random() * vegFoodData.length)].name
    );
  }, [data]);
  const font = "'Bebas Neue', cursive";
  const theme = createTheme({
    typography: {
      fontFamily: font,
    },
  });
  const changeFood = (isVeg) => {
    const food = isVeg ? vegFood : meatFood;
    setCurrentFood(food[Math.floor(Math.random() * food.length)].name);
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
              <Button
                variant="contained"
                color="error"
                onClick={() => changeFood(veg)}
              >
                I don't like it
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="success"
                      checked={veg}
                      onChange={() => {
                        setVeg(!veg);
                        changeFood(!veg);
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Veg"
                />
              </FormGroup>
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
