import {Col, Drawer, Row, Skeleton, Space} from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useDefaultValues } from "../../contexts/DefaultValuesContext";

import './index.css'
import { useEffect } from "react";

export function SelectBackgroundImage({open, onClose, onSelect}){
    
    if(!open) return <div/>;

    const {BackgroundImages, isLoadingBackgroundImages, getBackgroundImages} = useDefaultValues()

    useEffect(() => {
        getBackgroundImages()
    }, [])


    const renderBackgroundImages = () => {

        return(
            <Row 
                gutter={12}
            >
                {BackgroundImages.map((di, i) => {
                        const {Id, Code, URL} = di
                        return(
                            <Col 
                            key={Id}
                            xs ={6}>
                                <div
                                    className="select-background-img-container hoverable-plus"
                                    onClick={() => {
                                        onSelect(di)
                                        onClose()
                                    }}
                                >
                                     <Space>
                                        <p>{(i+1) + ' ' + Code} </p>
                                    </Space>

                                    <img
                                        className="select-background-img-img"
                                        src={URL}
                                        alt={Code}
                                    />
                                </div>
                            </Col>
                        )
                    })}
                </Row>
        )
    }

    return(
        <div>
            <Drawer
            title="Select background image for element"
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
                {isLoadingBackgroundImages && <Skeleton />}
                {(!isLoadingBackgroundImages && BackgroundImages) && renderBackgroundImages()}
            </Drawer>
        </div>
    )
}