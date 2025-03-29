import styles from "./HonorBoard.module.scss";
import no_avatar from "../../assets/no_avatar.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import ContentLoader from "react-content-loader";

function HonorBoard() {
  const [messages, setMessages] = useState(null);
  const { domain, userData, protocol, UpdateTokens } = useContext(UserContext);

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
    return (
      <div className={styles.honorBoard_block}>
        {messages.map((message) => (
          <div className={styles.message} key={message.user_id}>
            <div className={styles.text}>{message.message}</div>
            <img src={no_avatar} alt="" />
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
          <rect x="10%" y="0%" rx="20" ry="20" width="73.8%" height="10%" />
          <rect x="10%" y="11.5%" rx="20" ry="20" width="73.8%" height="10%" />
          <rect x="10%" y="23%" rx="20" ry="20" width="73.8%" height="10%" />
          <circle cx="88.2%" cy="5%" r="44" />
          <circle cx="88.2%" cy="16.5%" r="44" />
          <circle cx="88.2%" cy="28%" r="44" />
        </ContentLoader>
      </div>
    );
  }
}

export default HonorBoard;
