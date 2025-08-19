from django.core.exceptions import ValidationError
from django.db import models
from users.models import User


def validate_file_type(value):
    valid_mime_types = ['image/jpeg', 'image/png', 'video/mp4']
    if value.file.content_type not in valid_mime_types:
        raise ValidationError("Можно загружать только JPG, PNG или MP4 файлы.")


class Task(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='recipient', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class TaskFile(models.Model):
    task = models.ForeignKey(Task, related_name="files", on_delete=models.CASCADE)
    file = models.FileField(upload_to="task_files/",validators=[validate_file_type])
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.name} ({self.task.name})"
