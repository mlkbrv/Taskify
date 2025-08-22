from django.urls import path
from .views import *

urlpatterns = [
    path('tasks/', AllTasksView.as_view(), name='all-tasks'),
    path('tasks/my/', MyTasksView.as_view(), name='my-tasks'),
    path('tasks/created/', CreatedTasksView.as_view(), name='created-tasks'),
    path('tasks/completed/', CompletedTasksView.as_view(), name='completed-tasks'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/complete/', TaskCompleteView.as_view(), name='complete-task'),
    path('categories/', AllCategoriesView.as_view(), name='all-categories'),
]

