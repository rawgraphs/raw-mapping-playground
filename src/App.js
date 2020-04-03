import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Editor from "./pages/Editor";
import { PipelineProvider } from "./state";

function App() {
  return (
    <PipelineProvider>
      <Router>
        <Route component={Editor} path="/"></Route>
      </Router>
    </PipelineProvider>
  );
}

export default App;
