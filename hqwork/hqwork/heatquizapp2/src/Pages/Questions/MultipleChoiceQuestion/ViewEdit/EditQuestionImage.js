import { Button, Drawer, Space, Spin, message } from "antd";
import React from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { useState } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useQuestions } from "../../../../contexts/QuestionsContext";

import './index.css'
import Dragger from "antd/es/upload/Dragger";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../../services/Auxillary";

export function EditQuestionImage({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const [api, contextHolder] = message.useMessage()
    const { isLoadingEditMultipleChoiceQuestionImage, editMultipleChoiceQuestionImage} = useQuestions()
    
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
        title="Edit question image"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
                <p className="default-title">{question.Code}</p>
                <Space size={'large'} align="start">
                    <div>
                        <img
                            src = {question.Base_ImageURL}
                            alt="question"
                            className="question-feedback-image"
                            
                        />
                    </div>
                    <div>
                        {question.Latex && <LatexRenderer latex={question.Latex}/>}
                    </div>
                </Space>
            </div>}
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
                    api.warning('Please provide an image')

                    return
                }
                
                const data = new FormData()
                data.append("QuestionId", question.Id)
                data.append("Picture", newImage)

                editMultipleChoiceQuestionImage(data)
                .then(r => handleResponse(r, api, 'Image updated successfully', 1, () => {
                    onClose()
                    reloadQuestion()
                }))
            }}

            loading={isLoadingEditMultipleChoiceQuestionImage}
        >
            Update
        </Button>
        </Drawer>
    )
}