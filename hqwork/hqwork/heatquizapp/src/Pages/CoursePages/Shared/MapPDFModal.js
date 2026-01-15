import React, { } from "react";
import {Drawer, Space,} from "antd";

import {ArrowLeftOutlined} from '@ant-design/icons';

const MapPDF = (map) => {
    return(
        <div>
        </div>
    )
}

export function MapPDFModal({open, onClose, map}){

    return(
        <Drawer
            title={
            <Space>
                <p>Export Map</p>

            </Space>}
            width={'40%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
                {MapPDF(map)}
            </Drawer>
    )
}