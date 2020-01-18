import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import UseMemo from './pages/01_useMemo';
import ReactMemo from './pages/02_memo';
import Virtualization from './pages/03_virtualization';
import Slides from './Slides';
import './styles.sass';

const sequence = [
  '/slides/1',
  '/slides/2',
  '/slides/3',
  '/slides/4',
  '/useMemo',
  '/React.memo',
  '/virtualization',
];

const history = createBrowserHistory();

const App = () => {
  const handleKeyDown = (event) => {
    const current = sequence.indexOf(window.location.pathname);
    if (event.key === 'ArrowRight') {
      history.push(sequence[Math.min(current + 1, sequence.length - 1)]);
    } else if (event.key === 'ArrowLeft') {
      history.push(sequence[Math.max(current - 1, 0)]);
    }
  };

  return (
    <div tabIndex="0" onKeyDown={handleKeyDown}>
      <Router history={history}>
        <Switch>
          <Route path="/slides/:id" component={Slides} />
          <Route exact path="/useMemo" component={UseMemo} />
          <Route exact path="/useDeepMemo" />
          <Route exact path="/React.memo" component={ReactMemo} />
          <Route exact path="/virtualization" component={Virtualization} />
        </Switch>
      </Router>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
