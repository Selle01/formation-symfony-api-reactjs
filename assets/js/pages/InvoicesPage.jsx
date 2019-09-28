import moment from "moment";
import React, { useEffect, useState } from "react";
import invoicesAPI from "../services/invoicesAPI";
import Pagination from "../components/Pagination";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "info",
  CANCELLED: "danger"
};

const STATUS_LABELS = {
  PAID: "payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const formatDate = str => moment(str).format("DD/MM/YYYY");

  // permet d'aller recuperer les invoices de facon async
  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // au chargement du composant, on va chercher les invoices
  useEffect(() => {
    fetchInvoices();
  }, []);

  // gestion de la suppression d'un customer
  const handleDelete = async id => {
    const originslInvoices = [...invoices];
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    try {
      await invoicesAPI.delete(id);
      console.log("suppression reussie");
    } catch (error) {
      setInvoices(originslInvoices);
      console.log("echec suppression");
    }
  };

  // gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // gestion du changement de la recherche sur les invoices
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  // filtrage des invoices en fonction de la recherche

  const filteredInvoices = invoices.filter(
    i =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // pagination des invoices
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>liste des factures</h1>
      <div className="form-group">
        <input
          value={search}
          onChange={handleSearch}
          type="text"
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Chrono</th>
            <th>Client</th>
            <th className="text-center">Date Envoie</th>
            <th className="text-center">Montant</th>
            <th className="text-center">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.chrono}</td>
              <td>
                <a href="">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center"> {formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                {invoice.amount.toLocaleString()} $
              </td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-primary mr-1">Edite</button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={filteredInvoices.length}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default InvoicesPage;
