import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
} from "@mui/material";
import axios from "axios";

const popularCuisines = [
  "North Indian",
  "South Indian",
  "Punjabi",
  "Bengali",
  "Gujarati",
  "Rajasthani",
  "Maharashtrian",
  "Kerala",
  "Hyderabadi",
];

const commonCookingTimes = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "1 hour",
  "1.5 hours",
  "2 hours",
  "2.5 hours",
  "3 hours",
  "> 3 hours",
];

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

const FormComponent: React.FC = () => {
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [mealType, setMealType] = useState("");
  const [apiResponse, setApiResponse] = useState("");

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = "https://ennathinna.ue.r.appspot.com";
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": "ennathinna",
        "Access-Control-Allow-Origin": "*",
      };
      const body = {
        cuisine: cuisine,
        cookingTime: cookingTime,
        mealType: "", // Replace with the actual meal type value
      };

      const response = await axios.post(url, body, { headers });
      console.log("API response:", response.data);

      // Set the API response text in the state
      setApiResponse(response.data);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ padding: "1rem" }}
    >
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          ennathinna
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          options={popularCuisines}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cuisine"
              variant="outlined"
              fullWidth
              size="small"
              value={cuisine}
              onChange={(event) => setCuisine(event.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          options={commonCookingTimes}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cooking Time"
              variant="outlined"
              fullWidth
              size="small"
              value={cookingTime}
              onChange={(event) => setCookingTime(event.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          options={mealTypes}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Meal Type"
              variant="outlined"
              fullWidth
              size="small"
              value={mealType}
              onChange={(event) => setMealType(event.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          onClick={handleFormSubmit}
        >
          Submit
        </Button>
      </Grid>
      {apiResponse && (
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            API Response: {apiResponse}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default FormComponent;
