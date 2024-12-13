import React, { useContext } from 'react';
import Header from "../components/Header"; //介面的上面
import SideNav from "../components/SideNav"; //介面左邊的menu
import Footer from "../components/Footer"; //介面的底部
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LengthContext } from '../context/AuthProvider';
 
function Home() {
    const { t, i18n } = useTranslation();    
    const {postLength,userLength,productLength,shopLength,hospitalLength}=useContext(LengthContext);

        return (
            <div>
                <Header />
                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">{t('dashboard')}</h1>
                                </div>{/* /.col */}
                                <div className="col-sm-6">
                                    <ol className="breadcrumb float-sm-right">
                                        <li className="breadcrumb-item"><a href="#">{t('home')}</a></li>
                                        <li className="breadcrumb-item active">{t('dashboard')}</li>
                                    </ol>
                                </div>{/* /.col */}
                            </div>{/* /.row */}
                        </div>{/* /.container-fluid */}
                    </div>
                    {/* /.content-header */}
                    {/* Main content */}
                    <section className="content">
                        <div className="container-fluid">
                            {/* Small boxes (Stat box) */}
                            <div className="row">
                                {/* Total User */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-warning">
                                        <div className="inner">
                                            <p>{t('total_user')}</p>
                                            <h3>{ userLength }</h3>
                                        </div>
                                        <div className="icon">
                                            <i className="nav-icon fas fa-user" />
                                        </div>
                                        <Link to="/user" className="small-box-footer">{t('moreinfo')} <i className="fas fa-arrow-circle-right" /></Link>
                                    </div>
                                </div>
                                {/* Total My Pet Post */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-success">
                                        <div className="inner">
                                            <p>{t('total_mypetpost')}</p>
                                            <h3>{postLength}</h3>
                                        </div>
                                        <div className="icon">
                                            <i className="nav-icon far fa-newspaper" />
                                        </div>
                                        <Link to="/post" className="small-box-footer">{t('moreinfo')} <i className="fas fa-arrow-circle-right" /></Link>
                                    </div>
                                </div>                               
                                {/* Total Shop */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-info">
                                        <div className="inner">
                                            <p>{t('total_shop')}</p>
                                            <h3>{shopLength}</h3>
                                        </div>
                                        <div className="icon">
                                            <i className="nav-icon fas fa-store" />
                                        </div>
                                        <Link to="/shop" className="small-box-footer">{t('moreinfo')} <i className="fas fa-arrow-circle-right" /></Link>
                                    </div>
                                </div>
                                {/* Total Products */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-info">
                                        <div className="inner">
                                            <p>{t('total_products')}</p>
                                            <h3>{productLength}</h3>
                                        </div>
                                        <div className="icon">
                                            <i className="nav-icon fas fa-box-open" />
                                        </div>
                                        <Link to="/product" className="small-box-footer">{t('moreinfo')} <i className="fas fa-arrow-circle-right" /></Link>
                                    </div>
                                </div>
                                {/* Total Hospital */}
                                <div className="col-lg-3 col-6">
                                    {/* small box */}
                                    <div className="small-box bg-danger">
                                        <div className="inner">
                                            <p>{t('total_hospital')}</p>
                                            <h3>{hospitalLength}</h3>
                                        </div>
                                        <div className="icon">
                                            <i className="nav-icon fas fa-clinic-medical" />
                                        </div>
                                        <Link to="/hospital" className="small-box-footer">{t('moreinfo')} <i className="fas fa-arrow-circle-right" /></Link>
                                    </div>
                                </div>
                                
                            </div>
                        </div>{/* /.container-fluid */}
                    </section>
                    {/* /.content */}
                </div>
                <SideNav />
                <Footer />
            </div>
        );    
}
 
export default Home;