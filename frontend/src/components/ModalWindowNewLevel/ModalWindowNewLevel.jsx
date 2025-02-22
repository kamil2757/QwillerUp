import { useEffect, useState, useRef } from "react";
import styles from "./ModalWindowNewLevel.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import experience from "../../assets/experience.svg";
import ice from "../../assets/ice.svg";
import ProgressBar from "../ProgressBar/ProgressBar";

function ModalWindowNewLevel({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isMini, setIsMini] = useState(false);

  const modalBack = useRef(null);

  useEffect(() => {
    function handleResize() {
      setIsMini(window.innerWidth <= 995);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key == "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      setIsVisible(true);
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
        setIsVisible(false);
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
      onClick={() => onClose()}
    >
      <div className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        <img src={cross} alt="" onClick={onClose} className={styles.cross} />
        <div className={styles.conteiner}>
          <h1>26 уровень!</h1>
          <div className={styles.experience_block}>
            <img src={experience} alt="" />
            <ProgressBar percent="60" width={isMini ? "280px" : "600px"} />
            <p>60/100</p>
          </div>
          <div className={styles.info}>
            <div className={styles.awards_block}>
              <div className={styles.award}>
                <img src={ice} alt="" />
                <p>Лед</p>
              </div>
              <div className={styles.award}>
                <img src={ice} alt="" />
                <p>Лед</p>
              </div>
            </div>
            <div className={styles.about}>
              <p>Ура, ты достиг 26 уровня и получаешь: лед !</p>
            </div>
          </div>
        </div>
      </div>
    </div>,

    document.getElementById("modal-root")
  );
}

export default ModalWindowNewLevel;
