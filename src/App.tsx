import React, { useState } from "react";

const Form: React.FC = () => {
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("success");
    // Call the API and handle the response
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Cuisine:
        <input
          type="text"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
      </label>
      <br />
      <label>
        Cooking Time:
        <input
          type="text"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
