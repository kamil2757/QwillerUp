import styles from "./ModalWindowCheckMedals.module.scss";
import ReactDOM from "react-dom";
import cross from "../../assets/cross.svg";
import { useEffect, useRef, useState, useLayoutEffect, useContext } from "react";
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
import UserContext from "../../contexts/UserContext";

function ModalWindowCheckMedals({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const { UpdateTokens, domain } = useContext(UserContext);
  const modalBlock = useRef(null);
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
  const [description, setDescription] = useState(
    "Наведи на медаль, чтобы узнать условия её получения"
  );
  const [dataMedals, setDataMedals] = useState(null);
  const [blockForData, setBlockForData] = useState(null);
  const [arrData, setArrData] = useState(null);
  const [equippedMedals, setEquippedMedals] = useState(null);

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
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    async function getMedals() {
      try {
        const response = await fetch(
          `http://${domain}/api/users/getUserMedals/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok){
          UpdateTokens(getMedals)
          return
        }

        setDataMedals(data.medals);
        setBlockForData(Object.keys(data.medals).length / 5);
        setArrData(Object.entries(data.medals));

        const eqMedals = data.medals.filter((m) => m.equipped);
        setEquippedMedals(eqMedals.slice(0, 3));
      } catch (err) {
        console.log(err);
      }
    }

    getMedals();
  }, []);

  function handleBlockClick(e) {
    const classes = e.currentTarget.classList;
    if (!classes.contains(styles.hasnt) && !classes.contains(styles.equipped)) {
      const currentMedal = e.currentTarget.querySelector("p").innerText;
      let dataCurrentMedal = "Ничо нет";

      for (const m of dataMedals) {
        if (
          m.title.replace(/\s+/g, " ").trim() ==
          currentMedal.replace(/\s+/g, " ").trim()
        ) {
          dataCurrentMedal = m;
          break;
        } else {
        }
      }

      setEquippedMedals((prev) => {
        const arr = [...prev, dataCurrentMedal];
        arr.shift();
        return arr;
      });
    }
  }

  async function handlerClickButton() {
    try {
      console.log(equippedMedals)
      const response = await fetch(
        `http://${domain}/api/users/updateEquippedMedals/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(equippedMedals.map(m => m.id)),
        }
      );

      const data = await response.json();
      if (response.ok) {
        onClose()
      } else {
        UpdateTokens(handlerClickButton)
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (!isVisible || !dataMedals) return null;

  return ReactDOM.createPortal(
    <div className={styles.modal_back} onClick={onClose} ref={modalBlock}>
      <div className={styles.modal_block} onClick={(e) => e.stopPropagation()}>
        <img src={cross} alt="" onClick={onClose} className={styles.cross} />
        <div className={styles.conteiner}>
          <h1>Медали</h1>
          <div className={styles.info_block}>
            <p>
              Выбери 3 медали, которые хочешь показать в своем профиле! Пусть
              другие увидят твои самые крутые успехи!
            </p>
          </div>
          <div className={styles.description}>
            <p>{description}</p>
          </div>
          <div className={styles.medals}>
            <div className={styles.block1}>
              {arrData.slice(0, 5).map((data) => (
                <div
                  className={`
                  ${styles.medal} 
                  ${data[1].has ? "" : styles.hasnt} 
                  ${
                    equippedMedals?.some(
                      (medal) => medal.title === data[1].title
                    )
                      ? styles.equipped
                      : ""
                  }`}
                  key={data}
                  onMouseEnter={() => {
                    setDescription(data[1].description);
                  }}
                  onClick={handleBlockClick}
                >
                  <img src={medals[data[1].img]} alt="" />
                  <p>{data[1].title}</p>
                </div>
              ))}
            </div>
            {blockForData == 2 && (
              <div className={styles.block2}>
                {arrData.slice(5, 10).map((data) => (
                  <div
                    className={`
                    ${styles.medal} 
                    ${data[1].has ? "" : styles.hasnt} 
                    ${
                      equippedMedals?.some(
                        (medal) => medal.title === data[1].title
                      )
                        ? styles.equipped
                        : ""
                    }`}
                    key={data}
                    onMouseEnter={() => {
                      setDescription(data[1].description);
                    }}
                    onClick={handleBlockClick}
                  >
                    <img src={medals[data[1].img]} alt="" />
                    <p>{data[1].title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button width="100%" onClick={handlerClickButton}>
            Применить
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default ModalWindowCheckMedals;
