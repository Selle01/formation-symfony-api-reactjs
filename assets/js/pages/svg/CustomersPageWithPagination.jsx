import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Pagination";

const CustomersPageWithPagination = pops => {
  const [customers, setCustomers] = useState([]); // contient une liste et la methode pour modifier cette liste
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then(response => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch(error => console.log(error.response));
  }, [currentPage]);

  const handleDelete = id => {
    const originslCustomers = [...customers];
    //l'approche optimiste
    setCustomers(customers.filter(customer => customer.id !== id));

    //l'approche pessimiste
    axios
      .delete("http://127.0.0.1:8000/api/customersd/" + id)
      .then(response => console.log("ok"))
      .catch(error => {
        setCustomers(originslCustomers); // remettre les info originale  en cas d'echec
        console.log(error.response);
      });
  };

  const handlePageChange = page => {
    setCustomers([]);
    setCurrentPage(page);
    setLoading(true);
  };

  return (
    <>
      <h1>Liste des Clients (Pagination)</h1>
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
          {loading && (
            <tr>
              <td>Chargement...</td>
            </tr>
          )}
          {!loading &&
            customers.map(customer => (
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
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default CustomersPageWithPagination;
