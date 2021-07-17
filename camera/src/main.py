import base64
import random
import asyncio
import datetime
import json

import cv2
import websockets

cap = cv2.VideoCapture(0)

async def hello(ws, path):
  while True:
    if not cap.isOpened():
      print("[DEBUG] La cámara no está operativa.")
      break

    ret, frame = cap.read()
    if ret == False:
      print("[DEBUG] No se ha podido obtener una imagen.")
      continue
    ret, buffer = cv2.imencode('.jpg', frame)
    encoded = base64.b64encode(buffer).decode()
    data = json.dumps({ 'image': encoded })
    await ws.send(data)

# Productor
  # Productor
  # 1er thread
  # opencv -> leer imagenes
  # tomar la imagen y moverla a un buffer

  # Consumidor
  # 2do thread
  # verifica si hay imagenes en el buffer
  # y si los hay, los manda por el socket

# Consumidor del Detector Facial
  # Productor
  # 1er thread
  # conectar con el ws, y va a alimentar un buffer

  # 2do thread
  # tomar imagenes del buffer, y los va a procesar
  # con yolov5

# Consumidor Aplicación Web
  # Productor
  # 1er thread
  # conectar con el ws, y va a alimentar un buffer

  # Consumidor
  # 2do thread
  # tomar imagenes del buffer, y los mostrará en la
  # pagina web


server = websockets.serve(hello, "0.0.0.0", 5000)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()