import { Button, Drawer, Spin, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import Dragger from "antd/es/upload/Dragger";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../services/Auxillary";
import { useUsers } from "../../contexts/UsersContext";

export function EditProfilePicture({username, open, onClose, reloadData}){

    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const {loadingEditProfilePicture, updateUserProfilePicture} = useUsers()

    const [messageApi, contextHolder] = message.useMessage();

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
            title={"Edit profile picture"}
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
        >
            <div className="user-profile-picture-uploader">
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
                        className="new-profile-picture"
                        alt="course"
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

                   data.append('Username', username)
                   data.append('Picture', newImage)

                   updateUserProfilePicture(data)
                   .then((r) => 
                   handleResponse(r, messageApi, 'Picture updated successfully', 1, () => {
                    onClose()
                    reloadData()
                    }))

                }}
                loading = {loadingEditProfilePicture}
            >
                Update
            </Button>
        </Drawer>
        </div>
    )
}