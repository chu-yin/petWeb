import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import Footer from '../components/Footer';
import { baseURL, formatImageUrl } from '../pathApi';
import { LengthContext } from '../context/AuthProvider';
import { useTranslation } from 'react-i18next';

const Shop = () => {
    const [selected, setSelected] = useState('Processing');
    const [processingData, setProcessingData] = useState([]);
    const [acceptedData, setAcceptedData] = useState([]);
    const { setShopLength } = useContext(LengthContext);

    const categories = ['Processing', 'Accepted'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get(`${baseURL.baseURL}/api/role-requests/pending`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;

                const businessRequests = data.filter(request => request.requestedRole.name === 'BUSINESS');
                setShopLength(businessRequests.length);

                const formattedProcessingData = businessRequests.map(request => ({
                    id: request.id,
                    name: request.user.userName || request.user.username,
                    address: request.user.addresses[0]?.address || 'No Address Provided',
                    image: request.images.length > 0 ? `${formatImageUrl.formatImageUrl}/${request.images[0].imageUrl}` : 'No Image Available',
                    requestedRole: request.requestedRole.name
                }));

                setProcessingData(formattedProcessingData);
                fetchApprovedData();
            } catch (error) {
                console.error('Error fetching processing data:', error);
            }
        };

        fetchData();
    }, []);

    const handleApprove = async (requestId, index) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.post(`${baseURL.baseURL}/api/role-requests/approve/${requestId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const approvedRequest = processingData[index];
            setAcceptedData(prevData => [...prevData, approvedRequest]);
            setProcessingData(prevData => prevData.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const fetchApprovedData = async () => {
        try {
            const token = localStorage.getItem('userToken');
            console.log('Fetching with token:', token);
    
            const response = await axios.get(`${baseURL.baseURL}/api/role-requests/pending`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log('API Response:', response.data);
    
            const approvedData = response.data
                .filter(request => request.approved === true && request.role?.name === 'BUSINESS')
                .map(request => ({
                    id: request.id,
                    name: request.user?.userName || request.user?.username || 'Unknown',
                    address: request.user?.addresses?.[0]?.address || 'No Address Provided',
                    image: request.images?.[0]?.imageUrl
                        ? `${formatImageUrl.formatImageUrl}/${request.images[0].imageUrl}`
                        : '/placeholder.png',
                    requestedRole: request.role?.name || 'Unknown',
                }));
    
            console.log('Filtered Approved Data:', approvedData);
            setAcceptedData(approvedData);
        } catch (error) {
            console.error('Error fetching approved data:', error.response || error.message);
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
                                    <h3 className="card-title" style={{ fontWeight: 'bold', fontSize: '28px' }}>Shop</h3>
                                </div>
                                <div className="card-body">
                                    <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                                        {categories.map((category) => (
                                            <li
                                                key={category}
                                                onClick={() => setSelected(category)}
                                                style={{
                                                    marginRight: '20px',
                                                    cursor: 'pointer',
                                                    color: selected === category ? 'blue' : 'black',
                                                    fontWeight: selected === category ? 'bold' : 'normal'
                                                }}
                                            >
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                    {selected === 'Processing' && (
                                        <table className="table table-bordered" style={{ marginTop: '20px' }}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>Image</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {processingData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.address}</td>
                                                        <td>
                                                            {item.image !== 'No Image Available' ? (
                                                                <img
                                                                    src={`${item.image}`}
                                                                    alt="Certificate"
                                                                    style={{ width: '50px', height: '50px', borderRadius: '5px' }}
                                                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                                                />
                                                            ) : (
                                                                item.image
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                style={{ width: '80px', height: '40px', marginRight: '10px' }}
                                                                onClick={() => handleApprove(item.id, index)}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                style={{ width: '80px', height: '40px' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                    {selected === 'Accepted' && (
                                        <table className="table table-bordered" style={{ marginTop: '20px' }}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Address</th>
                                                    <th>Image</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {acceptedData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.address}</td>
                                                        <td>
                                                            {item.image !== 'No Image Available' ? (
                                                                <img
                                                                    src={`${item.image}`}
                                                                    alt="Certificate"
                                                                    style={{ width: '50px', height: '50px', borderRadius: '5px' }}
                                                                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                                                                />
                                                            ) : (
                                                                item.image
                                                            )}
                                                        </td>
                                                        <td>{item.requestedRole}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
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

export default Shop;
