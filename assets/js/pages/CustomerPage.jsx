import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import customersAPI from "../services/customersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/loaders/FormContentLoader";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });
  const [loading, setLoading] = useState(false);
  // recuperation du customer en fonction de l'id
  const fetchCustomer = async id => {
    try {
      //   const data = await customersAPI.findBy(id);
      //   const { firstName, lastName, email, company } = data;
      const { firstName, lastName, email, company } = await customersAPI.findBy(
        id
      );
      setCustomer({ firstName, lastName, email, company });
      setLoading(false);
      //console.log(data);
    } catch (error) {
      //console.log(error.response);
      toast.error("echec de chargement du client");
      history.replace("/customers");
    }
  };

  const [editing, setEditing] = useState(false);

  //chargement  du customer   si besoin au chargement du composant ou au chargement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]); // charger le coprs de useEffect a chaque fois que id change de valeur: add = new ou edite =86 ...etc

  //gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value }); // ici ...customera ecraser et remplacer par [name]: value
  };

  //gestion de la soumission
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      setErrors({});
      if (editing) {
        // const response = await axios.put(
        //   "http://127.0.0.1:8000/api/customers/" + id,
        //   customer
        // );
        await customersAPI.update(id, customer);
        toast.success("modification du client reussie");
        //console.log(response.data);
      } else {
        await customersAPI.create(customer);

        //    const response = await axios.post(
        //   "http://127.0.0.1:8000/api/customers",
        //   customer
        // );

        toast.success("creation du client reussie");
        //props.history.replace("/customers");
        history.replace("/customers");
      }

      //console.log(response.data);
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("des erreurs dans votre formulaire");
      }
    }
    //catch (error) {
    //   if (error.response.data.violations) {
    //     const apiErrors = {};
    //     error.response.data.violations.forEach(violation => {
    //       apiErrors[violation.propertyPath] = violation.message;
    //     });
    //     setErrors(apiErrors);
    //     //TODO: Flash notification d'erreur
    //   }
    // }
  };

  return (
    <>
      {(!editing && <h1>Creation d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      <Link to="/customers" className="float-right">
        Retour liste Clients
      </Link>
      {loading && <FormContentLoader />}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="lastName"
            label="Nom de famille"
            placeholder="Nom de famille du client"
            value={customer.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Field
            name="firstName"
            label="Prenom du client"
            placeholder="Nom de famille du client"
            value={customer.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="email"
            label="email"
            placeholder="email du client"
            type="email"
            value={customer.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="company"
            label="entreprise"
            placeholder="entreprise du client"
            value={customer.company}
            onChange={handleChange}
            error={errors.company}
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
      )}
    </>
  );
};

export default CustomerPage;
