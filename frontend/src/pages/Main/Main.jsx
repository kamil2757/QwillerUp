import styles from "./Main.module.scss";
import edit from "../../assets/edit.svg";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ProgressCircle from "../../components/ProgressCircle/ProgressCircle";
import ModalWindowTimeRedact from "../../components/ModalWindowTimeRedact/ModalWindowTimeRedact";
import ModalWindowNewLevel from "../../components/ModalWindowNewLevel/ModalWindowNewLevel";
import ModalWindowNewMedal from "../../components/ModalWindowNewMedal/ModalWindowNewMedal";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";

function Main() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const { authorized, UpdateTokens, domain } = useContext(UserContext);
  const [modalInfo, setModalInfo] = useState({
    taskName: null,
    currentHours: null,
    currentMinutes: null,
    aimHours: null,
    aimMinutes: null,
  });
  const [isMini, setIsMini] = useState(false);
  const [isSuperMini, setIsSuperMini] = useState(false);
  const [tasks, setTasks] = useState(false);
  const [message, setMessage] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [goalTime, setGoalTime] = useState(0);
  const [perfectDay, setPerfectDay] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMini(window.innerWidth < 812);
      setIsSuperMini(window.innerWidth < 396);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function getTasks() {
    setTotalTime(0);
    setGoalTime(0);
    try {
      const response = await fetch(
        `http://${domain}/api/goals/get-active-goal/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data.data.tasks);
        setMessage(data.message_for_user);
        setPerfectDay(data.perfect_day);

        for (const task of data.data.tasks) {
          setTotalTime((prevTotal) => prevTotal + task.spent_time);
          setGoalTime((prevGoal) => prevGoal + task.planned_time);
        }
      } else if (response.status === 404) {
        setTasks(false);
      } else {
        UpdateTokens();
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (authorized == true) {
      getTasks();
    }
  }, []);


  function hanldeClickEdit(e) {
    const task_title = e.target.parentNode.parentNode
      .querySelector(`.${styles.bl1}`)
      .querySelector(`p`).innerText;

    for (let t of tasks) {
      if (t.title == task_title) {
        setModalInfo({
          taskName: task_title,
          currentHours: Math.floor(t.spent_time / 60),
          currentMinutes: t.spent_time % 60,
          aimHours: Math.floor(t.planned_time / 60),
          aimMinutes: t.planned_time % 60,
        });
      }
    }

    setModalIsOpen(true);
  }

  if (!tasks) {
    return (
      <div className={styles.message_not_tasks}>
        У вас пока нет задач. Добавьте их в настройках, чтобы начать!
      </div>
    );
  }

  return (
    <div className={styles.main_block}>
      <div className={styles.block1}>
        <div className={styles.tasksContent}>
          {tasks &&
            tasks.map((task) => (
              <div className={styles.task} key={task.id}>
                <div className={styles.bl1}>
                  <p>{task.title}</p>
                  <ProgressBar
                    width={isMini ? "45vw" : "24vw"}
                    percent={(task.spent_time / task.planned_time) * 100}
                    bgc="rgb(79, 87, 129)"
                  />
                </div>
                <div className={styles.bl2}>
                  {task.spent_time < 60 && <p>{task.spent_time % 60}мин</p>}
                  {task.spent_time >= 60 && (
                    <>
                      <p>
                        {Math.floor(task.spent_time / 60)}ч{" "}
                        {task.spent_time % 60}мин
                      </p>
                    </>
                  )}
                  <img src={edit} alt="" onClick={hanldeClickEdit} />
                </div>
              </div>
            ))}

          {!tasks && <p>Загрузка...</p>}
        </div>
        <Link to="/settings/tasks/format1">
          <Button width="100%" format={2}>
            Изменить занятия
          </Button>
        </Link>

        {!isMini && (
          <div className={styles.motivation}>
            {perfectDay && (
              <p>
                Kamil! ты сделал все дела и получил <span>идеальный день</span>!
                ты большой молодец, продолжай так же усердно заниматься!
              </p>
            )}
            {!perfectDay && <p>{message}</p>}
          </div>
        )}
        {/* <Button onClick={() => setModal2IsOpen(true)} width="100%">modal window "New level"</Button> */}
      </div>
      <div className={styles.block2}>
        <div className={styles.diagramm}>
          <ProgressCircle
            goalTime={goalTime}
            spentTime={totalTime}
            mini={isMini}
            superMini={isSuperMini}
            perfect_day={perfectDay}
          />
        </div>
        <div className={styles.timeInfo}>
          {totalTime < 60 && (
            <div
              className={`${styles.total_time} ${
                perfectDay ? styles.total_timePerfect : ""
              }`}
            >
              <p>{totalTime % 60}мин</p>
            </div>
          )}
          {totalTime >= 60 && (
            <div
              className={`${styles.total_time} ${
                perfectDay ? styles.total_timePerfect : ""
              }`}
            >
              <p>
                Время всего: {Math.floor(totalTime / 60)}ч {totalTime % 60}мин
              </p>
            </div>
          )}
          {goalTime < 60 && <p>{goalTime % 60}мин</p>}
          {goalTime >= 60 && (
            <div className={styles.goal_time}>
              <p>
                Цель: {Math.floor(goalTime / 60)}ч {goalTime % 60}мин
              </p>
            </div>
          )}
        </div>
      </div>
      {isMini && (
        <div className={styles.motivation}>
          {perfectDay && (
            <p>
              Kamil! ты сделал все дела и получил <span>идеальный день</span>!
              ты большой молодец, продолжай так же усердно заниматься!
            </p>
          )}
          {!perfectDay && <p>{message}</p>}
        </div>
      )}

      <ModalWindowTimeRedact
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
          getTasks();
        }}
        info={modalInfo}
      ></ModalWindowTimeRedact>
      <ModalWindowNewLevel
        isOpen={modal2IsOpen}
        onClose={() => setModal2IsOpen(false)}
      ></ModalWindowNewLevel>
    </div>
  );
}

export default Main;
