import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [lists, setLists] = useState([]); //read lists
  const [listName, setListName] = useState(''); //create & edit list
  const [clickedList, setClickedList] = useState('');
  const [listItems, setListItems] = useState([]); //read list items
  const [editListUrl, setEditListUrl] = useState('');
  const [isListClicked, setIsListClicked] = useState(false);
  const [itemName, setItemName] = useState('');
  const [postItemUrl, setPostItemUrl] = useState('');
  const [editItemUrl, setEditItemUrl] = useState('');


  axios.defaults.baseURL = 'https://shrouded-journey-60588.herokuapp.com/';

  useEffect(() => {
    //read lists
    axios.get('/')
      .then((response) => {
        setLists(() => {
          return [...response.data];
        });
      });
  }, []);

  function handleChange(e) {
    setListName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    //create list 
    if (editListUrl === '' && listName) {
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
          setListName('');
          setIsListClicked(false);
        });
    } else {
      //edit list
      axios.patch('lists/' + editListUrl,
        {
          name: listName
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          setLists(() => {
            return [...response.data];
          });
          setEditListUrl('');
          setListName('');
          setIsListClicked(false);
        });
    }
  }

  function handleDeleteAllLists() {
    //delete all lists
    axios.delete('/lists')
      .catch(function (error) {
        console.log(error);
      })
      .then((response) => {
        setLists(() => {
          return [...response.data];
        });

        setIsListClicked(false);
        if(clickedList === 'default list'){
          setListItems([...response.data[0].items]);
        }
        setListName('');
        setEditListUrl('');
      });
  }


  function handleListClick(e) {
    let currListName = escape(e.target.textContent);
    
    setIsListClicked(true);
    if(currListName !== ''){
      axios.get('lists/' + currListName + '/items')
      .then((res) => {
        setClickedList(res.data.name);
        if (res.data.items) {
          setListItems([...res.data.items]);
        }
      });
    }
  }

  function handleEditList(e) {
    handleChange(e);
    setEditListUrl(escape(e.target.value));
  }

  function handleDeleteList(e) {
    let deleteUrl = escape(e.target.value);
    if (deleteUrl !== '') {
      axios.delete('lists/' + deleteUrl)
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          setLists(() => {
            return [...response.data];
          });
          setIsListClicked(false);
          setListName('');
          setEditListUrl('');
        });
    }
  }

  function handleItemChange(e) {
    setItemName(e.target.value);
    setPostItemUrl(escape(clickedList));
  }

  function handleItemSubmit(e) {
    e.preventDefault();
    //add new item

    if (editItemUrl === '' ) {
      axios.post('lists/' + postItemUrl + '/items',
        {
          name: itemName
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          setListItems([...response.data.items]);
          setItemName('');
          setPostItemUrl('');
        });
    } else {
   
      axios.patch('lists/' + editItemUrl,
      {
        name: itemName
      })
      .catch(function (error) {
        console.log(error);
      })
      .then((response) => {
        setListItems([...response.data[0].items]);
        setEditItemUrl('');
        setItemName('');
      });
    }
  }

  function handleEditItem(e) {
    handleItemChange(e);
    setEditItemUrl(escape(clickedList+"/items/"+e.target.value));
  }

  function handleDeleteItem(e) {
    let deleteItemUrl = escape(clickedList+"/items/"+e.target.value);
    //delete specific Item
    if (deleteItemUrl !== '') {
      axios.delete('lists/' + deleteItemUrl)
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          setListItems([...response.data.items]);
          setItemName('');
          setEditItemUrl('');
        });
    }
  }

  function handleDeleteAllItems(){

    axios.patch('lists/' + escape(clickedList) + '/items')
      .catch(function (error) {
        console.log(error);
      })
      .then((response) => {
        setListItems([...response.data.items]);
        setEditItemUrl('');
        setItemName('');
      });
  }

  return (
    <div className="App" style={{paddingLeft: '1rem', zoom: '110%'}}>
      <h1>TodoApp</h1>

      <ul>
        {lists.map((list, index) => {
          return <li key={index} style={{ paddingBottom: '1rem' }}>
            <button onClick={handleListClick} style={{ marginRight: '1rem', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>{list.name}</button>

            {list.name !== 'default list' &&
              <button value={list.name} onClick={handleEditList}>edit</button>}
            {list.name !== 'default list' &&
              <button value={list.name} onClick={handleDeleteList} >delete</button>}

          </li>
        })}
      </ul>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input type="text" name="name" onChange={handleChange} value={listName} placeholder="add new list" />
        <button type="submit">ok</button>
      </form>
      <button onClick={handleDeleteAllLists}> delete all lists</button>
      <div style={isListClicked === false ? { display: 'none' } : { display: 'block' }}>
        <h2>{clickedList}</h2>
        <ul>
          {listItems.map((item, index) => {

            return <li key={index} style={{ marginBottom: '1rem' }}> <span style={{ marginRight: '1rem' }}>{item.name}</span>
              <button value={item.name} onClick={handleEditItem}>edit</button>
              <button value={item.name} onClick={handleDeleteItem} >delete</button>
            </li>

          })}
          
        </ul>
        <form onSubmit={handleItemSubmit} style={{ marginBottom: '1rem' }}>
            <input type="text" onChange={handleItemChange} value={itemName} placeholder="add new item" />
            <button type="submit">+</button>
          </form>
          <button onClick={handleDeleteAllItems}> delete all items</button>
      </div>
    </div>
  );
}

export default App;