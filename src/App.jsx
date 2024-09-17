import { useState, useEffect, useRef, Button, act, useReducer, useCallback } from "react";
import axios from "axios";

import { List } from './List';
import { SearchForm } from './SearchForm'

import "./App.css";

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
};

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

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = useReducer(
    storiesReducer,
     {data: [], isLoading: false, isError:false});

  const handleFetchStories = useCallback(async () => {

    if(!searchTerm) return;

    dispatchStories({type:'STORIES_FETCH_INIT'});
    try{
    const result = await axios.get(url);
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits});
        }catch{ dispatchStories({type:'STORIES_FETCH_FAILURE'})}
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  },[handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({type:'REMOVE_STORY', payload: item});
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading.....</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;

