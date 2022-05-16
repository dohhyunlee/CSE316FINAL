import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";


ReactDOM.render(
    <React.StrictMode>
        <Router>
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="app.css" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                  rel="stylesheet"/>
            <title>Notes</title>
        </head>
        <App />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);


