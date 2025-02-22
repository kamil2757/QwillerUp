import { useEffect, useState, useRef } from "react";
import styles from "./ModalWindowLogout.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import Button from "../Button/Button";

function ModalWindowLogout({ isOpen, onClose }) {
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
          <h1>Вы уверены, что хотите выйти?</h1>
          <div className={styles.btns_block}>
            <Button>Выйти</Button>
            <Button format={2} onClick={onClose}>Назад</Button>
          </div>
        </div>
      </div>
    </div>,

    document.getElementById("modal-root")
  );
}

export default ModalWindowLogout;
