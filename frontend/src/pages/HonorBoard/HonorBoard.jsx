import styles from "./HonorBoard.module.scss";
import no_avatar from "../../assets/no_avatar.png";

function HonorBoard() {
  return (
    <div className={styles.honorBoard_block}>
      <div className={styles.message}>
        <div className={styles.text}>
          Мастурбек потратил 100 часов на обучение!
        </div>
        <img src={no_avatar} alt="" />
      </div>

      <div className={`${styles.message} ${styles.mark}`}>
        <div className={styles.text}>Kamil достиг 25 уровня!</div>
        <img src={no_avatar} alt="" />
      </div>

      <div className={styles.message}>
        <div className={styles.text}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo saepe
          maiores beatae voluptate odit temporibus neque quos, at labore!
          Reiciendis ab aspernatur earum cumque a laudantium eius. Eaque, at
          quos.
        </div>
        <img src={no_avatar} alt="" />
      </div>
    </div>
  );
}

export default HonorBoard;
