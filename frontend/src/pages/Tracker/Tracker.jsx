import { Link } from "react-router-dom";
import styles from "./Tracker.module.scss";
import ModalWindowAddTime from "../../components/ModalWindowAddTime/ModalWindowAddTime";
import Button from "../../components/Button/Button";
import { useEffect, useRef, useState } from "react";

function Tracker() {
  const [isRunning, setIsRunning] = useState(false);
  const btns1Ref = useRef(null);
  const btns2Ref = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isOpenAddTime, setIsOpenAddTime] = useState(false);

  useEffect(() => {
    if (localStorage.isRunning == "true" && localStorage.startTime) {
      const secs = Math.floor(
        (Date.now() - Number(localStorage.startTime)) / 1000
      );

      setHours(Math.floor(secs / 3600));
      setMinutes(Math.floor((secs % 3600) / 60));
      setSeconds(secs % 60);

      setIsRunning(true);
      btns1Ref.current.style.display = "none";
      btns2Ref.current.style.display = "flex";
    } else {
      const totalSeconds = Number(localStorage.pausedTime) || 0;

      setHours(Math.floor(totalSeconds / 3600));
      setMinutes(Math.floor((totalSeconds % 3600) / 60));
      setSeconds(totalSeconds % 60);
    }
  }, []);

  function startTime() {
    console.log("start");
    btns1Ref.current.style.display = "none";
    btns2Ref.current.style.display = "flex";
    console.log(localStorage.startTime);

    if (!localStorage.startTime) {
      const pausedTime = Number(localStorage.getItem("pausedTime")) || 0;

      localStorage.setItem("startTime", Date.now() - pausedTime * 1000);
      setIsRunning(true);
      localStorage.setItem("isRunning", "true");
    }
  }

  function deleteTime() {
    console.log("delete");
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setIsRunning(false);

    localStorage.removeItem("startTime");
    localStorage.removeItem("isRunning");
    localStorage.removeItem("hours");
    localStorage.removeItem("minutes");
    localStorage.removeItem("seconds");
    localStorage.removeItem("pausedTime");
  }

  function stopTime() {
    console.log("stop");
    btns2Ref.current.style.display = "none";
    btns1Ref.current.style.display = "flex";
    setIsRunning(false);

    localStorage.setItem("isRunning", "false");
    localStorage.removeItem("startTime");

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    localStorage.setItem("pausedTime", totalSeconds);
  }

  function saveTime() {
    console.log("save");
    setIsOpenAddTime(true);

    stopTime();
  }

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const start = Number(localStorage.getItem("startTime"));
      const secs = Math.floor((Date.now() - start) / 1000);

      setHours(Math.floor(secs / 3600));
      setMinutes(Math.floor((secs % 3600) / 60));
      setSeconds(secs % 60);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className={styles.tracker_block}>
      <div className={styles.time}>
        <h1>
          {hours < 10 ? "0" + String(hours) : hours}:
          {minutes < 10 ? "0" + String(minutes) : minutes}:
          {seconds < 10 ? "0" + String(seconds) : seconds}
        </h1>
      </div>
      <div className={styles.buttons1} ref={btns1Ref}>
        <Button format={2} onClick={deleteTime}>
          Сбросить
        </Button>
        <Button onClick={startTime}>Запустить</Button>
      </div>
      <div className={styles.buttons2} ref={btns2Ref}>
        <Button format={2} onClick={stopTime}>
          Остановить
        </Button>
        <Button onClick={saveTime}>Сохранить</Button>
      </div>

      <ModalWindowAddTime
        isOpen={isOpenAddTime}
        time={{ hours: hours, minutes: minutes }}
        onClose={() => {
          setIsOpenAddTime(false);
        }}
        setHours={setHours}
        setMinutes={setMinutes}
        setSeconds={setSeconds}
        deleteTime={deleteTime}
      ></ModalWindowAddTime>
    </div>
  );
}

export default Tracker;
