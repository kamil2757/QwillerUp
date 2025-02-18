import styles from "./Main.module.scss";
import edit from "../../assets/edit.svg";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ProgressCircle from "../../components/ProgressCircle/ProgressCircle";
import ModalWindowTimeRedact from "../../components/ModalWindowTimeRedact/ModalWindowTimeRedact";
import { useState } from "react";
import { Link } from "react-router-dom";

function Main() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    taskName: null,
    currentHours: null,
    currentMinutes: null,
    aimHours: null,
    aimMinutes: null,
  });

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
              <ProgressBar width="24vw" percent="80" />
            </div>
            <div className={styles.bl2}>
              <p>5мин</p>
              <img src={edit} alt="" onClick={setterInfo} />
            </div>
          </div>

          <div className={styles.task}>
            <div className={styles.bl1}>
              <p>Программирование</p>
              <ProgressBar width="24vw" percent="40" />
            </div>
            <div className={styles.bl2}>
              <p>4ч</p>
              <img src={edit} alt="" onClick={() => setModalIsOpen(true)} />
            </div>
          </div>
        </div>
        <Link to='/settings/tasks/format1'>
          <Button width="100%" format={2}>
            Изменить занятия
          </Button>
        </Link>

        <div className={styles.motivation}>
          <p>Привет, Kamil! Ты уже потратил 30 часов на обучение!</p>
        </div>
      </div>
      <div className={styles.block2}>
        <div className={styles.diagramm}>
          <ProgressCircle goalTime={4} spentTime={5} />
        </div>
        <div className={styles.timeInfo}>
          <div className={styles.total_time}>Время всего: 3ч 25мин</div>
          <div className={styles.aim_time}>Цель: 5ч</div>
        </div>
      </div>

      <ModalWindowTimeRedact
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        info={modalInfo}
      ></ModalWindowTimeRedact>
    </div>
  );
}

export default Main;
