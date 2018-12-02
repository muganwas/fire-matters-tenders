import React from 'react';
import  { ProfileInfo, Footer, HeaderMain } from 'components';

const ProfilePage = ()=>{
    return(
        <div className="main">
            <div className="top">
                <HeaderMain />
            </div>
            <div className="mid">
                <ProfileInfo />
            </div>
            <div className="bottom">
                <Footer />
            </div>
        </div>
    )
}

export default ProfilePage;