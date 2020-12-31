import React, { useState } from 'react';
import axios from 'axios';
import AllListsArea from './AllListsArea';
import ListArea from './ListArea';
import Container from 'react-bootstrap/Container';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


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

    <div className="App" >
      <h1 className="pl-5 pt-2 pb-2 bg-primary text-light">TodoApp</h1>
      <Container className="mt-5 " style={{maxWidth:'80rem'}} >
        <Row>
          <Col lg={6}  >
            <AllListsArea
              clickedList={clickedList}
              setClickedList={setClickedList}
              setListItems={setListItems}
              setEditItemUrl={setEditItemUrl}
              setItemTitle={setItemTitle}
              handleListClick={handleListClick}
            />
          </Col>
          <Col  lg={6} >
            <ListArea
              clickedList={clickedList}
              listItems={listItems}
              setListItems={setListItems}
              itemTitle={itemTitle}
              setItemTitle={setItemTitle}
              editItemUrl={editItemUrl}
              setEditItemUrl={setEditItemUrl}
            />
          </Col>
        </Row>

      </Container>

    </div>


  );
}

export default App;