# tasks/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .serializers import TaskSerializer
from .models import Task
from channels.db import database_sync_to_async

class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'tasks'

        # Join group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        # Handle incoming data if needed

    # Receive message from group
    async def task_update(self, event):
        task = event['task']
        await self.send(text_data=json.dumps({
            'task': task
        }))
