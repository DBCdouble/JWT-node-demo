import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import routes from './routes';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.less';
import './style/global.less';

moment.locale('zh-cn');

const App = () => (
  <ConfigProvider locale={zhCN}>
    <BrowserRouter>
      <Switch>
        { routes.map(item =>(
          <Route key={ item.key } path={ item.path } component={ item.component } exact={ true } />
        ))}
      </Switch>
    </BrowserRouter>
  </ConfigProvider>
)
ReactDOM.render(<App />, document.getElementById('root'));