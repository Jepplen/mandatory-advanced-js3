import React from 'react';
import './App.css';
import {Redirect} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {token$, updateToken} from "./store";
import jwt from "jsonwebtoken";
import axios from "axios";
import Todos from "./Todos";

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      todos: [],
      redirect: false,
      todo: "",
      token: token$.value,
    }
    this.getUserHasRun = false;
  }

  componentDidMount(){
    this.subscription = token$.subscribe((token) => this.setState({ token }));
    if (this.state.token) {
      this.getUser();
      this.getTodos();
    }
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
    this.getUserHasRun = false;
  }

  getUser = () => {
      const decoded = jwt.decode(token$.value);
      this.setState({ user: decoded});
  }

  getTodos = () => {
    axios.get("http://3.120.96.16:3002/todos", {
      headers: {
          Authorization: "Bearer " + this.state.token,
        },
      })
      .then((response) => {
        this.setState({todos: response.data.todos})
      })
      .catch((error) => {
        console.log("ERROR: " + error);
      });
  }

  postTodos = (todo) => {
    axios.post("http://3.120.96.16:3002/todos", todo,
    { headers: {
        Authorization: "Bearer " + this.state.token,
      },
    });
  }

  onChange = (e) => {
    this.setState({todo: e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();
    let todo = {
      content: this.state.todo,
    }
    new Promise((resolve, reject) => {
      this.postTodos(todo);
      resolve();
    })
    .then((response) => {
      this.getTodos();
    })
    .then((response) => {
      this.setState({ todo: "" });
    })
    .catch((error) => {
      console.error("ERROR: " + error);
    });
  }

  onClick = () => {
    updateToken(null);
    this.setState({ redirect: true});
  }


  render() {
    if(this.state.redirect || !this.state.token) {
      this.setState({redirect: false});
      return <Redirect to="/login" />
    }

      return (
        <main>
          <Helmet>
            <title>Todo Home</title>
          </Helmet>
          <div className="todoContent">
            <p>{this.state.user.email}</p>
            <button onClick={this.onClick}>Logout</button>
            <form onSubmit={this.onSubmit}>
              <label>
              New Todo
              <input type="text" value={this.state.todo} onChange={this.onChange} />
              <button>Add</button>
              </label>
            </form>
            <Todos todos={this.state.todos} getTodos={this.getTodos} />
          </div>
        </main>
      );
  }
}

export default Home;
