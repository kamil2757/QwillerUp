from django.urls import path

from Goals.views import CreateGoalTemplateView

urlpatterns = [
    path('create-goal-template/', CreateGoalTemplateView.as_view(), name='create_goal_template')
]