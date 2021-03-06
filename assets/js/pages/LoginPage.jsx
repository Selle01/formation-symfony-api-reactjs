import React, { useState, useContext } from "react";
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

const LoginPage = ({ history }) => {
  //const LoginPage = ({ onLogin, history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  // gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  //gestion du submit
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await authAPI.authenticate(credentials);
      setError("");
      //onLogin(true);// passage par props
      setIsAuthenticated(true); // passage par context
      toast.success("vous etes connecter bravo");
      history.replace("/customers");
    } catch (error) {
      setError(
        "Auncun compte ne possede cette adresse email ou alors les infos ne correspondent pas ! "
      );
      toast.error("une erreur  est survenue");
    }
  };

  return (
    <>
      <h1>Connexion</h1>
      <div className="row">
        <div className="col-lg-4">
          <form onSubmit={handleSubmit}>
            {/* <div className="form-group">
              <label htmlFor="username">Adresse Email</label>
              <input
                type="email"
                id="username"
                name="username"
                onChange={handleChange}
                value={credentials.username}
                placeholder="Adresse email de connexion"
                className={"form-control " + (error && "is-invalid")}
              />
              {error && <p className="invalid-feedback">{error}</p>}
            </div> */}
            <Field
              label="Adresse Email"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Adresse email de connexion"
              type="email"
              error={error}
            />
            {/* <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="mot de passe"
                className="form-control"
                autoComplete="false"
              />
            </div> */}
            <Field
              label="Mot de passe"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              type="password"
              error={error}
            />
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                je me connecte
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
