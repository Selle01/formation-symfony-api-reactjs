
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';


const App = () => {
    return (
        <HashRouter>

            <Navbar />

            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage} />
                    {/* <Route path="/customers" component={CustomersPageWithPagination} /> pagination via l'API */}
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
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



