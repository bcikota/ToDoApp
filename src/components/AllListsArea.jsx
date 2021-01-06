import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';



function AllListsArea(props) {
  const [lists, setLists] = useState([]);
  const [listTitle, setListTitle] = useState('');

  const [editListUrl, setEditListUrl] = useState('');
  // axios.defaults.baseURL = 'http://localhost:8080/';
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
    if (editListUrl === '' && listTitle !== '') {
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
          props.setClickedListTitle('');
        });
    } else if (editListUrl !== '') {
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
          props.setClickedListTitle('');
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

        props.setClickedListTitle('');
        if (props.clickedListTitle === 'default list') {
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
    setEditListUrl(escape(e.target.name));
  }

  function handleDeleteList(e) {
    let deleteUrl = escape(e.target.name);
    if (deleteUrl !== '') {
      axios.delete('lists/' + deleteUrl)
        .catch(function (error) {
          console.log(error);
        })
        .then((response) => {
          setLists(() => {
            return [...response.data];
          });
          props.setClickedListTitle('');
          setListTitle('');
          setEditListUrl('');
          props.setItemTitle('');
          props.setEditItemUrl('');
        });
    }
  }

  return <div className="mb-4">
    <Accordion defaultActiveKey="0">
      <h2 className="d-inline-block mb-lg-4 bg-white text-secondary p-2 pl-4 pr-4 rounded">All Lists</h2>
      <Accordion.Toggle as={Button} variant="link" eventKey="0" className="d-lg-none">
        show/hide
      </Accordion.Toggle>
      <Accordion.Collapse className="mb-3" eventKey="0">
        <ListGroup>

          {lists.map((list, index) => {
            return <ListGroup.Item key={index}>


              <Row className="d-xl-none">
                <button onClick={props.handleListClick} name={list._id} className="btn btn-outline-none" style={{ textDecoration: 'underline', fontSize: '1.1rem', letterSpacing: '1px' }}>{list.title}</button>
              </Row>
              <Row>
                <Col className="d-none d-xl-block">
                  <button onClick={props.handleListClick} name={list._id} className="btn btn-outline-none" style={{ textDecoration: 'underline', fontSize: '1.1rem', letterSpacing: '1px' }}>{list.title}</button>
                </Col>
                <Col style={{ maxWidth: '10rem' }}>
                  {list.title !== 'Default list' &&
                    <button className="w-100 btn btn-outline-primary" name={list._id} value={list.title} onClick={handleEditList}>edit</button>}
                </Col>
                <Col style={{ maxWidth: '10rem' }}>
                  {list.title !== 'Default list' &&
                    <button className="w-100 btn btn-outline-primary" name={list._id} value={list.title} onClick={handleDeleteList} >delete</button>}
                </Col>
              </Row>
            </ListGroup.Item>
          })}
        </ListGroup>
      </Accordion.Collapse>
      <Accordion.Collapse className="mb-3 bg-white  p-3" eventKey="0">
        <form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col  >
              <input style={{ border: '1.5px solid lightBlue', fontSize: '1.1rem' }} className="w-100 mb-2 p-2" type="text" onChange={handleChange} value={listTitle} placeholder="add new list" />
            </Col>
            <Col className="d-none d-xl-block" xl={2}>
              <button className="btn btn-outline-primary w-100" type="submit">ok</button>
            </Col>
            <Col  className="d-none d-xl-block" xl={3}>
              <button className="btn btn-outline-primary" onClick={handleDeleteAllLists}> delete all lists</button>
            </Col>
          </Row>
          <Row className="d-xl-none ">
            <Col style={{ maxWidth: '10rem' }}>
              <button className="w-100 btn btn-outline-primary" type="submit">ok</button>
            </Col>
            <Col style={{ maxWidth: '10rem' }} >
              <button className="w-100 btn btn-outline-primary" onClick={handleDeleteAllLists}> delete all lists</button>
            </Col>
          </Row>


        </form>
      </Accordion.Collapse>

    </Accordion>






  </div>
}

export default AllListsArea;