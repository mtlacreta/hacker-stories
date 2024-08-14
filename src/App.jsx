import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const welcome = {
  greeting: "Hey",
  title: "React",
};

const list1 = [
  {
    title: "React",
    url: "http://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "http://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const list2 = [
  {
    title: "Me",
    url: "http://reactjs.org/",
    author: "Michael LaCreta",
    num_comments: 5,
    points: 6,
    objectID: 0,
  },
  {
    title: "Not Me",
    url: "http://redux.js.org/",
    author: "Yo LaCreta",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const App = () => {
  return (
    <div>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <Search />

      <hr />

      <List list={list1} />
      <List list={list2} />
    </div>
  );
};

const List = (props) => (
    <ul>
        {props.list.map((item) => {
          return (
            <li key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
            </li>
          );
        })}
      </ul>
);

const Search = () => (
    <div>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" />
    </div>
);

export default App;
