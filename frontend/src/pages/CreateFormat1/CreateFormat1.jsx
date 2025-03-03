import styles from "./CreateFormat1.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useEffect, useRef, useState } from "react";

function CreateFormat1() {
  const [taskVolume, setTaskVolume] = useState(2);
  const [TotalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
  });
  const tasksRef = useRef(null);
  const navigate = useNavigate();

  async function sendTask(e) {
    let newGoal = { day_of_week: 0, tasks: [] };
    e.preventDefault();

    const tasks = tasksRef.current.querySelectorAll(`.${styles.field}`);

    for (const task of tasks) {
      const title = task.firstElementChild.firstElementChild.value;
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

    try {
      console.log(JSON.stringify(newGoal))
      const response = await fetch(
        "http://127.0.0.1:8000/api/goals/create-goal-template/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(newGoal),
        }
      );

      const data = await response.json();
      console.log(data);
      navigate("/main");
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
          onSubmit={sendTask}
        >
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

          <Button width="100%">Готово</Button>
        </form>
      </div>
    </div>
  );
}

export default CreateFormat1;
