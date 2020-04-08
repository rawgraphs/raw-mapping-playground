import React from 'react';
import ReactDOM from 'react-dom';
import  'rsuite/dist/styles/rsuite-default.css';
import './style/index.scss'
import App from './App';
import * as serviceWorker from './serviceWorker';

import "brace/mode/text";
import "brace/mode/json";
import "brace/theme/github";

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
