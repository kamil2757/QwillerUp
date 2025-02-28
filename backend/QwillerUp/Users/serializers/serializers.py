from typing import Dict, Any

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'experience', 'level', 'description', 'photo',
                  'ice_count', 'streak', 'schedule_type']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Пароли не совпадают')
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)

        return user


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError("Никнейм и пароль обязательны.")

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Неверный никнейм или пароль.")

        data = super().validate(attrs)
        data.update({
            'username': user.username,
            'date_joined': user.date_joined.isoformat(),
            'photo': user.photo.url if user.photo else None,
            'description': user.description,
            'experience': user.experience,
            'level': user.level,
            'ice_count': user.ice_count,
            'streak': user.streak,
            'schedule_type': user.schedule_type
        })

        return data


class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'date_joined', 'photo', 'description', 'experience', 'level', 'ice_count', 'streak',
                  'schedule_type']
