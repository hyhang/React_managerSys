import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './api'
import memoryUtil from '../src/utils/memoryUtil'
import {getUser} from './utils/storageUtil'

memoryUtil.user = getUser() || {}
ReactDOM.render(<App />, document.getElementById('root') );