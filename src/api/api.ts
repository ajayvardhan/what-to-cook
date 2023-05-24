import axios from "axios";

const API_URL = "https://ennathinna.ue.r.appspot.com";

export const postFormData = async ({
    cuisine,
    cookingTime,
    mealType,
}: {
    cuisine: string | null;
    cookingTime: string | null;
    mealType: string | null;
}) => {
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": "ennathinna",
    };
    const body = {
        cuisine: cuisine || "",
        cookingTime: cookingTime || "",
        mealType: mealType || "",
    };

    return await axios.post(API_URL, body, { headers });
};

