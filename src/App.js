import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Editor from "./pages/Editor";

function App() {
  return (
    <Router>
      <Route component={Editor} path="/"></Route>
    </Router>
  );
}

export default App;
