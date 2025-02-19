import styles from "./ModalWindowCheckMedals.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import Input from "../Input/Input";
import Button from "../Button/Button";
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

function ModalWindowCheckMedals({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const modalBlock = useRef(null);
  const [description, setDescription] = useState(
    "Наведи на медаль, чтобы узнать условия её получения"
  );
  const data = {
    medal1: {
      title: 'Бронзовая медаль "Начало пути"',
      description: "100 часов общего времени",
      img: medal_1_1,
      equipped: true,
    },
    medal2: {
      title: 'Серебряная медаль "Продвинутый"',
      description: "250 часов общего времени",
      img: medal_1_2,
      equipped: false,
    },
    medal3: {
      title: 'Золотая медаль "Эксперт"',
      description: "1000 часов общего времени",
      img: medal_1_3,
      equipped: false,
    },
    medal4: {
      title: 'Бронзовая медаль "Начало"',
      description: "Огненный стрик 10 дней подряд",
      img: medal_2_1,
      equipped: false,
    },
    medal5: {
      title: 'Серебряная медаль "Пламя"',
      description: "Огненный стрик 100 дней подряд",
      img: medal_2_2,
      equipped: true,
    },
    medal6: {
      title: 'Золотая медаль "Безудержный огонь"',
      description: "Огненный стрик 365 дней подряд",
      img: medal_2_3,
      equipped: false,
    },
    medal7: {
      title: 'Бронзовая медаль "Трудяга"',
      description: "Позаниматься 10 дней с 10+ часами",
      img: medal_3_1,
      equipped: false,
    },
    medal8: {
      title: 'Серебряная медаль "Переработчик"',
      description: "Позаниматься 30 дней с 10+ часами",
      img: medal_3_2,
      equipped: false,
    },
    medal9: {
      title: 'Золотая медаль "Неутомимый"',
      description: "Позаниматься 100 дней с 10+ часами",
      img: medal_3_3,
      equipped: true,
    },
    medal10: {
      title: 'Золотая медаль "партнер"',
      description: "Поддержать автора монеткой",
      img: medal_4_1,
      equipped: false,
    },
  };

  const block_for_data = Math.ceil(Object.keys(data).length / 5);
  const arr_data = Object.entries(data);

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

    return () => {
      document.removeEventListener('keydown',  handleKeyDown)
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div className={styles.modal_back} onClick={onClose} ref={modalBlock}>
      <div className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        <img src={cross} alt="" onClick={onClose} className={styles.cross} />
        <div className={styles.conteiner}>
          <h1>Медали</h1>
          <div className={styles.info_block}>
            <p>
              Выбери 3 достижения, которые хочешь показать в своем профиле! Пусть
              другие увидят твои самые крутые успехи!
            </p>
          </div>
          <div className={styles.description}>
            <p>{description}</p>
          </div>
          <div className={styles.medals}>
            <div className={styles.block1}>
              {arr_data.slice(0, 5).map((data) => (
                <div
                  className={
                    data[1].equipped
                      ? `${styles.medal} ${styles.equipped}`
                      : styles.medal
                  }
                  key={data}
                  onMouseEnter={() => {
                    setDescription(data[1].description);
                  }}
                >
                  <img src={data[1].img} alt="" />
                  <p>{data[1].title}</p>
                </div>
              ))}
            </div>
            {block_for_data == 2 && (
              <div className={styles.block2}>
                {arr_data.slice(5, 10).map((data) => (
                  <div
                    className={
                      data[1].equipped
                        ? `${styles.medal} ${styles.equipped}`
                        : styles.medal
                    }
                    key={data}
                    onMouseEnter={() => {
                      setDescription(data[1].description);
                    }}
                  >
                    <img src={data[1].img} alt="" />
                    <p>{data[1].title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button width="100%">Применить</Button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default ModalWindowCheckMedals;
