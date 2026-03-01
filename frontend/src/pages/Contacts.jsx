// import { useState, useEffect } from 'react';
// import axios from 'axios';
// export default function Contacts() {
//    const API_URL = process.env.REACT_APP_API_URL;
//   const [contacts, setContacts] = useState([]);
//   const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', category: 'Гость' });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => { fetchContacts(); }, []);

//   const fetchContacts = async () => {
//     const token = localStorage.getItem('token');
//     const res = await axios.get(`${API_URL}/contacts`, { headers: { Authorization: `Bearer ${token}` } });
//     setContacts(res.data);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     if (editingId) {
//       await axios.put(`${API_URL}/contacts/${editingId}`, newContact, { headers: { Authorization: `Bearer ${token}` } });
//       setEditingId(null);
//     } else {
//       await axios.post(`${API_URL}/contacts/add`, newContact, { headers: { Authorization: `Bearer ${token}` } });
//     }
//     setNewContact({ name: '', email: '', phone: '', category: 'Гость' });
//     fetchContacts();
//   };

//   const deleteContact = async (id) => {
//     if (!window.confirm('Точно удалить гостя?')) return;
//     const token = localStorage.getItem('token');
//     await axios.delete(`${API_URL}/contacts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//     fetchContacts();
//   };

//   const startEdit = (contact) => {
//     setNewContact(contact);
//     setEditingId(contact._id);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };


//   return (
//     <div>
//       <div className="card" style={{ marginBottom: '20px' }}>
//         <h3 style={{ marginTop: 0 }}>{editingId ? 'Редактировать гостя' : 'Новый контакт'}</h3>
//         <form className="form-group" onSubmit={handleSubmit} style={{ flexWrap: 'wrap' }}>
//           <input type="text" placeholder="Имя *" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} required style={{ flex: '1 1 200px' }} />
//           <input type="email" placeholder="Email" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} style={{ flex: '1 1 200px' }} />
//           <input type="text" placeholder="Телефон (например: +996...)" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} style={{ flex: '1 1 200px' }} />
//           <select value={newContact.category} onChange={e => setNewContact({...newContact, category: e.target.value})} style={{ flex: '1 1 150px' }}>
//             <option value="Гость">Гость</option>
//             <option value="Семья">Семья</option>
//             <option value="Друзья">Друзья</option>
//             <option value="Коллеги">Коллеги</option>
//             <option value="VIP">VIP</option>
//           </select>
//           <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingId ? 'Сохранить изменения' : 'Добавить'}</button>
//           {editingId && <button type="button" className="btn btn-outline" onClick={() => {setEditingId(null); setNewContact({name:'', email:'', phone:'', category:'Гость'})}} style={{ width: '100%' }}>Отмена</button>}
//         </form>
//       </div>

//       <div className="contacts-grid">
//         {contacts.map(c => (
//           <div className="card" key={c._id} style={{ margin: 0 }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
//               <h4 style={{ margin: 0 }}>{c.name}</h4>
//               <div>
//                 <button onClick={() => startEdit(c)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
//                 <button onClick={() => deleteContact(c._id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
//               </div>
//             </div>
//             <span style={{ background: '#ffe6ef', color: '#ff4b82', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>{c.category}</span>
//             <div style={{ fontSize: '13px', color: '#666', marginTop: '10px', lineHeight: '1.6' }}>
//               {c.email && <div>📧 {c.email}</div>}
//               {c.phone && <div>📞 {c.phone}</div>}
//               {!c.email && !c.phone && <div>Нет контактных данных</div>}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, createContext, useContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, addContact, updateContact, deleteContact } from '../store/contactSlice';

export default function Contacts() {
  const dispatch = useDispatch();
  
  const { items: contacts, status } = useSelector((state) => state.contacts);

  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', category: 'Гость' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { 
    if (status === 'idle') {
      dispatch(fetchContacts()); 
    }
  }, [status, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateContact({ id: editingId, contactData: newContact })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(addContact(newContact)).unwrap();
      }
      setNewContact({ name: '', email: '', phone: '', category: 'Гость' });
    } catch (error) {
      console.error("Ошибка при сохранении контакта", error);
    }
  };

  const handleDeleteContact = (id) => {
    if (!window.confirm('Точно удалить гостя?')) return;
    dispatch(deleteContact(id));
  };

  const startEdit = (contact) => {
    setNewContact({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      category: contact.category || 'Гость'
    });
    setEditingId(contact._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div className="card" style={{ marginBottom: '20px', padding: '20px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', background: '#fff' }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Редактировать гостя' : 'Новый контакт'}</h3>
        <form className="form-group" onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Имя *" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} required style={{ flex: '1 1 200px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="email" placeholder="Email" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} style={{ flex: '1 1 200px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="text" placeholder="Телефон (например: +996...)" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} style={{ flex: '1 1 200px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <select value={newContact.category} onChange={e => setNewContact({...newContact, category: e.target.value})} style={{ flex: '1 1 150px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <option value="Гость">Гость</option>
            <option value="Семья">Семья</option>
            <option value="Друзья">Друзья</option>
            <option value="Коллеги">Коллеги</option>
            <option value="VIP">VIP</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', background: '#ff4b82', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Сохранить изменения' : 'Добавить'}</button>
          {editingId && <button type="button" className="btn btn-outline" onClick={() => {setEditingId(null); setNewContact({name:'', email:'', phone:'', category:'Гость'})}} style={{ width: '100%', padding: '10px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Отмена</button>}
        </form>
      </div>

      <div className="contacts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {contacts.map(c => (
          <div className="card" key={c._id} style={{ margin: 0, padding: '20px', borderRadius: '12px', border: '1px solid #eee', background: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0 }}>{c.name}</h4>
              <div>
                <button onClick={() => startEdit(c)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
                <button onClick={() => handleDeleteContact(c._id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
              </div>
            </div>
            <span style={{ background: '#ffe6ef', color: '#ff4b82', padding: '3px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>{c.category}</span>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '10px', lineHeight: '1.6' }}>
              {c.email && <div>📧 {c.email}</div>}
              {c.phone && <div>📞 {c.phone}</div>}
              {!c.email && !c.phone && <div>Нет контактных данных</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
