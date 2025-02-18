import styles from "./ModalWindowCheckLevel.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import experience from "../../assets/experience.svg";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import ice from "../../assets/ice.svg";
import arrow_down from "../../assets/arrow_down.svg";

function ModalWindowCheckLevel({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const modalBlock = useRef(null);

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
        <img src={cross} alt="" onClick={onClose} className={styles.cross} />
        <div className={styles.conteiner}>
          <div className={styles.experience_now}>
            <h1>25 уровень</h1>
            <div className={styles.experience_block}>
              <img src={experience} alt="" />
              <ProgressBar percent="60" width="40vw" />
              <p>60/100</p>
              <img src={arrow_down} alt="" className={styles.arrow_down} />
            </div>
          </div>
          <div className={styles.experience_soon}>
            <div className={styles.level}>
              <h1>26 уровень</h1>
              <div className={styles.awards}>
                <div className={styles.award}>
                  <img src={ice} alt="" />
                  <p>лед</p>
                </div>
              </div>
            </div>
            <div className={styles.info}>
              <p>Повышай свой уровень, чтобы получать разные награды</p>
              <p>Вау, у тебя уже 25 уровень!</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default ModalWindowCheckLevel;
