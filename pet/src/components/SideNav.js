import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL, formatImageUrl } from "../pathApi";

function SideNav() {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { setAuth } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const getNavLinkClass = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    useEffect(() => {
        fetchData();
    }, []);

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
            setData(res.data.user);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userToken')
        setAuth(null);
        navigate('/')
    }

    return (
        <div>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <Link to="/home" className="brand-link">
                    <img src="dist/img/petlogo.png" alt="PET Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">PET ADMIN</span>
                </Link>
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user panel (optional) */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <img
                            src={`${formatImageUrl.formatImageUrl}/${data.avatar?.imageUrl}`}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                            alt="Profile"
                        />
                        <div className="info">
                            <Link to="/profile" className="d-block">FCU Admin</Link>
                        </div>
                    </div>
                    
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Add icons to the links using the .nav-icon class with font-awesome or any other icon font library */}
                            <li className="nav-item">
                                <Link to="/home" className={getNavLinkClass('/home')}>
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>{t('dashboard')}</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/user" className={getNavLinkClass('/user')}>
                                    <i className="nav-icon fas fa-user" />
                                    <p>
                                        {t('user')}
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/shop" className={getNavLinkClass('/shop')}>
                                    <i className="nav-icon fas fa-store" />
                                    <p>
                                        {t('shop')}
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/product" className={getNavLinkClass('/product')}>
                                    <i className="nav-icon fas fa-box-open" />
                                    <p>
                                        {t('products')}
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/hospital" className={getNavLinkClass('/hospital')}>
                                    <i className="nav-icon fas fa-clinic-medical" />
                                    <p>
                                        {t('hospital')}
                                    </p>
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/doctors" className={getNavLinkClass('/doctors')}>
                                    <i className="nav-icon fas fa-user-md" />
                                    <p>
                                        {t('doctors')}
                                    </p>
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link to="/post" className={getNavLinkClass('/post')}>
                                    <i className="nav-icon far fa-newspaper" />
                                    <p>
                                        {t('post')}
                                    </p>
                                </Link>
                            </li>
                            <p>
                                <hr color="white" />
                            </p>
                            <li className="nav-item">
                                <Link to='/' className={getNavLinkClass('/')} onClick={handleLogout} >
                                    <i className="nav-icon fas fa-sign-out-alt" />
                                    <p>
                                        {t('logout')}
                                    </p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside>

        </div>
    );
}

export default SideNav;