import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone } = formData;

    if (!name || !email || !phone) {
      setError('All fields are required!');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format!');
      return;
    }

    const { error } = await supabase.from('contacts').insert([{ name, email, phone }]);

    if (error) {
      console.error("❌ Insert failed:", error);
      setError('❌ Failed to add contact!');
    } else {
      console.log("✅ Contact inserted!");
      setSuccess('✅ Contact added!');
      setFormData({ name: '', email: '', phone: '' });
    }
  };

  return (
    <div>
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} /><br />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} /><br />
        <button type="submit">Add</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default ContactForm;
