import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import * as dbModule from  '../db';
import { useNavigate } from 'react-router-dom'; 

const categories = ['Food', 'Health', 'Education', 'Travel', 'Housng', 'Other'];

const AddExpanseForm = ({ onAdd }) => {
  const [sum, setSum] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
  
    const year = today.getFullYear();
    const month = today.getMonth() + 1; 

    dbModule.addItem(sum,description,category,year,month)


    onAdd({ sum, category, description, year, month });
    setSum('');
    setCategory(categories[0]);
    setDescription('');

  };

  return (
    <Form className="wide-form" onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Sum </Form.Label>
        <Form.Control
          type="number"
          value={sum}
          onChange={(e) => setSum(e.target.value)}
          required
          size="lg"
          id="cost"
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Category </Form.Label>
        <Form.Control size="lg" as="select" value={category} onChange={(e) => setCategory(e.target.value)} id="category">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label className='mb-3'>Description </Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          size="lg"
          id="description"
          
        />
      </Form.Group>
      <div className ="total"> 
      <Button className = "main-button" variant="primary" type="submit"> Add Cost Item</Button>
      <Button className = "main-button" variant="primary" onClick={() => navigate('/report')}>Produce report</Button>
      </div>
      
    </Form>
  );
};


export default AddExpanseForm;