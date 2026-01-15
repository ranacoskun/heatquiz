import React, { useEffect, useState } from "react";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64 } from "../../services/Auxillary";
import { Space, Spin, Tooltip } from "antd";
import {InboxOutlined} from '@ant-design/icons';
import Dragger from "antd/es/upload/Dragger";

export function UploadImage({className, classNameImage, imageURL, onSetImage, removable}){
    const [loadingImage, setLoadingImage] = useState(false)

    useEffect(()=> {
        setLoadingImage(false)
    }, [])

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingImage(true);
          return;
        }
    
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoadingImage(false);
                //ImageURL, Image
                onSetImage(url, info.file.originFileObj)
            });
        }
    };
    return(
    <div
        className={className}
    >
        <Tooltip
                color="white"
                placement="top"
                title={ <p>Click or drag file to this area to upload</p>}
        >
            <Dragger  
                customRequest={dummyRequest}
                accept={ALLOWED_IMAGE_EXTENSIONS}
                onChange={handleChange}
                showUploadList={false}
                >
                {!imageURL && 
                <>
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
            
                </>}
                {loadingImage && <Spin size="small"/>}
                {imageURL && 
                <img 
                    src={imageURL}
                    className={classNameImage}
                    alt="generic"
                />}

                
            </Dragger>

            {removable && imageURL &&
                <Space direction="vertical" align="center">
                    <small className="default-gray hq-clickable" onClick={() => onSetImage(null, null)}>Remove</small>
                </Space>}
        </Tooltip>
    </div>
    )
}