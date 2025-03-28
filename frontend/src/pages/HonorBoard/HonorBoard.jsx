import styles from "./HonorBoard.module.scss";
import no_avatar from "../../assets/no_avatar.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";

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
        console.log(data)

        if (response.ok) {
          setMessages(data.messages.entries);
          console.log(data.messages.entries)
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
    return <p>loading...</p>;
  }
}

export default HonorBoard;
