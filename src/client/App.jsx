import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('/api/items');
    setItems(response.data);
  };

  const addItem = async () => {
    if (!itemName) return;
    await axios.post('/api/items', { name: itemName });
    setItemName('');
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`/api/items/${id}`);
    fetchItems();
  };

  const startEditItem = (id, name) => {
    setEditItemId(id);
    setEditItemName(name);
  };

  const updateItem = async () => {
    if (!editItemName) return;
    await axios.put(`/api/items/${editItemId}`, { name: editItemName });
    setEditItemId(null);
    setEditItemName('');
    fetchItems();
  };

  return (
    <div className="App">
      <div>
        <h1>Items Example</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {item.id === editItemId ? (
                    <input
                      type="text"
                      value={editItemName}
                      onChange={(e) => setEditItemName(e.target.value)}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {item.id === editItemId ? (
                    <button onClick={updateItem}>Update</button>
                  ) : (
                    <>
                      <button onClick={() => startEditItem(item.id, item.name)}>Edit</button>
                      <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <button onClick={addItem}>Add Item</button>
        </div>
      </div>
    </div>
  );
}

export default App;
