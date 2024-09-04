import { useState, useEffect, useRef, Button, act, useReducer } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
};

const initialStories = [
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

const moreStories = [
  {
    title: "React2",
    url: "http://reactjs.org/",
    author: "Michael LaCreta",
    num_comments: 3,
    points: 4,
    objectID: 2,
  },
];

const getAsyncStories = () =>
  new Promise((resolve, reject) => setTimeout(reject, 2000));

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [stories, dispatchStories] = useReducer(
    storiesReducer,
     {data: [], isLoading: false, isError:false});

  //const [isLoading, setIsLoading] = useState(false);
  //const [isError, setIsError] = useState(false);

  useEffect(() => {

    dispatchStories({type:'STORIES_FETCH_INIT'});
    
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCEESS',
          payload: result.data.stories,});
      })
      .catch(() =>  dispatchStories({type:'STORIES_FETCH_FAILURE'})
    );
  }, []);

  const handleRemoveStory = (item) => {
    dispatchStories({type:'REMOVE_STORY', payload: item});
  };
{/* 
  const handleAddStory = (item) => {
    const newStories2 = stories.concat(item);
    setStories(newStories2);
  };
  */}

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

{/*
      <button type="button" onClick={() => handleAddStory(moreStories)}>
        Add:
      </button>
      */}

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading.....</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  isFocused,
  type = "text",
  onInputChange,
  children,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
      />
    </>
  );
};

// note that 'autoFocus' is a shorthand for 'autoFocus=true'
// every attribute that is set to 'true' can use this shorthand

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
    onRemoveItem(item);
  };

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => handleRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

export default App;
