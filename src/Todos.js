import React from 'react';
import './App.css';
import axios from "axios";
import {token$} from "./store";

class Todos extends React.Component {

  constructor(props) {
    super(props);
    this.state = { token: token$.value }
  }


  deleteTodo = (id) => {
    axios.delete("http://3.120.96.16:3002/todos/" + id, {
      headers: {
          Authorization: "Bearer " + this.state.token,
        },
      })
      .then((response) => {
        this.props.getTodos();
      })
      .catch((error) => {
        console.log("ERROR: " + error);
      });
    }

  render() {
    return (
        <ul>
          { this.props.todos.map((item) =>
            <li key={item.id}>{item.content}<button onClick={() => this.deleteTodo(item.id)}>Remove</button></li>
          )}
        </ul>
    );
  }
}

export default Todos;
