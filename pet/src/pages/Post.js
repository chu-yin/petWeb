import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import Footer from "../components/Footer";
import { baseURL, formatImageUrl } from "../pathApi";
import { useTranslation } from 'react-i18next';
import { LengthContext } from '../context/AuthProvider';

const Post = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [Caption, setCaption] = useState('');
  const [Kind, setKind] = useState('');
  const [Image, setImage] = useState([]);
  const [filter, setFilter] = useState('');
  const [original, setOriginal] = useState([]);
  const [success, setSuccess] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [kindOption, setKindOption] = useState([]);
  const [newKind, setNewKind] = useState('');
  const [selectedKind, setSelectedKind] = useState('');
  const { setPostLength } = useContext(LengthContext);

  useEffect(() => {
    fetchData();
    fetchKind();
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

      const res = await axios.get(`${baseURL.baseURL}/api/auth/post/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setData(res.data);
      setOriginal(res.data);
      console.log(res.data);
      setPostLength(res.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    }
  };

  const fetchKind = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const res = await axios.get(`${baseURL.baseURL}/api/post/kind/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setKindOption(res.data);
    } catch (error) {
      setError('Error fetching kind');
      console.error('Fetch kinds error:', error);
    }
  };

  const handleCreateKind = async () => {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('kind', newKind);
    try {
      await axios.post(`${baseURL.baseURL}/api/post/kind/create`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchKind();
      setNewKind('');
    } catch (error) {
      console.error('Error creating kind:', error);
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    try {
      if (newKind && !kindOption.some((k) => k.kind === newKind)) {
        await handleCreateKind()
      }

      const formData = new FormData();
      formData.append('caption', Caption);
      formData.append('kind', newKind || selectedKind);
      formData.append('userId', userId);

      if (Image.length > 0) {
        Image.forEach((img) => formData.append('images', img));
      }

      await axios.post(`${baseURL.baseURL}/api/auth/post/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchData();
      setCaption('');
      setKind('');
      setImage([]);
      setSelectedKind('');
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
      await axios.delete(`${baseURL.baseURL}/api/auth/post/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setData(prevData => prevData.filter(item => item.id !== id));
      setOriginal(prevData => prevData.filter(item => item.id !== id));
      setSuccess('Delete Success');
    } catch (error) {
      console.error('Error deleting data: ', error);
      setError('Error deleting data');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setCaption(item.caption);
    setKind(item.postKind);
    setImage(item.postImages || []);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token || !editId) {
        throw new Error('No token or data found');
      }

      if (newKind && !kindOption.some((k) => k.kind === newKind)) {
        await handleCreateKind();
      }

      const formData = new FormData();
      formData.append('caption', Caption);
      formData.append('kind', newKind || Kind);

      if (Image.length > 0) {
        Image.forEach((img) => formData.append('images', img));
      }

      console.log('Updating data with:', {
        caption: Caption,
        kind: Kind || newKind,
        image: Image ? Image.name : 'No new image'
      });

      const response = await axios.put(`${baseURL.baseURL}/api/auth/post/${editId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Server response:', response);

      const updatedData = data.map(item => item.id === editId ? {
        ...item,
        caption: Caption,
        kind: Kind || newKind,
        postImages: Image ? [{ ...item.postImages[0], imageUrl: `${Image.name}` }] : item.postImages
      } : item);


      fetchData();
      fetchKind();
      setData(updatedData);
      setOriginal(updatedData);
      setEditId(null);
      setCaption('');
      setKind('');
      setImage([]);
      setSuccess('Edit Success')
    } catch (error) {
      console.error('Error updating data: ', error);
      setError('Error updating data');
    }
  };

  const handleFilter = (e) => {
    const selectFilter = e.target.value;
    setFilter(selectFilter);
    const filteredData = selectFilter ? original.filter(item => item.postKind === selectFilter) : original;
    setData(filteredData);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const searchedData = value ? original.filter(item =>
      item.caption.toLowerCase().includes(value.toLowerCase()) ||
      item.authorName.toLowerCase().includes(value.toLowerCase()) ||
      item.postKind.toLowerCase().includes(value.toLowerCase())
    ) : original;
    setData(searchedData);
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
                    <h3 className="card-title" style={{ fontWeight: 'bold', fontSize: '28px' }}>{t('post')}</h3>
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
                        style={{ width: '100px' }}
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
                        <th style={{ width: '350px' }}>{t('image')}</th>
                        <th>{t('caption')}</th>
                        <th>{t('kind')}
                          <div style={{ float: 'right' }}>
                            <select value={filter} onChange={handleFilter}>
                              <option value="">{t('all')}</option>
                              {kindOption.map(kind => (
                                <option key={kind.id} value={kind.kind}>{kind.kind}</option>
                              ))}
                            </select>
                          </div>
                        </th>
                        <th style={{width:'50px'}}>{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPosts.map(item => (
                        <tr key={item.id}>
                          {editId === item.id ? (
                            <>
                              <td>{item.authorName}</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => setImage([...e.target.files])}
                                  placeholder="Edit Image"
                                  multiple
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={Caption}
                                  onChange={(e) => setCaption(e.target.value)}
                                  placeholder="Edit Caption"
                                  style={{ width: '50%', margin: '0 auto', display: 'block' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={newKind}
                                  onChange={(e) => setNewKind(e.target.value)}
                                  placeholder="Edit Kind"
                                  style={{ width: '50%', margin: '0 auto', display: 'block' }}
                                  list="kind-options"
                                />
                                <datalist id="kind-options">
                                  {kindOption.map((kind) => (
                                    <option key={kind.id} value={kind.kind} />
                                  ))}
                                </datalist>
                              </td>
                              <td>
                                <button onClick={handleSave} className="btn btn-primary">Save</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{item.authorName}</td>
                              <td>
                                {item.postImages && item.postImages.length > 0 ? (
                                  item.postImages.map((img, index) => (
                                    <img
                                      key={index}
                                      src={`${formatImageUrl.formatImageUrl}/${img.imageUrl}`}
                                      alt={`Post Image ${index + 1}`}
                                      style={{ width: '100px', height: '100px', margin: '5px' }}
                                    />
                                  ))
                                ) : (
                                  <span>No images</span>
                                )}
                              </td>
                              <td>{item.caption}</td>
                              <td>{item.postKind}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <button className="btn btn-primary" style={{ width: '80px', height: '40px', marginRight: '10px' }} onClick={() => handleEdit(item)}>{t('edit')}</button>
                                  <button className="btn btn-danger" style={{ width: '80px', height: '40px' }} onClick={() => handleDelete(item.id)}>{t('delete')}</button>
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
          <div className="modal-dialog" style={{ maxWidth: '500px', margin: '10% auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('create_post')}</h5>
                <button type="button" className="close" onClick={() => setShowCreate(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={Caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={t('enter_caption')}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={newKind}
                  onChange={(e) => setNewKind(e.target.value)}
                  placeholder={t('enter_kind')}
                  className="form-control mb-2"
                  list="kind-options"
                />
                <datalist id="kind-options">
                  {kindOption.map((kind) => (
                    <option key={kind.id} value={kind.kind} />
                  ))}
                </datalist>
                <input
                  type="file"
                  onChange={(e) => setImage([...e.target.files])}
                  className="form-control mb-2"
                  multiple
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>{t('cancel')}</button>
                <button type="button" className="btn btn-primary" onClick={handleCreate}>{t('save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Post;