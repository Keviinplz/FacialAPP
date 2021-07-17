import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { w3cwebsocket as WebSocket } from 'websocket';
import './App.css';

function App() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = '/api';
  const client = new WebSocket('ws://192.168.1.98/socketjs-node');

  const getData = async () => {
    setLoading(true);
    const data  = await axios.get(url)
      .then(response => JSON.stringify(response.data))
      .catch((e) => JSON.stringify(e.message))
    setLoading(false);
    setResponse(data);

  }

  // Connecting to images websocket
  useEffect(() => {
    client.onopen = () => {
      console.log("Connected to websocket images");
    }
  }, [])

  useEffect(() => {
    client.onmessage = (message) => {
      console.log(message);
    }
  })

  useEffect(() => {
    getData();
    const queryWebServer = setInterval(() => {
      getData();
    }, 5000)

    return () => clearInterval(queryWebServer);
  }, []);


  return (
    <div>
      <div>{loading ? "Obteniendo datos cada 5 segundos..." : "Estado del servidor backend:"}</div>
      <div>{response}</div>
      <div>Imagenes del websocket:</div>
      <div>
        <img src="#" alt="testing"></img>
      </div>
    </div>
  );
}

export default App;
