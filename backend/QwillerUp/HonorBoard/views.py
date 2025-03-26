import random

from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from Goals.models import UserDays, GoalsTemplateActive, TasksTemplateActive
from HonorBoard.models import HonorBoard
from django.utils.timezone import now
from datetime import datetime, timedelta

from Users.models import CustomUsers


class GetHonorBoardView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        messages = HonorBoard.objects.filter(date=now().date())
        if messages.exists():
            return Response({'messages': messages}, status=status.HTTP_200_OK)
        else:
            active_users = CustomUsers.objects.filter(
                last_active_date__in=[
                    (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                    datetime.now().strftime("%Y-%m-%d")
                ]
            ).order_by('?')[:6]
            entries = []

            for user in active_users:
                message = self.generate_message_for_user(user)
                entries.append({"user_id": user.id, "message": message})

            HonorBoard.objects.create(
                date=now().date(),
                entries=entries
            )

            return Response({'messages': entries}, status=status.HTTP_200_OK)

    def get_total_time(self, user):
        total_time = 0

        all_days = UserDays.objects.filter(user=user)
        for d in all_days:
            total_time += d.time

        goal = GoalsTemplateActive.objects.filter(user=user).first()
        tasks = TasksTemplateActive.objects.filter(goal=goal)

        for t in tasks:
            total_time += t.spent_time

        return total_time

    def generate_message_for_user(self, user, num_message=random.randint(1, 8)):
        message = ''
        match num_message:
            case 1:
                if user.streak <= 4:
                    return self.generate_message_for_user(7)
                message = f'{user} держит огненный стрик в {user.streak} дней! Не останавливайся!'
            case 2:
                if user.streak <= 9:
                    return self.generate_message_for_user(9)
                message = f'{user} уже {user.streak} дней подряд не пропускает ни дня! Вот это самоотдача!'
            case 3:
                if user.streak <= 14:
                    return self.generate_message_for_user(8)
                message = f'Рекорд? {user} продолжает работать уже {user.streak} дней подряд!'
            case 4:
                time_spent = self.get_total_time(user=user)
                if time_spent <= 9:
                    return self.generate_message_for_user(8)
                message = f'{user} посвятил {time_spent} часов продуктивной работе! Уважение и респект!'
            case 5:
                time_spent = self.get_total_time(user=user)
                if time_spent <= 5:
                    return self.generate_message_for_user(7)
                message = f'{user} вложил в развитие {time_spent} часов! Время – самый ценный ресурс!'
            case 6:
                time_spent = self.get_total_time(user=user)
                if time_spent <= 19:
                    return self.generate_message_for_user(9)
                message = f'За все время {user} провёл {time_spent} часов за работой. Настоящий марафонец!'
            case 7:
                message = f'{user} сегодня отличился в сообществе QwillerUp – продуктивность на высшем уровне!'
            case 8:
                message = f'{user} вдохновляет всех своей активностью! Работает на максимум!'
            case 9:
                message = f'{user} — один из самых активных пользователей сегодня. Продолжай в том же духе!'

        return message
