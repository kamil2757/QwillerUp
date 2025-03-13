import { useEffect, useState, useRef } from "react";
import styles from "./ModalWindowNewMedal.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import experience from "../../assets/experience.svg";
import ice from "../../assets/ice.svg";
import ProgressBar from "../ProgressBar/ProgressBar";
import medal_1_1 from "../../assets/1.1.svg";
import medal_1_2 from "../../assets/1.2.svg";
import medal_1_3 from "../../assets/1.3.svg";

import medal_2_1 from "../../assets/2.1.svg";
import medal_2_2 from "../../assets/2.2.svg";
import medal_2_3 from "../../assets/2.3.svg";

import medal_3_1 from "../../assets/3.1.svg";
import medal_3_2 from "../../assets/3.2.svg";
import medal_3_3 from "../../assets/3.3.svg";

import medal_4_1 from "../../assets/4.1.svg";

function ModalWindowNewMedal({ isOpen, onClose, medal_data}) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const medals = {
    "1.1.svg": medal_1_1,
    "1.2.svg": medal_1_2,
    "1.3.svg": medal_1_3,

    "2.1.svg": medal_2_1,
    "2.2.svg": medal_2_2,
    "2.3.svg": medal_2_3,

    "3.1.svg": medal_3_1,
    "3.2.svg": medal_3_2,
    "3.3.svg": medal_3_3,

    "4.1.svg": medal_4_1,
  };

  const modalBack = useRef(null);

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
          <div className={styles.new_medal}>
            <img src={medals[medal_data.img]} alt="new_medal" />
            <p className={styles.title}>{medal_data.title}</p>
            <p className={styles.description}>{medal_data.description}</p>
          </div>
          <div className={styles.info_medal}>
            <div className={styles.congratulations}>
              <h1>Поздравляем!</h1>
              <p>Вы получили новую медаль</p>
            </div>
            <p className={styles.info}>
              Продолжайте активно пользоваться QwillerUp и зарабатывайте ещё
              больше крутых медалей!
            </p>
          </div>
        </div>
      </div>
    </div>,

    document.getElementById("modal-root")
  );
}

export default ModalWindowNewMedal;
