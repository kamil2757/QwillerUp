import styles from "./SettingsTasksFormat2.module.scss";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../contexts/UserContext";

function SettingsTasksFormat2() {
  // Контексты и стейты
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const tasksRef = useRef(null);
  const { UpdateTokens, domain, protocol } = useContext(UserContext);
  const [inpValuesGoals, setInpValuesGoals] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });
  const [goals, setGoals] = useState(null);

  // Количество задач на каждый день
  const [taskVolume, setTaskVolume] = useState({
    Понедельник: 2,
    Вторник: 2,
    Среда: 2,
    Четверг: 2,
    Пятница: 2,
    Суббота: 2,
    Воскресенье: 2,
  });

  // Суммарное время задач на каждый день
  const [TotalTime, setTotalTime] = useState({
    Понедельник: { hours: 0, minutes: 0 },
    Вторник: { hours: 0, minutes: 0 },
    Среда: { hours: 0, minutes: 0 },
    Четверг: { hours: 0, minutes: 0 },
    Пятница: { hours: 0, minutes: 0 },
    Суббота: { hours: 0, minutes: 0 },
    Воскресенье: { hours: 0, minutes: 0 },
  });

  const week = [
    [1, "Понедельник"],
    [2, "Вторник"],
    [3, "Среда"],
    [4, "Четверг"],
    [5, "Пятница"],
    [6, "Суббота"],
    [7, "Воскресенье"],
  ];

  // Обновление количества полей для задач при вводе
  function handleChange(e, day_name, index_task) {
    if (taskVolume[day_name] == e.target.parentElement.className) {
      setTaskVolume((prev) => ({
        ...prev,
        [day_name]: prev[day_name] + 1,
      }));
    }

    if (
      taskVolume[day_name] - 1 == e.target.parentElement.className &&
      e.target.value === ""
    ) {
      setTaskVolume((prev) => ({
        ...prev,
        [day_name]: prev[day_name] - 1,
      }));
    }

    console.log(day_name, index_task);

    let index_week = Object.keys(taskVolume).indexOf(day_name);

    setInpValuesGoals((prev) => {
      const updatedDayTasks = [...prev[index_week]]; // Копируем массив задач на день
      const existingTask = updatedDayTasks[index_task] || {
        hours: 0,
        minutes: 0,
      };

      updatedDayTasks[index_task] = {
        ...existingTask,
        title: e.target.value,
      };

      return {
        ...prev,
        [index_week]: updatedDayTasks,
      };
    });
  }

  // Подсчет общего времени задач на день
  function handleChangeNumber(e, day, index_task, format) {
    let value = Number(e.target.value) || 0;
    let index_week = Object.keys(taskVolume).indexOf(day[1]);

    setInpValuesGoals((prev) => {
      const updatedDayTasks = [...prev[index_week]];
      const existingTask = updatedDayTasks[index_task] || {
        hours: 0,
        minutes: 0,
      };

      updatedDayTasks[index_task] = {
        ...existingTask,
        [format === 1 ? "hours" : "minutes"]: value,
      };

      return {
        ...prev,
        [index_week]: updatedDayTasks,
      };
    });

    const hours_arr = document.querySelectorAll(`.hours${day[0]}`);
    const minutes_arr = document.querySelectorAll(`.minutes${day[0]}`);

    let time_minutes = 0;

    hours_arr.forEach((item) => {
      if (item) time_minutes += Number(item.firstElementChild.value) * 60;
    });

    minutes_arr.forEach((item) => {
      if (item) time_minutes += Number(item.firstElementChild.value);
    });

    setTotalTime((prev) => ({
      ...prev,
      [day[1]]: {
        hours: Math.floor(time_minutes / 60),
        minutes: time_minutes % 60,
      },
    }));
  }

  // Проверка корректности всех полей
  function checkFields() {
    for (const Goal of tasksRef.current.children) {
      const day_of_week = week.find(
        (day) => Goal.firstElementChild.innerText == day[1]
      )[0];

      let tasks_count = 0;
      let Goal_time = 0;

      for (const task of Goal.querySelectorAll(`.${styles.field}`)) {
        const title = task.firstElementChild.firstElementChild.value;

        if (title) {
          if (tasks_count === 0 && !title) {
            setError("Добавьте хотя бы одно занятие в день");
            return false;
          }

          tasks_count++;

          const task_time =
            Number(
              task.querySelector(`.hours${day_of_week}`).firstElementChild.value
            ) *
              60 +
            Number(
              task.querySelector(`.minutes${day_of_week}`).firstElementChild
                .value
            );

          Goal_time += task_time;

          if (title.length > 16) {
            setError("Максимальная длина задачи 16 символов");
            return false;
          }

          if (task_time <= 0) {
            setError("Время для одного из дел слишком мало");
            return false;
          }

          if (Goal_time >= 20 * 60 || Goal_time <= 0) {
            setError("Суммарное время слишком нереалистично");
            return false;
          }
        } else if (tasks_count === 0) {
          setError("Добавьте хотя бы одно занятие, начиная с первого");
          return false;
        }
      }
    }

    return true;
  }

 // ======================= Работа с API =======================

  // Отправка шаблона задач на сервер
  async function sendTasks(e) {
    e.preventDefault();
    if (!checkFields()) {
      setSuccess(false);
      return;
    }

    for (const Goal of tasksRef.current.children) {
      const day_of_week = week.find(
        (day) => Goal.firstElementChild.innerText == day[1]
      )[0];

      let newGoal = { day_of_week, tasks: [] };

      for (const task of Goal.querySelectorAll(`.${styles.field}`)) {
        const title = task.firstElementChild.firstElementChild.value.trim();
        if (title) {
          const planned_time =
            Number(
              task.querySelector(`.hours${day_of_week}`).firstElementChild.value
            ) *
              60 +
            Number(
              task.querySelector(`.minutes${day_of_week}`).firstElementChild
                .value
            );
          newGoal.tasks.push({ title, planned_time });
        }
      }

      try {
        async function sendTaskData() {
          const response = await fetch(
            `${protocol}://${domain}/api/goals/create-goal-template/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify(newGoal),
            }
          );

          const data = await response.json();
          if (data?.code === "token_not_valid") {
            await UpdateTokens(sendTaskData);
            localStorage.setSuccess = "true";
          } else {
            setError(false);
            localStorage.schedule_type = 2;
            setSuccess("Шаблон был успешно изменен!");
          }
        }

        sendTaskData();
      } catch (err) {
        console.log(err);
      }
    }
  }


  async function getGoals() {
    const response = await fetch(
      `${protocol}://${domain}/api/goals/get-goals/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setGoals(data.goals);

      if (localStorage.setSuccess == "true") {
        console.log("localStorage.setSuccess: " + localStorage.setSuccess)
        setSuccess("Шаблон был успешно изменен!");
        localStorage.setSuccess = "false";
      }
    } else {
      await UpdateTokens();
    }
  }

  // ======================= Эффекты =======================

  useEffect(() => {
    if (localStorage.schedule_type == "2" && !goals) {
      getGoals();
    }

  }, []);

  useEffect(() => {
    console.log(goals);
  }, [goals]);

  useEffect(() => {
    console.log(goals);
    if (goals) {
      for (let i = 0; i < Object.values(goals).length; i++) {
        let tasks = goals[i];
        console.log(tasks);
        setTaskVolume((prev) => ({
          ...prev,
          [Object.keys(taskVolume)[i]]:
            tasks.length === 0 ? 2 : tasks.length + 1,
        }));

        setInpValuesGoals((prev) => ({
          ...prev,
          [i]: tasks.map((task) => ({
            title: task.title,
            hours: Math.floor(task.planned_time / 60) || 0,
            minutes: task.planned_time % 60 || 0,
          })),
        }));
      }
    }
  }, [goals]);

  // useEffect(() => {
  //   console.log(taskVolume);
  // }, [taskVolume]);

  useEffect(() => {
    console.log(inpValuesGoals);
  }, [inpValuesGoals]);

  useEffect(() => {
    if (inpValuesGoals && goals) {
      for (let i = 0; i < Object.values(goals).length; i++) {
        let tasks = goals[i];
        let totalMinutes = inpValuesGoals[i].reduce(
          (sum, task) => sum + (task.minutes + task.hours * 60),
          0
        );

        if (isNaN(totalMinutes)) {
          totalMinutes = 0;
        }

        setTotalTime((prev) => ({
          ...prev,
          [Object.keys(TotalTime)[i]]: {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60,
          },
        }));
      }
    }
  }, [inpValuesGoals, goals]);

  return (
    <div className={styles.block_settingsTasksFormat2}>
      <form className={styles.content} onSubmit={sendTasks}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {/* Поля для каждого дня недели */}
        <div className={styles.days} ref={tasksRef}>
          {week.map((day) => (
            <div className={styles.block_inputs} key={day[0]}>
              <p>{day[1]}</p>
              {Array.from({ length: taskVolume[day[1]] }, (_, index) => (
                <div className={styles.field} key={index}>
                  {/* Название задачи */}
                  <div className={index + 1}>
                    <Input
                      placeholder="Введите занятие"
                      value={inpValuesGoals?.[day[0] - 1]?.[index]?.title || ""}
                      onChange={(e) => handleChange(e, day[1], index)}
                    />
                  </div>

                  {/* Часы */}
                  <div className={`${styles.inp_time} hours${day[0]}`}>
                    <Input
                      placeholder="0"
                      type="number"
                      value={inpValuesGoals?.[day[0] - 1]?.[index]?.hours || ""}
                      onChange={(e) => handleChangeNumber(e, day, index, 1)}
                    />
                    <p>ч</p>
                  </div>

                  {/* Минуты */}
                  <div className={`${styles.inp_time} minutes${day[0]}`}>
                    <Input
                      placeholder="0"
                      type="number"
                      value={
                        inpValuesGoals?.[day[0] - 1]?.[index]?.minutes || ""
                      }
                      onChange={(e) => handleChangeNumber(e, day, index, 2)}
                    />
                    <p>мин</p>
                  </div>
                </div>
              ))}

              {/* Суммарное время задач */}
              <div className={styles.total_time}>
                <p>
                  Cуммарное время цели на день: {TotalTime[day[1]].hours}ч{" "}
                  {TotalTime[day[1]].minutes}мин
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка отправки */}
        <Button width="100%">Создать новое гибкое расписание</Button>
      </form>
    </div>
  );
}

export default SettingsTasksFormat2;
