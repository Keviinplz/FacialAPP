import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

let socket = new WebSocket("ws://192.168.1.98/frames");

// TODO: Create a reconnect system.
const App = () => {
  const [sConnected, setSConnected] = useState(false);
  const [frame, setFrame] = useState("#");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = '/api';

  if (!socket) {
    socket = new WebSocket("ws://192.168.1.98/frames");;
  }

  const getData = async () => {
    setLoading(true);
    const data = await axios.get(url)
      .then(response => JSON.stringify(response.data))
      .catch((e) => JSON.stringify(e.message))
    setLoading(false);
    setResponse(data);
  }

  useEffect(() => {
    socket.onmessage = (message) => {
      setFrame(message.data);
    };
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
      <div>{sConnected ? "Camera Images:" : "Connecting to camera..."}</div>
      <div>
        <img src={"data:image/jpeg;base64," + frame} alt="testing"></img>
      </div>
    </div>
  );
}

export default App;
