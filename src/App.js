/* Yarin Ben Moshe 314939885
Amit Rahamim 318816535
Shahar Ben Naim 208628453 */

import './App.css';
import * as dbModule from './db'
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import AddExpanseForm from './components/AddExpanseForm';
import Report from './components/Report';
import CostsList from './components/CostsList';
import { ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {


  dbModule.init();

    
    const [expenses, setExpenses] = useState([]);

    const addExpense = (expense) => {
      const newExpense = { ...expense, id: Date.now()};
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    };
  
    return (
      <Router>
        <Container className="appContainer">
          <h1>Cost Tracker</h1>
          <Routes>
            {/* Default path showing the expense form and list */}
            <Route path="/" element={
              <>
                <Container className="centered"> 
                  <AddExpanseForm onAdd={addExpense} />
                </Container>
                <Container className="listContainer wide-form">
                  <CostsList items={expenses} />
                </Container>
              </>
            } />
            {/* Route to the Report component */}
            <Route path="/report" element={<Report />} />
          </Routes>
        </Container>
      </Router>
    );
  }
  
  export default App;
