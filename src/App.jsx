import React from 'react';
import './App.scss';

import { Loans } from './Components/Loans/Loans';

export const App = () => (
  <div className="App">
    <header className="App__header">
      Current Loans
    </header>
    <Loans />
  </div>
);
