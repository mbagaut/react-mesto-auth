import React from "react";

function PopupWithForm(props) {
  const {
    name,
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    buttonText,
    defaultButtonText,
    buttonDisabled,
  } = props;

  const submitButton = React.useRef();

  if (submitButton.current !== undefined) {
    if (buttonDisabled) {
      submitButton.current.classList.add("popup__submit-btn_disabled");
      submitButton.current.setAttribute("disabled", true);
    } else {
      submitButton.current.classList.remove("popup__submit-btn_disabled");
      submitButton.current.removeAttribute("disabled");
    }
  }

  return (
    <section
      className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`}
    >
      <div className="popup__overlay" onClick={onClose} />
      <div className="popup__content">
        <button
          onClick={onClose}
          className="popup__close btn-opacity btn-opacity_type_medium"
          type="button"
        />
        <h2 className="popup__title">{title}</h2>
        <form
          className="popup__form"
          name={name}
          action="#"
          method="POST"
          onSubmit={onSubmit}
        >
          <fieldset className="popup__fieldset">{children}</fieldset>
          <button
            className="popup__submit-btn btn-opacity btn-opacity_type_high"
            tabIndex={18}
            type="submit"
            ref={submitButton}
          >
            {buttonText || defaultButtonText}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;
