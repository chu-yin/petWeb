import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL } from '../pathApi';

function Header() {
    const { t, i18n } = useTranslation();
    const [showCreate, setShowCreate] = useState(false);
    const [address, setAddress] = useState('');
    const [requestedRole, setRequestedRole] = useState("USER");
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [image, setImage] = useState(null);

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token || !address || !requestedRole) {
                throw new Error('Invalid data');
            }

            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('address', address);
            formData.append('requestedRole', requestedRole);
            if (image) {
                formData.append('images', image);
            }

            await axios.post(`${baseURL.baseURL}/api/role-requests`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setUserId('');
            setSuccess('Create Success');
            setShowCreate(false);
            setAddress('');
            setImage(null);
            setRequestedRole('USER');
        } catch (error) {
            console.error('Error creating data: ', error);
            setError('Error creating data');
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // Change language function
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <Link to="/home" className="nav-link">{t('home')}</Link>
                    </li>
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <button
                            className="btn btn-light ml-2"
                            onClick={() => setShowCreate(!showCreate)}
                        >
                            {showCreate ? t('cancel') : t('create_admin')}
                        </button>
                    </li>
                    {/* Language Dropdown */}
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <i className="fas fa-globe" /> {t('language')}
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => changeLanguage('en')}>English</a>
                            <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => changeLanguage('zh_TW')}>中文</a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-widget="fullscreen" href="#" role="button">
                            <i className="fas fa-expand-arrows-alt" />
                        </a>
                    </li>
                </ul>
            </nav>
            {/* /.navbar */}
            {showCreate && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-dialog" style={{ maxWidth: '500px', margin: '16% auto', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{t('create_admin')}</h5>
                                <button type="button" className="close" onClick={() => setShowCreate(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                            <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder={t('enter_userid')}
                                    required
                                    style={{
                                        appearance: 'none',
                                        border: '1px solid #ced4da',
                                        borderRadius: '0.25rem',
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '1rem',
                                        lineHeight: '1.5',
                                        backgroundColor: '#fff',
                                        backgroundClip: 'padding-box',
                                        width: '100%',
                                        maxWidth: '500px',
                                    }}
                                />
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder={t('enter_address')}
                                    required
                                    style={{
                                        appearance: 'none',
                                        border: '1px solid #ced4da',
                                        borderRadius: '0.25rem',
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '1rem',
                                        lineHeight: '1.5',
                                        backgroundColor: '#fff',
                                        backgroundClip: 'padding-box',
                                        width: '100%',
                                        maxWidth: '500px',
                                    }}
                                />
                                <select
                                    className="form-control mb-2"
                                    value={requestedRole}
                                    onChange={(e) => setRequestedRole(e.target.value)}
                                    required
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                    <option value="BUSINESS">BUSINESS</option>
                                    <option value="HOSPITAL">HOSPITAL</option>
                                </select>
                                <input
                                    type="file"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    aria-label="Upload Image"
                                    className="form-control mb-2"
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
        </div>
    );
}

export default Header;