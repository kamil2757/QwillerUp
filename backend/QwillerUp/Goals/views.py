from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta, date
import random

from Goals.models import GoalsTemplate, TasksTemplate, GoalsTemplateActive, TasksTemplateActive, UserDays
from Goals.serializers.serializers import ActiveGoalSerializer, TasksSerializer
from django.utils.timezone import now

from Users.models import Medals, UserMedals


class CreateGoalTemplateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        day_of_week = request.data.get("day_of_week")
        tasks = request.data.get("tasks", [])

        GoalsTemplate.objects.filter(user=user, day_of_week=day_of_week).delete()
        if GoalsTemplate:
            goal_template = GoalsTemplate.objects.create(user=user, day_of_week=day_of_week)

            for task in tasks:
                if len(task['title']) > 20:
                    return Response({'message': 'Максимальная длина задачи 20 символов'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    print(len(task['title']), task['title'])


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

        return Response({'message': 'У пользователя нету задач'}, status=status.HTTP_404_NOT_FOUND)


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
            task_templates = TasksTemplate.objects.filter(goal=goal_template).order_by('id')

            for task in task_templates:
                TasksTemplateActive.objects.create(
                    goal=active_goal,
                    title=task.title,
                    planned_time=task.planned_time
                )
        else:
            if user.schedule_type == 1:
                template = GoalsTemplate.objects.filter(user=user, day_of_week=0).first()
            else:
                template = GoalsTemplate.objects.filter(user=user, day_of_week=day_of_week).first()

            tasks_t = [(t.title, t.planned_time) for t in TasksTemplate.objects.filter(goal=template).order_by('id')]

            active = GoalsTemplateActive.objects.filter(user=user).first()
            ta_t = TasksTemplateActive.objects.filter(goal=active).order_by('id')
            tasks_a = [(t.title, t.planned_time) for t in ta_t]

            if not (tasks_t == tasks_a):
                ta_t.delete()
                active.delete()

                active_goal = GoalsTemplateActive.objects.create(user=user, created_at=now().date())
                task_templates = TasksTemplate.objects.filter(goal=template)

                for task in task_templates:
                    TasksTemplateActive.objects.create(
                        goal=active_goal,
                        title=task.title,
                        planned_time=task.planned_time
                    )

        last_goal = GoalsTemplateActive.objects.filter(user=user).exclude(created_at=now().date()).first()
        if last_goal:
            last_tasks = TasksTemplateActive.objects.filter(goal=last_goal)
            goal_time = 0
            perfect_day = True

            for task in last_tasks:
                goal_time += task.spent_time

                if task.spent_time < task.planned_time:
                    perfect_day = False

            UserDays.objects.create(time=goal_time, user=user, perfect_day=perfect_day, date=last_goal.created_at)
            last_tasks.delete()
            last_goal.delete()

        def get_total_time(section='all'):
            total_time = 0
            if section == 'all':
                all_days = UserDays.objects.filter(user=user)
                for d in all_days:
                    total_time += d.time

                goal = GoalsTemplateActive.objects.filter(user=user).first()
                tasks = TasksTemplateActive.objects.filter(goal=goal)

                for t in tasks:
                    total_time += t.spent_time

            elif section == 'week':
                today = now().date()
                start_week = today - timedelta(days=today.weekday())
                end_week = start_week + timedelta(days=6)

                week_days = UserDays.objects.filter(date__range=(start_week, end_week), user=user)
                for d in week_days:
                    total_time += d.time

                goal = GoalsTemplateActive.objects.filter(user=user).first()
                tasks = TasksTemplateActive.objects.filter(goal=goal)

                for t in tasks:
                    total_time += t.spent_time

            return total_time

        def get_message(num_message=random.randint(1, 8)):

            message = ''
            match num_message:
                case 1:
                    if user.streak <= 3:
                        return get_message(9)

                    message = f"Ты молодец, {user}! Уже {user.streak} дней подряд продуктивно работаешь!"
                case 2:
                    if user.streak <= 1:
                        return get_message(11)

                    message = f"{user}, твой стрик — {user.streak} дней! Держись, и тебя ждёт ещё больше достижений."
                case 3:
                    if user.streak <= 4:
                        return get_message(10)

                    message = (f"Лёд не понадобится, {user}, если ты продолжишь в таком же темпе!"
                               f" Твой стрик — {user.streak} дней.")
                case 4:
                    time = get_total_time()
                    if time < 60:
                        return get_message(10)

                    message = f"{user}, ты уже провёл(а) {time // 60} часов за занятиями! Отличный результат!"
                case 5:
                    today_time = 0
                    goal = GoalsTemplateActive.objects.filter(user=user).first()
                    tasks = TasksTemplateActive.objects.filter(goal=goal)
                    for t in tasks:
                        today_time += t.spent_time

                    if today_time < 60:
                        return get_message(10)

                    message = (f"{user}, твоя продуктивность впечатляет! Сегодня ты потратил(а) {today_time // 60} "
                               f"часов на полезные дела.")
                case 6:
                    time = get_total_time('week')
                    if time < 60:
                        return get_message(11)

                    message = f"Каждый день приближает тебя к цели, {user}! За эту неделю ты уже вложил(а) {time // 60} часов в своё развитие."
                case 7:
                    goal = GoalsTemplateActive.objects.filter(user=user).first()
                    random_task = TasksTemplateActive.objects.filter(goal=goal).order_by('?').first()

                    message = f"Продолжаем в том же духе, {user}! {random_task.title} — твой следующий шаг к успеху."
                case 8:
                    today_time = 0
                    goal = GoalsTemplateActive.objects.filter(user=user).first()
                    tasks = TasksTemplateActive.objects.filter(goal=goal)
                    for t in tasks:
                        today_time += t.spent_time

                    if today_time < 60:
                        return get_message(10)

                    message = (f"Огонь, {user}! Ты уже провёл(а) {today_time // 60} часов за учёбой сегодня."
                               f" Давай добьём ещё одну задачу?")
                case 9:
                    message = f"Ты можешь всё, {user}! Вперёд, к новым достижениям!"
                case 10:
                    message = f"{user}, ты на верном пути! Дерзай, результат не заставит себя ждать!"
                case 11:
                    message = f"Не важно, понедельник сегодня или нет — пора начинать! Вперёд к результатам!"

            return message

        goal = GoalsTemplateActive.objects.filter(user=user).first()
        tasks = TasksTemplateActive.objects.filter(goal=goal)
        perfect_day = True

        for task in tasks:
            if task.spent_time < task.planned_time:
                perfect_day = False

        serializer = ActiveGoalSerializer(active_goal)
        return Response(
            {'data': serializer.data, 'message_for_user': get_message(), 'perfect_day': perfect_day},
            status=status.HTTP_201_CREATED)


class UpdateTaskTimeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get('title')
        spent_time = request.data.get('time_spent')
        user = request.user

        goal = GoalsTemplateActive.objects.get(user=user)
        task = TasksTemplateActive.objects.get(goal=goal, title=title)
        task.spent_time = spent_time
        task.save()

        if (user.last_active_date == (date.today() - timedelta(days=1))) or (user.last_active_date == date.today()):
            pass
        else:
            if user.ice_count > 0:
                user.ice_count -= 1
            else:
                user.streak = 0

        if user.last_active_date != date.today():
            user.streak += 1

        user.last_active_date = date.today()
        user.save()

        return Response({'message': 'Цель успешна обновлена'}, status=status.HTTP_200_OK)


class GetTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        goal = False

        if user.schedule_type == 1:
            goal = GoalsTemplate.objects.filter(user=user, day_of_week=0).first()
        elif user.schedule_type == 2:
            day_week = now().date().weekday() + 1
            goal = GoalsTemplate.objects.filter(user=user, day_of_week=day_week).first()

        if not goal:
            return Response({'tasks': []})

        tasks = TasksTemplate.objects.filter(goal=goal).order_by('id')
        serializer = TasksSerializer(tasks, many=True)

        return Response({'tasks': serializer.data})


class CreateGoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not (user.schedule_type == 2):
            return Response({'message': 'schedule_type 1 у пользователя'}, status=status.HTTP_400_BAD_REQUEST)

        goals = GoalsTemplate.objects.filter(day_of_week__gte=1, user=user).order_by('day_of_week')

        if len(goals) != 7:
            return Response({'message': 'У пользователя должно быть ровно 7 целей (1–7)'}, status=status.HTTP_400_BAD_REQUEST)

        goals_dict = {}

        for i in range(0, 6 + 1):
            tasks = TasksTemplate.objects.filter(goal=goals[i])
            serializer = TasksSerializer(tasks, many=True)
            goals_dict[i] = serializer.data

        return Response({'goals': goals_dict}, status=status.HTTP_200_OK)

