from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .models import User
from .serializers import UserRegisterSerializer

class UserRegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            'user':serializer.data,
            "message":"User registered successfully"
        },status=status.HTTP_201_CREATED)
