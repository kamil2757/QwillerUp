from django.urls import path

from Goals.views import CreateGoalTemplateView, CreateGoalActiveView, UpdateTaskTimeView

urlpatterns = [
    path('create-goal-template/', CreateGoalTemplateView.as_view(), name='create_goal_template'),
    path('get-active-goal/', CreateGoalActiveView.as_view(), name='get_active_goal'),
    path('set-time-task/', UpdateTaskTimeView.as_view(), name="set_time_task"),
]