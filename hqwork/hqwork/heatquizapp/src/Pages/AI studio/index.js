import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import {Button, Col, Divider, Form, List, Select, Space, Spin, Steps, Tooltip, message, notification } from "antd";
import { LatexRenderer } from "../../Components/LatexRenderer";
import { UploadImage } from "../../Components/UploadImage";
import { useTopics } from "../../contexts/TopicsContext";
import { useLevelsOfDifficulty } from "../../contexts/LevelOfDifficultyContext";
import { SelectDefaultImage } from "../../Components/SelectDefaultImage";
import {AlignRightOutlined, SlidersOutlined, SmileTwoTone, FrownTwoTone, InfoCircleTwoTone, ExclamationCircleOutlined, CheckCircleFilled,CloseCircleFilled} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
//import PQueue from 'p-queue';

import icon from "./icon.png" 
import { useQuestions } from "../../contexts/QuestionsContext";
import { handleResponse } from "../../services/Auxillary";


export function AIStudio(){

    const [currentTab, setCurrentTab] = useState(0)
    const onChange = (value) => {
        if(isLoadingAddMultipleChoiceQuestion){
            api.destroy()

            api.warning("Cannot move while adding quesitons")

            return
        }

        setCurrentTab(value)
    };

    const [text,setText] = useState("")
    const [questions,setQuestions] = useState([])
    const [questionsValidation,setQuestionsValidation] = useState([])

    const {topics, isLoadingTopics, getAllTopics} = useTopics()
    const {isLoadingLODs, LODs, getAllLODs} = useLevelsOfDifficulty()

    const {isLoadingAddMultipleChoiceQuestion, addMultipleChoiceQuestion,} = useQuestions()

    const [api, contextHolder] = message.useMessage()
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const [error, setError] = useState("")

    const [questionsAddStatus, setQuestionsAddStatus] = useState([])
    const [questionsAddStatusError, setQuestionsAddStatusError] = useState([])
    const [questionsAdding, setQuestionsAdding] = useState(false)

    useEffect(() => {
        getAllTopics()
        getAllLODs()

    }, [])

    useEffect(() => {
        if(!text) {
            setError("Please add JSON data")
            return
        }
        
        try {
            const data = JSON.parse(text)   
            const qs = data["data"]
            if(qs){
                setQuestions(qs)
                setError("")
            }  
            else{
                setQuestions([])
                setError("Could not read data")
            }           
            return
        } 
        catch {
            setError("JSON data form not appropriate and cannot be read")
            setQuestions([])
            return
        }
        
    }, [text])

    const validateQuestion = (q) => {
        if(!(q.Code && q.Code.trimEnd())) return "Please add code";

        if(!(q.newImage || q.selectedDefaultImage)) return "Please add image";

        if(!(q.selectedLOD)) return "Please select a level of difficulty";

        if(!(q.selectedSubtopic)) return "Please select topic and subtopic";
        
        if(!(q.Choices && q.Choices.length)) return "Please add choices";

        if(!(q.Choices.filter(c => c.Text).length)) return "Choices should have text";

        if(!(q.Choices.filter(c => c.Correct).length)) return "Atleast one choice should be correct";

        return null
    }

    useEffect(() => {
        let validations = []
        for(const q of questions){
            const v = validateQuestion(q)
            validations.push(v)
        }

        setQuestionsValidation(validations)

        setQuestionsAddStatus([...questionsAddStatus.map(a => false)])
    }, [questions])

    const renderAddText = () => {
        return(
            <div className="hq-full-width">
                <Space size="large" className="hq-full-width hq-opposite-arrangement">
                    <Space className="hq-clickable" onClick={() => {
                        notificationApi.destroy()
                        notificationApi.open({
                            style:{width:'36vw', minWidth:'400px'},
                            description:
                             <div>
                                <p>The data should be in the following format:</p>
                                <TextArea 
                                    className="hq-full-width"
                                    rows={2}
                                    value={`{"data":[{"Code":"Code1", "QuestionBody":"Question body", "Choices":[{"Text":"Choice 1", "Correct":true},{"Text":"Choice 2", "Correct":false}]}]}`}
                                />
                             </div>,
                             duration: 0,
                             placement:'top',
                             icon:<InfoCircleTwoTone/>
                        })
                    }}>
                        <InfoCircleTwoTone />
                        How to write prompt
                    </Space>
                    <p className="default-red">{error}</p>
                </Space>
                <TextArea 
                    value={text}
                    onChange={(v) => setText(v.target.value)}
                    style={{width:'100%'}}
                    rows={25}
                />
                <p className="default-title">If you change JSON text, the info (LOD, Subtopic) ... etc will be reset</p>

            </div>
        )
    }

    const renderSortAndAdd = () => {
        return(
        <div className="hq-full-width">
            <p><span className="default-title">{questions.length}</span> Questions</p>
            <br/>
            <List 
                dataSource={questions}
                renderItem={(q, qi) => {
                    const {Code,selectedDefaultImage, newImageURL, QuestionBody, Choices, selectedLOD, selectedTopic, selectedSubtopic} = q

                    const validation = questionsValidation[qi]

                    return(
                        <div className="hq-full-width" key={qi}>
                            <Space align="start">
                                <p className="default-gray">{qi+1}</p>
                                <p className="default-title">{Code}</p>
                                <div className="hq-full-width">
                                <Space align="start">
                                    <UploadImage 
                                        onSetImage={(url, img) => {
                                            let _qs = [...questions]
                                            _qs[qi].newImageURL = url
                                            _qs[qi].newImage = img
                                            _qs[qi].selectedDefaultImage = null
                                            
                                            setQuestions(_qs)
                                        }}

                                        imageURL={newImageURL}

                                        className="add-keyboard-question-img-box"
                                        classNameImage="add-keyboard-question-img-box-inside-img"
                                    />
                                    <SelectDefaultImage 
                                        onSetImage={(di) => {
                                            let _qs = [...questions]
                                            _qs[qi].newImageURL = null
                                            _qs[qi].newImage = null
                                            _qs[qi].selectedDefaultImage = di
                                            
                                            setQuestions(_qs)
                                        }}

                                        imageURL={(selectedDefaultImage || {ImageURL:''}).ImageURL}

                                        className="add-keyboard-question-img-box"
                                        classNameImage="add-keyboard-question-img-box-inside-img"
                                    />
                                    <div>
                                    <Form>
                                <Form.Item className="question-form-sheet-input">
                    <p>Level of difficulty</p>
                    {isLoadingLODs ?
                    <Spin/>
                        :
                        <div
                            className="question-form-sheet-input"
                        >
                            <Select
                            
                                onChange={(v, option) => {
                                    let _qs = [...questions]
                                    const findLOD = LODs.filter(l => l.Id === option.value)[0]
                                    
                                    _qs[qi].selectedLOD = findLOD

                                    setQuestions(_qs)
                                }}
                                defaultValue={'please select'}
                                value={(selectedLOD || {'Name': 'please select'}).Name}

                                options={(LODs || []).map((d) => ({
                                    value: d.Id,
                                    label: d.Name
                                }))}
                            />
                        </div>}
                </Form.Item>
                <Form.Item>
                    <p>Subtopic</p>
                    {isLoadingTopics ?
                    <Spin/>
                        :
                        <Space>
                            <div
                                className="question-form-sheet-input"
                            >
                                <Select
                                    onChange={(v, option) => {
                                        let _qs = [...questions]
                                        const findTopic = topics.filter(t => t.Id === option.value)[0]

                                    
                                        _qs[qi].selectedTopic = findTopic
                                        _qs[qi].selectedSubtopic = null

                                        setQuestions(_qs)
                                       

                                    }}
                                    defaultValue={'please select'}
                                    value={(selectedTopic || {'Name': 'please select'}).Name}

                                    options={(topics || []).map((d) => ({
                                        value: d.Id,
                                        label: d.Name
                                        }))}
                                />
                            </div>
                            {selectedTopic && 
                            <div
                                className="question-form-sheet-input"
                            >
                                <Select
                                    onChange={(v, option) => {
                                        let _qs = [...questions]
                                        const findSubtopic = selectedTopic.Subtopics.filter(s => s.Id === option.value)[0]

                                        _qs[qi].selectedSubtopic = findSubtopic

                                        setQuestions(_qs)
                                    }}
                                    defaultValue={'please select'}
                                    value={(selectedSubtopic || {'Name': 'please select'}).Name}

                                    options={(selectedTopic.Subtopics || []).map((d) => ({
                                        value: d.Id,
                                        label: d.Name
                                        }))}
                                    
                                />
                            </div>
                           }
                        </Space>}
                </Form.Item>
                </Form>
                
            </div>
            <div>
                                    {validation && 
                                        <Tooltip
                                            color="white"
                                            title={<p>{validation}</p>}
                                        >
                                            <ExclamationCircleOutlined className="default-red hq-clickable"/>
                                        </Tooltip>
                                    }
                                </div>
                                    </Space>
                                    
                                    <br/>
                                <div>
                                    <LatexRenderer latex={QuestionBody || ""} className={"hq-full-width"}/>
                                    {Choices.map((c, ci) => (
                                        <div key={ci}>
                                            <Space>
                                                <p className="default">{ci+1}</p>
                                                <LatexRenderer latex={c.Text ||""} />
                                                {c.Correct ? <p className="default-green">Correct</p> : <p className="default-red">Incorrect</p>}
                                            </Space>
                                        </div>
                                    ))}
                                </div>
                                </div>
                                
                                
                            </Space>
                            <Divider />
                        </div>
                    )
                }}
            />
        </div>)
    }

    const canAdd = !Object.is(questions.length, 0) && !questionsValidation.filter(a => a).length

    async function addQuestion(qi,addStatus, addStatusError, data){
        await addMultipleChoiceQuestion(data)
                                        .then(r => handleResponse(r, api, 'Question added successfully', 1, () => {
                                                    addStatus[qi] = true
            
                                                    setQuestionsAddStatus(addStatus)
            
                                                    addStatusError[qi] = ""
            
                                                    setQuestionsAddStatusError(addStatusError)
                                                }, () => {
                                                    const {error} = r
                                                    if(error){
                                                        addStatusError[qi] = error
            
                                                        setQuestionsAddStatusError(addStatusError)
                                                }}))
    }

    const renderAddQuestions = () => {
        
        return(
            <div>
                {!canAdd && <p className="default-red">Please fill all required data</p>}
                {canAdd && 
                
                <div>
                    <Button
                        size="small"
                        type="primary"
                        loading={isLoadingAddMultipleChoiceQuestion}
                        onClick={() => {
                            //const queue = new PQueue({concurrency: 1});
                            let addStatus = [...questionsAddStatus]
                            let addStatusError = [...questionsAddStatusError]

                            for(const [qi, q] of questions.entries()){

                                
                                const isAdded = addStatus[qi]

                                if(isAdded) continue;

                                const data = new FormData()
                                data.append('Code', q.Code)
                                data.append('SubtopicId',  q.selectedSubtopic.Id)
                                data.append('LODId', q.selectedLOD.Id)

                                data.append('Public', false)
                                data.append('Attributes', "")

                                data.append('AnswerForLatex', q.QuestionBody)
                                data.append('AdditionalInfo', "")

                                data.append('ChoicesPerRow', 1)
                                data.append('AnswersString', JSON.stringify(
                                    q.Choices.map((a) =>(
                                        {
                                            Text: a.Text,
                                            Latex: a.Text,
                                            Correct: a.Correct,
                                            ImageURL: null
                                        }))
                                    ))

                                data.append('Picture', q.newImage) 
                                data.append('DefaultImageId', q.selectedDefaultImage && q.selectedDefaultImage.Id)
                                
                                try{
                                    addQuestion(qi, addStatus, addStatusError, data)
                                    }
                                    catch{
                                        
                                    }
                            }
                        }}
                    >
                        Add {questions.filter((q, qi) => !questionsAddStatus[qi]).length} questions
                    </Button>
                    <br/>
                    <Space>
                    <small className="default-gray">Questions will be added one by one</small>
                    {isLoadingAddMultipleChoiceQuestion && <Spin/>}
                    </Space>

                    <br/>
                    <br/>

                    <List
                        dataSource={questions}

                        renderItem={(q, qi) => {
                            const {Code, newImageURL, selectedDefaultImage} = q

                            const isAdded = questionsAddStatus[qi]
                            const error = questionsAddStatusError[qi]
                            return(
                                <div>
                                    <Space align="start">
                                        <p className="default-gray">{qi+1}</p>
                                        <p className="default-title">{Code}</p>

                                        <img 
                                            src={newImageURL || selectedDefaultImage.ImageURL}
                                            alt="image"
                                            style={{width:100, border:'1px solid lightgray'}}
                                        />

                                        {isAdded ? <CheckCircleFilled className="default-green"/> : <div/>}
                                        {error &&<Space><CloseCircleFilled className="default-red"/> <p className="default-red">{error}</p> </Space>}
                                    </Space>
                                </div>
                            )
                        }}
                    />
                </div>}
            </div>
        )
    }

    const selectContent = () => {
        const map = {
            0: () => renderAddText(),
            1: () => renderSortAndAdd(),
            2: () => renderAddQuestions()
        }

        return map[currentTab]()
    }


    return(
        <PagesWrapper>
            {contextHolder}
            {notificationContextHolder}
            <Space align="start">
                <img 
                    src={icon}
                    style={{width:60}}
                    alt="AI studi"
                />
                <p className="default-black default-large hq-bold-font-weight">AI Studio</p>
            </Space>
            <br/>
            <br/>
            <Steps

                onChange={onChange}
                current={currentTab}
                items={[
                        {
                            title: "Past text",
                            icon:<AlignRightOutlined />
                        },
                        {
                            title:"Sort & Categorize",
                            icon:<SlidersOutlined />
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