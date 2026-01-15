import { Button, Drawer, Space, Spin, message } from "antd";
import React from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { useState } from "react";
import { LatexRenderer } from "../../../Components/LatexRenderer";

import './index.css'
import Dragger from "antd/es/upload/Dragger";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../services/Auxillary";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";

export function EditQuestionnaireChoiceImage({open, onClose, choice, reloadSurvey}){

    if(!open) return <div/>;

    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const {LaTex, ImageURL} = choice

    const [api, contextHolder] = message.useMessage()
    const {isLoadingUpdateQuestionnaireChoiceImage, updateQuestionnaireChoiceImage} = useQuestionnaires()
    
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingImage(true);
          return;
        }
    
        if (info.file.status === 'done') {
          console.log(info.file.originFileObj)
          getBase64(info.file.originFileObj, (url) => {
            setLoadingImage(false);
            setNewImageURL(url);
            setNewImage(info.file.originFileObj);
          });
        }
      };

    return(
        <Drawer
        title="Edit choice image"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <Space
                size={'large'}
                align="start"
            >
        
                {LaTex && <LatexRenderer latex={LaTex} />}
                {ImageURL && 
                <img 
                    alt={'Choice'}
                    className="multiple-choice-question-edit-view-choice-img"
                    src={ImageURL}
                />}
            </Space>
        }
        >
        {contextHolder}
        <div
            className="thumbnail-uploader"
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
                    className="hq-upload-img"
                    alt="question"
                />}
            </Dragger>
        </div>

        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(!newImage){
                    api.destroy()
                    api.warning('Please provide a an image')

                    return
                }
                
                const data = new FormData()
                data.append("ChoiceId", choice.Id)
                data.append("Picture", newImage)

                updateQuestionnaireChoiceImage(data)
                .then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadSurvey()
                }))
            }}

            loading={isLoadingUpdateQuestionnaireChoiceImage}
        >
            Update
        </Button>
        </Drawer>
    )
}