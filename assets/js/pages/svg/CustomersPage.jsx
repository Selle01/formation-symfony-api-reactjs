import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPage = pops => {
  const [customers, setCustomers] = useState([]); // contient une liste et la methode pour modifier cette liste
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/customers")
      .then(response => response.data["hydra:member"])
      .then(data => setCustomers(data)) // changer ce qui est dans mon customers avec data
      .catch(error => console.log(error.response));
  }, []);

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
    setCurrentPage(page);
  };

  //const itemsPerPage = 10;
  // const pagesCount = Math.ceil(customers.length / itemsPerPage);
  // const pages = [];

  // for (let i = 1; i <= pagesCount; i++) {
  //   pages.push(i);
  // }

  // // d'ou on part (start)  et pendant combien (itemsPerPage)
  // const start = currentPage * itemsPerPage - itemsPerPage;
  // //                3       *    10        - 10           =20
  // // si on sur la page 2 on commence par 10 ,sur page 3 on commence par 20 ...etc

  // const paginatedCustomers = customers.slice(start, start + itemsPerPage);

  const handleSearch = event => {
    setSearch(event.currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedCustomers = Pagination.getData(
    // customers,
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des Clients</h1>
      {/* table.table.table-hover>thead>tr>th*7 */}

      <div className="form-group">
        {/* input.form-control[placeholder="Rechercher..."] */}

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

      {/* <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={customers.length}
        onPageChanged={handlePageChange}
      /> */}
      {/* <div>
        <ul className="pagination">
          <li className={"page-item" + (currentPage === 1 && " disabled")}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &laquo;
            </button>
          </li>
          {pages.map(page => (
            <li
              key={page}
              className={"page-item" + (currentPage === page && " active")}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}
          <li
            className={
              "page-item" + (currentPage === pagesCount && " disabled")
            }
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </div> */}
    </>
  );
};

export default CustomersPage;
