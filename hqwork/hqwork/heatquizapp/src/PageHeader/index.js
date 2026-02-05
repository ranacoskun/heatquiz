import { Layout } from 'antd';
import './PageHeader.css';
import React from 'react';
// NavigationDrawer/UserDrawer removed per simplified header request
import logoLarge from '../Sources/heatquizlogo_transparent.png'; 
import logoSmall from '../Sources/heatquizlogo_transparent_small.png'; 

const PageHeader = () => {

    return( 
        <Layout.Header
        className='page-header'
        
        >
            <img 
                src={logoLarge}
                className="hq-app-logo-large"
                alt='Heat quiz app logo'
            />

            <img 
                src={logoSmall}
                className="hq-app-logo-small"
                alt='Heat quiz app logo'

            />
        </Layout.Header>
    )
}

export default PageHeader;