import React, { useEffect, useState } from "react";
import ReactGA from "react-ga";
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
  Collapse,
} from "@mui/material";
import {
  popularCuisines,
  commonCookingTimes,
  mealTypes,
  dietaryRestrictions,
  flavorProfiles,
  allergies,
  proteinContent,
  carbohydrateContent,
  fatContent,
} from "./constants";
import { postFormData } from "../../api/api";

ReactGA.initialize("G-TT6N74JHVL");

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
  const [dietaryRestriction, setdietaryRestriction] = useState<string | null>(
    dietaryRestrictions[Math.floor(Math.random() * dietaryRestrictions.length)]
  );
  const [flavorProfile, setflavorProfile] = useState<string | null>(
    flavorProfiles[Math.floor(Math.random() * flavorProfiles.length)]
  );
  const [allergy, setallergy] = useState<string | null>(
    allergies[Math.floor(Math.random() * allergies.length)]
  );
  const [protein, setprotein] = useState<string | null>(
    proteinContent[Math.floor(Math.random() * proteinContent.length)]
  );
  const [carbohydrate, setcarbohydrate] = useState<string | null>(
    carbohydrateContent[Math.floor(Math.random() * carbohydrateContent.length)]
  );
  const [fat, setfat] = useState<string | null>(
    fatContent[Math.floor(Math.random() * fatContent.length)]
  );
  const [dietType, setDietType] = useState<string>("vegetarian");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advancedFiltersExpanded, setAdvancedFiltersExpanded] =
    React.useState(false);
  const getDish = async () => {
    setIsLoading(true);

    let values: {
      cuisine: string | null;
      cookingTime: string | null;
      mealType: string | null;
      dietaryRestriction: string | null;
      flavorProfile: string | null;
      allergy: string | null;
      protein: string | null;
      carbohydrate: string | null;
      fat: string | null;
      dietType: string | null;
    };

    if (advancedFiltersExpanded) {
      values = {
        cuisine,
        cookingTime,
        mealType,
        dietaryRestriction,
        flavorProfile,
        allergy,
        protein,
        carbohydrate,
        fat,
        dietType,
      };
    } else {
      values = {
        cuisine,
        cookingTime,
        mealType,
        dietaryRestriction: null,
        flavorProfile: null,
        allergy: null,
        protein: null,
        carbohydrate: null,
        fat: null,
        dietType,
      };
    }
    try {
      const response = await postFormData(values);
      const food = response.data.replace(/[^a-zA-Z0-9 ]/g, "");
      setApiResponse(food);
      // @ts-ignore
      window.heap.track("searchFoodResponse", { food });
      ReactGA.event({
        category: "Food",
        action: "response",
        label: "Search Dish",
        dimension1: food,
      });
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // @ts-ignore
    window.heap.track("searchFoodSubmit");
    ReactGA.event({
      category: "Form",
      action: "Submit",
      label: "Search Dish",
    });
    try {
      await getDish();
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    // @ts-ignore
    window.heap.track("viewPage", { location: window.location.pathname });

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
    // @ts-ignore
    window.heap.track("changeDietType", { dietType: event.target.value });
    ReactGA.event({
      category: "Input",
      action: "change",
      label: "Diet Type",
      dimension1: event.target.value,
    });
    setDietType(event.target.value);
  };

  const handleDislike = async () => {
    // @ts-ignore
    window.heap.track("changeFood", { food: apiResponse });
    ReactGA.event({
      category: "Food",
      action: "dislike",
      label: "Change Food",
    });
    await getDish();
  };

  const handleRecipeSearch = () => {
    // @ts-ignore
    window.heap.track("searchFoodRecipe", { food: apiResponse });
    ReactGA.event({
      category: "Food",
      action: "search",
      label: "Search Food",
      dimension1: apiResponse,
    });
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={popularCuisines}
            onChange={(event, value) => {
              // @ts-ignore
              window.heap.track("changeCuisine", { cuisine: value });
              ReactGA.event({
                category: "Input",
                action: "change",
                label: "Cuisine",
                dimension1: value as string,
              });
              setCuisine(value);
            }}
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={commonCookingTimes}
            onChange={(event, value) => {
              // @ts-ignore
              window.heap.track("changeCookingTime", { cookingTime: value });
              ReactGA.event({
                category: "Input",
                action: "change",
                label: "Cooking Time",
                dimension1: value as string,
              });
              setCookingTime(value);
            }}
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
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Autocomplete
            options={mealTypes}
            onChange={(event, value) => {
              // @ts-ignore
              window.heap.track("changeMealType", { mealType: value });
              ReactGA.event({
                category: "Input",
                action: "change",
                label: "Meal Type",
                dimension1: value as string,
              });
              setMealType(value);
            }}
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
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "1rem",
          }}
        >
          <Button
            onClick={() => setAdvancedFiltersExpanded(!advancedFiltersExpanded)}
            size="small"
            sx={{ marginTop: "1rem" }}
          >
            {advancedFiltersExpanded ? "Hide Filters" : "Advanced Filters"}
          </Button>
        </Grid>

        <Collapse in={advancedFiltersExpanded}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                multiple
                options={dietaryRestrictions}
                onChange={(event, values) => {
                  if (values) {
                    console.log(values);
                    // @ts-ignore
                    window.heap.track("dietaryRestriction", {
                      dietaryRestriction: values,
                    });
                    ReactGA.event({
                      category: "Input",
                      action: "change",
                      label: "dietaryRestriction",
                      dimension1: values.join(", ") as string,
                    });
                    setdietaryRestriction(values.join(", "));
                  }
                }}
                defaultValue={[dietaryRestriction]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Dietary Restriction"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={dietaryRestriction}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                options={flavorProfiles}
                onChange={(event, value) => {
                  // @ts-ignore
                  window.heap.track("changeFlavorProfile", {
                    flavorProfile: value,
                  });
                  ReactGA.event({
                    category: "Input",
                    action: "change",
                    label: "Flavor Profile",
                    dimension1: value as string,
                  });
                  setflavorProfile(value);
                }}
                defaultValue={flavorProfile}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Flavor Profile"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={flavorProfile}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                multiple
                options={allergies}
                onChange={(event, values) => {
                  if (values) {
                    console.log(values);
                    // @ts-ignore
                    window.heap.track("allergies", {
                      dietaryRestriction: values,
                    });
                    ReactGA.event({
                      category: "Input",
                      action: "change",
                      label: "allergies",
                      dimension1: values.join(", ") as string,
                    });
                    setallergy(values.join(", "));
                  }
                }}
                defaultValue={[allergy]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Allergies"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={allergy}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                options={proteinContent}
                onChange={(event, value) => {
                  // @ts-ignore
                  window.heap.track("changeproteinContent", { protein: value });
                  ReactGA.event({
                    category: "Input",
                    action: "change",
                    label: "Protein",
                    dimension1: value as string,
                  });
                  setprotein(value);
                }}
                defaultValue={protein}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Protein"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={protein}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                options={carbohydrateContent}
                onChange={(event, value) => {
                  // @ts-ignore
                  window.heap.track("changecarbohydrateContent", {
                    carbohydrate: value,
                  });
                  ReactGA.event({
                    category: "Input",
                    action: "change",
                    label: "Carbs",
                    dimension1: value as string,
                  });
                  setcarbohydrate(value);
                }}
                defaultValue={carbohydrate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Carbs"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={carbohydrate}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                options={fatContent}
                onChange={(event, value) => {
                  // @ts-ignore
                  window.heap.track("changefatContent", { fat: value });
                  ReactGA.event({
                    category: "Input",
                    action: "change",
                    label: "Fat",
                    dimension1: value as string,
                  });
                  setfat(value);
                }}
                defaultValue={fat}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fat"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={fat}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Collapse>
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
          <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card
              variant="outlined"
              sx={{ bgcolor: "#ffffff", cursor: "pointer" }}
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
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Typography align="center">Powered by OpenAI</Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Form;
