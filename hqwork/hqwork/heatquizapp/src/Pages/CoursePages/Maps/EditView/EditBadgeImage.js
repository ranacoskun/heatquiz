import {Button, Drawer, Space, Spin, message} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

export function EditBadgeImage({open, onClose, badge, nonElementBadge, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingEditMapElementBadgeImage, editMapElementBadgeImage,
        loadingEditBadgeSystemEntity, editBadgeSystemEntity} = useMaps()

    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const [api, contextHolder] = message.useMessage()

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingImage(true);
          return;
        }
    
        if (info.file.status === 'done') {
    
          getBase64(info.file.originFileObj, (url) => {
            setLoadingImage(false);
            setNewImageURL(url);
            setNewImage(info.file.originFileObj);
          });
        }
      };


    const {URL, Progress} = badge

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space
                align="start"
                className="hq-opposite-arrangement"
            >
                <Space>
                    <p>Edit badge image</p>

                    <Button
                        size="small"
                        type="primary"
                        loading={(loadingEditMapElementBadgeImage || loadingEditBadgeSystemEntity)}
                        onClick={() => {
                            if(!newImage){
                                api.destroy()
                                api.warning('Please add an image')

                                return

                            }

                            if(nonElementBadge){
                                const data = new FormData()
                                data.append("BadgeEntityId", badge.Id)
                                data.append("Picture", newImage)
    
                                editBadgeSystemEntity(data)
                                .then(r => handleResponse(
                                    r,
                                    api,
                                    'Updated successfuly',
                                    1,
                                    () => {
                                        reloadMap()
                                        onClose()
                                    }))
                            }
                            else{
                                const data = new FormData()
                                data.append("BadgeId", badge.Id)
                                data.append("Picture", newImage)
    
                                editMapElementBadgeImage(data)
                                .then(r => handleResponse(
                                    r,
                                    api,
                                    'Updated successfuly',
                                    1,
                                    () => {
                                        reloadMap()
                                        onClose()
                                    }))
                            }
                            
                        }}
                    >
                        Update
                    </Button>
                </Space>
                <img 
                    src={URL}
                    alt={"Badge " + Progress}
                    className="map-badge-small-img"
                />
               
            </Space>}
            width={'40%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
                <Dragger  
                    customRequest={dummyRequest}
                    accept={ALLOWED_IMAGE_EXTENSIONS}
                    onChange={handleChange}
                    showUploadList={false}
                >
                    {!newImageURL && <>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    </>}
                    {loadingImage && <Spin size="small"/>}
                    {newImageURL && 
                    <img 
                        src={newImageURL}
                        className="new-course-photo"
                        alt="course"
                    />}
                </Dragger>
            </Drawer>
        </div>
    )
}