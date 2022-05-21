import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {LotteryProvider} from './context/LotteryContext';

ReactDOM.render(
  <LotteryProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </LotteryProvider>,
  document.getElementById('root')
)
