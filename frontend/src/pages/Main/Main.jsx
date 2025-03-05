import styles from "./Main.module.scss";
import edit from "../../assets/edit.svg";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ProgressCircle from "../../components/ProgressCircle/ProgressCircle";
import ModalWindowTimeRedact from "../../components/ModalWindowTimeRedact/ModalWindowTimeRedact";
import ModalWindowNewLevel from "../../components/ModalWindowNewLevel/ModalWindowNewLevel";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Main() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
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

  useEffect(() => {
    async function getTasks() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/goals/get-active-goal/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const data = await response.json();
        console.log(data.data.tasks);
        setTasks(data.data.tasks);
        setMessage(data.setMessage);
      } catch (err) {
        console.log(err);
      }
    }

    getTasks();
  }, []);

  function setterInfo() {
    setModalInfo({
      taskName: "Программирование",
      currentHours: 4,
      currentMinutes: 10,
      aimHours: 5,
      aimMinutes: 0,
    });

    setModalIsOpen(true);
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
                  />
                </div>
                <div className={styles.bl2}>
                  {task.spent_time < 60 && (
                    <p>{Math.floor(task.spent_time / 60)}мин</p>
                  )}
                  {task.spent_time >= 60 && (
                    <>
                      <p>{task.spent_time % 60}час</p>
                      <p>{task.spent_time % 60}мин</p>
                    </>
                  )}
                  <img src={edit} alt="" onClick={setterInfo} />
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
            <p>Привет, Kamil! Ты уже потратил 30 часов на обучение!</p>
          </div>
        )}
        {/* <Button onClick={() => setModal2IsOpen(true)} width="100%">modal window "New level"</Button> */}
      </div>
      <div className={styles.block2}>
        <div className={styles.diagramm}>
          <ProgressCircle
            goalTime={5}
            spentTime={3.5}
            mini={isMini}
            superMini={isSuperMini}
          />
        </div>
        <div className={styles.timeInfo}>
          <div className={styles.total_time}>Время всего: 3ч 30мин</div>
          <div className={styles.aim_time}>Цель: 5ч</div>
        </div>
      </div>
      {isMini && (
        <div className={styles.motivation}>
          <p>Привет, Kamil! Ты уже потратил 30 часов на обучение!</p>
        </div>
      )}

      <ModalWindowTimeRedact
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
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
