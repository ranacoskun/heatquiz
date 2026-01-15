import { Button, Divider, Drawer, Spin, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';

import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

import { useClickTrees } from "../../contexts/ClickTreesContext";

export function EditNodeImage({open, onClose, node, reloadData}){
    const {loadingEditNode, editNode} = useClickTrees()

    const [messageApi, contextHolder] = message.useMessage();
    
    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

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
                title={"Edit Node Image"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >   
                <div className="tree-picture-uploader">
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
                            className="new-tree-picture"
                            alt="tree"
                        />}
                    </Dragger>
                </div>
                <br/>
                <Button
                    type="primary"
                    onClick={() => {
                        if(!newImage){
                            messageApi.destroy()
                            messageApi.warning('Please upload a new image')
    
                            return
                       }

                      
                       
                       let data = new FormData()
                       data.append('Name', node.Name)
                       data.append('AnswerId', node.Id)
                       data.append('Picture', newImage)
                       data.append('SameImage', false)

                       editNode(data)
                       .then((r) => handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                       }))
                        
                    }}
                    loading = {loadingEditNode}
                >
                Update
                </Button>
                <Divider />
                <small className="default-gray">Node </small>
                <p className="default-title">
                    {(node || {}).Name} 
                </p>
            </Drawer>
        </div>
    )
}