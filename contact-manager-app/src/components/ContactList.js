import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ name: '', email: '', phone: '' });

  // Function to fetch all contacts
  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('❌ Fetch error:', error);
    } else {
      setContacts(data);
    }
  };

  // Setup realtime listener for contact changes
  useEffect(() => {
    fetchContacts(); // Initial load

    const channel = supabase
      .channel('realtime:contacts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
        },
        (payload) => {
          console.log('📡 Change received:', payload);
          fetchContacts(); // Refresh contacts on change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Clean up on unmount
    };
  }, []);

  // Delete contact
  const handleDelete = async (id) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) console.error('❌ Delete error:', error);
  };

  // Start editing a contact
  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditedData({ name: contact.name, email: contact.email, phone: contact.phone });
  };

  // Save updated contact
  const handleUpdate = async () => {
    const { error } = await supabase
      .from('contacts')
      .update({
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone,
      })
      .eq('id', editingId);

    if (error) {
      console.error('❌ Update failed:', error);
    } else {
      setEditingId(null);
      setEditedData({ name: '', email: '', phone: '' });
    }
  };

  return (
    <div>
      <h2>All Contacts</h2>
      {contacts.length === 0 ? (
        <p>No contacts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {contacts.map((c) => (
            <li key={c.id} style={{ marginBottom: '10px' }}>
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editedData.phone}
                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                  />
                  <button onClick={handleUpdate}>✅ Update</button>
                  <button onClick={() => setEditingId(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <strong>{c.name}</strong> — {c.email} — {c.phone}
                  <button onClick={() => handleEdit(c)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(c.id)}>🗑️ Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList;
