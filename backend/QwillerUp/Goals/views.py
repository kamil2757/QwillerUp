from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from Goals.models import GoalsTemplate, TasksTemplate


class CreateGoalTemplateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        day_of_week = request.data.get("day_of_week")
        tasks = request.data.get("tasks", [])

        GoalsTemplate.objects.filter(user=user).delete()

        goal_template = GoalsTemplate.objects.create(user=user, day_of_week=day_of_week)

        for task in tasks:
            TasksTemplate.objects.create(
                goal=goal_template,
                title=task['title'],
                planned_time=task['planned_time'],
            )

        return Response({'message': 'Шаблон цели успешно создан'}, status=status.HTTP_201_CREATED)
