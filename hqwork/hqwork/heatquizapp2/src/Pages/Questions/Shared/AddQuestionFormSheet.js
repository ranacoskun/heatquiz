import { Form, Input, Select, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTopics } from "../../../contexts/TopicsContext";
import { useLevelsOfDifficulty } from "../../../contexts/LevelOfDifficultyContext";

import './AddQuestionFormSheet.css'
import { MAX_QUESTION_CODE } from "./Constants";

export function AddQuestionFormSheet({onSetInfo, existingInfo}){

    const {topics, isLoadingTopics, getAllTopics} = useTopics()
    const {isLoadingLODs, LODs, getAllLODs} = useLevelsOfDifficulty()

    useEffect(() => {
        getAllTopics()
        getAllLODs()

        const {Code} = existingInfo
        setCode(Code)
    }, [])

    useEffect(() => {
        if(existingInfo && topics && LODs){
            //Set LOD
            const {selectedSubtopic: st,selectedLOD: lod} = existingInfo

            if(lod){
                const findLOD = LODs.filter(l => l.Id === lod.Id)[0]
                setSelectedLOD(findLOD)
            }

            if(st){
                const {TopicId} = st

                const findTopic = topics.filter(t => t.Id === TopicId)[0]
                setSelectedTopic(findTopic)

                const findSubtopic = findTopic.Subtopics.filter(s => s.Id === st.Id)[0]
                setSelectedSubtopic(findSubtopic)


            }
        }
    }, [topics, LODs])

    const [code, setCode] = useState('')

    const [selectedTopic, setSelectedTopic] = useState(null)
    const [selectedSubtopic, setSelectedSubtopic] = useState(null)

    const [selectedLOD, setSelectedLOD] = useState(null)

    const validateQuestionInfo = (ei) => {

        const {Code, selectedLOD: lod, selectedSubtopic: st} = ei

        if(!Code.trim())
        {
            return "Please add question code"
        }

        if(!lod){
            return "Please select a level of difficulty"

        }

        if(!st){
            return "Please select a subtopic"

        }

        return null
    }


    return(
        <Space>
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

                            const ei = ({...existingInfo})

                            ei.Code = value

                            const validation = validateQuestionInfo(ei)

                            onSetInfo({...ei, validation})
                        }}
                        maxLength={MAX_QUESTION_CODE}
                        showCount
                    />
                </Form.Item>
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
                                    const findLOD = LODs.filter(l => l.Id === option.value)[0]

                                    setSelectedLOD(findLOD)

                                    const ei = ({...existingInfo})

                                    ei.selectedLOD = findLOD
        
                                    const validation = validateQuestionInfo(ei)

                                    onSetInfo({...ei, validation})
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
                                        const findTopic = topics.filter(t => t.Id === option.value)[0]

                                        setSelectedTopic(findTopic)
                                        setSelectedSubtopic(null)

                                        const ei = ({...existingInfo})

                                        ei.selectedSubtopic = null
            
                                        const validation = validateQuestionInfo(ei)

                                        onSetInfo({...ei, validation})

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
                                        const findSubtopic = selectedTopic.Subtopics.filter(s => s.Id === option.value)[0]

                                        setSelectedSubtopic(findSubtopic)

                                        const ei = ({...existingInfo})

                                        ei.selectedSubtopic = findSubtopic
            
                                        const validation = validateQuestionInfo(ei)

                                        onSetInfo({...ei, validation})
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
        </Space>
    )
}