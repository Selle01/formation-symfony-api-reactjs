import axios from 'axios';
import jwtDecode from 'jwt-decode';


/**
 * request HTTP d'authentification et stockage du token dans le storage et sur axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios
        .post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {

            // je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);

            // On previent axios qu'on a maintenant un header par defaut sur toutes nos requestes HTTP
            setAxiosToken(token);
        });
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Deconnexion(suppression du token du localStorage et sur Axios )
 */
function logOut() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Mise en place du chargement  de l'application
 */
function setup() {
    //1•    On vérifié si on a un token
    const token = window.localStorage.getItem("authToken");
    //2•	Si le token est encore valide
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            //3•	Donner le token a axios
            setAxiosToken(token);
            // console.log("connexion etablie avec avec axios");
        }
    }
}

/**
 * Permet de savoir si on est authentifier ou pas
 * @returns boolean
 */
function isAuthenticated() {
    //1•    On vérifié si on a un token
    const token = window.localStorage.getItem("authToken");
    //2•	Si le token est encore valide
    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logOut,
    setup,
    isAuthenticated
}



// try {
//   const token = await axios
//     .post("http://127.0.0.1:8000/api/login_check", credentials)
//     .then(response => response.data.token);
//   setError("");
//   // je stocke le token dans mon localStorage
//   window.localStorage.setItem("authToken", token);

//   // On previent axios qu'on a maintenant un header par defaut sur toutes nos requestes HTTP
//   axios.defaults.headers["Authorization"] = "Bearer " + token;
// } catch (error) {
//   setError(
//     "Auncun compte ne possede cette adresse email ou alors les infos ne correspondent pas ! "
//   );
// }


//const handleChange = event => {
//     let value = event.currentTarget.value;
//     let name = event.currentTarget.name;
//     setCredentials({ ...credentials, [name]: value });
//   };