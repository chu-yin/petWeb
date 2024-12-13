import { useState, useContext, useEffect } from 'react';
import {AuthContext} from '../context/AuthProvider';
import './css/login.css';
import logo from '../image/petlogo.png';
import axios from "axios";
import { baseURL } from "../pathApi";
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    const savedUserToken = localStorage.getItem("userToken");
    if (savedUserInfo && savedUserToken) {
      setUserInfo(JSON.parse(savedUserInfo));
      setUserToken(savedUserToken);
      setAuth({ token: savedUserToken, userInfo: JSON.parse(savedUserInfo) });
      setSuccess(true);
    }
  }, [setAuth]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change language function
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${baseURL.baseURL}/api/auth/login`, {
        email: inputEmail,
        password: inputPassword,
      });
      const userInfo = res.data;
      console.log(userInfo);

      if (userInfo.token) {
        setUserToken(userInfo.token);
        setUserInfo(userInfo);

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("userToken", userInfo.token);
        localStorage.setItem("userId", userInfo.userId);
        setAuth({ token: userInfo.token, userInfo });
        setSuccess(true);
        setError('');
      } else {
        throw new Error("Invalid");
      }
    } catch (err) {
      setError('Login failed. Please check your email and password.');
      console.error(`error: ${err.message || err}`);
    }
  };

  const handleRememberPasswordToggle = () => {
    setRememberPassword(!rememberPassword);
  };

  if (success) {
    return <Navigate to="home" />;
  }

  return (
    <body className="hold-transition login-page">
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <center><img src={logo} width="100px" height="100px" /></center>
            <a href="../../index2.html" className="h1"><b>PETS </b>ADMIN</a>
          </div>
          <div className="card-body">
            <p className="login-box-msg">{t('login_message')}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder={t('email_placeholder')}
                  value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input type="password" className="form-control" placeholder={t('password_placeholder')}
                  value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" checked={rememberPassword}
                      onChange={handleRememberPasswordToggle} />
                    <label htmlFor="remember">
                      {t('remember_me')}
                    </label>
                  </div>
                </div>
              </div>
              <div className="social-auth-links text-center mt-2 mb-3">
                <button type="submit" className="btn btn-success btn-block">{t('sign_in')}</button>
              </div>
            </form>
            
            <div className="language-switcher" style={{ float: 'right' }}>
              <div className="btn-group">
                <button type="button" className="btn btn-primary">
                  {t('language')}
                </button>
                <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="sr-only">Toggle Dropdown</span>
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" onClick={() => changeLanguage('en')}>English</a>
                  <a className="dropdown-item" onClick={() => changeLanguage('zh_TW')}>中文</a>
                </div>
              </div>
            </div>
            <p className="mb-1">
              <Link to="/register">{t('forgot_password')} </Link>
            </p>
            <p className="mb-0">
              <Link to="/register" className="text-center">{t('create_account')}</Link>
            </p>
          </div>
        </div>
      </div>
    </body>
  );
};

export default Login;