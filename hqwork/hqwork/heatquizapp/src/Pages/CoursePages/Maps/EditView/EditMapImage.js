import {Alert, Button, Drawer, Space, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';

import { UploadImage } from "../../../../Components/UploadImage";
import { handleResponse } from "../../../../services/Auxillary";
import { useMaps } from "../../../../contexts/MapsContext";

import "./index.css"

export function EditMapImage({open, onClose, map, reloadMap}){

    if(!open) return <div/>;

    const { loadingEditMapImage, editMapImage,} = useMaps()

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)
    const [ratio, setRation] = useState(0)

    const [api, contextHolder] = message.useMessage()

    const {LargeMapWidth} = map

    return( 
        <Drawer
        title={
        <Space size={'large'}>
            <p>Edit Map Image</p>

            <Button
                size="small"
                type="primary"

                loading={loadingEditMapImage}

                onClick={() => {
                    if(!newImage){
                        api.destroy()
                        api.warning("Please add image")
                        return
                    }

                    const data = new FormData()

                    data.append("MapId", map.Id)
                    data.append("Picture", newImage)
                    data.append("Ratio", ratio)

                    editMapImage(data).then(r => handleResponse(r, api, 'Updates successfully', 1, () => {
                        reloadMap()
                        onClose()
                    }))
                }}
            >
                Update
            </Button>
        </Space>}
        width={'60%'}
        onClose={onClose}
        open={open}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {contextHolder}
            <div>
                <Alert 
                    message={
                    <p>Image width will be the same, while the height will be <strong>recalculated</strong> depending on the new image's ratio of dimensions. {'\n'}
                    Current width:{LargeMapWidth} px.</p>}
                    type="info"
                /> 
                    
                <br/>
                <UploadImage
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)
                    }}

                    imageURL={newImageURL}

                    className="edit-map-image-container"
                    classNameImage="edit-map-image-inside"
                />
                <img 
                    style={{width:0, height:0}}
                    src = {newImageURL}
                    onLoad={(e) => {
                        e.persist()

                        const w = e.target.naturalWidth
                        const h = e.target.naturalHeight

                        const _ratio = (h/w)

                        setRation(_ratio)

                    }}
                />
            </div>
        </Drawer>
    )
}