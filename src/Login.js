import React from 'react';
import './App.css';
import {Link, Redirect} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import axios from "axios";
import {updateToken} from "./store";

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {email: "", password: ""},
      token: "",
      redirect: false,
      redirectToRegister: false,
      classChange: false,
    }
  }

  onChange = (e) => {
    let value = e.target.value;
    this.setState({ user: {...this.state.user, [e.target.name]: value }});
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.post();
  }

  post = () => {
    axios.post("http://3.120.96.16:3002/auth", this.state.user)
    .then((response) => {
      updateToken(response.data.token);
    })
    .then((response) => {
      this.setState({redirect: true});
    })
    .catch((error) => {
      this.setState({ existingUser: true });
    });
  }

  delay = (seconds) => {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve(seconds);
      }, seconds * 1000);
    })
  }

  onChangeView = () => {
    this.setState({ changeClass: true });
    this.delay(0.3)
      .then((seconds) => {
        this.delay(0.1)
      })
      .then((seconds) => {
        this.setState({ redirectToRegister: true });
      });
  }


  render() {


    if(this.state.redirect || this.state.token) {
      return <Redirect to="/" />
    }

    if (this.state.redirectToRegister) {
      return <Redirect to="/register" />
    }



    return (
      <main>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <div className="logoTitle">
          <h1>Välkommen till ToDo || !ToDo</h1>
        </div>
        <div className="logoSlogan">
          <p className="logoText">Appen du alltid behöver...</p>
        </div>
        <div className={this.state.changeClass ?  "loginContent formAnimationOut" : "loginContent formAnimationIn"}>
          <h2>Login</h2>
          <form onSubmit={this.onSubmit}>
            <div className="inputContainer">
              <div className="labels">
                <label>Email:</label>
                <label>Password:</label>
              </div>
              <div className="inputs">
                <input type="email" name="email" onChange={this.onChange} value={this.state.email} />
                <input type="password" name="password" onChange={this.onChange} value={this.state.password} />
              </div>
            </div>
            <button type="submit" className="submitButton">Login</button>
          </form>
          <button className="registerButton" onClick={this.onChangeView}>Register new account</button>
        </div>
        <div className="errorMessage" style={{height: "100px", widht: "100%"}}>
        { this.state.existingUser ? <p style={{color: "red"}}>Email or Password incorrect</p> : null}
        </div>
      </main>
    );
  }

}

export default Login;
