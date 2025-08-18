from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
    )

    class Meta:
        model = User
        fields =[
            'email',
            'first_name',
            'last_name',
            'password',
            'password2',
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, data):
        password1 = data.get('password')
        password2 = data.pop('password2')

        if password1 != password2:
            raise serializers.ValidationError('Passwords don\'t match')

        try:
            from .models import validate_password
            validate_password(password1)
        except ValidationError as e:
            raise serializers.ValidationError({"Password": e.message})

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
        )
        return user