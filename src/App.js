import React from 'react';
import './App.css';
import {Route, BrowserRouter as Router} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

class App extends React.Component {

  render() {
    return (
      <>
        <HelmetProvider>
          <Router>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Router>
        </HelmetProvider>
      </>
    );
  }

}

export default App;
