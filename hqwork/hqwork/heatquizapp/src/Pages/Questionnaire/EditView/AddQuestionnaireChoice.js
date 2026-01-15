import { Button, Divider, Drawer, Input, Radio, Slider, Space, Spin, Switch, Tooltip, message } from "antd";
import React from "react";
import {ArrowLeftOutlined, InboxOutlined, InfoOutlined} from '@ant-design/icons';
import { useState } from "react";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import TextArea from "antd/es/input/TextArea";

import './index.css'
import Dragger from "antd/es/upload/Dragger";
import { ALLOWED_IMAGE_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../services/Auxillary";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { QUESTIONNAIRE_QUESTION_MC_TYPE } from "../Shared/Constants";

export function AddQuestionnaireChoice({open, onClose, question, reloadSurvey}){

    if(!open) return <div/>;

    const [newLatex, setNewLatex] = useState('')

    const [loadingImage, setLoadingImage] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageURL, setNewImageURL] = useState(null);

    const [type, setType] = useState(QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL)

    const [maxCharacterCount, setMaxCharacterCount] = useState(50)

    const [start, setStart] = useState(1)
    const [end, setEnd] = useState(10)
    const [step, setStep] = useState(1)

    const [api, contextHolder] = message.useMessage()

    const {isLoadingAddQuestionnaireChoice, addQuestionnaireChoice} = useQuestionnaires()

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

    const {Title, Body, ImageURL} = question

    const renderTextInput = () => {
        return(
            <div className="hq-full-width">
                <Space className="hq-full-width hq-opposite-arrangement">
                    <Input 
                        prefix={<p className="default-gray">Max character count</p>}
                        
                        className="hq-full-width"
                        min={1}
                        type="number"
                        value={maxCharacterCount}

                        onChange={(v) => {
                            const value = v.target.value

                            if(value < 1) return;

                            setMaxCharacterCount(value)
                        }}
                    />
                    <Tooltip
                        color="white"
                        title={<p>The maximum number of characters students allowed to enter.</p>}
                    >
                        <InfoOutlined className="default-title" />
                    </Tooltip>
                </Space>
            </div>
        )
    }

    const canDisplayRange = (start, end, step) => {
        const data = [
            parseFloat(start),
            parseFloat(end),
            parseFloat(step)
        ]
        if(data.filter(a => Object.is(a, NaN)).length) return false;

        return true;
    }

    const renderRangeInput = () => {
        const displayRange = canDisplayRange(start, end, step)

        return(
            <div className="hq-full-width">
                <Space className="hq-full-width hq-opposite-arrangement">
                    <Input 
                        prefix={<p className="default-gray">Start</p>}
                        value={start}

                        onChange={(v) => {
                            const value = v.target.value

                            setStart(value)
                        }}
                    />

                    <Input 
                        prefix={<p className="default-gray">End</p>}
                        value={end}

                        onChange={(v) => {
                            const value = v.target.value

                            if(value < start) return;

                            setEnd(value)
                        }}
                    />

                    <Input 
                        prefix={<p className="default-gray">Step</p>}
                        value={step}

                        onChange={(v) => {
                            const value = v.target.value

                            setStep(value)
                        }}
                    />
                </Space>
                {displayRange ? 
                <Slider 
                    min={parseFloat(start)}
                    max={parseFloat(end)}
                    step={parseFloat(step)}
                    className="hq-full-width"
                /> : 
                <p className="default-gray">Invalid data</p>
                }
            </div>
        )
    }

    return(
        <Drawer
        title={
            <Space>
            <p>Add Choice</p>
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
                    data.append("Latex", newLatex.trimEnd())
                    data.append("Type", type)

                    if(Object.is(type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT)){
                        if(!maxCharacterCount || maxCharacterCount < 1){
                            api.destroy()
                            api.warning('Please insure the max character count is above zero')
        
                            return
                        }

                        data.append("MaxCharacterCount", maxCharacterCount)
                    }
                    else if(Object.is(type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE)){
                        const valid = canDisplayRange(start, end, step)
                        if(!valid || (start >= end) || (step > start) || (step > (end - start))){
                            api.destroy()
                            api.warning('Please insure valid range entry')
        
                            return
                        }

                        data.append("Start", parseFloat(start))
                        data.append("End", parseFloat(end))
                        data.append("Step", parseFloat(step))
                    }

                    addQuestionnaireChoice(data)
                    .then(r => handleResponse(r, api, 'Choice added successfully', 1, () => {
                        onClose()
                        reloadSurvey()
                    }))

                }}

                loading={isLoadingAddQuestionnaireChoice}
            >
                Add
            </Button>
            </Space>
            }
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
            <p className="default-title">{Title}</p>
            <Space size={'large'} align="start">
                {ImageURL && 
                <div>
                    <img
                        src = {ImageURL}
                        alt="question"
                        className="question-feedback-image"
                        
                    />
                </div>}
                <div>
                    {Body && <LatexRenderer latex={Body || ""}/>}
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
        <Space>
            <Radio.Group size="small" value={type} onChange={(v) => {
                setType(v.target.value)
            }}>
                <Radio.Button value={QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL}>Normal</Radio.Button>
                <Radio.Button value={QUESTIONNAIRE_QUESTION_MC_TYPE.TXT}>Text input</Radio.Button>
                <Radio.Button value={QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE}>Range input</Radio.Button>
            </Radio.Group>
        </Space>
                                    
        {Object.is(type,QUESTIONNAIRE_QUESTION_MC_TYPE.TXT) && 
        <div>
        <br/>
        {renderTextInput()}
        </div>}
        {Object.is(type,QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE) &&
        <div>
            <br/>
            {renderRangeInput()}
        </div>}
       
        </Drawer>
    )
}