import React, { useState, useContext } from "react";
import Field from "../components/forms/Field";
import { async } from "q";
import Axios from "axios";
import usersAPI from "../services/usersAPI";

const RegisterPage = ({ match, history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  //gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  // gestion de la soumission
  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm = "votre mot de passe n'est pas conforme";
      setErrors(apiErrors);
      return;
    }
    try {
      await usersAPI.register(user);
      //TODO: Flash notification d'erreur
      setErrors({});
      history.replace("/login");
      //console.log(data);
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        //TODO: Flash notification d'erreur
      }
    }
  };
  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          label="Prenom"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          placeholder="Votre Prenom"
          error={errors.firstName}
        />
        <Field
          label="Nom"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          placeholder="Votre Nom de famille"
          error={errors.lastName}
        />
        <Field
          label="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Votre email"
          error={errors.email}
        />
        <Field
          label="Mot de passe"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder=" Votre Mot de passe"
          error={errors.password}
        />

        <Field
          label="Confirmation de mot de passe"
          name="passwordConfirm"
          type="password"
          value={user.passwordConfirm}
          onChange={handleChange}
          placeholder="Confirmez Votre Mot de passe"
          error={errors.passwordConfirm}
        />
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-success"
            onSubmit={handleSubmit}
          >
            Enregistrer
          </button>
          <button type="reset" className="btn">
            Effacer
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
