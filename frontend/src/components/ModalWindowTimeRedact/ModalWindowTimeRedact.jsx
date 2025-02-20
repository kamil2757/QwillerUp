import styles from "./ModalWindowTimeRedact.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import Input from "../Input/Input";
import Button from "../Button/Button";

function ModalWindowTimeRedact({ children, isOpen, onClose, info }) {
  const [hours, setHours] = useState(info.currentHours ?? "");
  const [minutes, setMinutes] = useState(info.currentMinutes ?? "");
  const [isVisible, setIsVisible] = useState(isOpen);
  const modalBlock = useRef(null);

  useEffect(() => {
    setHours(info.currentHours ?? "");
    setMinutes(info.currentMinutes ?? "");
  }, [info]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key == "Escape") {
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
    <div className={styles.modal_back} onClick={onClose} ref={modalBlock}>
      <div className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        <img src={cross} alt="" onClick={onClose} />
        <div className={styles.conteiner}>
          <h1>{info.taskName}</h1>
          <ProgressBar width="100%" percent="40" />
          <div className={styles.content}>
            <div className={styles.edit}>
              <div className={styles.edit_time}>
                <div className={styles.format1}>
                  <p>
                    cейчас
                    <Input
                      value={hours}
                      format={2}
                      onChange={(e) => setHours(e.target.value)}
                    ></Input>
                    час
                    <Input
                      value={minutes}
                      format={2}
                      onChange={(e) => setMinutes(e.target.value)}
                    ></Input>
                    мин
                  </p>
                </div>
                <div className={styles.format2}>
                  <Button padding="0 26px" width="48%">
                    +5 мин
                  </Button>
                  <Button padding="0 26px" width="48%">
                    +15 мин
                  </Button>
                  <Button padding="0 26px" width="48%">
                    +30 мин
                  </Button>
                  <Button padding="0 26px" width="48%">
                    +1 час
                  </Button>
                </div>
              </div>
              <Button format={2} width="100%">
                Сохранить
              </Button>
            </div>
            <div className={styles.info}>
              <div className={styles.aim_task}>
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
