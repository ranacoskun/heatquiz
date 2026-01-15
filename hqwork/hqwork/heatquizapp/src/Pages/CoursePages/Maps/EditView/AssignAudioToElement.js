import {Button, Drawer, Space, Spin, message} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, FileSyncOutlined} from '@ant-design/icons';
import { useMaps } from "../../../../contexts/MapsContext";
import { ALLOWED_AUDIO_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

export function AssignAudioToElement({open, onClose, element, reloadMap}){
    
    if(!open) return <div/>;
    const [loadingAudio, setLoadingAudio] = useState(false)
    
    const {loadingAssignAudioToMapElement,  assignAudioToMapElement,} = useMaps()

    const [newAudio, setNewAudio] = useState(null)
    const [newAudioURL, setNewAudioURL] = useState(null)

    const [api, contextHolder] = message.useMessage()

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingAudio(true);
          return;
        }
    
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoadingAudio(false);
                setNewAudioURL(url)
                setNewAudio(info.file.originFileObj)
            });
        }
    };

    useEffect(()=> {
        setLoadingAudio(false)
    }, [])

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space>
                <p>Add Audio to element {' '}{element.Title}</p>

                <Button
                    size="small"
                    type="primary"
                    loading={loadingAssignAudioToMapElement}
                    onClick={() => {
                        const data = new FormData()

                        data.append('ElementId', element.Id)
                        data.append("Audio", newAudio)

                        assignAudioToMapElement(data)
                        .then(r => 
                            handleResponse(
                                r,
                                api,
                                'Audio assigned successfuly',
                                1,
                                () => {
                                    reloadMap()
                                    onClose()
                                }))
                    }}
                >
                    Assign
                </Button>
            </Space>}
            width={'40%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
            
            <Dragger  
                customRequest={dummyRequest}
                accept={ALLOWED_AUDIO_EXTENSIONS}
                onChange={handleChange}
                showUploadList={false}
                >
                {!newAudioURL && 
                <>
                <p className="ant-upload-drag-icon">
                <FileSyncOutlined />
                </p>
            
                </>}
                {loadingAudio && <Spin size="small"/>}
            </Dragger>
            </Drawer>
        </div>
    )
}