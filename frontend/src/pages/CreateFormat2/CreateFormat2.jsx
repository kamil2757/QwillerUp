import styles from "./CreateFormat2.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useContext, useRef, useState } from "react";
import UserContext from "../../contexts/UserContext";

function CreateFormat2() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [taskVolume, setTaskVolume] = useState({
    Понедельник: 2,
    Вторник: 2,
    Среда: 2,
    Четверг: 2,
    Пятница: 2,
    Суббота: 2,
    Воскресенье: 2,
  });
  const [TotalTime, setTotalTime] = useState({
    Понедельник: { hours: 0, minutes: 0 },
    Вторник: { hours: 0, minutes: 0 },
    Среда: { hours: 0, minutes: 0 },
    Четверг: { hours: 0, minutes: 0 },
    Пятница: { hours: 0, minutes: 0 },
    Суббота: { hours: 0, minutes: 0 },
    Воскресенье: { hours: 0, minutes: 0 },
  });
  const tasksRef = useRef(null);
  const { UpdateTokens } = useContext(UserContext);

  const week = [
    [1, "Понедельник"],
    [2, "Вторник"],
    [3, "Среда"],
    [4, "Четверг"],
    [5, "Пятница"],
    [6, "Суббота"],
    [7, "Воскресенье"],
  ];

  function checkFields() {
    for (const Goal of tasksRef.current.children) {
      console.log("Goal");
      console.log(Goal);
      let day_of_week = week.find(
        (day) => Goal.firstElementChild.innerText == day[1]
      )[0];

      let tasks_count = 0;
      let Goal_time = 0;

      for (const task of Goal.querySelectorAll(`.${styles.field}`)) {
        const title = task.firstElementChild.firstElementChild.value;
        if (title) {
          if (tasks_count == 0) {
            if (!title) {
              console.log("Добавьте хотя бы одно занятие в день");
              setError("Добавьте хотя бы одно занятие в день");
              return false;
            }
            tasks_count += 1;
          }

          const task_time =
            Number(
              task.querySelector(`.${"hours" + day_of_week}`).firstElementChild
                .value
            ) *
              60 +
            Number(
              task.querySelector(`.${"minutes" + day_of_week}`)
                .firstElementChild.value
            );

          Goal_time += task_time;

          console.log(title, task_time);
          console.log(task_time <= 0);
          if (task_time <= 0) {
            setError("Время для одного из дел слишком мало");
            return false;
          }

          if (Goal_time >= 20 * 60 || Goal_time <= 0) {
            console.log("не подходящее время: " + Goal_time);
            setError("Суммарное время слишком нереалистично");
            return false;
          }
        } else {
          if (tasks_count == 0) {
            setError("Добавьте хотя бы одно занятие, начиная с первого");
            return false;
          }
        }
      }
    }

    console.log("Все в порядке!");
    return true;
  }

  async function sendTasks(e) {
    e.preventDefault();
    if (!checkFields()) {
      return;
    }

    for (const Goal of tasksRef.current.children) {
      let day_of_week = week.find(
        (day) => Goal.firstElementChild.innerText == day[1]
      )[0];
      let newGoal = { day_of_week: day_of_week, tasks: [] };

      for (const task of Goal.querySelectorAll(`.${styles.field}`)) {
        const title = task.firstElementChild.firstElementChild.value.trim();

        if (title) {
          const planned_time =
            Number(
              task.querySelector(`.${"hours" + day_of_week}`).firstElementChild
                .value
            ) *
              60 +
            Number(
              task.querySelector(`.${"minutes" + day_of_week}`)
                .firstElementChild.value
            );
          newGoal.tasks.push({ title, planned_time });
        }
      }

      try {
        async function sendTaskData() {
          console.log(newGoal);
          const response = await fetch(
            "http://127.0.0.1:8000/api/goals/create-goal-template/",
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
          console.log(data);
          if (data?.code == "token_not_valid") {
            UpdateTokens(sendTaskData);
          }
        }

        sendTaskData();
      } catch (err) {
        console.log(err);
      }
    }

    navigate("/main");
  }

  function handleChange(e, day_name) {
    if (taskVolume[day_name] == e.target.parentElement.className) {
      console.log(day_name);
      setTaskVolume((prevTaskVolume) => ({
        ...prevTaskVolume,
        [day_name]: prevTaskVolume[day_name] + 1,
      }));
    }

    if (
      taskVolume[day_name] - 1 == e.target.parentElement.className &&
      e.target.value == ""
    ) {
      setTaskVolume((prevTaskVolume) => ({
        ...prevTaskVolume,
        [day_name]: prevTaskVolume[day_name] - 1,
      }));
    }
  }

  function handleChangeNumber(day) {
    const hours_arr = document.querySelectorAll(`.hours${day[0]}`);
    const minutes_arr = document.querySelectorAll(`.minutes${day[0]}`);

    let time_minutes = 0;
    hours_arr.forEach((item) => {
      if (item) {
        time_minutes += Number(item.firstElementChild.value) * 60;
      }
    });

    minutes_arr.forEach((item) => {
      if (item) {
        time_minutes += Number(item.firstElementChild.value);
      }
    });

    setTotalTime((prevTotalTime) => ({
      ...prevTotalTime,
      [day[1]]: {
        hours: Math.floor(time_minutes / 60),
        minutes: time_minutes % 60,
      },
    }));
  }

  return (
    <div className={styles.block_createFormat1}>
      <form className={styles.content} onSubmit={sendTasks}>
        <h1>Гибкое расписание</h1>
        <p>
          Напиши в каждый день направления, которые хочешь изучать, и укажи,
          сколько времени готов уделять каждому из них
        </p>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.days} ref={tasksRef}>
          {week.map((day) => (
            <div className={styles.block_inputs} key={day[0]}>
              <p>{day[1]}</p>
              {Array.from({ length: taskVolume[day[1]] }, (_, index) => (
                <div className={styles.field} key={index}>
                  <div className={index + 1}>
                    <Input
                      placeholder="Введите занятие"
                      onChange={(e) => handleChange(e, day[1])}
                    />
                  </div>
                  <div className={`${styles.inp_time} hours${day[0]}`}>
                    <Input
                      placeholder="0"
                      onChange={() => handleChangeNumber(day)}
                      type="number"
                    />
                    <p>ч</p>
                  </div>
                  <div className={`${styles.inp_time} minutes${day[0]}`}>
                    <Input
                      placeholder="0"
                      onChange={() => handleChangeNumber(day)}
                      type="number"
                    />
                    <p>мин</p>
                  </div>
                </div>
              ))}

              <div className={styles.total_time}>
                Cуммарное время цели на день: {TotalTime[day[1]].hours}ч{" "}
                {TotalTime[day[1]].minutes}
                мин
              </div>
            </div>
          ))}
        </div>
        <div className={styles.button_block}>
          <Button width="100%">Готова</Button>
        </div>
      </form>
    </div>
  );
}

export default CreateFormat2;
