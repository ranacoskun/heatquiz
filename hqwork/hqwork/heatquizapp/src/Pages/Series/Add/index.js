import React, { useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import {ScheduleTwoTone, BuildTwoTone , SmileTwoTone, FrownTwoTone, AppstoreTwoTone, CheckCircleFilled, CloseCircleTwoTone, RocketOutlined , CloseCircleFilled, CaretLeftOutlined, CaretRightOutlined} from '@ant-design/icons';
import { Button, Divider, Empty, Form, Input, Row, Space, Steps, Switch, Tooltip, message } from "antd";
import { MAX_SERIES_CODE } from "../EditView/Constants";

import './index.css'
import { SearchQuestionsList } from "../../Questions/SearchQuestionsList";
import { CompactQuestionComponent } from "../../Questions/SearchQuestionsList/CompactQuestionComponent";
import {QUESTION_TYPES_SEARCH_NAMES } from "../../Questions/List/constants";
import { useSeries } from "../../../contexts/SeriesContext";
import { QuestionPlayPocket } from "../../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { handleResponse } from "../../../services/Auxillary";

export function AddSeries(){

    const {isLoadingAddSeries, addSeries} = useSeries()

    const [api, contextHolder] = message.useMessage()

    const [currentTab, setCurrentTab] = useState(0)

    const [code, setCode] = useState('')
    const [isRandom, setIsRandom] = useState(false)
    const [sampleSize, setSampleSize] = useState(1)

    const [selectedQuestions, setSelectedQuestions] = useState([])

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)


    const onChange = (value) => setCurrentTab(value);

    const validateMetadata = () => {
        if(!code.trim())
            return "Please add a code"

        return null
    }

    const validateSelectQuestions = () => {
        if(!selectedQuestions.length)
            return "Please select questions"

        if(isRandom && (selectedQuestions.length < sampleSize))
            return "Sample size cannot be larger than the number of selected questions"


        return null
    }

    const metadataValidation = validateMetadata()
    const selectingQuestionsValidation = validateSelectQuestions()

    const canAdd = !metadataValidation && !selectingQuestionsValidation

    const renderMetaData = () => {
        return(
            <Space>
                <Form>
                    <Form.Item>
                        <p>Code</p>
                        <Input 
                            className="series-meta-data-input"
                            placeholder="Unique series code"
                            value={code}
                            onChange={(v) => setCode(v.target.value)}
                            maxLength={MAX_SERIES_CODE}
                            showCount
                        />
                    </Form.Item>
                    <Form.Item>
                        <Switch 
                            checked={isRandom}
                            onChange={() => setIsRandom(!isRandom)}
                            checkedChildren="Series is random" 
                            unCheckedChildren="Series is sequential" 
                        />
                    </Form.Item>

                    {isRandom&&
                    <Form.Item>
                        <p>Sample size</p>
                        <Input 
                            className="series-meta-data-input"
                            placeholder="Unique series code"
                            type="number"
                            value={sampleSize}
                            onChange={(v) => {
                                const value = v.target.value

                                if(value < 1) return

                                setSampleSize(value)
                            }}
                            min={1}
                        />
                    </Form.Item>}
                </Form>
            </Space>
        )
    }

    const renderSelectQuestions = () => {

        return(
            <div>
                <SearchQuestionsList
                    selectedQuestions={selectedQuestions}
                    onSelectQuestions={(d) => setSelectedQuestions(d)}
                    forbiddenQuestions = {[]}
                />
            </div>
        )
    }


    const renderSelectedQuestions = () => {

        const qTypes = selectedQuestions
        .map((q) => QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === q.Type)[0].label)
        .sort((a, b) => a - b)
        .reduce((r, c) => {
            if(r[c]){
                r[c] += 1
            }
            else{
                r[c] = 1
            }

            return r
        }, {})

        const qTopics = selectedQuestions
        .map((q) => q.Subtopic.Topic.Name)
        .sort((a, b) => a - b)
        .reduce((r, c) => {
            if(r[c]){
                r[c] += 1
            }
            else{
                r[c] = 1
            }

            return r
        }, {})

        const qLODs = selectedQuestions
        .map((q) => q.LevelOfDifficulty.Name)
        .sort((a, b) => a - b)
        .reduce((r, c) => {
            if(r[c]){
                r[c] += 1
            }
            else{
                r[c] = 1
            }

            return r
        }, {})

        const qTime = selectedQuestions
        .map((q) => q.MedianPlayTime)

        const minQTime = Math.min(...qTime)
        const maxQTime = Math.max(...qTime)

        return(
            <div>
                
                {selectedQuestions.length &&
                <Space 
                className="series-edit-view-add-questions"
                size={'large'}>
                   
                    <Space direction="vertical">
                        <Space><small>{selectedQuestions.length} qustions selected </small></Space>
                        {Object.keys(qTypes).map(k => <Space className="series-edit-view-element-other-info"><small>{k}s</small> <small>{qTypes[k]}</small></Space>)}
                    </Space>
                    &nbsp;
                    &nbsp;
                    <Space direction="vertical"> 
                        {Object.keys(qTopics).map(k => <Space className="series-edit-view-element-other-info"><small>{k}</small> <small>{qTopics[k]}</small></Space>)}
                    </Space>
                    &nbsp;
                    &nbsp;
                    <Space direction="vertical">
                        {Object.keys(qLODs).map(k => <Space className="series-edit-view-element-other-info"><small>{k}</small> <small>{qLODs[k]}</small></Space>)}
                    </Space>
                    &nbsp;
                    &nbsp;
                    <Space className="series-edit-view-element-other-info">
                        <small>Median play time</small>
                        <small>({minQTime} - {maxQTime}) {' '}<i>seconds</i></small>
                    </Space>                    
                </Space>}

                <Divider/>

                {selectedQuestions.length ? 
                <Row
                    gutter={[12, 12]}
                >
                    {selectedQuestions.map((q, qi) => 
                        (
                            <CompactQuestionComponent 
                                q={q}
                                selectedQuestions={selectedQuestions}
                                qi={qi}
                                firstIndex={0}

                                onRenderCode = {(q, i) => {

                                    return(
                                        <Space
                                        
                                        className="hq-opposite-arrangement"
                                        align="start"
                                        >   
                                            <Space align="start" >
                                                &nbsp;
                                                <Tooltip
                                                    color="white"
                                                    placement="top"
                                                    title={<p>Remove from series</p>}
                                                >
                                                    <CloseCircleFilled 
                                                        onClick={() => {
                                                            let _selectedQuestions = [...selectedQuestions]
                                                            _selectedQuestions = _selectedQuestions.filter(a => a.Id !== q.Id)
                                                
                                                            setSelectedQuestions(_selectedQuestions)
                                                        }}
                                                        style={{color:'red', cursor:'pointer'}}
                                                    />
                                                </Tooltip>
                                                &nbsp;
                                                <p className="default-title hoverable">{i}{' '}{q.Code}</p>
                                            </Space>
                                            <Space size={'large'} align="start" >
                                                <Tooltip
                                                    color="white"
                                                    title={<p>Play question</p>}
                                                >
                                                    <RocketOutlined  
                                                    style={{color:'green'}} 
                                                    onClick={() => {
                                                        setSelectedQuestion(q)
                                                        setShowPlayQuestionModal(true)
                                                    }}/>                                                    
                                                </Tooltip>

                                                <Space>
                                                        <CaretLeftOutlined 
                                                            style={{color:'#0275d8'}}
                                                            onClick={() => {
                                                                if(qi === 0) return;

                                                                const _selectedQuestions = [...selectedQuestions]
                                                                const finalSelectedQuestions = [...selectedQuestions]
                            
                                                                const current= _selectedQuestions[qi]
                                                                const other= _selectedQuestions[qi-1]

                                                                finalSelectedQuestions[qi] = other
                                                                finalSelectedQuestions[qi-1] = current

                                                                setSelectedQuestions(finalSelectedQuestions)
                                                            }}
                                                        />
                                                        <CaretRightOutlined 
                                                            style={{color:'#0275d8'}}
                                                            onClick={() => {
                                                                if((qi+1) === selectedQuestions.length) return;

                                                                const _selectedQuestions = [...selectedQuestions]
                                                                const finalSelectedQuestions = [...selectedQuestions]

                                                                const current= _selectedQuestions[qi]
                                                                const other= _selectedQuestions[qi+1]

                                                                finalSelectedQuestions[qi] = other
                                                                finalSelectedQuestions[qi+1] = current

                                                                setSelectedQuestions(finalSelectedQuestions)
                                                            }}
                                                        />
                                                    </Space>
                                            </Space>
                                        </Space>
                                    )

                                }}
                            />
                        )
                    )}
                </Row>
                :
                <Space
                    align="center"
                >
                    <Empty
                        description="No questions selected"
                    />
                </Space>} 
            </div>
        )
    }

    const addSeriesClick = () => {
        const VM = ({
            Code: code,
            Elements: selectedQuestions.map((q, i) => ({
                Order: i + 1,
                QuestionId: q.Id

            })),
            IsRandom: isRandom,
            RandomSize: sampleSize
        })

        addSeries(VM)
        .then(r => handleResponse(r, api, 'Series added successfully', 1))

    }

    const renderFinalPage = () => {
        return(
            <Space direction="vertical">
                {!canAdd && <p className="default-red">Please fill all required data</p>}
                <br/>
                {canAdd && 
                <Space size={'large'} align="start">
                    <Button
                        type="primary"
                        onClick={() => addSeriesClick()}
                        loading={isLoadingAddSeries}
                    >
                        Add series
                    </Button>
                </Space>}
            </Space>
        )
    }

    const selectContent = () => {
        const map = {
            0: () => renderMetaData(),
            1: () => renderSelectQuestions(),
            2: () => renderSelectedQuestions(),
            3: () => renderFinalPage(),
        }

        return map[currentTab]()
    }

    return(
        <PagesWrapper>
            {contextHolder}
            <Steps
                onChange={onChange}
                current={currentTab}
                items={[
                        {
                            title: 
                            <Space className={metadataValidation ? "highlighted" : "hoverable"}>
                                <p>Meta data{' '}</p>

                                {(!metadataValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{metadataValidation}</p>}
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
                            <Space className={!metadataValidation && selectingQuestionsValidation ? "highlighted" : "hoverable"}>
                                <p>Select questions</p>

                                {(!selectingQuestionsValidation ? 
                                <CheckCircleFilled style={{color:'green'}}/> 
                                : 
                                <Tooltip 
                                    color="white"
                                    title={<p>{selectingQuestionsValidation}</p>}
                                    placement="top"
                                >
                                    <CloseCircleTwoTone twoToneColor={'red'}/>
                                </Tooltip>
                                )}
                            </Space>,
                            icon:<AppstoreTwoTone  />
                        },
                        {
                            title:
                            <Space>
                                <p>Arrange questions</p>
                            </Space>,
                            icon:<BuildTwoTone  />
                        },
                        {
                            title: 'Final',
                            icon: canAdd ? <SmileTwoTone /> : <FrownTwoTone />
                        },
                ]}
            />
            <br/>
            {selectContent()}

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />
        </PagesWrapper>
    )
}