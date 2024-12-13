import React, { useState, useEffect} from 'react';
import logo from '../image/petlogo.png';
import axios from 'axios';
import { baseURL } from "../pathApi";
import { Link, useNavigate} from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //const [rememberPassword, setRememberPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess]=useState('');
    const navigate=useNavigate();

    useEffect(() => {
        if (success) {
          const timer = setTimeout(() => {
            setSuccess('');
            navigate('/');
           } , 1000);
          return () => clearTimeout(timer);
        }
      }, [success,navigate]);

    // const handleRegister = async () => {
    //     try {
    //         const res = await axios.post(`${BASE_URL}/register`, {
    //             email,
    //             username,
    //             password,
    //             rememberPassword,
    //         });
    //         const userInfo = res.data;
    //         sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    //         sessionStorage.setItem('userToken', userInfo.token);
    //         console.log(`UserToken: ${userInfo.token}`);
    //     } catch (err) {
    //         setError('Registration failed. Please try again.');
    //         console.error(`Register error ${err}`);
    //     }
    // };

    const handleRegister = async () => {
        try {
          const token = sessionStorage.getItem('userToken');
          if (!token) {
            throw new Error('No token found');
          }
    
          const newUser = { username, email, password };
    
          console.log(newUser);
    
          await axios.post(`${baseURL.baseURL}/api/auth/register`, newUser, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type':'multipart/form-data'
            }
          });
    
          setUsername('');
          setEmail('');
          setPassword('');
          setSuccess(`Create Success`);
          //setShowCreate(false);
          //fetchUsers();
        } catch (error) {
          console.error('Error creating user: ', error);
          setError('Error creating user');
        }
      };

    // const handleRememberPasswordToggle = () => {
    //     setRememberPassword(!rememberPassword);
    // };

    return (
        <body className="hold-transition login-page">
            <div className="login-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <center>
                            <img src={logo} width="100px" height="100px" alt="logo" />
                        </center>
                        <b>PETS</b>ADMIN
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg" >Create an account to continue</p>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{color: 'green'}}>{success}</p>}
                        <form>
                            <div className="input-group mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col-8">
                                    <div className="icheck-primary">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={rememberPassword}
                                            onChange={handleRememberPasswordToggle}
                                        />
                                        <label htmlFor="terms" style={{whiteSpace: 'nowrap'}}>
                                            I accept terms and conditions
                                        </label>
                                    </div>
                                </div>
                            </div> */}
                            <div className="social-auth-links text-center mt-2 mb-3">
                                <button
                                    type="button"
                                    className="btn btn-success btn-block"
                                    onClick={handleRegister}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>

                        <p className="mb-1">
                            Already have an account?<br/>
                            <Link to="/" className="text-center">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </body>
    )
};

export default Register;