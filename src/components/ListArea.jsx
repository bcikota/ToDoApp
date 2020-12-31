import React, { useState } from 'react';
import axios from 'axios';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


function ListArea(props) {

  const [postItemUrl, setPostItemUrl] = useState('');


  function handleItemChange(e) {
    props.setItemTitle(e.target.value);
    setPostItemUrl(escape(props.clickedList));
  }

  function handleItemSubmit(e) {
    e.preventDefault();
    //add new item

    if (props.editItemUrl === '' && postItemUrl !== '') {
      axios.post('lists/' + postItemUrl + '/items',
        {
          title: props.itemTitle
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          props.setListItems([...response.data.items]);
          props.setItemTitle('');
          setPostItemUrl('');
        });
    } else if (props.editItemUrl !== '') {

      axios.patch('lists/' + props.editItemUrl,
        {
          title: props.itemTitle
        })
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          props.setListItems([...response.data[0].items]);
          props.setEditItemUrl('');
          props.setItemTitle('');
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
          props.setItemTitle('');
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
        props.setItemTitle('');
      });
  }
  return <div style={props.clickedList === '' ? { display: 'none' } : { display: 'block' }}>
    <h2 className='mb-lg-4'>{props.clickedList}</h2>
    <ul className="list-group">

      <li className="list-group-item"
        style={props.listItems.length !== 0 ? { display: 'none' } : { display: 'block', height: '3rem' }}></li>

      {props.listItems.map((item, index) => {


        return <li className={index === 0 ? "border-top list-group-item" : "list-group-item"} key={index}>
          <Row>
            <Col >
              <span style={{ marginRight: '1rem', fontSize: '1.1rem' }}>{item.title}</span>
            </Col>
            <Col>
              <button className="w-100 btn btn-outline-primary" value={item.title} onClick={handleEditItem}>edit</button>
            </Col>
            <Col>
              <button className="w-100 btn btn-outline-primary" value={item.title} onClick={handleDeleteItem} >delete</button>
            </Col>
          </Row>
        </li>
      })}
    </ul>
    <form className="mt-2 mb-3" onSubmit={handleItemSubmit}>
      <Row>
        <Col xs={9}>
          <input style={{ border: '1.5px solid lightGray', fontSize: '1.1rem' }} type="text" className="w-100 p-2" onChange={handleItemChange} value={props.itemTitle} placeholder="add new item" />
        </Col>
        <Col>
          <button type="submit">+</button>
        </Col>
      </Row>


    </form>
    <button onClick={handleDeleteAllItems}> delete all items</button>
  </div>
}

export default ListArea;