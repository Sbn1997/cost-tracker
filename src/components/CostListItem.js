import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import * as dbModule from  '../db';





const CostListItem = ({ item, onDelete }) => {
  return (
    <ListGroup.Item>
      {item.category}: ${item.sum} - {item.description}
      <Button variant="danger" size="sm" onClick={() => onDelete(item.id)} style={{ marginLeft: '10px' }}>
        Delete
      </Button>
    </ListGroup.Item>
  );
};

export default CostListItem;