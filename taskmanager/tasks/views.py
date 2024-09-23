# tasks/views.py
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, User
from .serializers import TaskSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import TaskSerializer

# Custom permissions
class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to allow only admins or owners to edit tasks.
    """
    def has_object_permission(self, request, view, obj):
        return request.user.role == 'admin' or obj.assigned_to == request.user

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

# Task ViewSet
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related('assigned_to').all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['due_date', 'priority', 'assigned_to', 'completed']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'priority', 'created_at']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdminOrOwner])
    def toggle_complete(self, request, pk=None):
        task = self.get_object()
        task.completed = not task.completed
        task.save()
        # Notify via WebSocket (to be implemented)
        return Response({'status': 'task completion toggled'})

    def perform_create(self, serializer):
        task = serializer.save(assigned_to=self.request.user)
        self.broadcast_task_update(task)

    def perform_update(self, serializer):
        task = serializer.save()
        self.broadcast_task_update(task)

    def perform_destroy(self, instance):
        self.broadcast_task_update(instance)
        instance.delete()

    def broadcast_task_update(self, task):
        channel_layer = get_channel_layer()
        serializer = TaskSerializer(task)
        async_to_sync(channel_layer.group_send)(
            'tasks',
            {
                'type': 'task_update',
                'task': serializer.data
            }
        )
