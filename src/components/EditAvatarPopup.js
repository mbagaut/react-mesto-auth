import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const { isOpen, onClose, onUpdateAvatar, buttonText } = props;

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [validationError, setValidationError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [eventTarget, setEventTarget] = React.useState({});

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar(eventTarget.value);
    eventTarget.value = "";
    setButtonDisabled(true);
  }

  function clearInputValue() {
    eventTarget.value = "";
    setValidationError(false);
    setErrorMessage("");
    setButtonDisabled(true);
    onClose();
  }

  function checkInputValidity(eTarget) {
    if (eTarget.validity.valid) {
      setValidationError(false);
      setErrorMessage("");
      setButtonDisabled(false);
    } else {
      setValidationError(true);
      setErrorMessage(eTarget.validationMessage);
      setButtonDisabled(true);
    }
  }

  function onChange(e) {
    setEventTarget(e.target);
    checkInputValidity(e.target);
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      name="popupAvatarForm"
      title="Обновить аватар"
      onClose={clearInputValue}
      onSubmit={handleSubmit}
      buttonText={buttonText}
      defaultButtonText={"Сохранить"}
      buttonDisabled={buttonDisabled}
    >
      <fieldset className="popup__fieldset">
        <label className="popup__field popup__field_avatar">
          <input
            className={`popup__input ${
              validationError && "popup__input_error"
            }`}
            tabIndex={1}
            id="link-input2"
            type="url"
            name="avatarLink"
            onChange={onChange}
            placeholder="Ссылка на картинку"
            required
          />
          <span
            className={`link-input-error ${
              validationError && "popup__input-error"
            }`}
          >
            {errorMessage}
          </span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
