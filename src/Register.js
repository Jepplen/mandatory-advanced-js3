import React from 'react';
import './App.css';
import {Link, Redirect} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import axios from "axios";
import {updateToken} from "./store";

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
       user: {
         email: "",
         password: "",
       },
       token: "",
       existingUser: false,
       redirect: false,
       changeClass: false,
    }
  }

  onChange = (e) => {
    this.setState({
      existingUser: false,
      user:  {...this.state.user, [e.target.name]: e.target.value},
    });

  }

  onSubmit = (e) => {
    e.preventDefault();
    this.post();
  }

  post = () => {
    axios.post("http://3.120.96.16:3002/register", this.state.user)
    .then((response) => {
      return axios.post("http://3.120.96.16:3002/auth", this.state.user)
      .then((response) => {
        updateToken(response.data.token);
      })
      .catch((error) => {
        console.log(error);
      });
    })
    .then((response) => {
      this.setState({ redirect: true });
    })
    .catch((error) => {
      console.log(error);
      this.setState({ existingUser: true })
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
        this.delay(0.3)
      })
      .then((seconds) => {
        this.setState({ redirect: true });
      });
  }


  render() {
    if (this.state.redirect || this.state.token) {
      return <Redirect to="/" />
    }

    return (
      <main>
        <Helmet>
          <title>Register</title>
        </Helmet>
        <div className="logoTitle">
          <h1>Välkommen till ToDo || !ToDo</h1>
        </div>
        <div className="logoSlogan">
          <p className="logoText">Appen du alltid behöver...</p>
        </div>
        <div className={this.state.changeClass ?  "registerContent formAnimationOut" : "registerContent formAnimationIn"}>
          <h2>Register new account</h2>
          <form className="registerForm" onSubmit={this.onSubmit}>
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
            <button className="submitButton">Register</button>
          </form>
          <button className="registerButton" onClick={this.onChangeView}>Go back to login</button>
        </div>
        <div className="errorMessage" style={{height: "100px", widht: "100%"}}>
          { this.state.existingUser ? <p style={{color: "red"}}>Email is already in use</p> : null}
        </div>
      </main>
    );
  }

}

export default Register;
