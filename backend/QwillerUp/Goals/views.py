from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime

from Goals.models import GoalsTemplate, TasksTemplate, GoalsTemplateActive, TasksTemplateActive
from Goals.serializers.serializers import ActiveGoalSerializer
from django.utils.timezone import now


class CreateGoalTemplateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        day_of_week = request.data.get("day_of_week")
        tasks = request.data.get("tasks", [])

        GoalsTemplate.objects.filter(user=user, day_of_week=day_of_week).delete()

        goal_template = GoalsTemplate.objects.create(user=user, day_of_week=day_of_week)

        for task in tasks:
            TasksTemplate.objects.create(
                goal=goal_template,
                title=task['title'].capitalize(),
                planned_time=task['planned_time'],
            )

        if day_of_week == 0:
            user.schedule_type = 1
        else:
            user.schedule_type = 2

        user.save()
        return Response({'message': 'Шаблон цели успешно создан'}, status=status.HTTP_201_CREATED)


class CreateGoalActiveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        day_of_week = datetime.today().weekday() + 1

        active_goal = GoalsTemplateActive.objects.filter(created_at=now().date(), user=user).first()

        if not active_goal:
            if user.schedule_type == 1:
                goal_template = GoalsTemplate.objects.filter(user=user, day_of_week=0).first()
            else:
                goal_template = GoalsTemplate.objects.filter(user=user, day_of_week=day_of_week).first()

            if not goal_template:
                return Response({'message': "Нет шаблона цели для этого дня"}, status=status.HTTP_404_NOT_FOUND)

            active_goal = GoalsTemplateActive.objects.create(user=user, created_at=now().date())
            task_templates = TasksTemplate.objects.filter(goal=goal_template)

            for task in task_templates:
                TasksTemplateActive.objects.create(
                    goal=active_goal,
                    title=task.title,
                    planned_time=task.planned_time
                )

        serializer = ActiveGoalSerializer(active_goal)
        return Response({'data': serializer.data, 'message_for_user': f'{user.username}, ты занимаешься уже n часов, молодец!'})

class UpdateTaskTimeView(APIView):
    def post(self, request):
        task_title = request.data.get('title')
        task_timeSpent = request.data.get('time_spent')
        user = request.user

