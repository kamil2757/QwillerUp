import styles from "./NotFoundPage.module.scss";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className={styles.block_notFoundPage}>
      <h1>Ошибка 404. Ой-ой! Вы заблудились?</h1>
      <p>
        Это явно не та страница, где нужно быть продуктивным... Тут даже задач
        нет! Но не переживайте, просто вернитесь назад или отправляйтесь <Link to="/main">на
        главную</Link>, пока ваш день не сбился с курса!
      </p>
    </div>
  );
}

export default NotFoundPage;
