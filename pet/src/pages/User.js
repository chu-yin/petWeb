import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import Footer from "../components/Footer";
import { baseURL, formatImageUrl } from '../pathApi';
import { useTranslation } from 'react-i18next';
import { LengthContext } from '../context/AuthProvider'
 
const User=()=> {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('')
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [original, setOriginal] = useState([]);
  const {setUserLength}= useContext(LengthContext);
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
 
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
 
      const res = await axios.get(`${baseURL.baseURL}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
 
      setUsers(res.data);
      setOriginal(res.data);
      console.log(res.data);
      setUserLength(res.data.length)
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    }
  };
 
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
 
      const newUser = { username, email, password };
 
      console.log(newUser);
 
      await axios.post(`${baseURL.baseURL}/api/auth/register`, newUser, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
 
      setUsername('');
      setEmail('');
      setPassword('');
      setSuccess(`Create Success`);
      setShowCreate(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user: ', error);
      setError('Error creating user');
    }
  };
 
 
  const handleEdit = (user) => {
    setEditId(user.id);
    setUsername(user.userName);
    setEmail(user.email);
    setImage(null);
    setAddress(user.addresses[0]?.address);
    if(user.birthday){
      const localDate = new Date(user.birthday);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth()+1).padStart(2,'0');
      const day = String(localDate.getDate()).padStart(2,'0');
      setBirthday(`${year}-${month}-${day}`);
    }
    else{
      setBirthday('');
    }
  };
 
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token || !editId) {
        throw new Error('No token or data found');
      }
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('birthday', birthday);
      formData.append('address',address)
      if (image) {
        formData.append('image', image);
      }
      else {
        formData.append('image', new File([], users.find(item => item.id === editId).avatar.imageUrl.split('/').pop()));
      }
      const res = await axios.put(`${baseURL.baseURL}/api/auth/${editId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
 
      console.log(res);
 
      const updatedData = users.map(user => user.id === editId ? {
        ...user,
        userName: username,
        email: email,
        birthday: birthday,
        address: address,
        image: image ? URL.createObjectURL(image) : user.avatar.imageUrl,
      } : user);
 
      fetchUsers();
      setUsers(updatedData);
      setOriginal(updatedData);
      setEditId(null);
      setUsername('');
      setEmail('');
      setBirthday('');
      setAddress('')
      setImage(null);
      setSuccess('Edit Success');
    } catch (error) {
      console.error('Error updating data: ', error.response ? error.response.data : error.message);
      setError('Error updating data');
    }
  };
 
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`${baseURL.baseURL}/api/auth/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
 
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      setSuccess('Delete Success');
    } catch (error) {
      console.error('Error deleting user: ', error);
      setError('Error deleting user');
    }
  };
 
 
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const searchedUsers = value ? original.filter(user =>
      (user.userName && user.userName.toLowerCase().includes(value.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(value.toLowerCase())) ||
      (user.address && user.address.toLowerCase().includes(value.toLowerCase()))
    ) : original;
    setUsers(searchedUsers);
  };  
 
  const indexOfLastUser = currentPage * postsPerPage;
  const indexOfFirstUser = indexOfLastUser - postsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
 
  return (
    <div>
      <Header />
      <SideNav />
      <section className="content-wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="card-title" style={{ fontWeight: 'bold', fontSize: '28px' }}>{t('user')}</h3>
                    <div className="d-flex justify-content-between" style={{ paddingRight: '0.5cm' }}>
                      <input
                        className="form-control form-control-sidebar"
                        type="search"
                        placeholder={t('search')}
                        aria-label="Search"
                        value={search}
                        onChange={handleSearch}
                      />
                      <button
                        className="btn btn-primary "
                        style={{ width:'100px'}}
                        onClick={() => setShowCreate(true)}
                      >
                      {t('create')}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  {success && <p style={{ color: 'green' }}>{success}</p>}
                  <table id="example2" className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>{t('user_name')}</th>
                        <th>{t('email_placeholder')}</th>
                        <th>{t('birthday')}</th>
                        <th>{t('user_address')}</th>
                        <th>{t('image')}</th>
                        <th style={{width:'200px'}}>{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map(user => (
                        <tr key={user.id}>
                          {editId === user.id ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  placeholder="Edit Username"
                                  style={{ width: '100%' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Edit Email"
                                  style={{ width: '100%' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  value={birthday[0]}
                                  onChange={(e) => setBirthday(e.target.value)}
                                  style={{ width: '100%' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={address}
                                  onChange={(e)=>setAddress(e.target.value)}
                                  style={{width:'100%'}}
                                />
                              </td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => setImage(e.target.files[0])}
                                  style={{ width: '100%' }}
                                />
                              </td>
                              <td>
                                <button onClick={handleSave} className="btn btn-primary">{t('save')}</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{user.userName}</td>
                              <td>{user.email}</td>
                              <td>{new Date(user.birthday).toLocaleDateString()}</td>
                              <td>{user.addresses[0]?.address}</td>
                              <td>
                                <img src={`${formatImageUrl.formatImageUrl}/${user.avatar?.imageUrl}`} alt="User" style={{ width: '50px', height: '50px' }} />
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <button className="btn btn-primary" style={{ width: '80px', height: '40px', marginRight: '10px' }} onClick={() => handleEdit(user)}>{t('edit')}</button>
                                  <button className="btn btn-danger" style={{ width: '80px', height: '40px' }} onClick={() => handleDelete(user.id)}>{t('delete')}</button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <button onClick={prevPage} className="btn btn-light" disabled={currentPage === 1}>&laquo;</button>
                    {Array.from({ length: Math.ceil(users.length / postsPerPage) }, (_, index) => (
                      <button key={index + 1} onClick={() => paginate(index + 1)} className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-light'}`}>{index + 1}</button>
                    ))}
                    <button onClick={nextPage} className="btn btn-light" disabled={currentPage === Math.ceil(users.length / postsPerPage)}>&raquo;</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showCreate && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
          <div className="modal-dialog" style={{ maxWidth: '500px', margin: '10% auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('create_user')}</h5>
                <button type="button" className="close" onClick={() => {
                  setShowCreate(false);
                  setUsers(original);
                }}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('enter_username')}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enter_email')}
                  className="form-control mb-2"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('enter_password')}
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowCreate(false);
                  setUsers(original);
                }}>{t('cancel')}</button>
                <button type="button" className="btn btn-primary" onClick={handleCreate}>{t('save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
 
export default User;