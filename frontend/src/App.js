import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

function App() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = '/api';

  const getData = async () => {
    setLoading(true);
    const data  = await axios.get(url)
      .then(response => JSON.stringify(response.data))
      .catch((e) => JSON.stringify(e.message))
    setLoading(false);
    setResponse(data);

  }

  useEffect(() => {
    getData();
    const queryWebServer = setInterval(() => {
      getData();
    }, 5000)

    return () => clearInterval(queryWebServer);
  }, []);


  return (
    <div>
      <div>{loading ? "Obteniendo datos cada 5 segundos..." : "Estado del servidor:"}</div>
      <div>{response}</div>
    </div>
  );
}

export default App;
