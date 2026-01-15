import React from "react";

import './index.css'
import { useState } from "react";
import { useEffect } from "react";
import { Drawer, Space } from "antd";
import { ZoomableImage } from "./ZoomableImage";

export function ImageModal({URL, children}){

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        setShowModal(false)
    }, [])


    const renderModal = () => {        
        return(
            <Drawer
                open={showModal}
                onClose={() => setShowModal(false)}
                width={'90%'}
            >
                <Space direction="vertical" align="center" className="hq-full-width">
                    {/*<img 
                        alt={URL}
                        src={URL}
                        className="image-model-img"
                    />
                    <br/>
                    <p className="default-gray">Magnified image</p>*/}
                    <ZoomableImage 
                        image = {{
                            url: URL,
                            name: URL,
                            source: {
                                type:'image',
                                url:  URL,
                                buildPyramid: false
                            }
                        }}
                    />
                </Space>
            </Drawer>
        )
    }

    return(
        <div className="image-modal">
            <div  onClick={() => setShowModal(true)}>
                {children}
            </div>

            {renderModal()}
        </div>
    )
}