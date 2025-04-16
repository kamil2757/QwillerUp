import { useEffect, useState, useRef, useContext } from "react";
import styles from "./ModalWindowAddTime.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import Button from "../Button/Button";
import UserContext from "../../contexts/UserContext";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Input from "../Input/Input";

function ModalWindowAddTime({ isOpen, onClose, time, deleteTime }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const { domain, protocol, UpdateTokens, authorized } =
    useContext(UserContext);
  const [tasks, setTasks] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const navigate = useNavigate();
  const [hours, setHours] = useState(time.hours);
  const [minutes, setMinutes] = useState(time.minutes);

  function onCloseUpd() {
    setCurrentTask(null);
    onClose();
  }

  const modalBack = useRef(null);

  async function getTasks() {
    if (isOpen) {
      try {
        const response = await fetch(
          `${protocol}://${domain}/api/goals/get-active-goal/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTasks(data.data.tasks);
        } else if (response.status === 404) {
          setTasks(false);
        } else {
          UpdateTokens();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    console.log("isOpen: " + isOpen);
    console.log("isVisible: " + isVisible);
    if (isOpen) {
      getTasks();
    }
  }, [isOpen]);

  function handleClickTask(event) {
    const tasksHTML = document.querySelectorAll(`.${styles.task}`);

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title == event.target.textContent) {
        setCurrentTask(tasks[i]);
      }

      if (tasksHTML[i].textContent == event.target.textContent) {
        tasksHTML[i].classList.add(styles.active);
      } else {
        tasksHTML[i].classList.remove(styles.active);
      }
    }
  }

  async function UpdateTime(time, task) {
    console.log(time)
    if (time.hours * 60 + time.minutes == 0) {
      console.log("Можно ничо не делать у него 0 минут");
      deleteTime();
      return;
    }

    const response = await fetch(
      `${protocol}://${domain}/api/goals/set-time-task/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          time_spent: time + task.spent_time,
          title: task.title,
        }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      deleteTime();
    } else {
      UpdateTokens(() =>
        UpdateTime(
          time,
          currentTask
        )
      );
    }

    onClose();
    console.log(data);

    // if (!response.ok) {
    //   UpdateTokens(() => updateTimeTask(time_spent, title));
    //   return;
    // } else {
    //   setError(false);
    //   onClose();
    // }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key == "Escape") {
        onCloseUpd();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      setIsVisible(isOpen);
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "17px";

      setTimeout(() => {
        if (modalBack.current) {
          modalBack.current.style.opacity = "1";
        }
      }, 10);
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
      if (modalBack.current) {
        modalBack.current.style.opacity = "0";
      }
      setTimeout(() => {
        setIsVisible(isOpen);
      }, 200);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.modal_back}
      ref={modalBack}
      onClick={() => onCloseUpd()}
    >
      <div className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        <img src={cross} alt="" onClick={onCloseUpd} className={styles.cross} />
        <div className={styles.conteiner}>
          <div className={styles.tasksContent}>
            {tasks ? (
              <>
                {tasks.map((task) => (
                  <div className={styles.task} key={task.id}>
                    <div onClick={handleClickTask}>{task.title}</div>
                  </div>
                ))}
              </>
            ) : tasks === false ? (
              <div className={styles.instruction}>
                <p>
                  У вас пока нет задач. Добавьте их в{" "}
                  <Link to="/settings/tasks/format1">настройках</Link>, чтобы
                  начать!
                </p>
              </div>
            ) : (
              <div className={styles.loading}>Загрузка...</div>
            )}
          </div>
          <div className={styles.edit_block}>
            <div className={styles.info}>
              <div>
                {currentTask ? (
                  <div className={styles.taskInfo}>
                    <h1>{currentTask.title}</h1>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.time}>
                <div className={styles.time_hours}>
                  <Input
                    value={hours}
                    format={2}
                    onChange={(e) => setHours(Number(e.target.value))}
                    type="number"
                  ></Input>
                  час
                </div>
                <div className={styles.time_minutes}>
                  <Input
                    value={minutes}
                    format={2}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    type="number"
                  ></Input>
                  мин
                </div>
              </div>
              {!currentTask ? (
                <div className={styles.text}>
                  Выбери дело, которым занимался, и добавь время. Можно
                  скорректировать, если нужно
                </div>
              ) : (
                ""
              )}
              <div className={styles.btns}>
                {currentTask ? (
                  <>
                    <Button
                      onClick={() => {
                        UpdateTime(hours * 60 + minutes, currentTask);
                        onCloseUpd();
                      }}
                    >
                      Добавить
                    </Button>
                    <Button format={2} onClick={onCloseUpd}>
                      Отмена
                    </Button>
                  </>
                ) : (
                  <Button format={2} onClick={onCloseUpd}>
                    Отмена
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    document.getElementById("modal-root")
  );
}

export default ModalWindowAddTime;
