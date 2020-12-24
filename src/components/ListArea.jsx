import React, { useState } from 'react';
import axios from 'axios';

function ListArea(props) {
  
  const [postItemUrl, setPostItemUrl] = useState('');
  

  function handleItemChange(e) {
    props.setItemName(e.target.value);
    setPostItemUrl(escape(props.clickedList));
  }

  function handleItemSubmit(e) {
    e.preventDefault();
    //add new item

    if (props.editItemUrl === '') {
      axios.post('lists/' + postItemUrl + '/items',
        {
          name: props.itemName
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          props.setListItems([...response.data.items]);
          props.setItemName('');
          setPostItemUrl('');
        });
    } else {

      axios.patch('lists/' + props.editItemUrl,
        {
          name: props.itemName
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          props.setListItems([...response.data[0].items]);
          props.setEditItemUrl('');
          props.setItemName('');
        });
    }
  }

  function handleEditItem(e) {
    handleItemChange(e);
    props.setEditItemUrl(escape(props.clickedList + "/items/" + e.target.value));
  }

  function handleDeleteItem(e) {
    let deleteItemUrl = escape(props.clickedList + "/items/" + e.target.value);
    //delete specific Item
    if (deleteItemUrl !== '') {
      axios.delete('lists/' + deleteItemUrl)
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          props.setListItems([...response.data.items]);
          props.setItemName('');
          props.setEditItemUrl('');
        });
    }
  }

  function handleDeleteAllItems() {

    axios.patch('lists/' + escape(props.clickedList) + '/items')
      .catch(function (error) {
        console.log(error);
      })
      .then((response) => {
        props.setListItems([...response.data.items]);
        props.setEditItemUrl('');
        props.setItemName('');
      });
  }
    return <div style={props.clickedList === '' ? { display: 'none' } : { display: 'block' }}>
      <h2>{props.clickedList}</h2>
      <ul>
        {props.listItems.map((item, index) => {

          return <li key={index} style={{ marginBottom: '1rem' }}> <span style={{ marginRight: '1rem' }}>{item.name}</span>
            <button value={item.name} onClick={handleEditItem}>edit</button>
            <button value={item.name} onClick={handleDeleteItem} >delete</button>
          </li>

        })}

      </ul>
      <form onSubmit={handleItemSubmit} style={{ marginBottom: '1rem' }}>
        <input type="text" onChange={handleItemChange} value={props.itemName} placeholder="add new item" />
        <button type="submit">+</button>
      </form>
      <button onClick={handleDeleteAllItems}> delete all items</button>
    </div>
  }

  export default ListArea;