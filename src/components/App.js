import React from "react";
import { Route, Switch, useHistory, withRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute"; // импортируем HOC

import Header from "./Header";
import Register from "./Register";
import Login from "./Login";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DelCardPopup from "./DelCardPopup";
import InfoTooltip from "./InfoTooltip";

import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import * as auth from "../utils/auth.js";

function App(props) {
  const history = useHistory();

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDelCardPopupOpen, setIsDelCardPopupOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState({});
  const [selectedDelCard, setSelectedDelCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [buttonText, setButtonText] = React.useState("");

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCardList()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => console.log(`АЛЯРМ!: ${err}`));
  }, []);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  // К сожалению, без обнуления текста кнопки получается такой эффект, что, к примеру, после удаления карточки
  // в любом другом popup (при первом открытии) кнопка будет иметь текст - "Удалить".
  // В popupWithForm у меня выбор текста кнопки вот так сделан: {buttonText || defaultButtonText}
  // Поэтому чтобы отрисовать базовый текст мне нужно чтобы buttonText был пустой)) Не соображу как сделать подругому.
  function handleEditAvatarClick() {
    setButtonText("");
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setButtonText("");
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setButtonText("");
    setIsAddPlacePopupOpen(true);
  }

  function handleDelCardClick(card) {
    setButtonText("");
    setSelectedDelCard(card);
    setIsDelCardPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDelCardPopupOpen(false);
    setSelectedCard({});
  }

  function handleUpdateUser(formValues) {
    setButtonText("Сохраняем...");
    api
      .changeUserInfo(formValues)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(`АЛЯРМ!: ${err}`))
      .finally(() => {
        setButtonText("Сохранить");
      });
  }

  function handleUpdateAvatar(avatarLink) {
    setButtonText("Сохраняем...");
    api
      .changeAvatar(avatarLink)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(`АЛЯРМ!: ${err}`))
      .finally(() => {
        setButtonText("Сохранить");
      });
  }

  const [cards, setCards] = React.useState([]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((cardsData) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? cardsData : c))
        );
      })
      .catch((err) => console.log(`АЛЯРМ!: ${err}`));
  }

  function handleCardDelete() {
    setButtonText("Удаляем...");
    api
      .deleteCard(selectedDelCard._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== selectedDelCard._id));
        closeAllPopups();
      })
      .catch((err) => console.log(`АЛЯРМ!: ${err}`))
      .finally(() => {
        setButtonText("Удалить");
      });
  }

  function handleAddPlaceSubmit(name, link) {
    setButtonText("Создаём...");
    api
      .postCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`АЛЯРМ!: ${err}`))
      .finally(() => {
        setButtonText("Создать");
      });
  }

  const [loggedIn, setLoggedIn] = React.useState(false);

  function tokenCheck() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      auth
        .getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => console.log(`АЛЯРМ!: ${err}`));
    }
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  const [infoTooltip, setInfoTooltip] = React.useState("");

  function closeTooltip() {
    setInfoTooltip("");
  }

  const handleRegister = (password, email) => {
    auth
      .register(password, email)
      .then((data) => {
        if (data) {
          // const token = data._id;
          // localStorage.setItem("jwt", token);
          localStorage.setItem("email", email);
          setLoggedIn(true);
          setInfoTooltip("success");
        }
      })
      .catch((err) => {
        setInfoTooltip("fail");
        console.log(`АЛЯРМ!: ${err}`);
      });
  };

  const handleLogin = (password, email) => {
    auth
      .authorize(password, email)
      .then((data) => {
        if (data.token) {
          const token = data.token;
          localStorage.setItem("jwt", token);
          localStorage.setItem("email", email);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        setInfoTooltip("fail");
        console.log(`АЛЯРМ!: ${err}`);
      });
  };

  const onSignOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("email");
    setLoggedIn(false);
  };

  const { location } = props;
  const currentPath = location.pathname;

  const [headerLink, setHeaderLink] = React.useState({
    path: "/sign-up",
    headerlinkText: "Регистрация",
  });

  React.useEffect(() => {
    if (currentPath === "/sign-up") {
      setHeaderLink({
        path: "/sign-in",
        headerlinkText: "Войти",
      });
    }
  }, []);

  function changeHeaderLink() {
    if (headerLink.path === "/sign-up") {
      setHeaderLink({
        path: "/sign-in",
        headerlinkText: "Войти",
      });
    } else {
      setHeaderLink({
        path: "/sign-up",
        headerlinkText: "Регистрация",
      });
    }
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      <Header
        onSignOut={onSignOut}
        changeHeaderLink={changeHeaderLink}
        headerLink={headerLink}
      />
      <Switch>
        <Route path="/sign-up">
          <Register
            handleRegister={handleRegister}
            changeHeaderLink={changeHeaderLink}
          />
        </Route>
        <Route path="/sign-in">
          <Login
            handleLogin={handleLogin}
            changeHeaderLink={changeHeaderLink}
          />
        </Route>

        <ProtectedRoute
          path="/"
          loggedIn={loggedIn}
          component={Main}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          onCardDelIconClick={handleDelCardClick}
          cards={cards}
          onCardLike={handleCardLike}
        />
      </Switch>
      {loggedIn && <Footer />}

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        buttonText={buttonText}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        buttonText={buttonText}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        buttonText={buttonText}
      />

      <DelCardPopup
        isOpen={isDelCardPopupOpen}
        onClose={closeAllPopups}
        onCardDel={handleCardDelete}
        buttonText={buttonText}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

      <InfoTooltip infoTooltip={infoTooltip} onClose={closeTooltip} />
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
