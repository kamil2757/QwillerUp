import styles from "./ModalWindowTimeRedact.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useContext,
} from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import Input from "../Input/Input";
import Button from "../Button/Button";
import UserContext from "../../contexts/UserContext";

function ModalWindowTimeRedact({ children, isOpen, onClose, info }) {
  const [hours, setHours] = useState(info.currentHours);
  const [minutes, setMinutes] = useState(info.currentMinutes);
  const aimHours = info.aimHours;
  const aimMinutes = info.aimMinutes;
  const [isVisible, setIsVisible] = useState(isOpen);
  const [adaptive, setAdaptive] = useState(false);
  const modalBlock = useRef(null);
  const aimRef = useRef(null);
  const { UpdateTokens, domain, protocol } = useContext(UserContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Number(minutes) >= 60) {
      setHours((prevHours) => prevHours + Math.floor(Number(minutes) / 60));
      setMinutes(Number(minutes) % 60);
    }
  }, [minutes]);

  useEffect(() => {
    if (
      Number(hours) * 60 + Number(minutes) >=
      Number(aimHours) * 60 + Number(aimMinutes)
    ) {
      if (aimRef.current) {
        aimRef.current.style.backgroundColor = "rgb(248, 188, 59)";
      }
    } else {
      if (aimRef.current) {
        aimRef.current.style.backgroundColor = "rgb(122, 211, 249)";
      }
    }
  }, [hours, minutes]);

  useEffect(() => {
    function handleResize() {
      setAdaptive(window.innerWidth <= 674);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function updateTimeTask(time_spent, title) {
    try {
      const response = await fetch(
        `${protocol}://${domain}/api/goals/set-time-task/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            time_spent: time_spent,
            title: title,
          }),
        }
      );

      if (!response.ok) {
        UpdateTokens(() => updateTimeTask(time_spent, title));
        return;
      } else {
        setError(false);
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const time_spent = Number(hours * 60) + Number(minutes);
    const title = info.taskName;

    if (time_spent >= 20 * 60 || time_spent < 0) {
      setError("Нереальное время");
    } else {
      if (e.nativeEvent.submitter.name == "save_editTime") {
        updateTimeTask(time_spent, title);
      }
    }
  }

  useEffect(() => {
    setHours(info.currentHours ?? "");
    setMinutes(info.currentMinutes ?? "");
  }, [info]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key == "Escape") {
        setError(true);
        onClose();
      }
    }

    if (isOpen) {
      setIsVisible(true);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "17px";
      setTimeout(() => {
        if (modalBlock.current) {
          modalBlock.current.style.opacity = "1";
        }
      }, 10);
    } else {
      if (modalBlock.current) {
        modalBlock.current.style.opacity = "0";
      }
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";

      setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.modal_back}
      onClick={() => {
        setError(true);
        onClose();
      }}
      ref={modalBlock}
    >
      <div className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        <img
          src={cross}
          alt=""
          onClick={() => {
            setError(true);
            onClose();
          }}
        />
        <div className={styles.conteiner}>
          <h1>{info.taskName}</h1>
          <ProgressBar
            width="100%"
            percent={
              ((Number(hours) * 60 + Number(minutes)) /
                (Number(aimHours) * 60 + Number(aimMinutes))) *
              100
            }
            bgc="rgb(47, 56, 100)"
          />
          <div className={styles.content}>
            <form className={styles.edit} onSubmit={handleSubmit}>
              <div className={styles.edit_time}>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.format1}>
                  <p>
                    cейчас:
                    <Input
                      value={hours}
                      format={2}
                      onChange={(e) => setHours(e.target.value)}
                      type="number"
                    ></Input>
                    час
                    <Input
                      value={minutes}
                      format={2}
                      onChange={(e) => setMinutes(e.target.value)}
                      type="number"
                    ></Input>
                    мин
                  </p>
                </div>
                <div className={styles.format2}>
                  <Button
                    padding={adaptive ? "0 26px" : "0 18px"}
                    width={adaptive ? "46%" : undefined}
                    onClick={() =>
                      setMinutes((prevMinutes) => Number(prevMinutes) + 5)
                    }
                    name="5minutes"
                  >
                    +5 мин
                  </Button>
                  <Button
                    padding={adaptive ? "0 26px" : "0 18px"}
                    width={adaptive ? "46%" : undefined}
                    onClick={() =>
                      setMinutes((prevMinutes) => Number(prevMinutes) + 15)
                    }
                    name="15minutes"
                  >
                    +15 мин
                  </Button>
                  <Button
                    padding={adaptive ? "0 26px" : "0 18px"}
                    width={adaptive ? "46%" : undefined}
                    onClick={() =>
                      setMinutes((prevMinutes) => Number(prevMinutes) + 30)
                    }
                    name="30minutes"
                  >
                    +30 мин
                  </Button>
                  <Button
                    padding={adaptive ? "0 26px" : "0 18px"}
                    width={adaptive ? "46%" : undefined}
                    onClick={() =>
                      setHours((prevHours) => Number(prevHours) + 1)
                    }
                    name="1hours"
                  >
                    +1 час
                  </Button>
                </div>
              </div>
              <Button format={2} width="100%" name="save_editTime">
                Сохранить
              </Button>
            </form>
            <div className={styles.info}>
              <div className={styles.aim_task} ref={aimRef}>
                цель: {info.aimHours}ч {info.aimMinutes}мин
              </div>
              <div className={styles.instruction}>
                <p>Впиши свое время или нажми, сколько нужно добавить</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default ModalWindowTimeRedact;
