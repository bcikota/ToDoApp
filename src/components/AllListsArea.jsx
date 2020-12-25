import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AllListsArea(props) {
  const [lists, setLists] = useState([]);
  const [listTitle, setListTitle] = useState('');
  
  const [editListUrl, setEditListUrl] = useState('');
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
    setListTitle(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    //create list 
    if (editListUrl === '' && listTitle) {
      axios.post(
        '/lists',
        {
          title: listTitle
        }
      )
        .then((response) => {
          setLists(() => {
            return [...response.data];
          });
          setListTitle('');
          props.setClickedList('');
        });
    } else {
      //edit list
      axios.patch('lists/' + editListUrl,
        {
          title: listTitle
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          setLists(() => {
            return [...response.data];
          });
          setEditListUrl('');
          setListTitle('');
          props.setClickedList('');
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

        props.setClickedList('');
        if (props.clickedList === 'default list') {
          props.setListItems([...response.data[0].items]);
        }
        setListTitle('');
        setEditListUrl('');
        props.setEditItemUrl('');
        props.setItemTitle('');
      });
      
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
          props.setClickedList('');
          setListTitle('');
          setEditListUrl('');
        });
    }
  }

    return <div>
      <ul>
        {lists.map((list, index) => {
          return <li key={index} style={{ paddingBottom: '1rem' }}>
            <button onClick={props.handleListClick} style={{ marginRight: '1rem', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>{list.title}</button>

            {list.title !== 'default list' &&
              <button value={list.title} onClick={handleEditList}>edit</button>}
            {list.title !== 'default list' &&
              <button value={list.title} onClick={handleDeleteList} >delete</button>}

          </li>
        })}
      </ul>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input type="text" onChange={handleChange} value={listTitle} placeholder="add new list" />
        <button type="submit">ok</button>
      </form>
      <button onClick={handleDeleteAllLists}> delete all lists</button>
    </div>
  }

  export default AllListsArea;