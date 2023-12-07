import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    userrole: 'user', // Default role is set to 'user'
  });

  useEffect(() => {
    axios.get('http://localhost:8080/all_users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSave = (userData) => {
    axios.put("http://localhost:8080/updateUser", userData)
      .then(response => {
        console.log('User data updated successfully:', response.data);
        setUsers(prevUsers => prevUsers.map(user =>
          user.id === userData.id ? { ...user, ...userData } : user
        ));
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });
  };

  const handleDelete = (userId) => {
    // Get the user to be deleted
    const userToDelete = users.find(user => user.id === userId);
  
    // Optimistically remove the user from the local state
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  
    // Send a request to delete the user from the server
    axios.put('http://localhost:8080/DeleteUser', { data: userToDelete })
      .then(response => {
        // Handle success, e.g., show a success message
        console.log('User deleted successfully:', response.data);
      })
      .catch(error => {
        // Handle error, e.g., show an error message
        console.error('Error deleting user:', error);
  
        // Roll back the state if the request fails
        axios.get('http://localhost:8080/all_users')
          .then(response => {
            // Update the state with the fetched data
            setUsers(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      });
  };
  
  
  

  const handleInputChange = (userId, field, value) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  const handleAdd = () => {
    axios.post('http://localhost:8080/UserProfile', newUser)
      .then(response => {
        console.log('New user added successfully:', response.data);
        setUsers(prevUsers => [...prevUsers, response.data]);
        setNewUser({
          username: '',
          email: '',
          userrole: 'user', // Default role is set to 'user'
        });
      })
      .catch(error => {
        console.error('Error adding new user:', error);
      });
  };

  return (
    <div className="p-4 flex justify-center mt-28 ml-36">
      <table className="w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-4/5 bg-white border border-gray-300">
        <thead className="bg-[#9DB2BF] text-white">
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={index}
              className={`border-b hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
            >
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={user.username}
                  className="w-full bg-transparent"
                  onChange={(e) => handleInputChange(user.id, 'username', e.target.value)}
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={user.email}
                  className="w-full bg-transparent"
                  onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}
                />
              </td>
              <td className="py-2 px-4">
                <select
                  value={user.userrole}
                  className="bg-transparent"
                  onChange={(e) => handleInputChange(user.id, 'userrole', e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="trainer">trainer</option>
                </select>
              </td>
              <td className="py-2 px-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleSave(user)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="py-2 px-4">
              <input
                type="text"
                value={newUser.username}
                className="w-full bg-transparent"
                placeholder="New Name"
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </td>
            <td className="py-2 px-4">
              <input
                type="text"
                value={newUser.email}
                className="w-full bg-transparent"
                placeholder="New Email"
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </td>
            <td className="py-2 px-4">
              <select
                value={newUser.userrole}
                className="bg-transparent"
                onChange={(e) => setNewUser({ ...newUser, userrole: e.target.value })}
              >
                <option value="user">user</option>
                <option value="trainer">trainer</option>
              </select>
            </td>
            <td className="py-2 px-4 flex justify-end">
              <button
                type="button"
                className="text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={handleAdd}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Users;