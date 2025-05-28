import Header from "../../components/Header/Header";
import styles from "./Landing.module.scss";
import welcome_img from "../../assets/welcome_img.svg";
import Button from "../../components/Button/Button";
import Footer from "../../components/Footer/Footer";
import Login from "../Login/Login";
import arrow1 from "../../assets/arrow1.svg";
import arrow2 from "../../assets/arrow2.svg";
import awards from "../../assets/awards_picture.svg";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className={styles.landing_block}>
      <div className={styles.welcome_block}>
        <div className={styles.text}>
          <h1>Планируй и отслеживай свои цели!</h1>
          <p>
            Начни свой продуктивный путь уже сегодня! Наш сайт поможет тебе
            отслеживать, сколько времени ты посвящаешь обучению, эффективно
            управлять своим временем и получать за это опыт и достижения
          </p>
          <Link to="/login">
            <Button>Начать</Button>
          </Link>
        </div>
        <div className={styles.image}>
          <img src={welcome_img} alt="" />
        </div>
      </div>
      <div className={styles.pluses_block} id="about">
        <h1>Как наш метод для отслеживании времени улучшает продуктивность?</h1>
        <p>
          Отслеживание времени помогает избежать прокрастинации, потому что
          видно, сколько реально потрачено на учёбу. Это даёт измеримый прогресс
          и мотивацию продолжать, даже если результаты не сразу заметны. Такой
          подход предотвращает перегрузки, позволяя равномерно распределять
          нагрузку. Фиксированное время на задачу помогает лучше
          концентрироваться и работать без отвлечений. А система наград делает
          процесс обучения увлекательным, превращая его в игру!
        </p>
      </div>
      <div className={styles.steps_block}>
        <h1>Три шага к результату</h1>
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.content}>
              <h1>Цели</h1>
              <p>
                Определи задачи дня и укажи, сколько времени ты готов на них
                выделить!
              </p>
            </div>
          </div>
          <img src={arrow1} alt="" className={styles.arrow1} />
          <div className={styles.card}>
            <div className={styles.content}>
              <h1>Работа</h1>
              <p>
                Отслеживай время, чтобы отмечать его рядом со своими задачами на
                день!
              </p>
            </div>
          </div>
          <img src={arrow2} alt="" className={styles.arrow2} />
          <img src={awards} alt="" className={styles.awards} />
          <div className={styles.card}>
            <div className={styles.content}>
              <h1>Награда</h1>
              <p>
                Записывай время и получай награды: отдых, достижения и новый
                уровень!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.video_block}>
        {/* <h1>Видео про QwillerUp</h1> */}
        <h1>Подход QwillerUp</h1>
        <div className={styles.video}>
          <iframe
            width="560"
            height="315"
            src="https://rutube.ru/play/embed/5d23df688cab4038402f043189d2d941"
            frameBorder="0"
            allow="clipboard-write; autoplay"
            webkitallowfullscreen="true"
            mozallowfullscreen='true'
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div className={styles.btn_block}>
          <Link to="/login">
            <Button>Начать свой путь</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
