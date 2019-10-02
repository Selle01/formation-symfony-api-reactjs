import axios from 'axios';
import cache from './cache';
import { CUSTOMERS_API } from './config';


// function findAll(params) {
//     return axios
//         .get("http://127.0.0.1:8000/api/customers")
//         .then(response => response.data["hydra:member"]);
// }

async function findAll() {

    const cacheCustomers = await cache.get("customers");

    if (cacheCustomers) return cacheCustomers;

    return axios
        .get(CUSTOMERS_API)
        .then(response => {
            const customers = response.data["hydra:member"];
            cache.set("customers", customers);
            return customers;
        });
}


async function findBy(id) {
    const cacheCustomer = await cache.get("customers." + id);

    if (cacheCustomer) return cacheCustomer;
    return axios
        .get(CUSTOMERS_API + "/" + id)
        .then(response => {
            const customer = response.data;
            cache.set("customers." + id, customer);
            return customer;
        });
}

// function findBy(id) {
//     return axios
//         .get("http://127.0.0.1:8000/api/customers/" + id)
//         .then(response => response.data);
// }

function update(id, customer) {
    return axios.put(
        CUSTOMERS_API + "/" + id,
        customer
    ).then(async response => {
        const cachedCustomers = await cache.get("customers");

        const cachedCustomer = await cache.get("customers." + id);
        if (cachedCustomer) {
            cache.set("customers." + id, response.data);
        }
        if (cachedCustomers) {
            const index = cachedCustomers.findIndex(c => c.id === +id);
            cachedCustomers[index] = response.data;
        }
        return response;
    });
}


// sanc cache
// function update(id, customer) {
//     return axios.put(
//         "http://127.0.0.1:8000/api/customers/" + id,
//         customer
//     );
// }

// avec cache methode 1
// function update(id, customer) {
//     return axios.put(
//         "http://127.0.0.1:8000/api/customers/" + id,
//         customer
//     ).then(async response => {
//         const cachedCustomers = await cache.get("customers");

//         if (cachedCustomers) {
//             const index = cachedCustomers.findIndex(c => c.id === +id);
//             const newCachedCustomer = response.data;
//             cachedCustomers[index] = newCachedCustomer;
//             cache.set("customers", [...cacheCustomers, response.data]);
//         }
//         return response;
//     });
// }



// avec cache methode 2
// function update(id, customer) {
//     return axios.put(
//         "http://127.0.0.1:8000/api/customers/" + id,
//         customer
//     ).then(response => {
//         cache.invalide("customers");
//         return response;
//     });
// }

function create(customer) {
    return axios
        .post(CUSTOMERS_API, customer)
        .then(async response => {
            const cacheCustomers = await cache.get("customers");

            if (cacheCustomers) {
                cache.set("customers", [...cacheCustomers, response.data]);
            }
            return response;
        });
}


function deleteCustomer(id) {
    return axios
        .delete(CUSTOMERS_API + "/" + id)
        .then(async response => {
            const cacheCustomers = await cache.get("customers");

            if (cacheCustomers) {
                cache.set("customers", cacheCustomers.filter(c => c.id !== id));
            }
            return response;
        });
}

// function deleteCustomer(id) {
//     return axios
//         .delete("http://127.0.0.1:8000/api/customers/" + id);
// }

export default {
    findAll,
    findBy,
    update,
    create,
    delete: deleteCustomer
}