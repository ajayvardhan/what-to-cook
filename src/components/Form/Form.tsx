import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { postFormData } from "../../api/api";

const popularCuisines = [
  "Italian",
  "French",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "Thai",
  "Spanish",
  "Greek",
  "American",
  "Mediterranean",
  "Middle Eastern",
  "Korean",
  "Vietnamese",
  "Brazilian",
  "British",
  "German",
  "Russian",
  "African",
  "Caribbean",
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

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
    },
    primary: {
      main: "#0c8235",
    },
  },
  typography: {
    fontFamily: "Oswald, sans-serif",
  },
});

const Form: React.FC = () => {
  const [cuisine, setCuisine] = useState<string | null>(
    popularCuisines[Math.floor(Math.random() * popularCuisines.length)]
  );
  const [cookingTime, setCookingTime] = useState<string | null>(
    commonCookingTimes[Math.floor(Math.random() * commonCookingTimes.length)]
  );
  const [mealType, setMealType] = useState<string | null>(
    mealTypes[Math.floor(Math.random() * mealTypes.length)]
  );
  const [dietType, setDietType] = useState<string>("vegetarian");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDish = async () => {
    setIsLoading(true);
    try {
      const response = await postFormData({
        cuisine,
        cookingTime,
        mealType,
        dietType,
      });
      setApiResponse(response.data);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await getDish();
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    // Call the API with the assigned random values
    (async () => {
      try {
        await getDish();
      } catch (error) {
        console.error("API error:", error);
      }
    })();
  }, []);

  const handleDietTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDietType(event.target.value);
  };

  const handleDislike = async () => {
    await getDish();
  };

  const handleRecipeSearch = () => {
    const searchUrl = `https://www.google.com/search?q=${apiResponse}+recipe`;
    window.open(searchUrl, "_blank");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="center"
        style={{ padding: "5rem" }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            fontFamily={"Bungee Shade, cursive"}
          >
            Enna Thinna
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={popularCuisines}
            onChange={(event, value) => setCuisine(value)}
            defaultValue={cuisine}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cuisine"
                variant="outlined"
                fullWidth
                size="small"
                value={cuisine}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={commonCookingTimes}
            onChange={(event, value) => setCookingTime(value)}
            defaultValue={cookingTime}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cooking Time"
                variant="outlined"
                fullWidth
                size="small"
                value={cookingTime}
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            options={mealTypes}
            onChange={(event, value) => setMealType(value)}
            defaultValue={mealType}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Meal Type"
                variant="outlined"
                fullWidth
                size="small"
                value={mealType}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              name="dietType"
              value={dietType}
              onChange={handleDietTypeChange}
            >
              <FormControlLabel
                value="vegetarian"
                control={<Radio />}
                label="Vegetarian"
              />
              <FormControlLabel
                value="non-vegetarian"
                control={<Radio />}
                label="Non-Vegetarian"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: "20%" }}
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Grid>
        {apiResponse && (
          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{ bgcolor: "#adadad", cursor: "pointer" }}
            >
              <CardContent>
                {isLoading ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="primary" />
                  </div>
                ) : (
                  <Typography
                    align="center"
                    fontWeight="bold"
                    color={"#000000"}
                    fontSize={48}
                  >
                    {apiResponse}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Grid container justifyContent="center" spacing={2}>
                  <Grid item>
                    <Button variant="contained" onClick={handleRecipeSearch}>
                      🙌🏽
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={handleDislike}>
                      ❌
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default Form;
