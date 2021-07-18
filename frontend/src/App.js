import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import './App.css';

function App() {
  const [wsResponse, setWsResponse] = useState(false);
  const [imgString, setImgString] = useState("#");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = '/api';


  const getData = async () => {
    setLoading(true);
    const data = await axios.get(url)
      .then(response => JSON.stringify(response.data))
      .catch((e) => JSON.stringify(e.message))
    setLoading(false);
    setResponse(data);

  }

  useEffect(() => {
    const socket = socketIOClient("http://192.168.1.98");

    socket.on("connect", (data) => {
      setWsResponse(true);
      socket.emit('get_image');
    });

    socket.on("image-response", data => {
      setImgString(JSON.parse(data).image);
    })
  }, [])





  useEffect(() => {
    getData();
    const queryWebServer = setInterval(() => {
      getData();
    }, 5000)

    return () => clearInterval(queryWebServer);
  }, []);


  return (
    <div>
      <div>{loading ? "Reconnecting to backend..." : "Connected to backend:"}</div>
      <div>{response}</div>
      <div>{wsResponse ? "Camera Images:" : "Connecting to camera..."}</div>
      <div>
        <img src={"data:image/jpg;base64," + imgString} alt="testing"></img>
      </div>
    </div>
  );
}

export default App;
