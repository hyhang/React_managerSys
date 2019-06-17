import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './api'
import memoryUtil from '../src/utils/memoryUtil'

memoryUtil.user = JSON.parse(localStorage.getItem('USER') || '{}')

ReactDOM.render(<App />, document.getElementById('root'));