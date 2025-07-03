import React from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>📇 Contact Manager App</h1>
      <ContactForm />
      <hr />
      <ContactList />
    </div>
  );
};

export default App;
