import styles from "./CreateFormat1.module.scss";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useRef, useState } from "react";

function CreateFormat1() {
  const [taskVolume, setTaskVolume] = useState(2);
  const [TotalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
  });
  const tasksRef = useRef(null)
  const [task, setTask] = useState([]);

  function sendTask(){
    console.log(tasksRef.current)
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
        console.log(time_minutes);
      }
    });

    minutes_arr.forEach((item) => {
      if (item) {
        time_minutes += Number(item.firstElementChild.value);
        console.log(time_minutes);
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
        <div className={styles.block_inputs} ref={tasksRef}>
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

          <Link to="/main">
            <Button width="100%" onClick={sendTask}>Готово</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateFormat1;
