import base64
import asyncio

import cv2
import websockets

cap = cv2.VideoCapture(0)

async def hello(ws, path):
  while True:
    if not cap.isOpened():
      break

    ret, frame = cap.read()
    if ret == False:
      print("[DEBUG] No se ha podido obtener una imagen.")
      continue
    ret, buffer = cv2.imencode('.jpg', frame)
    encoded = base64.b64encode(buffer).decode()
    await ws.send(encoded)
    await asyncio.sleep(0.03)

server = websockets.serve(hello, "0.0.0.0", 5000)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()

# TODO: Create a productor consumer to avoid saturation in websocket.