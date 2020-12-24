import React, { useState } from 'react';
import axios from 'axios';
import AllListsArea from './AllListsArea';
import ListArea from './ListArea';

function App() {
  const [editItemUrl, setEditItemUrl] = useState('');
  const [itemName, setItemName] = useState('');
  const [clickedList, setClickedList] = useState('');
  const [listItems, setListItems] = useState([]);

  function handleListClick(e) {
    let currListName = escape(e.target.textContent);

    if (currListName !== '') {
      axios.get('lists/' + currListName + '/items')
        .then((res) => {
          setClickedList(res.data.name);
          if (res.data.items) {
            setListItems([...res.data.items]);
          }
        });
    }
  }

  
  

  return (
    <div className="App" style={{ paddingLeft: '1rem', zoom: '110%' }}>
      <h1>TodoApp</h1>
      <AllListsArea
        clickedList={clickedList}
        setClickedList={setClickedList}
        setListItems={setListItems}
        setEditItemUrl={setEditItemUrl}
        setItemName={setItemName}
        handleListClick={handleListClick}
      />
      <ListArea
        clickedList={clickedList}
        listItems={listItems}
        setListItems={setListItems}
        itemName={itemName}
        setItemName={setItemName}
        editItemUrl={editItemUrl}
        setEditItemUrl={setEditItemUrl}
      />
    </div>
  );
}

export default App;