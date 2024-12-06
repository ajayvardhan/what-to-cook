import React, { useCallback, useEffect, useState } from "react";
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
import { getRecipe, postFormData } from "../../api/api";

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
  const [availableIngredients, setavailableIngredients] = useState<string>("");
  const [dietType, setDietType] = useState<string>("vegetarian");
  const [dishName, setdishName] = useState<string>("");
  const [showDishContainer, setshowDishContainer] = useState<boolean>(false);
  const [recipe, setrecipe] = useState<string>("");
  const [showRecipeContainer, setshowRecipeContainer] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecipeLoading, setIsRecipeLoading] = useState<boolean>(false);
  const [advancedFiltersExpanded, setAdvancedFiltersExpanded] =
    React.useState(false);
  const getDish = useCallback(async () => {
    setIsLoading(true);

    const values = advancedFiltersExpanded
      ? {
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
          availableIngredients,
        }
      : {
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
          availableIngredients: null,
        };

    setshowDishContainer(true);
    setIsLoading(true);
    try {
      const response = await postFormData(values);
      const food = response.data.dishRecommendation;
      setdishName(food);

      // Tracking events
      // @ts-ignore
      window?.heap?.track("searchFoodResponse", { searchValues: values, food });
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
  }, [
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
    availableIngredients,
    advancedFiltersExpanded,
  ]);

  const reset = useCallback(() => {
    setdishName("");
    setrecipe("");
    setshowDishContainer(false);
    setshowRecipeContainer(false);
    setIsLoading(false);
    setIsRecipeLoading(false);
  }, []);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    reset();
    setshowDishContainer(true);
    //@ts-ignore
    window?.heap?.track("searchFoodSubmit");
    ReactGA.event({
      category: "Form",
      action: "Submit",
      label: "Search Dish",
    });
    await getDish();
  };

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    //@ts-ignore
    window?.heap?.track("viewPage", { location: window.location.pathname });

    // Initial API call
    getDish().catch((error) => console.error("API error:", error));
  }, [getDish]);

  const handleDietTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    const value = event.target.value;

    //@ts-ignore
    window?.heap?.track("changeDietType", { dietType: value });
    ReactGA.event({
      category: "Input",
      action: "change",
      label: "Diet Type",
      dimension1: value,
    });
    setDietType(value);
  };

  const handleDislike = async () => {
    reset();

    //@ts-ignore
    window?.heap?.track("changeFood", { food: dishName });
    ReactGA.event({
      category: "Food",
      action: "dislike",
      label: "Change Food",
    });
    await getDish();
  };

  const handleRecipeSearch = () => {
    //@ts-ignore
    window?.heap?.track("searchFoodRecipe", { food: dishName });
    ReactGA.event({
      category: "Food",
      action: "search",
      label: "Search Food",
      dimension1: dishName,
    });
    const searchUrl = `https://www.google.com/search?q=${dishName}+recipe`;
    window.open(searchUrl, "_blank");
  };

  const searchRecipe = async () => {
    setshowRecipeContainer(true);
    setIsRecipeLoading(true);
    try {
      const recipeResponse = await getRecipe(dishName);
      setrecipe(recipeResponse.data.recipe);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsRecipeLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="center"
        sx={{ padding: "2rem" }}
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
              reset();
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
              reset();
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
              reset();
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
            paddingBottom: "2rem",
          }}
        >
          <Button
            onClick={() => setAdvancedFiltersExpanded(!advancedFiltersExpanded)}
            size="small"
            sx={{ marginBotton: "1rem" }}
          >
            {advancedFiltersExpanded ? "Hide Filters" : "Advanced Filters"}
          </Button>
        </Grid>

        <Collapse in={advancedFiltersExpanded}>
          <Grid container spacing={5} justifyContent="center">
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginLeft: "2.5rem",
              }}
            >
              <TextField
                label="Available Ingredients"
                variant="outlined"
                sx={{ width: "75%" }}
                size="small"
                helperText="Comma separated list of available ingredients"
                value={availableIngredients}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  setavailableIngredients(inputValue);
                  if (inputValue === "") {
                    // Input value is empty, clear the state
                    setavailableIngredients("");
                  }
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ marginLeft: "2.5rem" }}
            >
              <Autocomplete
                multiple
                options={dietaryRestrictions}
                onChange={(event, values) => {
                  if (values) {
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ marginLeft: "2.5rem" }}
            >
              <Autocomplete
                options={flavorProfiles}
                onChange={(event, value) => {
                  reset();
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ marginLeft: "2.5rem" }}
            >
              <Autocomplete
                multiple
                options={allergies}
                onChange={(event, values) => {
                  if (values) {
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

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ marginLeft: "2.5rem" }}
            >
              <Autocomplete
                options={proteinContent}
                onChange={(event, value) => {
                  reset();
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ marginLeft: "2.5rem" }}
            >
              <Autocomplete
                options={carbohydrateContent}
                onChange={(event, value) => {
                  reset();
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

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ marginLeft: "2.5rem" }}
            >
              <Autocomplete
                options={fatContent}
                onChange={(event, value) => {
                  reset();
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
      </Grid>
      {showDishContainer && (
        <Grid container justifyContent="center" alignItems="center" padding={5}>
          <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card variant="outlined" sx={{ bgcolor: "#ffffff" }}>
              <CardContent>
                {isLoading ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress color="primary" />
                  </div>
                ) : (
                  <>
                    <Typography
                      align="center"
                      fontWeight="bold"
                      color={"#000000"}
                      fontSize={48}
                    >
                      {dishName}
                    </Typography>
                    {showRecipeContainer && (
                      <Grid
                        container
                        justifyContent="center"
                        sx={{
                          bgcolor: "#b0b0b0",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isRecipeLoading ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "2rem",
                            }}
                          >
                            <CircularProgress color="primary" />
                          </div>
                        ) : (
                          <Typography
                            align="center"
                            color="#000000"
                            fontSize={24}
                            padding={2}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {recipe}
                          </Typography>
                        )}
                      </Grid>
                    )}
                  </>
                )}
              </CardContent>
              <CardActions>
                <Grid container justifyContent="center" spacing={2}>
                  <Grid item>
                    <Button variant="contained" onClick={searchRecipe}>
                      Give me the recipe
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handleRecipeSearch}
                      color="warning"
                    >
                      Google Search
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handleDislike}
                      color="error"
                    >
                      I don't like this
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Typography align="center">Powered by OpenAI</Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Form;
