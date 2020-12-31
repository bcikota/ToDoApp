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
          props.setClickedList('');
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

  return <div className="mb-4">
    <Accordion defaultActiveKey="0">
    <h2 className="d-inline-block mb-lg-4">All Lists</h2>
      <Accordion.Toggle as={Button} variant="link" eventKey="0" className="d-lg-none">
        show/hide
      </Accordion.Toggle>
      <Accordion.Collapse className="mb-3" eventKey="0">
        <ListGroup>

          {lists.map((list, index) => {
            return <ListGroup.Item key={index}>
              <div>
                <Row>
                  <Col >
                    <button onClick={props.handleListClick} className="btn btn-outline-none" style={{textDecoration:'underline', fontSize:'1.1rem'}}>{list.title}</button>
                  </Col>
                  <Col>
                    {list.title !== 'default list' &&
                      <button className="w-100 btn btn-outline-primary" value={list.title} onClick={handleEditList}>edit</button>}
                  </Col>
                  <Col>
                    {list.title !== 'default list' &&
                      <button className="w-100 btn btn-outline-primary" value={list.title} onClick={handleDeleteList} >delete</button>}
                  </Col>
                </Row>
              </div></ListGroup.Item>
          })}
        </ListGroup>
      </Accordion.Collapse>
      <Accordion.Collapse className="mb-3" eventKey="0">
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs={9}>
            <input style={{border:'1.5px solid lightGray', fontSize:'1.1rem'}} className="w-100 mb-2 p-2" type="text" onChange={handleChange} value={listTitle} placeholder="add new list" />
            </Col>
            <Col>
            <button className=" btn btn-primary p-2 pl-3 pr-3" type="submit">ok</button>
            </Col>
          </Row>
          
          
        </form>
      </Accordion.Collapse>
      <Accordion.Collapse eventKey="0">
        <button className="w-100 btn btn-outline-primary" onClick={handleDeleteAllLists}> delete all lists</button>
      </Accordion.Collapse>
    </Accordion>






  </div>
}

export default AllListsArea;