from django.shortcuts import render
from django.utils import timezone
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers

from .serializers import TaskSerializer, TaskFileSerializer, CategorySerializer
from .models import Task, TaskFile, Category
from .permissions import *


class AllCategoriesView(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

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
    
    def perform_create(self, serializer):
        # Получаем email получателя из request data
        recipient_email = self.request.data.get('recipient_email')
        
        if recipient_email:
            try:
                from users.models import User
                recipient = User.objects.get(email=recipient_email)
                # Автоматически устанавливаем отправителя как текущего пользователя
                serializer.save(sender=self.request.user, recipient=recipient)
            except User.DoesNotExist:
                from rest_framework.response import Response
                from rest_framework import status
                raise serializers.ValidationError(
                    f"Пользователь с email {recipient_email} не найден"
                )
        else:
            # Если получатель не указан, создаем задачу без получателя
            serializer.save(sender=self.request.user)


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


class TaskCompleteView(APIView):
    permission_classes = [IsAuthenticated, IsSenderOrRecipient]

    def post(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            if request.user != task.recipient:
                return Response(
                    {'error': 'Только получатель задачи может отметить её как выполненную'},
                    status=400
                )

            task.is_complete = True
            task.completed_at = timezone.now()
            task.save()

            serializer = TaskSerializer(task)
            return Response(serializer.data, status=200)

        except Task.DoesNotExist:
            return Response({'error': 'Задача не найдена'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class CompletedTasksView(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(recipient=user, is_complete=True).order_by('-completed_at')
