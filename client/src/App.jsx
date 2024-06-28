import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Diagnosa } from "./pages/Diagnosa";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/diagnosa" component={Diagnosa} />
      </Switch>
    </Router>
  );
};

export default App;
