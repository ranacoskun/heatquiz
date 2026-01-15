import {Button, Col, Divider, Drawer, Input, Radio, Row, Slider, Space, Tooltip, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, PlusOutlined, InfoOutlined, DeleteOutlined} from '@ant-design/icons';

import './index.css'
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { MAX_ALLOWED_COURSE_NAME, handleResponse } from "../../../services/Auxillary";
import TextArea from "antd/es/input/TextArea";
import { UploadImage } from "../../../Components/UploadImage";
import { SelectDefaultImage } from "../../../Components/SelectDefaultImage";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { makeid } from "../../../services/Auth";
import { QUESTIONNAIRE_QUESTION_MC_TYPE } from "../Shared/Constants";
import { validateChoices } from "../Shared/Functions";

export function AddQuestionnaireQuestion({open, onClose, survey, reloadSurvey}){

    if(!open) return <div/>;

    const [api, contextHolder] = message.useMessage()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState(null)

    const [defaultImage, setDefaultImage] = useState(null)

    const [isSingleChoice, setIsSingleChoice] = useState(false)

    const [choices, setChoices] = useState([])

    const {isLoadingAddQuestionnaireQuestion, addQuestionnaireQuestion,} = useQuestionnaires()

    const renderTextInput = (ci) => {
        const _choice = choices[ci]
        const {MaxCharacterCount} = _choice

        return(
            <div className="hq-full-width">
                <Space className="hq-full-width hq-opposite-arrangement">
                    <Input 
                        prefix={<p className="default-gray">Max character count</p>}
                        
                        className="hq-full-width"
                        min={1}
                        type="number"
                        value={MaxCharacterCount}

                        onChange={(v) => {
                            const value = v.target.value

                            if(value < 1) return;

                            let _choices = [...choices]            
                            _choices[ci].MaxCharacterCount = value
                            setChoices(_choices)
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

    const renderRangeInput = (ci) => {

        const _choice = choices[ci]
        const {Start, End, Step} = _choice

        const displayRange = canDisplayRange(Start, End, Step)

        const _start = parseFloat(Start)
        const _end= parseFloat(End)
        const _step = parseFloat(Step)

        return(
            <div className="hq-full-width">
                <Space className="hq-full-width hq-opposite-arrangement">
                    <Input 
                        prefix={<p className="default-gray">Start</p>}
                        value={Start}

                        onChange={(v) => {
                            const value = v.target.value

                            let _choices = [...choices]            
                            _choices[ci].Start = value
                            setChoices(_choices)
                        }}
                    />

                    <Input 
                        prefix={<p className="default-gray">End</p>}
                        value={End}

                        onChange={(v) => {
                            const value = v.target.value

                            if(value < Start) return;

                            let _choices = [...choices]            
                            _choices[ci].End = value
                            setChoices(_choices)
                        }}
                    />

                    <Input 
                        prefix={<p className="default-gray">Step</p>}
                        value={Step}

                        onChange={(v) => {
                            const value = v.target.value

                            let _choices = [...choices]            
                            _choices[ci].Step = value
                            setChoices(_choices)
                        }}
                    />
                </Space>
                {displayRange ? 
                <Slider 
                    min={_start}
                    max={_end}
                    step={_step}
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
                    <p>Add Question</p>

                    <Button
                        size="small"
                        type="primary"
                        loading={isLoadingAddQuestionnaireQuestion}
                        onClick={() => {
                            if(!body.trim() || !title.trim())
                            {
                                api.destroy()
                                api.warning("Please add title and body")

                                return
                            }
                            const choicesValidation = validateChoices(choices)

                            if(!choicesValidation){
                                api.destroy()
                                api.warning("Please add atleast (two normal choices / one text input / one range input) for each multiple choice question")

                                return
                            }
                            
                            const data = new FormData

                            data.append("SurveyId", survey.Id)

                            data.append("Title", title.trim())
                            data.append("Body", body.trim())
                            data.append("IsSingleChoice", isSingleChoice)

                            let fileNamesList = []
                            let filesList = []

                            let qData = ({
                                Title: title.trimEnd(),
                                Body: body,
                                ImageURL: null,
                                Image: null,
                                Choices:[]
                            })

                            if(image){
                                const randomNumber = makeid(8)
                                qData.ImageURL = "" + randomNumber
                                fileNamesList.push(randomNumber)
                                filesList.push(image)
                            }
                            else if(defaultImage){
                                qData.ImageURL = "" + defaultImage.Id
                            }

                            for(const [ci, c] of choices.entries()) {
                                let cData = ({
                                    ...c,
                                    Order:  choices.length - ci + 1,
                                    LaTex: c.Latex.trimEnd(),
                                    ImageURL: null,
                                    Image: null,
                                })

                                if(c.Image){
                                    const randomNumber = makeid(8)
                                    cData.ImageURL = "" + randomNumber
                                    fileNamesList.push(randomNumber)
                                    filesList.push(c.Image)
                                }

                                qData.Choices.push(cData)
                            }


                            data.append("QuestionString", JSON.stringify(qData))

                            for(const fn of fileNamesList){
                                data.append("FileListCodes", fn)
                            }

                            for(const fn of filesList){
                                data.append("Files", fn)
                            }

                            addQuestionnaireQuestion(data).then(r => handleResponse(r, api, "Added successfully",1 ,() => {
                                onClose()
                                reloadSurvey()
                            }))
                        }}
                    >
                        Add
                    </Button>
                </Space>
            }
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}      
        >
        {contextHolder}
        <div className="hq-full-width">
            <Row>
                    <Col xs = {6}>
                        <Space direction="vertical">
                        <Space>
                        <small className="default-gray">Image (optional)</small>
                        {(imageURL || defaultImage) && 
                                <small className="default-red hq-clickable" 
                                onClick={() => {
                                    setDefaultImage(null)
                                    setImage(null)
                                    setImageURL(null)
                                }}>Clear</small>}
                        </Space>
                        <Space size={'large'} align="start">
                            <div>
                                <UploadImage
                                    onSetImage={(url, img) => {
                                        setDefaultImage(null)
                                        setImage(img)
                                        setImageURL(url)
                                    }}

                                    imageURL={imageURL}

                                    className="add-multiple-choice-question-img-box"
                                    classNameImage="add-multiple-choice-question-img-box-inside-img"
                                />
                                
                            </div>
                            <SelectDefaultImage 
                                onSetImage={(di) => {
                                    setDefaultImage(di)
                                    setImage(null)
                                    setImageURL(null)
                                }}

                                imageURL={(defaultImage || {ImageURL:''}).ImageURL}

                                className="add-multiple-choice-question-img-box"
                                classNameImage="add-multiple-choice-question-img-box-inside-img"
                            />
                        </Space>                        
                       </Space>
                       
                    </Col>
                    <Col xs={1} />
                    <Col xs={6}>
                        <Space direction="vertical">
                            <small className="default-gray">Title</small>
                            <Input 
                                type="text"
                                maxLength={MAX_ALLOWED_COURSE_NAME}

                                value={title}

                                onChange={(v) => {
                                    const value = v.target.value
                                    setTitle(value)
                                }}

                                className="add-questionnaire-title"
                            />
                            <small className="default-gray">Body text </small>  {/*&nbsp; &nbsp; <span className="default-smaller">(Changing the text resets the whole variables list.)</span></small> */}
                            <TextArea
                                value={body}
                                rows={4} 
                                onChange={(v) => {
                                    const value = v.target.value
                                    setBody(value)
                                }}

                                className="add-questionnaire-body"
                            />

                            <LatexRenderer latex={body || "-"} />                           
                       </Space>
                    </Col>
                    <Col xs={1} />
                    <Col xs={6}>
                        <Space direction="vertical">
                            <Space className="add-questionnaire-body hq-opposite-arrangement">
                            <Space>
                                <small className="default-gray">Choices</small>

                                <Button
                                    icon={<PlusOutlined className="default-green"/>}

                                    onClick={() => {
                                        let _choices = [...choices]

                                        _choices.push({
                                            Latex:"",
                                            Image:null,
                                            ImageURL: null,
                                            Type: QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL,

                                            MaxCharacterCount:50,
                                            Start:1,
                                            End:10,
                                            Step:1
                                        })

                                        setChoices(_choices)
                                    }}

                                    size="small"
                                />
                            </Space>
                            <Space>
                                <small className="default-title">Player choice restricted to a signle choice</small>

                                <Radio.Group size="small" value={isSingleChoice} onChange={(v) => {
                                    const value = v.target.value 
                                    setIsSingleChoice(value)
                                }}>
                                    <Radio.Button value={true}>Yes</Radio.Button>
                                    <Radio.Button value={false}>No</Radio.Button>
                                </Radio.Group>
                            </Space>
                            </Space>
                            <br/>
                            {choices.map((c, ci) => {
                                const {Latex, ImageURL, Type} = c

                                return(
                                <div
                                    key={ci}
                                >
                                    <Space align="start">
                                        <p className="default-title">{ci + 1}</p>

                                        <div>
                                            <TextArea
                                                value={Latex}
                                                rows={4} 
                                                onChange={(v) => {
                                                    const value = v.target.value

                                                    let _choices = [...choices]
            
                                                    _choices[ci].Latex = value
                                                    setChoices(_choices)
                                                }}

                                                className="add-questionnaire-body"
                                            />

                                            <br/>

                                            <LatexRenderer latex={Latex || "-"} />
                                        </div>
                                        <div>
                                        <UploadImage 
                                                onSetImage={(url, img) => {
                                                    let _choices = [...choices]
            
                                                    _choices[ci].ImageURL = url
                                                    _choices[ci].Image = img
                                                    setChoices(_choices)
                                                }}

                                                imageURL={ImageURL}

                                                className="add-multiple-choice-question-img-box"
                                                classNameImage="add-multiple-choice-question-img-box-inside-img"
                                            />
                                        </div>
                                        <Space>
                                            <Button 
                                                size="small" 
                                                type="default" 
                                                onClick={() => {
                                                    let _choices = [...choices]

                                                    _choices = _choices.filter((cc, cci) => cci !== ci)
                
                                                    setChoices(_choices)
                                                }} 

                                                icon={<DeleteOutlined className="default-red"/>}
                                            />
                                        </Space>
                                    </Space>
                                    <br/>
                                    <Space>
                                    <Radio.Group size="small" value={Type} onChange={(v) => {
                                        const value = v.target.value
                                        let _choices = [...choices]
            
                                        _choices[ci].Type = value

                                        setChoices(_choices)
                                    }}>
                                        <Radio.Button value={QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL}>Normal</Radio.Button>
                                        <Radio.Button value={QUESTIONNAIRE_QUESTION_MC_TYPE.TXT}>Text input</Radio.Button>
                                        <Radio.Button value={QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE}>Range input</Radio.Button>
                                    </Radio.Group>
                                    </Space>
                                    {Object.is(Type,QUESTIONNAIRE_QUESTION_MC_TYPE.TXT) && 
                                    <div>
                                        <br/>
                                        <br/>
                                        {renderTextInput(ci)}
                                    </div>}
                                    {Object.is(Type,QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE) &&
                                    <div>
                                        <br/>
                                        <br/>
                                        {renderRangeInput(ci)}
                                    </div>}
                                    <Divider />
                                </div>
                                )
                            })}
                       </Space>
                    </Col>
                </Row>
        </div>
        </Drawer>
    )
}