import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  //---------Add CRUD for '/lists'-------
  const [lists, setLists] = useState([]);
  const [listName, setlistName] = useState('');

  axios.defaults.baseURL = 'https://shrouded-journey-60588.herokuapp.com/';

  useEffect(() => {
    axios.get('/')
      .then((response) => {
        setLists(() => {
          return [...response.data];
        });
      });
  }, []);

  function handleChange(e) {
    let targetValue = e.target.value;
    setlistName(targetValue);
  }

  function handleListSubmit(e) {
    e.preventDefault();

    axios.post(
      '/lists',
      {
        name: listName
      }
    )
    .then((response) => {
      setLists(() => {
        return [...response.data];
      });
      setlistName('');
    });
  }

  function handleDeleteAllLists() {
    axios.delete('/lists')
      .catch(function (error) {
        console.log(error);
      })
      .then((response) => {
        setLists(() => {
          return [...response.data];
        });
        setClickedList('');
        setListItems([]);
      });
  }
  //----END-----Add CRUD for '/lists'-------


  const [listUrl, setListUrl] = useState('');


  function handleListClick(e) {
    let listName = escape(e.target.textContent);
    setListUrl(listName);
    // setIsListClicked((prevValue) => !prevValue);
  }

  const [clickedList, setClickedList] = useState('');
  const [listItems, setListItems] = useState([]);
  

  

    useEffect(() => {
      axios.get('lists/' + listUrl)
        .then((res) => {
          setClickedList(res.data.name);
      if (res.data.items) {
        setListItems([...res.data.items])
      }
        });
    }, [listUrl]);

  return (
    <div className="App">
      <h1>TodoApp</h1>

      <ul>
        {lists.map((list, index) => {
          return <li key={index} onClick={handleListClick} >{list.name}</li>
        })}
      </ul>
      <form onSubmit={handleListSubmit}>
        <input type="text" name="name" onChange={handleChange} value={listName} />
        <button type="submit">add new list</button>
      </form>
      <button onClick={handleDeleteAllLists}> delete all lists</button>
      <div>
        <h2>{clickedList}</h2>
        <ul>
          {listItems.map((item, index) => {
            return <li key={index} >{item.name}</li>
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;