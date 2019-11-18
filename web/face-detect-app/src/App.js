import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const URLAPI = `http://localhost:5000`

function App() {

  // eslint-disable-next-line
  const [data, setData] = useState([])
  // eslint-disable-next-line
  const [image, setImage] = useState('')

  const handleOnChange = event => {
    setImage(event.target.value)
  }

  const handleClickImage = async event => {
    event.preventDefault()
    console.log('click')
    try {
      const testImage = `https://www.elsiglodetorreon.com.mx/m/i/2019/10/1235159.jpeg`
      const fetchOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: image,
        })
      }

      const resp = await fetch(`${URLAPI}/create-facelist`, fetchOptions)
      const people = await resp.json()
      console.log(people.data)
      setData(people.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Upload a JPG image
        </p>
        <div className="containerFile">
          <input
            className="inputFile"
            placeholder="Upload image"
            onChange={handleOnChange}
          />
          <button
            className="buttonFile"
            onClick={handleClickImage}
          >
            Upload
          </button>
        </div>
        <h3 className="titleAtribute">Image attributes: </h3>
        <ul>
        {
          data.map(item => (
            <li key={item.faceId}>
              <span>
                Gender: {item.faceAttributes.gender}, age: {item.faceAttributes.age}
              </span>
            </li>
          ))
        }
        </ul>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch the image: {image}
        </a>
      </header>
    </div>
  );
}

export default App;
