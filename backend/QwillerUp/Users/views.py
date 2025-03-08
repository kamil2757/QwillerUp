from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from Users.models import UserMedals, Medals
from Users.serializers.serializers import LoginSerializer, RegisterSerializer, GetUserSerializer, UserMedalsSerializer


class RegisterUser(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                'data': RegisterSerializer(user).data,
                'refresh_token': str(refresh),
                'access_token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUser(TokenObtainPairView):
    serializer_class = LoginSerializer


class GetUserByAccess(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(GetUserSerializer(user).data)


class GetUserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_medals = UserMedals.objects.filter(user=user, equipped=True)

        if len(user_medals) <= 3:
            user_medals = UserMedals.objects.filter(user=user)

        medals = [user_medal.medal for user_medal in user_medals]

        serializer = UserMedalsSerializer(medals, many=True)

        return Response({'medals': serializer.data})

