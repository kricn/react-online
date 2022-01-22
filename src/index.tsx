import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from 'react-router-dom'

// 全局样式
import "./styles/index.scss"

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
