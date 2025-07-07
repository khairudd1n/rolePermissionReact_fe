import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
 

const Dashboard = ({ user, onLogout }) => {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/menus', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMenus(res.data);
      } catch (err) {
        console.error('Failed to fetch menus', err);
      }
    };

    fetchMenus();
  }, []);

  const renderMenu = (menuList) => (
    <ul>
      {menuList.map(menu => (
        <li key={menu.id}>
          {menu.name}
          {menu.children && menu.children.length > 0 && renderMenu(menu.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Menu</h2>
        {renderMenu(menus)}
        <hr />
        <button onClick={onLogout}>Logout</button>
      </div>
      <div className="main-content">
        <h2>Welcome, {user.username}</h2>
        <p>This is your dashboard.</p>
      </div>
    </div>
  );
};

export default Dashboard;
