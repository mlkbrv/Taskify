from django.urls import path
from .views import *
urlpatterns = [
    path('tasks/', AllTasksView.as_view(), name='all-tasks'),
    path('tasks/my/', MyTasksView.as_view(), name='my-tasks'),
    path('tasks/created/', CreatedTasksView.as_view(), name='created-tasks'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
]

