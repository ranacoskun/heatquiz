import {Button, Drawer, message, Form, Input, Spin, Space} from "antd";
import React, {useState } from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

export function AddBadgeSystemEntity({open, onClose, system, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingAddBadgeSystemEntity, addBadgeSystemEntity} = useMaps()

    const [newPercentage, setNewPercentage] = useState(1)

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

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
                <Space size={'large'}>
                    <p>Add badge</p>
                    <Button 
                        size="small"
                        type="primary"
                        onClick={() => {
                            if(!newImage){
                                api.destroy()
                                api.warning('Please add image')

                                return
                            }

                            const data = new FormData()
                            data.append("MapId", system.Id)
                            data.append("Title", system.Title) 
                            data.append('Pictures', newImage);
                            data.append('ProgressList', newPercentage)
                            
                            addBadgeSystemEntity(data).then(r => 
                                handleResponse(
                                    r,
                                    api,
                                    'Added successfuly',
                                    1,
                                    () => {
                                        reloadMap()
                                        onClose()
                                    })
                            )
                        }}

                        loading={loadingAddBadgeSystemEntity}
                    >
                        Add
                    </Button>
                </Space>
            }
            width={'70%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
            <Form>
                <Form.Item>
                    <p className="default-gray">Progress</p>
                    <Input 
                        placeholder="Badge progress"
                        type="number"
                        min={1}
                        max={100}
                        onChange={(v) => {
                            const value = Number(v.target.value)

                            if(value < 1) return;
                            if(value > 100) return;

                            setNewPercentage(value)
                        }}
                        value={newPercentage}
                    />
                </Form.Item>
            </Form>

            <p className="default-gray">Image</p>
            <div
                className="add-badge-system-entity-container"
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
            </div>            
            </Drawer>
        </div>
    )
}