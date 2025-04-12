import styles from "./SettingsTasksFormat1.module.scss";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../contexts/UserContext";

function SettingsTasksFormat1() {
  const tasksRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { UpdateTokens, domain, protocol } = useContext(UserContext);
  const [TotalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
  });
  const { tasks } = useOutletContext();
  const [taskVolume, setTaskVolume] = useState(2);
  const [inpValues, setInpValues] = useState(
    tasks.map((task) => ({
      ...task,
      hours: Math.floor(task.planned_time / 60) || 0,
      minutes: task.planned_time % 60 || 0,
    }))
  );

  useEffect(() => {
    if (tasks) {
      setTaskVolume(tasks.length == 0 ? tasks.length + 2 : tasks.length + 1);
    }
  }, [tasks]);

  function handleChange(e, index) {
    if (taskVolume === Number(e.target.parentElement.id)) {
      setTaskVolume(taskVolume + 1);
    }

    if (
      taskVolume - 1 === Number(e.target.parentElement.id) &&
      e.target.value === ""
    ) {
      setTaskVolume(taskVolume - 1);
    }

    setInpValues((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        title: e.target.value,
        hours: updatedItems[index]?.hours ? updatedItems[index].hours : 0,
        minutes: updatedItems[index]?.minutes ? updatedItems[index].minutes : 0,
      };
      return updatedItems;
    });
  }

  function handleChangeNumber(e, index, format) {
    let value = Number(e.target.value);
    if (value === "") {
      value = 0;
    }

    setInpValues((prevItems) => {
      const updatedItems = [...prevItems];
      if (!updatedItems[index])
        updatedItems[index] = { title: "", hours: 0, minutes: 0 };

      if (format === 1) {
        updatedItems[index].hours = value;
      } else if (format === 2) {
        updatedItems[index].minutes = value;
      }

      return updatedItems;
    });
  }

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

        if (title.length > 20){
          setError("Максимальная длина задачи 20 символов");
          return false;
        }

        if (planned_time <= 0) {
          setError("Время для одного из дел слишком мало");
          return false;
        }

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

  useEffect(() => {
    let totalMinutes = inpValues.reduce((sum, task) => {
      console.log(task.hours, task.minutes);
      const time = task.minutes + task.hours * 60;
      return sum + time;
    }, 0);

    if (isNaN(totalMinutes)) {
      totalMinutes = 0;
    }

    setTotalTime({
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    });
  }, [inpValues]);

  async function sendTasks(e) {
    e.preventDefault();

    if (!checkFields()) {
      setSuccess(false);
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
        console.log(data);
        if (data?.code == "token_not_valid") {
          UpdateTokens(sendTaskData);
        } else {
          setError(false);
          setSuccess("Шаблон был успешно изменен!");
        }
      }

      sendTaskData();
    } catch (err) {
      console.log(err);
    }
  }

  if (inpValues) {
    return (
      <div className={styles.block_settingsTasksFormat1}>
        <form
          className={styles.block_inputs}
          onSubmit={sendTasks}
          ref={tasksRef}
        >
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {Array.from({ length: taskVolume }, (_, index) => (
            <div className={styles.field} key={index}>
              <div className={styles.input_task} id={index + 1}>
                <Input
                  placeholder="Введите занятие"
                  onChange={(e) => handleChange(e, index)}
                  value={inpValues[index] ? inpValues[index].title : ""}
                />
              </div>

              <div className={styles.time_inputes}>
                <div className={styles.hours}>
                  <Input
                    placeholder="0"
                    onChange={(e) => handleChangeNumber(e, index, 1)}
                    type="number"
                    value={
                      inpValues[index] && !isNaN(inpValues[index].hours)
                        ? String(Math.floor(inpValues[index].hours))
                        : ""
                    }
                  />
                  <p>ч</p>
                </div>
                <div className={styles.minutes}>
                  <Input
                    placeholder="0"
                    onChange={(e) => handleChangeNumber(e, index, 2)}
                    type="number"
                    value={
                      inpValues[index] && !isNaN(inpValues[index].minutes)
                        ? String(Math.floor(inpValues[index].minutes))
                        : ""
                    }
                  />
                  <p>мин</p>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.total_time}>
            <p>
              Cуммарное время цели на каждый день: {TotalTime.hours}ч{" "}
              {TotalTime.minutes}мин
            </p>
          </div>

          <Button width="100%">Создать новый план</Button>
        </form>
      </div>
    );
  }
}

export default SettingsTasksFormat1;
