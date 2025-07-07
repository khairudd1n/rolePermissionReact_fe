import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';



const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [menus, setMenus] = useState([]);
  const [assignedMenus, setAssignedMenus] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await axios.get('http://localhost:5000/api/roles');
    setRoles(res.data);
  };

  const handleAddRole = async () => {
    if (!newRole) return;
    await axios.post('http://localhost:5000/api/roles', { name: newRole });
    setNewRole('');
    fetchRoles();
  };

  const handleOpenPermission = async (roleId, roleName) => {
    setSelectedRoleId(roleId);
    setSelectedRoleName(roleName);
    const menusRes = await axios.get('http://localhost:5000/api/menus/all');
    const permRes = await axios.get(`http://localhost:5000/api/roles/${roleId}/permissions`);
    setMenus(menusRes.data);
    setAssignedMenus(permRes.data.map(m => m.id));
  };

  const toggleMenu = (menuId, children = []) => {
  const isChecked = assignedMenus.includes(menuId);
  let newAssigned = [...assignedMenus];

  if (isChecked) {
    // Uncheck parent and children
    newAssigned = newAssigned.filter(id => id !== menuId && !children.some(child => child.id === id));
  } else {
    // Check parent and children
    newAssigned.push(menuId);
    newAssigned = [...new Set([...newAssigned, ...children.map(child => child.id)])];
  }

  setAssignedMenus(newAssigned);
};


  const savePermission = async () => {
    await axios.post(`http://localhost:5000/api/roles/${selectedRoleId}/permissions`, {
      menuIds: assignedMenus
    });
    setSelectedRoleId(null);
    setSelectedRoleName('');
  };

return (
    <div className="main-content">
      <h2>Role Management</h2>
      <div style={{ display: 'flex', maxWidth: '400px', gap: '10px' }}>
        <input
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="New role name"
        />
        <button onClick={handleAddRole}>Add Role</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                <button onClick={() => handleOpenPermission(role.id, role.name)}>
                  Edit Permission
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRoleId && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Edit Permissions for <strong>{selectedRoleName}</strong></h3>
          <ul>
            {menus.map(menu => (
              <li key={menu.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={assignedMenus.includes(menu.id)}
                    onChange={() => toggleMenu(menu.id, menu.children || [])}
                  />
                  {menu.name}
                </label>
                {menu.children && menu.children.length > 0 && (
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {menu.children.map(child => (
                      <li key={child.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={assignedMenus.includes(child.id)}
                            onChange={() => toggleMenu(child.id)}
                          />
                          {child.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <button onClick={savePermission}>Save</button>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
