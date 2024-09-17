import { useState, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
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
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    case 'EDIT_STORY': {
        const newList = state.data.map((item) => {
          if (item.objectID === action.payload.objectID) {
            const updatedItem = {
              ...item,
              title: action.payload.title,
            };
  
            return updatedItem;
          }
  
          return item;
        });
  
        return { ...state, data: newList };
    }
    case "ADD_STORY":
      return {
        ...state,
        data: state.data.concat({
          url: "Add Story",
          title: action.payload.title,
          author: "LaCreta",
          num_comments: "3",
          points: 2,
          objectID: Math.random(),
        }),
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [addTerm, setAddTerm] = useStorageState("add", "");
  const [editTerm, setEditTerm] = useStorageState("edit", "");


  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    if (!searchTerm) return;

    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleAddStory = (item) => {
    dispatchStories({ type: "ADD_STORY", payload: item });
  };

  const handleRemoveStory = (item) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  };

  const handleEditStory = (item) => {
    dispatchStories({ type: "EDIT_STORY", payload: item })
  }

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddInput = (event) => {
    setAddTerm(event.target.value);
  };

  const handleEditInput = (event) => {
    setEditTerm(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="add"
        value={addTerm}
        isFocused={false}
        onInputChange={handleAddInput}
      >
        <strong>Add Story:</strong>
      </InputWithLabel>

      <button
        type="submit"
        disabled={!addTerm}
        onClick={() => handleAddStory({ title: addTerm })}
      >
        Add Story
      </button>

      <InputWithLabel
        id="edit"
        value={editTerm}
        isFocused={false}
        onInputChange={handleEditInput}
      >
        <strong>Edit Story:</strong>
      </InputWithLabel>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading.....</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} onEditItem={handleEditStory} editTerm={editTerm} />
      )}
    </div>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button type="button" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

const InputWithLabel = ({
  id,
  value,
  isFocused,
  type = "text",
  onInputChange,
  children,
}) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        autoFocus={isFocused}
        id={id}
        type={type}
        onChange={onInputChange}
        value={value}
      />
    </>
  );
};

const List = ({ list, onRemoveItem, onEditItem, editTerm }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} onEditItem={onEditItem} editTerm={editTerm} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem, onEditItem, editTerm }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
      <span>
      <button
        type="button"
        onClick={() => onEditItem({...item, title: editTerm})}
      >
        Edit
      </button>
      </span>
    </li>
  );
};

export default App;
