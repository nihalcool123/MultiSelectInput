import './App.css';
import { useState, useEffect, useRef } from 'react';
import Pill from './components/Pill';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  const inputRef = useRef(null);

  const fetchUsers = () => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    fetch(`https://dummyjson.com/users/search?=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => console.log(err));
  };

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm('');
    setSuggestions([]);
    inputRef.current.focus();
  };
  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );

    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === 'Backspace' &&
      e.targte.value === '' &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  };

  return (
    <>
      <div className="user-search-container">
        <div className="user-search-input">
          {selectedUsers.map((user) => {
            return (
              <Pill
                key={user.email}
                image={user.image}
                text={`${user.firstName}`}
                onClick={() => handleRemoveUser(user)}
              />
            );
          })}
          <div>
            <input
              ref={inputRef}
              value={searchTerm}
              placeholder="search for a user"
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              onKeyDown={handleKeyDown}
            />

            <ul className="suggestions-list">
              {suggestions?.users?.map((user, index) => {
                return !selectedUserSet.has(user.email) ? (
                  <li key={user.email} onClick={() => handleSelectUser(user)}>
                    <img src={user.image} />
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </li>
                ) : (
                  <></>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
