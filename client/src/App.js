import {Route, Redirect, Switch} from 'react-router-dom';
import Editpage from "./Edit";
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
                <Route path='/editpage' component={Editpage}/>
                <Route exact path='/' render={() => (
                    <Redirect
                        to='/editpage'
                    />
                )}/>
                <Route component={NoMatch}/>
            </Switch>
        </div>
    );
}

export default App;
