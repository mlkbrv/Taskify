from django.shortcuts import render
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import TaskSerializer, TaskFileSerializer
from .models import Task, TaskFile
from .permissions import *


class AllTasksView(ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]


class MyTasksView(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(recipient=user)


class CreatedTasksView(ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(sender=user)


class TaskDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsSenderOrRecipient]

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(*args, **kwargs)
        if self.request.user == self.get_object().recipient:
            serializer.fields.pop('name', None)
            serializer.fields.pop('description', None)
            serializer.fields.pop('sender', None)
            serializer.fields.pop('recipient', None)
            serializer.fields.pop('created_at', None)
        return serializer
