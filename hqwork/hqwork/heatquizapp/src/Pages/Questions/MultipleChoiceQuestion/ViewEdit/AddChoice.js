import { Button, Divider, Drawer, Space, Spin, Switch, message } from "antd";
import React from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { useState } from "react";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";
import { useQuestions } from "../../../../contexts/QuestionsContext";

import './index.css'
import Dragger from "antd/es/upload/Dragger";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../../services/Auxillary";

export function AddChoice({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const [newLatex, setNewLatex] = useState('')
    const [isCorrect, setIsCorrect] = useState(false)

    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const [api, contextHolder] = message.useMessage()

    const {isLoadingAddMultipleChoiceQuestionChoice, addMultipleChoiceQuestionChoice,} = useQuestions()

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
        title="Add choice"
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

        <Divider orientation="left">Image</Divider>
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

        <Divider orientation="left">LaTeX</Divider>
        <Space
            direction="vertical"
            size={'large'}
            className="hq-full-width"
        >
            <TextArea 
                value={newLatex}
                rows={4} 
                onChange={(v) => setNewLatex(v.target.value)}
            />

            <LatexRenderer latex={newLatex} />
        </Space>
        <Divider orientation="left">Status</Divider>
        <Switch
            checked={isCorrect}
            checkedChildren={'Correct'}
            unCheckedChildren={'False'}
            onChange={() => {setIsCorrect(!isCorrect)}}
        />
        
        <br/>
        <br/>
        
        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(!newLatex.trim() && !newImage){
                    api.destroy()
                    api.warning('Please provide LaTex content or an image')

                    return
                }       
                
                const data = new FormData()
                data.append("QuestionId", question.Id)
                data.append("Picture", newImage)
                data.append("Latex", newLatex)
                data.append("Correct", isCorrect)
                data.append("Width", 1)
                data.append("Height", 1)

                addMultipleChoiceQuestionChoice(data)
                .then(r => handleResponse(r, api, 'Choice added successfully', 1, () => {
                    onClose()
                    reloadQuestion()
                }))

            }}

            loading={isLoadingAddMultipleChoiceQuestionChoice}
        >
            Add
        </Button>
        </Drawer>
    )
}