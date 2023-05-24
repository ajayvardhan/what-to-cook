import React from "react";
import { Analytics } from "@vercel/analytics/react";
import Form from "./components/Form/Form";

const App: React.FC = () => {
  return (
    <div>
      <Form />
      <Analytics />
    </div>
  );
};

export default App;
