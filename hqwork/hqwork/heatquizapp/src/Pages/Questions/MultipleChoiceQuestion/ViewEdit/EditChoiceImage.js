import { Button, Drawer, Space, Spin, message } from "antd";
import React from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { useState } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useQuestions } from "../../../../contexts/QuestionsContext";

import './index.css'
import Dragger from "antd/es/upload/Dragger";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../../services/Auxillary";

export function EditChoiceImage({open, onClose, choice, question, reloadQuestion}){

    if(!open) return <div/>;

    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const {Latex, Correct, ImageURL, index} = choice

    const [api, contextHolder] = message.useMessage()
    const {isLoadingEditMultipleChoiceQuestionChoice, editMultipleChoiceQuestionChoice} = useQuestions()
    
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
                <p 
                    className={Correct ? 'default-green hq-bold-font-weight' : 'default-red hq-bold-font-weight'}
                >
                    {index+1}
                </p>

                {Latex && <LatexRenderer latex={Latex} />}
                {ImageURL && 
                <img 
                    alt={'Choice' + index + 1}
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
                if(!newImage && !Latex){
                    api.destroy()
                    api.warning('Please provide a an image since this choice has no LaTeX content')

                    return
                }
                
                const data = new FormData()
                data.append("QuestionId", question.Id)
                data.append("AnswerId", choice.Id)
                data.append("Correct", Correct)
                data.append("Picture", newImage)
                data.append("Width", 1)
                data.append("Height", 1)

                editMultipleChoiceQuestionChoice(data)
                .then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadQuestion()
                }))
            }}

            loading={isLoadingEditMultipleChoiceQuestionChoice}
        >
            Update
        </Button>
        </Drawer>
    )
}