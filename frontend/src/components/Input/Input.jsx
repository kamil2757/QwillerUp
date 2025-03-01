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
        className={styles.input}
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        autoComplete={autoComplete}
        style={
          format == 2
            ? { width: `${60}px`, padding: "0px", textAlign: "center" }
            : {}
        }
      />
    );
  }
}

export default Input;
