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
  const [modal2IsOpen, setModal2IsOpen] = useState(true);
  const [modalInfo, setModalInfo] = useState({
    taskName: null,
    currentHours: null,
    currentMinutes: null,
    aimHours: null,
    aimMinutes: null,
  });
  const [isMini, setIsMini] = useState(false);
  const [isSuperMini, setIsSuperMini] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMini(window.innerWidth < 812);
      setIsSuperMini(window.innerWidth < 396)
    }

    handleResize()

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
          <div className={styles.task}>
            <div className={styles.bl1}>
              <p>Английский</p>
              <ProgressBar width={isMini ? "45vw" : "24vw"} percent="80" />
            </div>
            <div className={styles.bl2}>
              <p>5мин</p>
              <img src={edit} alt="" onClick={setterInfo} />
            </div>
          </div>

          <div className={styles.task}>
            <div className={styles.bl1}>
              <p>Программирование</p>
              <ProgressBar width={isMini ? "45vw" : "24vw"} percent="40" />
            </div>
            <div className={styles.bl2}>
              <p>4ч</p>
              <img src={edit} alt="" onClick={() => setModalIsOpen(true)} />
            </div>
          </div>
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
