import {Route, Redirect, Switch} from 'react-router-dom';
import Notepage from "./Note";
import Mainpage from "./Main";
import './app.css';
import React from "react";

const NoMatch = ({location}) => (
    <div>
        <strong>Error!</strong> No route found matching:
        <div>
            <code>{location.pathname}</code>
        </div>
    </div>
);

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path='/mainpage' component={Mainpage}/>
                <Route path='/notepage' component={Notepage}/>
                <Route exact path='/' render={() => (
                    <Redirect
                        to='/mainpage'
                    />
                )}/>
                <Route component={NoMatch}/>
            </Switch>
        </div>
    );
}

export default App;
