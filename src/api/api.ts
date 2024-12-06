import axios from "axios";


export const postFormData = async ({
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
}: {
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
    availableIngredients: string | null,
}) => {
    const API_URL = process.env.REACT_APP_API_URL as string;
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY,
    };
    const body = {
        cuisine: cuisine || "",
        cookingTime: cookingTime || "",
        mealType: mealType || "",
        dietaryRestriction: dietaryRestriction || "",
        flavorProfile: flavorProfile || "",
        allergy: allergy || "",
        protein: protein || "",
        carbohydrate: carbohydrate || "",
        fat: fat || "",
        dietType: dietType || "",
        availableIngredients: availableIngredients || "",
    };

    return await axios.post(`${API_URL}/recommend-dish`, body, { headers });
};


export const getRecipe = async (dish: string) => {
    const API_URL = process.env.REACT_APP_API_URL as string;
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY,
    };
    const body = { dish };

    return await axios.post(`${API_URL}/recipe`, body, { headers });
};

