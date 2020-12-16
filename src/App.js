import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  //---------Add CRUD for '/lists'-------
  const [lists, setLists] = useState([]);
  const [listName, setlistName] = useState('');
  const [listChange, setListChange] = useState(false);
  
  axios.defaults.baseURL = 'https://shrouded-journey-60588.herokuapp.com/';

  useEffect(() => {
    axios.get('/')
      .then((response) => {
        setLists(() => {
          return [...response.data];
        });
      });
  }, [listChange]);

  function handleChange(e) {
    let targetValue = e.target.value;
    setlistName(targetValue);
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios.post(
      '/lists',
      {
        name: listName
      }
    )
    .then(function () {
      setListChange((prevValue)=>!prevValue);
      setlistName('');
    });
  }

  function handleDeleteAllLists(){
    axios.delete('/lists')
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      setListChange((prevValue)=>!prevValue);
    });
  }
  //----END-----Add CRUD for '/lists'-------

  return (
    <div className="App">
      <h1>TodoApp</h1>

      <ul>
        {lists.map((list, index) => {
          return <li key={index}>{list.name}</li>
        })}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" onChange={handleChange} value={listName} />
        <button type="submit">add new list</button>
      </form>
        <button onClick={handleDeleteAllLists}> delete all lists</button>
    </div>
  );
}

export default App;
