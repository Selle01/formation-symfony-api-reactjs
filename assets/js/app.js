
import React, { useState, useContext } from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";

AuthAPI.setup();

// const PrivateRoute = ({ path, isAuthenticated, component }) => {
//     return isAuthenticated ? <Route path={path} component={component} /> : <Redirect to="/login" />
// }

// const PrivateRoute = ({ path, component }) => {
//     const { isAuthenticated } = useContext(AuthContext);
//     return isAuthenticated ? <Route path={path} component={component} /> : <Redirect to="/login" />
// }

const App = () => {
    //demander par defaut a l'API si on est connecté ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

    const NavBarWithRouter = withRouter(Navbar); // retourne un composant qui herite des props du composant Route (history... etc) afin de permettre la navigation

    // const contextValue = { // idem que celui en dessous
    //     isAuthenticated: isAuthenticated,
    //     setIsAuthenticated: setIsAuthenticated
    // }
    const contextValue = {
        isAuthenticated,
        setIsAuthenticated
    }
    return (
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                {/* <Navbar isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated} /> */}
                {/* <NavBarWithRouter isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated} /> */}

                <NavBarWithRouter />

                <main className="container pt-5">
                    <Switch>

                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <PrivateRoute path="/invoices/:id" component={InvoicePage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} />

                        {/* <Route path="/login" render={(props) => (<LoginPage onLogin={setIsAuthenticated} {...props} />)} />
                        <PrivateRoute path="/invoices" isAuthenticated={isAuthenticated} component={InvoicesPage} />
                        <PrivateRoute path="/customers" isAuthenticated={isAuthenticated} component={CustomersPage} /> */}

                        {/* <Route path="/login" component={LoginPage} /> */}
                        {/* <Route path="/invoices" component={InvoicesPage} /> */}
                        {/* <Route path="/customers" component={CustomersPageWithPagination} /> pagination via l'API */}
                        {/* <Route path="/customers" component={CustomersPage} /> */}
                        {/* <Route path="/customers" render={(props) => { return (isAuthenticated) ? <CustomersPage {...props} /> : <Redirect to="/login" /> }} /> */}

                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
}
const rootElement = document.querySelector('#app')
ReactDOM.render(<App />, rootElement);



/**
 * LES RACCOURCIES
 * 1) importation: imr
 * 2) stateless function component : sfc
 */

















// class App extends Component{
//     render() {
//         return (<h1>bravo une deuxieme fois</h1>);
//     }
// }
//ReactDOM.render(<App />, document.getElementById('app'));



