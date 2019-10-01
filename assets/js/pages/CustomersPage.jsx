import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
//service
import CustomersAPI from "../services/customersAPI";

const CustomersPage = pops => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // permet d'aller recuperer les customers de facon async
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // gestion de la suppression d'un customer
  const handleDelete = async id => {
    const originslCustomers = [...customers];
    setCustomers(customers.filter(customer => customer.id !== id));
    try {
      await CustomersAPI.delete(id);
      console.log("suppression reussie");
    } catch (error) {
      setCustomers(originslCustomers);
    }
  };

  // gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // gestion du changement de la recherche sur les customers
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  // filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  // pagination des customers
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <h1>Liste des Clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Creer un Client
        </Link>
      </div>

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
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="#">
                  {customer.firstName} {customer.lastName}
                </a>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()} $
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
