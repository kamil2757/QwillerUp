import styles from "./Input.module.scss";

function Input({
  placeholder,
  type = "text",
  autoComplete,
  name,
  onChange,
  value,
  format = 1,
  id = "",
}) {
  if (type == "textarea") {
    return (
      <textarea
        className={styles.textarea}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
    );
  } else {
    return (
      <input
        className={ format == 2 ? `${styles.input_mini} ${styles.input}` : styles.input}
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        autoComplete={autoComplete}
      />
    );
  }
}

export default Input;
