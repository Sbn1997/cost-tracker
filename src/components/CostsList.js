import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import * as dbModule from '../db';
import CostListItem from './CostListItem';


const CostsList = ({ items }) => {
  const [currentMonthItems, setCurrentMonthItems] = useState([]);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Initialize the database first and set dbReady
    dbModule.initDatabase().then(() => {
      setDbReady(true);
    }).catch(error => {
      console.error("Database initialization failed:", error);
    });
  }, []);

  useEffect(() => {
    if (dbReady) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      const fetchItems = async () => {
        try {
          const fetchedItems = await dbModule.getItemsByMonthAndYear(year, month);
          setCurrentMonthItems(fetchedItems);
        } catch (error) {
          console.error("Failed to fetch items:", error);
        }
      };

      fetchItems();
    }
  }, [dbReady]); 


  const handleDelete = async (id) => {
    try {
      await dbModule.deleteItemById(id);
      const updatedItems = currentMonthItems.filter(item => item.id !== id);
      setCurrentMonthItems(updatedItems);
      
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };


  const totalSum = items.reduce((acc, item) => acc + parseFloat(item.sum), 0);


  


  return (
    <div>
      <div className='total'>
        <h3>Total costs this month:<br></br> ${totalSum}</h3>
      </div>
      <ListGroup>
        {currentMonthItems.map((item) => (
          <CostListItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
        {items.map((item) => (
          <CostListItem key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </ListGroup>
    </div>
  );
};

export default CostsList;