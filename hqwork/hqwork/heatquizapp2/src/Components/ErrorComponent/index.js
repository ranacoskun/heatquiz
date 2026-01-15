import { Space } from "antd";
import React from "react";
import {ExclamationCircleOutlined } from '@ant-design/icons';

export function ErrorComponent({error, onReload}){

    return(
        <Space 
            direction="vertical"
            align="center"
            className="hq-full-width">
            <div className="hq-element-container hoverable">
                <Space
                direction="vertical"
                align="center" 
                onClick={() => {
                    if(onReload) onReload();
                }}
                >
                    <Space align="center">
                        <ExclamationCircleOutlined 
                            style={{fontSize:'x-large'}}
                            className="default-title"
                        />
                        <Space 
                            direction="vertical"
                            align="center" 
                        >
                            <p className="default-title">{error}</p>
                            <Space align="center">
                                <small className="default-gray"> Click to reload </small>
                            </Space>
                        </Space> 
                    </Space>
                
                </Space>
            </div>
        </Space>
        
    )
}