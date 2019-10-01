import React, { useEffect, useState } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import customersAPI from "../services/customersAPI";
import invoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/loaders/FormContentLoader";

const InvoicePage = ({ match, history }) => {
  const { id = "new" } = match.params;
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });
  const [customers, setCustomers] = useState([]);

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  // recuperation des clients  pour le select
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      setLoading(false);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      //console.log(error.response);
      //TODO: Flash notification de succes
      toast.error("Erreur de chargement de la liste des clients");
      history.replace("/invoices");
    }
  };

  // recuperation d'une facture
  const fetchInvoice = async id => {
    try {
      const { amount, customer, status } = await invoicesAPI.findBy(id);
      setInvoice({ amount, status, customer: customer.id });
      setLoading(false);
    } catch (error) {
      //console.log(error.response);
      //TODO: Flash notification de succes
      toast.error("Erreur de chargement de la liste des factures");
      history.replace("/invoices");
    }
  };

  //recuperation de la liste des clients a chaque changement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Recuperation de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  //gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  //gestion de la soumission
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
        //TODO: Flash notification d'erreur
        toast.success("modification reussie");
      } else {
        await invoicesAPI.create(invoice);
        //TODO: Flash notification d'erreur
        toast.success("la facture a etait bien enregistrer");
        history.replace("/invoices");
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        //TODO: Flash notification d'erreur
        toast.error("des erreurs dans votre formulaire");
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Creation d'une facture</h1>) || (
        <h1>Modification d facture</h1>
      )}
      {loading && <FormContentLoader />}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="amount"
            type="number"
            label="Montant"
            placeholder="Montant de la facture"
            value={invoice.amount}
            error={errors.amount}
            onChange={handleChange}
          />
          <Select
            name="customer"
            label="Client"
            value={invoice.customer}
            error={errors.customer}
            onChange={handleChange}
          >
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </Select>

          {/* <div className="form-group">
          <label htmlFor="customer">Client</label>
          <select name="customer" id="customer" className="form-control">
            <option value="1">Moussa Diop</option>
          </select>
          <p className="invalid-feedback">erreur</p>
        </div> */}

          <Select
            name="status"
            label="Status"
            value={invoice.status}
            error={errors.status}
            onChange={handleChange}
          >
            <option value="SENT">Envoyee</option>
            <option value="PAID">Payee</option>
            <option value="CANCELLED">Annulee</option>
          </Select>

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

export default InvoicePage;
