import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const welcome = {
  greeting: "Hey",
  title: "React",
};

const App = () => {

  console.log('App Rerenders');

  const handleSearch = (event) => {
    console.log(event.target.value);
  }; 

  const stories = [
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

  return (
    <div>
      <h1>
        {welcome.greeting} {welcome.title}
      </h1>

      <Search onSearch={handleSearch}/>

      <hr />

      <List list={stories} />
    </div>
  );
};

const List = (props) => {
  console.log('List Rerenders');

  return(
  <ul>
    {props.list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
  );
};

const Item = (props) => (
  <li>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span>{props.item.author}</span>
    <span>{props.item.num_comments}</span>
    <span>{props.item.points}</span>
  </li>
);

const Search = (props) => {

  console.log('Search Rerenders');

  const[searchTerm, setSearchTerm]  = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    props.onSearch(event);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />

      <p>
        Searching for <strong>{searchTerm}</strong>.
      </p>
    </div>
  );
};

export default App;
