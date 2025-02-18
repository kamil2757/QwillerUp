import Button from "../../components/Button/Button";
import styles from "./ChooseFormat.module.scss";
import { Link } from "react-router-dom";

function ChooseFormat() {
  return (
    <div className={styles.block_chooseFormat}>
      <div className={styles.content}>
        <h1>Создание задач</h1>
        <p>Выберите какой формат задач вас больше привлекает</p>
        <div className={styles.btns}>
          <Link to='/create-format1'>
            <Button width="100%" format="2">
              Постоянный план (легче)
            </Button>
          </Link>
          <Link to='/create-format2'>
            <Button width="100%" format="2">
              Гибкое расписание
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChooseFormat;
