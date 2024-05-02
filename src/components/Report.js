import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import * as dbModule from '../db';


const ReportComponent = ({ db }) => {
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(12);
  const [items, setItems] = useState([]);

  const handleSearch = async () => {
    try {
      const fetchedItems = await dbModule.getItemsByDateRange(startYear, startMonth, endYear, endMonth);
      setItems(fetchedItems); // Assuming fetchedItems is always an array
    } catch (error) {
      console.error('Failed to fetch items', error);
      // Optionally set items to an empty array or handle the error as needed
      setItems([]);
    }
  };
 

  return (
    <Container>
      <Row className="mb-4">
        <h1>Report</h1>
      </Row>
      <Row>
        <Col>
          <Form.Label>Start Month and Year</Form.Label>
          <Form.Control type="number" placeholder="Start Year" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value, 10))} />
          <Form.Control type="number" placeholder="Start Month" value={startMonth} onChange={(e) => setStartMonth(parseInt(e.target.value, 10))} />
        </Col>
        <Col>
          <Form.Label>End Month and Year</Form.Label>
          <Form.Control type="number" placeholder="End Year" value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value, 10))} />
          <Form.Control type="number" placeholder="End Month" value={endMonth} onChange={(e) => setEndMonth(parseInt(e.target.value, 10))} />
        </Col>
      </Row>
      <Row className="mt-3">
      <Button onClick={handleSearch}>Search</Button>
      </Row>
      <Row className="mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Month</th>
              <th>Cost</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.year}</td>
                <td>{item.month}</td>
                <td>{item.cost}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default ReportComponent;