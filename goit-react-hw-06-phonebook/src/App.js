import React, { useState, useReducer, useMemo, useEffect } from 'react';
import storage from './localStorage';
import shortid from 'short-id';

const styles = {
  app: {
    textAlign: 'center',
  },
  container: {
    display: 'inline-block',
    border: '1px solid black',
    padding: '10px',
  },
  button: {
    color: '#F21D41',
  },
  label: {
    color: '#212121',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  ul: {
    listStyleType: 'none',
    color: '#000',
  },
  li: {
    color: '#212121',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  span: {
    marginRight: '15px',
  },
};

const contactsReducer = (state, action) => {
  switch (action.type) {
    case 'addContact':
      return [...state, action.payload.contact];

    case 'removeContact':
      return state.filter(contact => contact.id !== action.payload.contactId);

    case 'initContact':
      return action.payload.contacts;

    default:
      return state;
  }
};

export default function App() {
  // name
  const [name, setName] = useState('');
  const updateName = evt => {
    setName(evt.target.value);
  };

  // number
  const [number, setNumber] = useState('');
  const updateNumber = evt => {
    setNumber(evt.target.value);
  };

  // contacts
  const [contacts, dispatch] = useReducer(contactsReducer, []);

  const addContact = evt => {
    if (isRepeatsName()) {
      alert('name reserved');
      return;
    }
    if (isRepeatsPhone()) {
      alert('phone reserved');
      return;
    }
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    dispatch({ type: 'addContact', payload: { contact } });
    setName('');
    setNumber('');
  };
  const removeContact = contactId => {
    dispatch({ type: 'removeContact', payload: { contactId } });
  };
  const isRepeatsName = () => {
    return contacts.some(contact => contact.name === name);
  };
  const isRepeatsPhone = () => {
    return contacts.some(contact => contact.number === number);
  };

  // filter
  const [filter, setFilter] = useState('');
  const changeFilter = evt => {
    setFilter(evt.target.value);
  };
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => contact.name.includes(filter));
  }, [contacts, filter]);

  // loading contacts
  useEffect(() => {
    const savedContacts = storage.get('contacts');
    if (savedContacts) {
      const contacts = savedContacts.contacts;
      dispatch({ type: 'initContact', payload: { contacts } });
    }
  }, []);

  // save contacts
  useEffect(() => {
    storage.set('contacts', { contacts });
  }, [contacts]);

  return (
    <div className="App" style={styles.app}>
      <div style={styles.container}>
        <label style={styles.label}>Name</label>
        <br />
        <input type="text" value={name} onChange={updateName} />
        <br />
        <label style={styles.label}>Number</label>
        <br />
        <input
          type="tel"
          placeholder="111-111-111"
          value={number}
          onChange={updateNumber}
        />
        <br />
        <br />
        <button type="button" onClick={addContact}>
          Add contact
        </button>
      </div>
      <br />
      <br />
      <label style={styles.label}>Find contacts by name</label>
      <br />
      <input type="text" onChange={changeFilter} value={filter} />
      <br />
      <ul style={styles.ul}>
        {filteredContacts.map(contact => (
          <li key={contact.id} style={styles.li}>
            <span
              style={styles.span}
            >{`Name: ${contact.name} Number: ${contact.number}`}</span>
            <button onClick={() => removeContact(contact.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
