import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import Footer from "../components/Footer";
import { baseURL, formatImageUrl} from '../pathApi';
import { useTranslation } from 'react-i18next';
import { LengthContext } from '../context/AuthProvider';

const Products = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [original, setOriginal] = useState([]);
  const {setProductLength} = useContext(LengthContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await axios.get(`${baseURL.baseURL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setData(res.data);
      setOriginal(res.data);
      console.log(res.data);
      setProductLength(res.data.length)
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      if (!token) {
        throw new Error('Invalid data');
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('userId', userId);

      if (image) {
        formData.append('images', image);
      }

      await axios.post(`${baseURL.baseURL}/api/products`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      fetchData();
      setName('');
      setType('');
      setPrice('');
      setDescription('');
      setImage(null);
      setSuccess('Create Success');
      setShowCreate(false);
    } catch (error) {
      console.error('Error creating data: ', error);
      setError('Error creating data');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`${baseURL.baseURL}/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setData(prevData => prevData.filter(item => item.id !== id));
      setSuccess('Delete Success');
    } catch (error) {
      console.error('Error deleting data: ', error);
      setError('Error deleting data');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setType(item.type);
    setPrice(item.price);
    setDescription(item.description);
    setImage(null);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token || !editId) {
        throw new Error('No token or data found');
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type);
      formData.append('price', price);
      formData.append('description', description);

      if (image.length > 0) {
        image.forEach((img) => formData.append('images', img));
      }

      console.log('Updating data with:', {
        name,
        type,
        price,
        description,
        image: image ? image.name : 'No new image'
      });

      const response = await axios.put(`${baseURL.baseURL}/api/products/${editId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Server response:', response);

      const updatedData = data.map(item => item.id === editId ? {
        ...item,
        name,
        type,
        price,
        description,
        images: image ? [{ ...item.imageUrl[0], imageUrl: `${image.name}` }] : item.imageUrl
      } : item);

      fetchData();
      setData(updatedData);
      setOriginal(updatedData);
      setEditId(null);
      setName('');
      setType('');
      setPrice('');
      setDescription('');
      setImage(null);
      setSuccess('Edit Success');
    } catch (error) {
      console.error('Error updating data: ', error);
      setError('Error updating data');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const searchedUsers = value ? original.filter(data =>
      data.name.toLowerCase().includes(value.toLowerCase()) ||
      data.description.toLowerCase().includes(value.toLowerCase()) ||
      data.type.toLowerCase().includes(value.toLowerCase())
    ) : original;
    setData(searchedUsers);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  const pageinate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / postsPerPage)) {
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
                    <h3 className="card-title" style={{ fontWeight: 'bold', fontSize: '28px' }}>{t('products')}</h3>
                    <div className="d-flex">
                      <input
                        className="form-control form-control-sidebar"
                        type="search"
                        placeholder={t('search')}
                        aria-label="Search"
                        value={search}
                        onChange={handleSearch}
                      />
                      <button className="btn btn-primary" style={{ width: '100px' }} onClick={() => setShowCreate(true)}>{t('create')}</button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  {success && <p style={{ color: 'green' }}>{success}</p>}
                  <table id="example2" className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>{t('hospital_name')}</th>
                        <th>{t('type')}</th>
                        <th>{t('price')}</th>
                        <th>{t('description')}</th>
                        <th style={{ width: '350px' }}>{t('image')}</th>
                        <th>{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(item => (
                        <tr key={item.id}>
                          {editId === item.id ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Edit name"
                                  style={{ width: '50%', margin: '0 auto', display: 'block' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={type}
                                  onChange={(e) => setType(e.target.value)}
                                  placeholder="Edit type"
                                  style={{ width: '50%', margin: '0 auto', display: 'block' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                  placeholder="Edit price"
                                  style={{ width: '50%', margin: '0 auto', display: 'block' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  placeholder="Edit description"
                                  style={{ width: '50%', margin: '0 auto', display: 'block' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => setImage(e.target.files[0])}
                                  placeholder="Edit Image"
                                />
                              </td>
                              <td>
                                <button onClick={handleSave} className="btn btn-primary">{t('save')}</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{item.name}</td>
                              <td>{item.type}</td>
                              <td>{item.price}</td>
                              <td>{item.description}</td>
                              <td>
                                {item.imageUrl && item.imageUrl[0].length > 0 && (
                                  <img
                                    src={`${formatImageUrl.formatImageUrl}/${item.imageUrl[0]}`}
                                    alt="Item"
                                    style={{ width: '100px', height: '100px' }}
                                  />
                                )}
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={() => handleEdit(item)}>{t('edit')}</button>
                                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>{t('delete')}</button>
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
                    {Array.from({ length: Math.ceil(data.length / postsPerPage) }, (_, index) => (
                      <button key={index + 1} onClick={() => pageinate(index + 1)} className={`btn ${currentPage === index + 1 ? `btn-primary` : 'btn-light'}`}>{index + 1}</button>
                    ))}
                    <button onClick={nextPage} className="btn btn-light" disabled={currentPage === Math.ceil(data.length / postsPerPage)}>&raquo;</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showCreate && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
          <div className="modal-dialog" style={{ maxWidth: '500px', margin: '5% auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('create_product')}</h5>
                <button type="button" className="close" onClick={() => setShowCreate(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('product_name')}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder={t('enter_type')}
                  className="form-control mb-2"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={t('enter_price')}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('enter_description')}
                  className="form-control mb-2"
                />
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  aria-label="Upload Image"
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>{t('cancel')}</button>
                <button type="button" className="btn btn-primary" onClick={handleCreate}>{t('create')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Products;