import React from 'react';

function Footer() {
    return (
        <div>
            <footer className="main-footer">
                <strong>© 2024 Create by <a href="https://www.iecs.fcu.edu.tw/"> FCU | Pet group</a>.  </strong>
                All rights reserved.
                <div className="float-right d-none d-sm-inline-block">
                    <b>Version</b> 0.1beta
                </div>
            </footer>
            {/* Control Sidebar */}
            <aside className="control-sidebar control-sidebar-dark">
                {/* Control sidebar content goes here */}
            </aside>
            {/* /.control-sidebar */}
        </div>

    );
}

export default Footer;