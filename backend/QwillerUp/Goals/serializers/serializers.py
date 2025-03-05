from typing import Dict, Any

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from Goals.models import GoalsTemplateActive, TasksTemplateActive


class ActiveTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TasksTemplateActive
        fields = ['id', 'title', 'spent_time', 'planned_time']

class ActiveGoalSerializer(serializers.ModelSerializer):
    tasks = ActiveTaskSerializer(many=True, read_only=True, source='taskstemplateactive_set')

    class Meta:
        model = GoalsTemplateActive
        fields = ['id', 'tasks', 'created_at']
