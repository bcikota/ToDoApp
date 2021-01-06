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
  const [clickedListTitle, setClickedListTitle] = useState('');
  const [clickedListID, setClickedListID] = useState('');
  const [listItems, setListItems] = useState([]);

  function handleListClick(e) {
    let currListID = escape(e.target.name);
    setClickedListID(e.target.name);

    if (currListID !== '') {
      axios.get('lists/' + currListID + '/items')
        .then((res) => {
          setClickedListTitle(res.data.title);
          if (res.data.items) {
            setListItems([...res.data.items]);
          }
        });
    }
  }

  return (

    <div className="App" >
      <h1 className="pl-3 pl-lg-5 pt-2 pb-2 bg-primary text-light">TodoApp</h1>
      <Container className="mt-5" style={{maxWidth:'80rem'}} >
        <Row>
          <Col xl={6} style={{maxWidth:'40rem'}} >
            <AllListsArea
              clickedListTitle={clickedListTitle}
              setClickedListTitle={setClickedListTitle}
              setListItems={setListItems}
              setEditItemUrl={setEditItemUrl}
              setItemTitle={setItemTitle}
              handleListClick={handleListClick}
            />
          </Col>
          <Col  xl={6} style={{maxWidth:'40rem'}}>
            <ListArea
              clickedListTitle={clickedListTitle}
              listItems={listItems}
              setListItems={setListItems}
              itemTitle={itemTitle}
              setItemTitle={setItemTitle}
              editItemUrl={editItemUrl}
              setEditItemUrl={setEditItemUrl}
              clickedListID={clickedListID}
            />
          </Col>
        </Row>

      </Container>
      <footer className="mt-5 text-center p-4 p-xl-5 " style={{fontSize:'1.3rem', border:'3px solid lightBlue', color: 'gray'}}>Made by <a style={{ color: 'gray'}}  href="https://github.com/BogdanCikota">Bogdan Cikota</a></footer>

    </div>


  );
}

export default App;