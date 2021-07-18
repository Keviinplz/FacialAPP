import json
import base64
from aiohttp import web

import cv2
import socketio

cap = cv2.VideoCapture(0)
sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)

@sio.event
async def connect(sid, environ):
  print("[DEBUG] Connected:", sid)

@sio.event
async def get_image(sid):
  while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
      print(
        "[DEBUG] Failed to get camera image, retrying..."
      )
      continue
    ret, buffer = cv2.imencode('.jpg', frame)
    encoded = base64.b64encode(buffer).decode()
    data = json.dumps({ 'client': sid, 'image': encoded })
    await sio.emit('image-response', data)

@sio.event
async def disconnect(sid):
  print("[DEBUG] Disconnected:", sid)

if __name__ == '__main__':
  web.run_app(app, host='0.0.0.0', port=5000)