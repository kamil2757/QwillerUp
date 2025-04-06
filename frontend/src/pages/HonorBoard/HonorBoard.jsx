import styles from "./HonorBoard.module.scss";
import no_avatar from "../../assets/no_avatar.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import ContentLoader from "react-content-loader";

function HonorBoard() {
  const [messages, setMessages] = useState(null);
  const { domain, userData, protocol, UpdateTokens } = useContext(UserContext);
  const [isMini, setIsMini] = useState(false);
  const [isSuperMini, setIsSuperMini] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMini(window.innerWidth <= 1150);
      setIsSuperMini(window.innerWidth <= 624);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function GetHonorBoard() {
      try {
        const response = await fetch(
          `${protocol}://${domain}/api/honor-board/get-messages/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setMessages(data.messages.entries);
          console.log(data.messages.entries);
        } else {
          UpdateTokens(GetHonorBoard);
        }
      } catch (err) {
        console.log("Ошибка загрузки данных:", err);
      }
    }

    GetHonorBoard();
  }, []);

  if (messages) {
    if (messages.length == 0) {
      return (
        <div className={styles.infoText}>
          <div className={styles.infoText__text}>
            Сегодняшний день прошёл без отметок на доске почёта. Возможно,
            завтра мы увидим здесь новые имена.
          </div>
        </div>
      );
    }

    return (
      <div className={styles.honorBoard_block}>
        {messages.map((message) => (
          <div className={styles.message} key={message.user_id}>
            <div className={styles.text}>{message.message}</div>
            <img
              src={
                message.photo
                  ? `${protocol}://${domain}${decodeURIComponent(
                      message.photo
                    )}`
                  : no_avatar
              }
              alt=""
            />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className={styles.honorBoard_block}>
        <ContentLoader
          speed={1.5}
          width="100vw"
          height="100vh"
          viewBox="0 0 100% 100%"
          backgroundColor="#2f3864"
          foregroundColor="#6876bb"
          style={{ width: "100vw", height: "100vh" }}
        >
          <rect
            x="10%"
            y="0%"
            rx="20"
            ry="20"
            width={isSuperMini ? "68%" : isMini ? "71%" : "73.8%"}
            height={isSuperMini ? "10%" : isMini ? "7%" : "10%"}
          />
          <rect
            x="10%"
            y={isSuperMini ? "11.5%" : isMini ? "8.5%" : "11.5%"}
            rx="20"
            ry="20"
            width={isSuperMini ? "68%" : isMini ? "71%" : "73.8%"}
            height={isSuperMini ? "10%" : isMini ? "7%" : "10%"}
          />
          <rect
            x="10%"
            y={isSuperMini ? "23%" : isMini ? "17%" : "23%"}
            rx="20"
            ry="20"
            width={isSuperMini ? "68%" : isMini ? "71%" : "73.8%"}
            height={isSuperMini ? "10%" : isMini ? "7%" : "10%"}
          />
          <circle
            cx="88%"
            cy={isSuperMini ? "5%" : isMini ? "3.5%" : "5%"}
            r={isSuperMini ? "26" : isMini ? "38" : "44"}
          />
          <circle
            cx="88%"
            cy={isSuperMini ? "16.5%" : isMini ? "12%" : "16.5%"}
            r={isSuperMini ? "26" : isMini ? "38" : "44"}
          />
          <circle
            cx="88%"
            cy={isSuperMini ? "28%" : isMini ? "20.5%" : "28%"}
            r={isSuperMini ? "26" : isMini ? "38" : "44"}
          />
        </ContentLoader>
      </div>
    );
  }
}

export default HonorBoard;
