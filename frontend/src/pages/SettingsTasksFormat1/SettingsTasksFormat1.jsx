import styles from "./SettingsTasksFormat1.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useOutletContext, Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import UserContext from "../../contexts/UserContext";

function SettingsTasksFormat1() {
  // ======================= Контексты и стейты =======================
  const tasksRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [taskVolume, setTaskVolume] = useState(2);
  const [inpValues, setInpValues] = useState([]);
  const [TotalTime, setTotalTime] = useState({ hours: 0, minutes: 0 });

  const {
    UpdateTokens,
    domain,
    protocol,
    authorized,
    setTasksSettings,
    tasksSettings,
  } = useContext(UserContext);

  const [tasks, setTasks] = useState(tasksSettings);

  // ======================= Обработчики полей =======================

  // Обновление названия задачи
  function handleChange(e, index) {
    const parentId = Number(e.target.parentElement.id);
    if (taskVolume === parentId) {
      setTaskVolume(taskVolume + 1);
    }
    if (taskVolume - 1 === parentId && e.target.value === "") {
      setTaskVolume(taskVolume - 1);
    }

    setInpValues((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        title: e.target.value,
        hours: updated[index]?.hours || 0,
        minutes: updated[index]?.minutes || 0,
      };
      return updated;
    });
  }

  // Обновление времени задачи (часы или минуты)
  function handleChangeNumber(e, index, format) {
    let value = Number(e.target.value) || 0;

    setInpValues((prev) => {
      const updated = [...prev];
      if (!updated[index]) updated[index] = { title: "", hours: 0, minutes: 0 };
      if (format === 1) updated[index].hours = value;
      if (format === 2) updated[index].minutes = value;
      return updated;
    });
  }

  // ======================= Проверки полей =======================

  function checkFields() {
    const taskFields = tasksRef.current.querySelectorAll(`.${styles.field}`);
    let count = 0;

    for (const task of taskFields) {
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
        if (title.length > 16) {
          setError("Максимальная длина задачи 16 символов");
          return false;
        }
        if (planned_time <= 0) {
          setError("Время для одного из дел слишком мало");
          return false;
        }
        count += 1;
      } else if (count === 0) {
        setError("Добавьте хотя бы одно занятие, начиная с первого");
        return false;
      }
    }

    return true;
  }

  // ======================= Работа с API =======================

  async function getTasks() {
    const response = await fetch(
      `${protocol}://${domain}/api/goals/get-tasks/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setTasks(data.tasks);
      if (localStorage.setSuccess == "true") {
        setSuccess("Шаблон был успешно изменен!");
        localStorage.setSuccess = "false";
      }
    } else {
      UpdateTokens();
    }
  }

  async function sendTaskData(newGoal) {
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
      await UpdateTokens();
      await sendTaskData(newGoal);
      localStorage.setSuccess = "true";
    } else {
      setError(false);
      localStorage.schedule_type = "1";
      setSuccess("Шаблон был успешно изменен!");
    }
  }

  async function sendTasks(e) {
    if (e) e.preventDefault();
    if (!checkFields()) {
      setSuccess(false);
      return;
    }

    const newGoal = { day_of_week: 0, tasks: [] };
    const taskFields = tasksRef.current.querySelectorAll(`.${styles.field}`);

    for (const task of taskFields) {
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
      }
    }

    sendTaskData(newGoal);
  }

  // ======================= Эффекты =======================

  // Получаем задачи при первой загрузке, если выбран "Постоянный план"
  useEffect(() => {
    if (localStorage.schedule_type == "1" && !tasks) {
      getTasks();
    }
  }, []);

  // При получении задач обновляем инпуты
  useEffect(() => {
    if (tasks) {
      // Обновляем количество отображаемых полей
      setTaskVolume(tasks.length === 0 ? 2 : tasks.length + 1);

      setInpValues(() =>
        tasks.map((task) => ({
          title: task.title,
          hours: Math.floor(task.planned_time / 60) || 0,
          minutes: task.planned_time % 60 || 0,
        }))
      );
    }

    // отправляем, если до этого был refresh токена
    if (tasksSettings) {
      sendTasks();
      setTasksSettings(null);
    }
  }, [tasks]);

  // Подсчет общего времени всех задач
  useEffect(() => {
    if (inpValues) {
      let totalMinutes = inpValues.reduce(
        (sum, task) => sum + (task.minutes + task.hours * 60),
        0
      );
      if (isNaN(totalMinutes)) totalMinutes = 0;
      setTotalTime({
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
      });
    }
  }, [inpValues, tasks]);

  // ======================= Отображение =======================

  return (
    <div className={styles.block_settingsTasksFormat1}>
      <form className={styles.block_inputs} onSubmit={sendTasks} ref={tasksRef}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {Array.from({ length: taskVolume }, (_, index) => (
          <div className={styles.field} key={index}>
            <div className={styles.input_task} id={index + 1}>
              <Input
                placeholder="Введите занятие"
                onChange={(e) => handleChange(e, index)}
                value={inpValues[index]?.title || ""}
              />
            </div>

            <div className={styles.time_inputes}>
              <div className={styles.hours}>
                <Input
                  placeholder="0"
                  type="number"
                  onChange={(e) => handleChangeNumber(e, index, 1)}
                  value={inpValues[index]?.hours || ""}
                />
                <p>ч</p>
              </div>
              <div className={styles.minutes}>
                <Input
                  placeholder="0"
                  type="number"
                  onChange={(e) => handleChangeNumber(e, index, 2)}
                  value={inpValues[index]?.minutes || ""}
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

export default SettingsTasksFormat1;
