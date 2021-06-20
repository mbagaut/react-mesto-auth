import React from "react";
import { Link } from "react-router-dom";

function Login({ handleLogin, changeHeaderLink }) {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  // А есть ли способ сделать универсальным этот обработчик, как в классовом компоненте? Я покрутил, но прилепить сюда не получилось)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else {
      setEmail(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(password, email);
  };

  return (
    <div className="page__authorization authorization">
      <h2 className="authorization__title">Вход</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className="authorization__fieldset">
          <label className="authorization__field">
            <input
              className="authorization__input"
              placeholder="Email"
              required
              name="email"
              type="text"
              value={email}
              onChange={handleChange}
            />
            <span className="email-input-error" />
          </label>

          <label className="authorization__field">
            <input
              className="authorization__input"
              placeholder="Пароль"
              required
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
            />
            <span className="password-input-error" />
          </label>
        </fieldset>
        <button
          type="submit"
          className="authorization__button btn-opacity btn-opacity_type_high"
        >
          Войти
        </button>
      </form>

      <Link
        onClick={changeHeaderLink}
        to="/sign-up"
        className="authorization__link btn-opacity btn-opacity_type_medium"
      >
        Ещё не зарегистрированы? Зарегистрироваться
      </Link>
    </div>
  );
}

export default Login;

//! Я классовые компоненты оставил для тренировки, чтобы лучше понимать разницу.

// class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       password: "",
//       email: "",
//     };

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange = (e) => {
//     const { name, value } = e.target;
//     this.setState({
//       [name]: value,
//     });
//   };

//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.props.handleLogin(this.state.password, this.state.email);
//   };

//   render() {
//     return (
//       <div className="page__authorization authorization">
//         <h2 className="authorization__title">Вход</h2>
//         <form onSubmit={this.handleSubmit}>
//           <fieldset className="authorization__fieldset">
//             <label className="authorization__field">
//               <input
//                 className="authorization__input"
//                 placeholder="Email"
//                 required
//                 name="email"
//                 type="text"
//                 value={this.state.email}
//                 onChange={this.handleChange}
//               />
//               <span className="email-input-error" />
//             </label>

//             <label className="authorization__field">
//               <input
//                 className="authorization__input"
//                 placeholder="Пароль"
//                 required
//                 name="password"
//                 type="password"
//                 value={this.state.password}
//                 onChange={this.handleChange}
//               />
//               <span className="password-input-error" />
//             </label>
//           </fieldset>
//           <button
//             type="submit"
//             className="authorization__button btn-opacity btn-opacity_type_high"
//           >
//             Войти
//           </button>
//         </form>

//         <Link
//           onClick={this.props.changeHeaderLink}
//           to="/sign-up"
//           className="authorization__link btn-opacity btn-opacity_type_medium"
//         >
//           Ещё не зарегистрированы? Зарегистрироваться
//         </Link>
//       </div>
//     );
//   }
// }

// export default Login;
