import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [lists, setLists] = useState([]);

  axios({
    method: 'get',
    url: 'https://shrouded-journey-60588.herokuapp.com/'
  })
    .then((response) => {
      setLists(()=>{
        return [...response.data];
      });
    });

  return (
    <div className="App">
      <h1>TodoApp</h1>
      <ul>
        {lists.map((list, index) => {
          return <li key={index}>{list.name}</li>
        })}
      </ul>

    </div>
  );
}

export default App;
