import React from "react";
import ReactDOM from "react-dom";
import './style.scss';
import test from './test.png'

const App = () => {
    return <div>React dis <img src={test} /></div>;
}

ReactDOM.render(<App />, document.querySelector("#root"));