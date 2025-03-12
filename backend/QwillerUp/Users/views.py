from calendar import weekday
import calendar

from django.core.serializers import serialize
from django.shortcuts import render
from pyexpat.errors import messages
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.timezone import now
from datetime import timedelta, date

from Goals.models import UserDays
from Users.models import UserMedals, Medals
from Users.serializers.serializers import LoginSerializer, RegisterSerializer, GetUserSerializer, UserMedalsSerializer, \
    UserMedals2Serializer


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

        medals = [user_medal.medal for user_medal in user_medals]
        medals_data = UserMedalsSerializer(medals, many=True)

        week = {
            0: "Пн",
            1: "Вт",
            2: "Ср",
            3: "Чт",
            4: "Пт",
            5: "Сб",
            6: "Вс",
        }

        days = []

        for d in range(1, 7):
            day = UserDays.objects.filter(user=user, date=(now() - timedelta(days=d)).date()).first()
            if day:
                days.append({
                    'id': d,
                    'weekday': week.get(day.date.weekday()),
                    'hours': day.time // 60,
                    'perfect_day': day.perfect_day,
                })
            else:
                days.append({
                    'id': d,
                    'weekday': week.get((now() - timedelta(days=d)).weekday()),
                    'hours': 0,
                    'perfect_day': False,
                })
        days.reverse()

        if (user.last_active_date == (date.today() - timedelta(days=1))) or (user.last_active_date == date.today()):
            pass
        else:
            if user.ice_count > 0:
                user.ice_count -= 1
            else:
                user.streak = 0
            user.save()

        streak_active = user.last_active_date == date.today()

        return Response({'medals': medals_data.data, "days": days, 'streak_count': user.streak,
                         'streak_active': streak_active, 'ice_count': user.ice_count}, status=status.HTTP_200_OK)


class GetUserMedalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        medals = UserMedals2Serializer(Medals.objects.all(), many=True, context={'user': user})

        return Response({'medals': medals.data}, status=status.HTTP_200_OK)


class UpdateEquippedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        UserMedals.objects.filter(user=user).update(equipped=False)

        for i in request.data:
            medal = UserMedals.objects.filter(medal=i, user=user).first()
            medal.equipped = True
            medal.save()

        return Response({'message': 'все путем!'}, status=status.HTTP_200_OK)


class EditUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.username = request.data.get('username')

        if len(request.data.get('about')) > 0:
            user.description = request.data.get('about')

        user.save()

        return Response({'message': 'Гатова!'}, status=status.HTTP_200_OK)



