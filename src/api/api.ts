import axios from "axios";

const API_URL = "https://ennathinna.ue.r.appspot.com";

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
}) => {
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": "ennathinna",
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
    };

    return await axios.post(API_URL, body, { headers });
};

