import React, { useState } from 'react';
import axios from 'axios';
import AllListsArea from './AllListsArea';
import ListArea from './ListArea';

function App() {
  const [editItemUrl, setEditItemUrl] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [clickedList, setClickedList] = useState('');
  const [listItems, setListItems] = useState([]);

  function handleListClick(e) {
    let currListTitle = escape(e.target.textContent);

    if (currListTitle !== '') {
      axios.get('lists/' + currListTitle + '/items')
        .then((res) => {
          setClickedList(res.data.title);
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
        setItemTitle={setItemTitle}
        handleListClick={handleListClick}
      />
      <ListArea
        clickedList={clickedList}
        listItems={listItems}
        setListItems={setListItems}
        itemTitle={itemTitle}
        setItemTitle={setItemTitle}
        editItemUrl={editItemUrl}
        setEditItemUrl={setEditItemUrl}
      />
    </div>
  );
}

export default App;