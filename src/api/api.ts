import axios from "axios";

const API_URL = "https://ennathinna.ue.r.appspot.com";

export const postFormData = async ({
    cuisine,
    cookingTime,
    mealType,
    dietType
}: {
    cuisine: string | null;
    cookingTime: string | null;
    mealType: string | null;
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
        dietType: dietType || ""
    };

    return await axios.post(API_URL, body, { headers });
};

