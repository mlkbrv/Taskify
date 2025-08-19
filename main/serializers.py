from rest_framework import serializers
from .models import Task,TaskFile
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

class TaskFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = TaskFile
        fields = '__all__'
        read_only_fields = ('id','uploaded_at')

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class TaskSerializer(serializers.ModelSerializer):
    files = TaskFileSerializer(many=True, read_only=True)
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'name',
            'description',
            'sender',
            'recipient',
            'created_at',
            'completed_at',
            'is_complete',
            'files',
        ]
        read_only_fields = ('id','created_at',)

