import React, { useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import {Button, Col, Divider, Form, Input, Radio, Row, Slider, Space, Steps, Tabs, Tooltip, message } from "antd";
import {ScheduleTwoTone, DeleteOutlined, WarningOutlined, SmileTwoTone, InfoOutlined, ArrowUpOutlined, ArrowDownOutlined, FrownTwoTone, CheckCircleFilled, LeftCircleOutlined, RightCircleOutlined, CloseCircleTwoTone, CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { MAX_QUESTION_CODE } from "../../Questions/Shared/Constants";

import "./index.css"
import { SelectDefaultImage } from "../../../Components/SelectDefaultImage";
import { UploadImage } from "../../../Components/UploadImage";
import { MAX_ALLOWED_COURSE_NAME, getUniqueValues, handleResponse } from "../../../services/Auxillary";
import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import {useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { makeid } from "../../../services/Auth";
import {QUESTIONNAIRE_QUESTION_MC_TYPE} from "../Shared/Constants";
import { validateChoices } from "../Shared/Functions";

export function AddQuestionnaire(){
    const [api, contextHolder] = message.useMessage()

    const [currentTab, setCurrentTab] = useState(0)

    const [code, setCode] = useState("")
    const [explanation, setExplanation] = useState("")
    const [finalText, setFinalText] = useState("")
    const [surveyImage, setSurveyImage] = useState("")
    const [surveyImageURL, setSurveyImageURL] = useState("")

    const [questions, setQuestions] = useState([])

    const [currentQuestionsTab, setCurrentQuestionsTab] = useState(0)

    const {isLoadingAddSurvey, addSurvey,} = useQuestionnaires()

    const validateInfo = () => {
        if(!code.trim()) return "Please add code"

        return null
    }



    const renderInfo = () => {
        return(
            <Space align="start" size="large">
            <Form>
                <Form.Item>
                    <p>Code</p>
                    <Input 
                        className="question-form-sheet-input"
                        placeholder="Unique question code"
                        value={code}
                        onChange={(v) => {
                            const value = v.target.value
                            setCode(value)
                        }}
                        maxLength={MAX_QUESTION_CODE}
                        showCount
                    />
                </Form.Item>
            </Form>
            <Form>
            <Form.Item>
                    <p>Explanation (optional)</p>
                    <TextArea
                        value={explanation}
                        rows={4} 
                        onChange={(v) => {
                            const value = v.target.value

                            setExplanation(value)
                        }}  

                        className="add-questionnaire-body"
                    />

                    <LatexRenderer latex={explanation || "-"} />
                </Form.Item>
            </Form>
            <Form>
                <Form.Item>
                    <Tooltip
                            color="white"
                            title={<p>Text displayed to survey participants after sumbitting thier answers</p>}
                        >
                            <p>Post-sumbittion text (optional)</p>
                        </Tooltip>
                        <TextArea
                            value={finalText}
                            rows={4} 
                            onChange={(v) => {
                                const value = v.target.value

                                setFinalText(value)
                            }}  

                            className="add-questionnaire-body"
                        />
                </Form.Item>
                
                
            </Form>

            <Form>
            <Form.Item>
                <Space>
                    <p>Image (optional)</p>
                    {surveyImage && 
                    <p 
                    className="default-red hq-clickable" 
                        onClick={() => {
                            setSurveyImage(null)
                            setSurveyImageURL(null)
                        }}>
                            Clear
                    </p>}
                </Space>
                <UploadImage 
                    onSetImage={(url, img) => {
                       setSurveyImage(img)
                       setSurveyImageURL(url)
                    }}

                    imageURL={surveyImageURL}

                    className="add-multiple-choice-question-img-box"
                    classNameImage="add-multiple-choice-question-img-box-inside-img"
                />
                </Form.Item>
            </Form>
        </Space>
        )
    }

    const validateQuestion = (q) => {
        const {Latex, Title, Choices} = q

        if(!Title.trim()) return "Please add title";
        if(!Latex.trim()) return "Please add body";

        const choicesValidation = validateChoices(Choices)

        if(!choicesValidation)
            return "Please add atleast (two normal choices / one text input / one range input) for each multiple choice question";

        
        if(Choices.filter((c) => {
            const {Type, MaxCharacterCount, Start, End, Step} = c

            if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT)){
                const isValid = !Object.is(MaxCharacterCount, NaN)

                return (!isValid)
            }
            else if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE)){
                const isValid = canDisplayRange(Start, End, Step)
                return (!isValid)
            }

            return false
        }).length) return "Please validate entry for each direct input choice";

        if(Choices.filter(c => !(c.Latex.trim() || c.Image)).length) return "Please add a text or/and an image to choices";

        return null
    }

    const validateQuestions = () => {
        if(!questions.length) return {text: "Please add questions", index: -1};

        for(let [qi, q] of questions.entries()){
            const validationMessage = validateQuestion(q)

            if(validationMessage) return {index: qi, text: validationMessage}
        }

        return null
    }

    
    const validateVariableInsertion = (question) => {
        const {LatexVar} = question

        if(!LatexVar.length) return true

        if(LatexVar.length%2 !== 0) return false

        for(let i = 0; i <(0.5*LatexVar.length) ; i++){
            const v = LatexVar[2*i]
            const nextV = LatexVar[2*i+1]

            if(v !== nextV) return false
        } 

        return true
    }

    const convertTextBody = (question) => {
        const {Latex, LatexVar, reducedVarArray} = question

        let latex = Latex
        latex = Latex.replace('/@', '@')

        for(let i = 0; i <(0.5*LatexVar.length) ; i++){
            const v = LatexVar[2*i]
            const reducedV = reducedVarArray[i]
            const {link, fileURL} = reducedV

            latex = latex.replace(v, "<a target=\"_blank\" href = \"" + (link || fileURL) + "\">")
            latex = latex.replace(v, "</a>")
        } 

        return latex
    }

    const getVariablesFromVarArray = (varArry, latex) => {
        const uniqueValues = getUniqueValues(varArry).map(a => {
            const arrStr = latex.split(" ");

            let indices = []

            for(const [si, s] of arrStr.entries()){
                if(s === a) indices.push(si);
            }

            let inBetweenTextArray = []

            for(let i = 0; i < (indices.length * 0.5); i++){
                const index = indices[2 * i]
                const indexNext = indices[2 * i + 1]
                const textArr = arrStr.slice(index + 1, indexNext)
                const text = textArr.reduce((r, c) => r += c + " ", "")

                inBetweenTextArray.push(text)
            }

            return({
                variable: a,
                inBetweenText: inBetweenTextArray,
                isFile: false,
                file: null,
                fileURL: null,
                link: null
            })
        })

        return uniqueValues
    }
    
    const renderTextInput = (qi, ci) => {
        const _question = questions[qi]
        const {Choices} = _question

        const _choice = Choices[ci]
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

                            let _questions = [...questions]            
                            _questions[qi].Choices[ci].MaxCharacterCount = value
                            setQuestions(_questions)
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

    const renderRangeInput = (qi, ci) => {
        const _question = questions[qi]
        const {Choices} = _question

        const _choice = Choices[ci]
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

                            let _questions = [...questions]            
                            _questions[qi].Choices[ci].Start = value
                            setQuestions(_questions)
                        }}
                    />

                    <Input 
                        prefix={<p className="default-gray">End</p>}
                        value={End}

                        onChange={(v) => {
                            const value = v.target.value

                            if(value < Start) return;

                            let _questions = [...questions]            
                            _questions[qi].Choices[ci].End = value
                            setQuestions(_questions)
                        }}
                    />

                    <Input 
                        prefix={<p className="default-gray">Step</p>}
                        value={Step}

                        onChange={(v) => {
                            const value = v.target.value

                            let _questions = [...questions]            
                            _questions[qi].Choices[ci].Step = value
                            setQuestions(_questions)
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

    const renderMCEntry = (qi) => {
        const _question = questions[qi]
        const {Choices, IsSingleChoice} = _question

        return(
            <div>
                <Space direction="vertical">
                            <Space className="add-questionnaire-body hq-opposite-arrangement">
                            <Space>
                                <small className="default-gray">Choices</small>

                                <Button
                                    icon={<PlusOutlined className="default-green"/>}

                                    onClick={() => {
                                        let _questions = [...questions]

                                        _questions[qi].Choices = [..._questions[qi].Choices]

                                        _questions[qi].Choices.push({
                                            Latex:"",
                                            Image:null,
                                            ImageURL: null,
                                            Type: QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL,
                                            MaxCharacterCount:50,
                                            Start:0,
                                            End:10,
                                            Step:1
                                        })

                                        setQuestions(_questions)
                                    }}

                                    size="small"
                                />
                            </Space>
                            <Space>
                                <small className="default-title">Player choice restricted to a signle choice</small>

                                <Radio.Group size="small" value={IsSingleChoice} onChange={(v) => {
                                    const value = v.target.value

                                    let _questions = [...questions]

                                    _questions[qi].IsSingleChoice = value
 
                                    setQuestions(_questions)
                                }}>
                                    <Radio.Button value={true}>Yes</Radio.Button>
                                    <Radio.Button value={false}>No</Radio.Button>
                                </Radio.Group>
                            </Space>
                            </Space>
                            <br/>
                            {Choices.map((c, ci) => {
                                const {Latex, Type, ImageURL} = c
                                const firstChoice = (ci === 0)
                                const lastChoice = ((ci + 1) === Choices.length)
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
                                                    let _questions = [...questions]            
                                                    _questions[qi].Choices[ci].Latex = value
                                                    setQuestions(_questions)
                                                }}

                                                className="add-questionnaire-body"
                                            />

                                            <br/>

                                            <LatexRenderer latex={Latex || "-"} />
                                        </div>
                                        <div>
                                        <UploadImage 
                                                onSetImage={(url, img) => {
                                                    let _questions = [...questions]
            
                                                    _questions[qi].Choices[ci].ImageURL = url
                                                    _questions[qi].Choices[ci].Image = img

                                                    setQuestions(_questions)
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
                                                    let _questions = [...questions]

                                                    _questions[qi].Choices = _questions[qi].Choices.filter((cc, cci) => cci !== ci)
                
                                                    setQuestions(_questions)
                                                }} 

                                                icon={<DeleteOutlined className="default-red"/>}
                                            />
                                        </Space>
                                        <Space>
                                            <Button
                                                icon={<ArrowUpOutlined />}
                                                className={!firstChoice ? "default-title" : "default-gray"}
                                                onClick={() => {
                                                    if(firstChoice) return;

                                                    let _choices = [...Choices]
                                                    let _choices2 = [..._choices]
                    
                                                    _choices[ci-1] = _choices2[ci]
                                                    _choices[ci] = _choices2[ci-1]
                                                    
                                                    let _questions = [...questions]
                                                    _questions[qi].Choices = _choices
                                                    setQuestions(_questions)
                                                }}
                                            />
                                             <Button
                                                icon={<ArrowDownOutlined />}
                                                className={!lastChoice ? "default-title" : "default-gray"}
                                                onClick={() => {
                                                    if(lastChoice) return;

                                                    let _choices = [...Choices]
                                                    let _choices2 = [..._choices]
                    
                                                    _choices[ci+1] = _choices2[ci]
                                                    _choices[ci] = _choices2[ci+1]
                                                    
                                                    let _questions = [...questions]
                                                    _questions[qi].Choices = _choices
                                                    setQuestions(_questions)
                                                }}
                                            />
                                        </Space>
                                    </Space>
                                    <br/>
                                    <Space>
                                    <Radio.Group size="small" value={Type} onChange={(v) => {
                                        const value = v.target.value
                                        let _questions = [...questions]
            
                                        _questions[qi].Choices[ci].Type = value

                                        setQuestions(_questions)
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
                                        {renderTextInput(qi, ci)}
                                    </div>}
                                    {Object.is(Type,QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE) &&
                                    <div>
                                        <br/>
                                        <br/>
                                        {renderRangeInput(qi, ci)}
                                    </div>}
                                    <Divider />
                                </div>
                                )
                            })}
                       </Space>
            </div>
        )
    }


    const renderQuestionInList = (qi) => {
        const firstQuestion = (qi === 0)
        const lastQuestion = ((qi + 1) === questions.length)

        const _question = questions[qi]

        if(!_question) return <div/>

        const {Type, Title, ImageURL, defaultImage, Latex, varInsertionIsValid, reducedVarArray} = _question

        const convertedLatex = Latex // varInsertionIsValid ? convertTextBody(_question) : Latex

        return(
            <div>
                <Row>
                    <Col xs = {6}>
                        <Space direction="vertical">
                        <Space>
                        <small className="default-gray">Image (optional)</small>
                        {(ImageURL || defaultImage) && 
                                <small className="default-red hq-clickable" 
                                onClick={() => {
                                    let _questions = [...questions]

                                    _questions[qi].ImageURL = null
                                    _questions[qi].Image = null

                                    _questions[qi].defaultImage = null

                                    setQuestions(_questions)
                                }}>Clear</small>}
                        </Space>
                        <Space size={'large'} align="start">
                            <div>
                                <UploadImage 
                                    onSetImage={(url, img) => {
                                        let _questions = [...questions]

                                        _questions[qi].ImageURL = url
                                        _questions[qi].Image = img

                                        _questions[qi].defaultImage = null

                                        setQuestions(_questions)
                                    }}

                                    imageURL={ImageURL}

                                    className="add-multiple-choice-question-img-box"
                                    classNameImage="add-multiple-choice-question-img-box-inside-img"
                                />
                                
                            </div>
                            <SelectDefaultImage 
                                onSetImage={(di) => {
                                    let _questions = [...questions]

                                    _questions[qi].ImageURL = null
                                    _questions[qi].Image = null

                                    _questions[qi].defaultImage = di

                                    setQuestions(_questions)
                                }}

                                imageURL={(defaultImage || {ImageURL:''}).ImageURL}

                                className="add-multiple-choice-question-img-box"
                                classNameImage="add-multiple-choice-question-img-box-inside-img"
                            />
                        </Space>
                        <br/>

                        <Space>
                            <Button
                                size="small"
                                icon={<DeleteOutlined className="default-red"/>}

                                onClick={() => {
                                    let _questions = [...questions]

                                    _questions = _questions.filter((a, ai) => ai !== qi)

                                    setQuestions(_questions)

                                    setCurrentQuestionsTab(0)
                                }}
                            >
                                question
                            </Button>

                            <Button size="small" type="default" 
                            onClick={() => {
                                if(firstQuestion) return;

                                let _questions = [...questions]
                                let _questions2 = [..._questions]

                                _questions[qi-1] = _questions2[qi]
                                _questions[qi] = _questions2[qi-1]

                                setQuestions(_questions)
                                setCurrentQuestionsTab(currentQuestionsTab - 1)
                            }}>
                                <LeftCircleOutlined className={!firstQuestion ? "default-title" : "default-gray"} />
                            </Button>

                            <Button size="small" type="default" 
                            onClick={() => {
                                    if(lastQuestion) return;

                                    let _questions = [...questions]
                                    let _questions2 = [..._questions]

                                    _questions[qi+1] = _questions2[qi]
                                    _questions[qi] = _questions2[qi+1]

                                    setQuestions(_questions)
                                    setCurrentQuestionsTab(currentQuestionsTab + 1)
                                }}>
                                <RightCircleOutlined className={!lastQuestion ? "default-title" : "default-gray"} /> 
                            </Button>
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

                                value={Title}

                                onChange={(v) => {
                                    const value = v.target.value

                                    let _questions = [...questions]

                                    _questions[qi].Title = value

                                    setQuestions(_questions)
                                }}

                                className="add-questionnaire-title"
                            />
                            <small className="default-gray">Body text </small>  {/*&nbsp; &nbsp; <span className="default-smaller">(Changing the text resets the whole variables list.)</span></small> */}
                            <TextArea
                                value={Latex}
                                rows={4} 
                                onChange={(v) => {
                                    const value = v.target.value

                                    /*const repeated = value.match(/(@)\1\1/g)

                                    if(repeated && repeated.length){
                                        api.destroy()
                                        api.warning(
                                            <Space direction="vertical" align="start">
                                                <p>Cannot add two consecutive @ characters</p>
                                                <p>to add a simple @ character write /@</p>
                                            </Space>)

                                        return
                                    }

                                    if(Latex && Latex.length && Latex.slice(-1) === '@'){
                                        if(value.slice(-1) === '@'){
                                            api.destroy()
                                            api.warning(
                                            <Space direction="vertical" align="start">
                                                <p>Cannot add two consecutive @ characters</p>
                                                <p>Please finish adding the variable</p>
                                                <p>to add a simple @ character write /@</p>
                                            </Space>)

                                            return
                                        }
                                    }*/

                                    //const varArray =  value.replace('/@', ' ').match(/@\w*/g) || [];

                                    let _questions = [...questions]

                                    _questions[qi].Latex = value
                                    /*_questions[qi].LatexVar = varArray 

                                    const _varInsertionIsValid = validateVariableInsertion(_questions[qi])
                                    _questions[qi].varInsertionIsValid = _varInsertionIsValid

                                    _questions[qi].reducedVarArray = _varInsertionIsValid ? getVariablesFromVarArray(varArray, value) : []
                                    console.log(reducedVarArray)*/
                                    setQuestions(_questions)
                                }}

                                className="add-questionnaire-body"
                            />

                            <LatexRenderer latex={convertedLatex || "-"} />

                            {/*<br/>
                            <small className="default-gray">Variables list</small>
                            {reducedVarArray.map((v, vi) => {
                                const {variable, isFile, inBetweenText, link, file} = v
                                return(
                                    <Space key={vi} direction="vertical" size="small">
                                        <Space>
                                            <p className="default-gray">{vi+1}</p>
                                            <p className="default-title">{variable}</p>
                                            <Radio.Group size="small" value={isFile} onChange={(v) => {
                                            
                                            }}>
                                                <Radio.Button value={false}>Link</Radio.Button>
                                                <Radio.Button value={true}>File</Radio.Button>
                                            </Radio.Group>

                                            {!isFile ? 
                                                <Input type="text"                
                                                value={link}
                
                                                onChange={(v) => {
                                                    const value = v.target.value
                
                                                    let _questions = [...questions]

                                                    _questions[qi].reducedVarArray[vi].link = value

                                                    setQuestions(_questions)
                                                }}
                
                                                className="add-questionnaire-link" />
                                            :   <div/>}
                                        </Space>
                                        <Space>{inBetweenText.map((t, ti) => 
                                            <small key={ti} className="highlighted">
                                                <span className="default-title">{ti+1}{' '}</span>
                                                {t}
                                            </small>)}
                                        </Space>
                                    </Space>
                                )
                            })*/}
                       </Space>
                    </Col>
                    <Col xs={1} />
                    <Col xs={6}>
                        {renderMCEntry(qi)}
                    </Col>
                </Row>
            </div>
        )
    }

    const renderContent = () => {
        const tabs = questions.map((q, qi) => {
                    const {Title} = q
                    const error = validateQuestion(q)

                    return ({
                        key: qi,
                        label:
                        <Space>
                            <p className="default-black">{"Q" + (qi + 1)} {Title &&<span className="default-gray">{' '}{Title}</span>}</p>
                            {error && 
                            <Tooltip
                                color="white"
                                title={<p>{error}</p>}
                            >
                                <WarningOutlined className="default-orange" />
                            </Tooltip>}
                        </Space> ,
                        children:<div>{renderQuestionInList(qi)} </div>
                    })
                }
            )

        return(
            <Space direction="vertical" size="middle">
                <Space>
                    <Button 
                        size="small"
                        icon={<PlusOutlined className="default-green" />}

                        onClick={() => {
                            let _questions = [...questions]

                            _questions.push({
                                Title:"",
                                Latex:"",
                                LatexVar: [],
                                reducedVarArray:[],

                                Image: null,
                                ImageURL: null,
                                defaultImage: null,
                                Files:[],
                                Links:[],

                                IsSingleChoice: false,
                                Choices:[]
                            })

                            setQuestions(_questions)
                            setCurrentQuestionsTab(_questions.length - 1)
                        }}
                    >
                        Add Question
                    </Button>
                </Space>
                <Tabs
                    defaultActiveKey={0}
                    items={tabs}
                    onChange={(t) => setCurrentQuestionsTab(t)}
                    activeKey={currentQuestionsTab}
                    className="add-questionnaire-tabs"
                />
            </Space>
        )
    }

    const addQuestionnaire = () => {
        const data = new FormData()

        data.append('Code', code.trimEnd())
        if(explanation) data.append('Explanation', explanation)
        if(finalText) data.append('FinalText', finalText)
       

        let fileNamesList = []
        let filesList = []

        if(surveyImage){
            const randomNumber = makeid(8)
            data.append('ImageURL', "" + randomNumber)
            fileNamesList.push(randomNumber)
            filesList.push(surveyImage)
        }

        const QVM = (questions.map((q, qi) => {
            let qData = ({
                ...q,
                Title: q.Title.trimEnd(),
                Order: qi + 1,
                Body: q.Latex,
                ImageURL: null,
                Image: null,
                Choices:[]
            })

            if(q.Image){
                const randomNumber = makeid(8)
                qData.ImageURL = "" + randomNumber
                fileNamesList.push(randomNumber)
                filesList.push(q.Image)
            }
            else if(q.defaultImage){
                qData.ImageURL = "" + q.defaultImage.Id
            }

            for(const [ci, c] of q.Choices.entries()) {
                let cData = ({
                    ...c,
                    LaTex: c.Latex.trimEnd(),
                    ImageURL: null,
                    Image: null,
                    Order:  q.Choices.length - ci + 1,
                })

                if(c.Image){
                    const randomNumber = makeid(8)
                    cData.ImageURL = "" + randomNumber
                    fileNamesList.push(randomNumber)
                    filesList.push(c.Image)
                }

                qData.Choices.push(cData)
            }

            return qData
        }))

        data.append("QuestionsString", JSON.stringify(QVM))

        for(const fn of fileNamesList){
            data.append("FileListCodes", fn)
        }

        for(const fn of filesList){
            data.append("Files", fn)
        }

        addSurvey(data).then(r => handleResponse(r, api, "Added successfully", 1))
    }

    const renderFinalPage = () => {
        return(
            <div>
                {!canAdd && <p className="default-red">Please fill all required data</p>}
                <br/>
                {canAdd &&
                <Space>
                    <Button
                        onClick={() => addQuestionnaire()}
                        type="primary"
                        size="small"

                        loading={isLoadingAddSurvey}
                    >
                        Add Questionnaire
                    </Button>
                </Space>}
            </div>
        )
    }

    const selectContent = () => {
        const map = {
            0: () => renderInfo(),
            1: () => renderContent(),
            2: () => renderFinalPage(),
        }

        return map[currentTab]()
    }

    const infoValidation = validateInfo()
    const contentValidation = validateQuestions()

    const canAdd = !(infoValidation || contentValidation)

    const onChange = (value) => setCurrentTab(value);
   

    return(
        <PagesWrapper>
            {contextHolder}
            <Steps

                onChange={onChange}
                current={currentTab}
                items={[
                    {
                        title: 
                        <Space className ={infoValidation ? "highlighted" : "hoverable"}>
                            <p>Meta data{' '}</p>

                            {(!infoValidation ? 
                            <CheckCircleFilled style={{color:'green'}}/> 
                            : 
                            <Tooltip 
                                color="white"
                                title={<p>{infoValidation}</p>}
                                placement="top"
                            >
                                <CloseCircleTwoTone twoToneColor={'red'}/>
                            </Tooltip>
                            )}
                        </Space>,
                        icon:<ScheduleTwoTone />
                    },
                    {
                        title: 
                        <Space className ={contentValidation ? "highlighted" : "hoverable"}>
                            <p>Content</p>

                            {(!contentValidation ? 
                            <CheckCircleFilled style={{color:'green'}}/> 
                            : 
                            <Tooltip 
                                color="white"
                                title={<p>{contentValidation.text}</p>}
                                placement="top"
                            >
                                <CloseCircleTwoTone twoToneColor={'red'} onClick={() => {
                                    const {index} = contentValidation

                                    setCurrentQuestionsTab(index)
                                }}/>
                            </Tooltip>
                            )}
                        </Space>,
                    },
                    {
                            title: 'Final',
                            icon: canAdd ? <SmileTwoTone /> : <FrownTwoTone />
                    }
                ]} 
            />
            <br/>
            {selectContent()}
        </PagesWrapper>
    )
}