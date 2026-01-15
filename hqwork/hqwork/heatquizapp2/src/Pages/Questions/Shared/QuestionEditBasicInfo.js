import {Button, Drawer, Form, Input, Select, Space, Spin, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { useEffect } from "react";
import { useLevelsOfDifficulty } from "../../../contexts/LevelOfDifficultyContext";
import { useTopics } from "../../../contexts/TopicsContext";
import { MAX_QUESTION_CODE } from "./Constants";

import './QuestionEditView.css'
import { useQuestions } from "../../../contexts/QuestionsContext";
import { handleResponse } from "../../../services/Auxillary";
import { ErrorComponent } from "../../../Components/ErrorComponent";

export function QuestionEditBasicInfo({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const { isLoadingLODs, errorGetLODs, LODs, getAllLODs} = useLevelsOfDifficulty()
    const {topics, errorGetTopics, isLoadingTopics, getAllTopics} = useTopics()

    const {isLoadingEditQuestionBasicInfo, editQuestionBasicInfo} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [newCode, setNewCode] = useState('')

    const [selectedTopic, setSelectedTopic] = useState(null)
    const [newSubtopic, setNewSubtopic] = useState(null)

    const [newLOD, setNewLOD] = useState(null)

    useEffect(() => {
        if(open){
            const {Code, Subtopic, LevelOfDifficulty} = question
            const {Topic} = Subtopic

            setNewCode(Code)

            setNewSubtopic(Subtopic)
            setSelectedTopic(Topic)
            
            setNewLOD(LevelOfDifficulty)


            getAllLODs()
            getAllTopics()
        }
    }, [open])

    useEffect(() => {
        if(topics && selectedTopic){
            const findTopic = topics.filter(t => t.Id === selectedTopic.Id)[0]
            if(findTopic) setSelectedTopic(findTopic)
        }
    }, [topics, selectedTopic])


    return(
        <Drawer
        title="Edit question basic info"
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
    
        <Form>
            <Form.Item>
                <small className="default-gray">Code</small>
                <Input 
                    placeholder="New code"
                    value={newCode}
                    onChange={(v) => setNewCode(v.target.value)}
                    maxLength={MAX_QUESTION_CODE}
                    showCount
                />
            </Form.Item>
            <Form.Item>
                <small className="default-gray">Level of difficulty</small>
                {isLoadingLODs ?
                    <Spin/>
                    :
                    <Select
                        onChange={(v, option) => {
                            const findLOD = LODs.filter(l => l.Id === option.value)[0]
                            setNewLOD(findLOD)
                        }}
                        defaultValue={'please select'}
                        value={(newLOD || {'Name': 'please select'}).Name}

                        options={(LODs || []).map((d) => ({
                            value: d.Id,
                            label: d.Name
                            }))}

                    />}

                {errorGetLODs && !isLoadingLODs && 
                    <ErrorComponent 
                        error={errorGetLODs}
                        onReload={() => getAllLODs()}
                    />
                }
            </Form.Item>
            <Form.Item>
                {isLoadingTopics ?
                    <Spin/>
                    :
                    <Space
                        direction="vertical"
                    >
                        <small className="default-gray">Topic / Subtopic</small>
                        <Space>
                            <div
                                className="question-edit-view-edit-basic-info-topic-subtopic-section-select"
                            >
                                <Select
                                    onChange={(v, option) => {
                                        const findTopic = topics.filter(t => t.Id === option.value)[0]

                                        setSelectedTopic(findTopic)
                                        setNewSubtopic(null)

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
                                className="question-edit-view-edit-basic-info-topic-subtopic-section-select"
                            >
                                <Select
                                    onChange={(v, option) => {
                                        const findSubtopic = selectedTopic.Subtopics.filter(s => s.Id === option.value)[0]

                                        setNewSubtopic(findSubtopic)
                                    }}
                                    defaultValue={'please select'}
                                    value={(newSubtopic || {'Name': 'please select'}).Name}

                                    options={(selectedTopic.Subtopics || []).map((d) => ({
                                        value: d.Id,
                                        label: d.Name
                                    }))}

                                />
                            </div>
                            }
                            
                        </Space>
                </Space>}

                {errorGetTopics && !isLoadingTopics && 
                    <ErrorComponent 
                        error={errorGetTopics}
                        onReload={() => getAllTopics()}
                    />
                }
            </Form.Item>
            
        </Form>

        <Button
            size="small"
            type="primary"

            onClick={() => {
                if(!newCode.trim()){
                    api.destroy()
                    api.warning('Please provide a new code')

                    return
                }

                if(!newLOD){
                    api.destroy()
                    api.warning('Please select a level of difficulty')

                    return
                }

                if(!newSubtopic){
                    api.destroy()
                    api.warning('Please select a subtopic')

                    return
                }

                const VM = ({
                    Id: question.Id,
                    Code: newCode,
                    LevelOfDifficultyId: newLOD.Id,
                    SubtopicId: newSubtopic.Id
                })

                editQuestionBasicInfo(VM)
                .then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadQuestion()   
                }))
            }}

            loading={isLoadingEditQuestionBasicInfo}
        >
            Update
        </Button>
    </Drawer>
    )
}