import { Button, Divider, Drawer, Form, Input, Spin, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';

import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

import { useClickTrees } from "../../contexts/ClickTreesContext";

export function AddImageTree({open, onClose, baseTree, reloadData}){
    const {loadingAddImageTree, addImageTree} = useClickTrees()


    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')
    
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
                title={"Add Image"}
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
                <Form>
                    <Form.Item>
                        <small className="default-gray">Name</small>
                        <Input 
                        placeholder="New name"
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                </Form>
                <Button 
                    type="primary"
                    onClick={() => {
                        if(!newImage){
                            messageApi.destroy()
                            messageApi.warning('Please upload a new image')
    
                            return
                       }

                       if(!newName.trim()){
                            messageApi.destroy()
                            messageApi.warning('Please add name')
                       }
                       
                       let data = new FormData()
                       data.append('Name', newName)
                       data.append('Picture', newImage)
                       data.append('GroupId', baseTree.Id)

                       addImageTree(data).then((r) => 
                        handleResponse(r, messageApi, 'Added successfully', 1, () => {
                            reloadData()
                            onClose()
                        }))
                        
                    }}
                    loading = {loadingAddImageTree}
                >
                Add
                </Button>
                <Divider />
                <small className="default-gray">Tree </small>
                <p className="default-title">
                    {(baseTree || {}).Name} 
                </p>
            </Drawer>
        </div>
    )
}