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

from Goals.models import UserDays, TasksTemplateActive, GoalsTemplateActive
from Users.models import UserMedals, Medals, CustomUsers
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

        def get_total_time():
            total_time = 0
            all_days = UserDays.objects.filter(user=user)
            for d in all_days:
                total_time += d.time

            goal = GoalsTemplateActive.objects.filter(user=user).first()
            tasks = TasksTemplateActive.objects.filter(goal=goal)

            for t in tasks:
                total_time += t.spent_time
            return total_time

        def check_new_medal():
            total_times_medal = [
                {'condition': 1000, 'title': 'Золотая медаль "Эксперт"'},
                {'condition': 250, 'title': 'Серебряная медаль "Продвинутый"'},
                {'condition': 100, 'title': 'Бронзовая медаль "Начало пути"'}
            ]

            streak_medals = [
                {'condition': 365, 'title': 'Золотая медаль "Безудержный огонь"'},
                {'condition': 100, 'title': 'Серебряная медаль "Пламя"'},
                {'condition': 10, 'title': 'Бронзовая медаль "Начало"'},
            ]

            days_more_ten = [
                {'condition': 100, 'title': 'Золотая медаль "Неутомимый"'},
                {'condition': 30, 'title': 'Серебряная медаль "Переработчик"'},
                {'condition': 10, 'title': 'Бронзовая медаль "Трудяга"'},
            ]

            hours = get_total_time() // 60
            streak = user.streak
            more_ten = UserDays.objects.filter(user=user, time__gte=600).count()

            def check_medal(condition, medal_list):
                new_medal = None
                for medal in medal_list:
                    medal_obj = Medals.objects.filter(title=medal['title']).first()

                    if (medal_obj and condition >= medal['condition']
                            and not UserMedals.objects.filter(user=user, medal=medal_obj).exists()):
                        if len(UserMedals.objects.filter(user=user)) < 3:
                            UserMedals.objects.create(user=user, medal=medal_obj, equipped=True)
                        else:
                            UserMedals.objects.create(user=user, medal=medal_obj)

                        new_medal = UserMedalsSerializer(medal_obj).data
                        break

                return new_medal

            ch1 = check_medal(hours, total_times_medal)
            if ch1:
                print('ch1')
                return ch1

            ch2 = check_medal(streak, streak_medals)
            if ch2:
                print('ch2')
                return ch2

            ch3 = check_medal(more_ten, days_more_ten)
            if ch3:
                print('ch3')
                return ch3

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
                         'streak_active': streak_active, 'ice_count': user.ice_count, 'new_medal': check_new_medal()},
                        status=status.HTTP_200_OK)


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
        has_user = CustomUsers.objects.filter(username=request.data.get('username')).exclude(id=user.id).exists()

        if not (len(request.data.get('about')) > 0 and len(request.data.get('username')) > 0):
            return Response({'message': 'Некорректные поля'}, status=status.HTTP_400_BAD_REQUEST)

        if has_user:
            return Response({'message': 'Пользователь с таким именем уже существует.'},
                            status=status.HTTP_400_BAD_REQUEST)

        user.username = request.data.get('username')
        user.description = request.data.get('about')

        user.save()

        return Response({'message': 'Ваши данные успешно обновлены!'}, status=status.HTTP_200_OK)
