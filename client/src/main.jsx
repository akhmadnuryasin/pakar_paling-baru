import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AnimationContextWrapper } from "./context/animation.jsx";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AnimationContextWrapper>
      <App />
    </AnimationContextWrapper>
  </Router>,
);
