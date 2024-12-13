import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import Footer from '../components/Footer';
import { baseURL, formatImageUrl } from "../pathApi";
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { t, i18n } = useTranslation();
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [posts, setPosts] = useState([]);
    const [data, setData] = useState({
        user: {
            userName: '',
            birthday: '',
            email: '',
            addresses: [{ address: '' }],
            avatar:{imageUrl: ''},
        },
    });
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [address, setAddress] = useState('');
    const [newImage, setNewImage] = useState(null);

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
            const userId = localStorage.getItem('userId');
            if (!token || !userId) {
                throw new Error('No token found');
            }

            const res = await axios.get(`${baseURL.baseURL}/api/auth/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(res.data);
            setPosts(res.data.posts);
            setUsername(res.data.user.userName);
            setEmail(res.data.user.email);
            if(res.data.user.birthday){
                const localDate = new Date(res.data.user.birthday);
                const year = localDate.getFullYear();
                const month = String(localDate.getMonth()+1).padStart(2,'0');
                const day = String(localDate.getDate()).padStart(2,'0');
                setBirthday(`${year}-${month}-${day}`);
            }else{
                setBirthday('');
            }
            setAddress(res.data.user.addresses[0]?.address);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
        }
    };

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            setNewImage(file);
        }
    }
      const handleSave = async () => {
        try {
          const token = localStorage.getItem('userToken');
          const userId = localStorage.getItem('userId');
          if (!token || !userId) {
            throw new Error('No token or data found');
          }
          const formData = new FormData();
          formData.append('username', username);
          formData.append('email', email);
          formData.append('birthday', birthday);
          formData.append('address',address);
          if(newImage){
            formData.append('image',newImage);
          }
          await axios.put(`${baseURL.baseURL}/api/auth/${userId}`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          fetchData();
          setIsEditing(false);
          setSuccess('Edit Success');
        } catch (error) {
          console.error('Error updating data: ', error.response ? error.response.data : error.message);
          setError('Error updating data');
        }
      };

    return (
        <div>
            <Header />
            <SideNav />
            <section className="content-wrapper">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h4>{t('profile')}</h4>
                                    <button
                                        className="btn btn-primary"
                                        style={{ marginRight: '0.5cm', position: 'absolute', top: '10px', right: '10px' }}
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        {isEditing ? t('cancel') : t('edit')}
                                    </button>
                                </div>
                                <div className="card card-primary card-outline">
                                    <div className="card-body box-profile">
                                        <div className="text-center">
                                            {isEditing ? (
                                                <div>
                                                    <input
                                                        type="file"
                                                        className="form-control mt-3"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                            ):(
                                                <img
                                                src={`${formatImageUrl.formatImageUrl}/${data.user.avatar?.imageUrl}`}
                                                style={{ width: '150px', height: '150px' }}
                                                alt="Profile"
                                            />
                                            )}
                                        </div>
                                        <h3 className="profile-username text-center">
                                            {data.user.userName}
                                        </h3>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>
                                                    <i className="nav-icon fas fa-user" style={{ marginRight: '8px' }} />
                                                    {t('user_name')} :
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="userName"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                ) : (
                                                    <p>{data.user.userName}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-birthday-cake" style={{ marginRight: '8px' }}></i>
                                                    {t('birthday')} :
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="birthday"
                                                        value={birthday}
                                                        onChange={(e) => setBirthday(e.target.value)}
                                                    />
                                                ) : (
                                                    <div>
                                                    <p>{new Date(data.user.birthday).toLocaleDateString()}</p>                                      
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-users-cog" style={{ marginRight: '8px' }}></i>
                                                    {t('role')} :
                                                </label>
                                                {/* {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="role.description"
                                                        value={role.description}
                                                        onChange={(e) => setRole(e.target.value)}
                                                    />
                                                ) : ( */}
                                                    <p>{data.user.role?.description}</p>
                                                {/* )} */}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                                                    {t('email_placeholder')} :
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                ) : (
                                                    <p>{data.user.email}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>
                                                    <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                                                    {t('user_address')} :
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="addresses.0.address"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                    />
                                                ) : (
                                                    <p>{data.user.addresses[0]?.address}</p>
                                                )}
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <div className="col-12">
                                                <button className="btn btn-primary mt-3" onClick={handleSave}>
                                                    {t('save')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-header d-flex justify-content-between align-items-center">

                        </div>
                        <div className="col-7">
                            <div className="card">
                                <div className="card-header p-2">
                                    <h4>{t('post')}</h4>
                                </div>{/* /.card-header */}
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div className="active tab-pane" id="activity">
                                            {/* Post */}
                                            {posts.length === 0 ? (
                                                <p>No Posts</p>
                                            ) : (
                                                posts.map((post) => (
                                                    <div key={post.id} className="post">
                                                        {/* 使用者資訊 */}
                                                        <div className="user-block">
                                                            <img
                                                                src={`${formatImageUrl.formatImageUrl}/${post.author?.avatar?.imageUrl }`}
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    borderRadius: '50%',
                                                                    objectFit: 'cover',
                                                                }}
                                                                alt="Profile"
                                                            />
                                                            <span className="username">{post.author?.userName || 'Unknown User'}</span>
                                                            
                                                        </div>
                                                        <p>{post.caption || 'No caption provided.'}</p>
                                                        {(post.postImages || []).map((image) => (
                                                            <img
                                                                key={image.id}
                                                                src={`${formatImageUrl.formatImageUrl}/${image.imageUrl}`}
                                                                alt="Post"
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    marginBottom: '10px',
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Profile;