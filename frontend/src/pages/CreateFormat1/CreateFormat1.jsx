import styles from "./CreateFormat1.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../contexts/UserContext";

function CreateFormat1() {
  const [blockedButton, setBlockedButton] = useState(false);
  const [taskVolume, setTaskVolume] = useState(2);
  const { UpdateTokens, domain } = useContext(UserContext);
  const [TotalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
  });
  const tasksRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);


 function checkFields() {
    const tasks = tasksRef.current.querySelectorAll(`.${styles.field}`);
    let tasks_count = 0;
    for (const task of tasks) {
      const title = task.firstElementChild.firstElementChild.value.trim();
      if (title) {
        const planned_time =
          Number(
            task.querySelector(`.${styles.hours}`).firstElementChild.value
          ) *
            60 +
          Number(
            task.querySelector(`.${styles.minutes}`).firstElementChild.value
          );

        if (
          TotalTime.hours * 60 + TotalTime.minutes >= 20 * 60 ||
          TotalTime.hours * 60 + TotalTime.minutes <= 0
        ) {
          setError("Суммарное время слишком нереалистично");
          return false;
        }

        if (planned_time <= 0) {
          setError("Время для одного из дел слишком мало");
          return false;
        }

        console.log(title + " " + planned_time);
        tasks_count += 1;
      } else {
        if (tasks_count == 0) {
          setError("Добавьте хотя бы одно занятие, начиная с первого");
          return false;
        }
      }
    }

    return true;
  }

  async function sendTasks(e) {
    e.preventDefault();

    if (!checkFields()) {
      console.log("Проверка провалена");
      return;
    }

    let newGoal = { day_of_week: 0, tasks: [] };
    const tasks = tasksRef.current.querySelectorAll(`.${styles.field}`);

    for (const task of tasks) {
      const title = task.firstElementChild.firstElementChild.value.trim();
      if (title) {
        const planned_time =
          Number(
            task.querySelector(`.${styles.hours}`).firstElementChild.value
          ) *
            60 +
          Number(
            task.querySelector(`.${styles.minutes}`).firstElementChild.value
          );

        newGoal.tasks.push({ title, planned_time });
        console.log(title + " " + planned_time);
      }
    }

    console.log(newGoal);

    try {
      console.log(JSON.stringify(newGoal));
      async function sendTaskData() {
        const response = await fetch(
          `http://${domain}/api/goals/create-goal-template/`,
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
        navigate("/main");
        if (data?.code == "token_not_valid") {
          UpdateTokens(sendTaskData);
        }
      }

      sendTaskData();
    } catch (err) {
      console.log(err);
    }
  }


  function handleChange(e) {
    if (taskVolume == e.target.parentElement.className) {
      setTaskVolume(taskVolume + 1);
    }

    if (
      taskVolume - 1 == e.target.parentElement.className &&
      e.target.value == ""
    ) {
      setTaskVolume(taskVolume - 1);
    }
  }
  function handleChangeNumber(e) {
    const hours_arr = document.querySelectorAll(`.${styles.hours}`);
    const minutes_arr = document.querySelectorAll(`.${styles.minutes}`);

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

    setTotalTime({
      hours: Math.floor(time_minutes / 60),
      minutes: time_minutes % 60,
    });
  }

  return (
    <div className={styles.block_createFormat1}>
      <div className={styles.content}>
        <h1>Постоянный план</h1>
        <p>
          Напиши направления, которые хочешь изучать, и укажи, сколько времени
          готов уделять каждому из них
        </p>
        <form
          className={styles.block_inputs}
          ref={tasksRef}
          onSubmit={sendTasks}
        >
          {error && <div className={styles.error}>{error}</div>}

          {Array.from({ length: taskVolume }, (_, index) => (
            <div className={styles.field} key={index}>
              <div className={index + 1}>
                <Input placeholder="Введите занятие" onChange={handleChange} />
              </div>
              <div className={`${styles.inp_time} ${styles.hours}`}>
                <Input
                  placeholder="0"
                  onChange={handleChangeNumber}
                  type="number"
                />
                <p>ч</p>
              </div>
              <div className={`${styles.inp_time} ${styles.minutes}`}>
                <Input
                  placeholder="0"
                  onChange={handleChangeNumber}
                  type="number"
                />
                <p>мин</p>
              </div>
            </div>
          ))}

          <div className={styles.total_time}>
            Cуммарное время цели на каждый день: {TotalTime.hours}ч{" "}
            {TotalTime.minutes}мин
          </div>

          <Button width="100%" blocked={blockedButton}>
            Готово
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateFormat1;
