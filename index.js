import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import UseMemo from './pages/01_useMemo';
import ReactMemo from './pages/02_memo';
import Virtualization from './pages/03_virtualization';
import './styles.sass';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/useMemo" component={UseMemo} />
      <Route exact path="/useDeepMemo" />
      <Route exact path="/React.memo" component={ReactMemo} />
      <Route exact path="/virtualization" component={Virtualization} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
