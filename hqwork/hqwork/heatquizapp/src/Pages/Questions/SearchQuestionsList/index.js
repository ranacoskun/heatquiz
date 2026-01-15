import React, { useState } from "react";
import {Empty, Row, Skeleton, Space, Tooltip } from "antd";
import { useQuestions } from "../../../contexts/QuestionsContext";
import {QuestionsSearchTool} from "../List/QuestionsSearchTool"

import './SearchQuestionsList.css'
import { CompactQuestionComponent } from "./CompactQuestionComponent";
import { QuestionPlayPocket } from "../QuestionPlayPocket/QuestionPlayPocket";

import { RocketOutlined } from '@ant-design/icons';

export function SearchQuestionsList({selectedQuestions, onSelectQuestions, forbiddenQuestions}){

    const {questions, isLoadingQuestions, questionsByIds, isLoadingQuestionsByIds} = useQuestions()

    const [firstIndex, setFirstIndex] = useState(0)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)


    const handleSelectQuestion = (q) => {
        const questionIsSelected = selectedQuestions.map(a => a.Id).includes(q.Id)

        let _selectedQuestions = [...selectedQuestions]

        if(questionIsSelected){
            _selectedQuestions = _selectedQuestions.filter(a => a.Id !== q.Id)
        }
        else{
            _selectedQuestions.push(q)
        }

        onSelectQuestions(_selectedQuestions)
    }

    const renderQuestions = () => {
        let Questions = []
        if(questions){
            Questions = questions.Questions
        }

        if(questionsByIds){
            Questions = questionsByIds
        }

        Questions = Questions.filter(q => !forbiddenQuestions.includes(q.Id))



        return(
           <div>
                {Questions.length ? 
                <Row
                    gutter={[12, 12]}
                >
                    {Questions.map((q, qi) => (
                        <CompactQuestionComponent 
                            q={q}
                            selectedQuestions={selectedQuestions}
                            qi={qi}
                            firstIndex={firstIndex}
                            
                            onRenderCode={(q, i) => (
                               <Space
                                    className="hq-opposite-arrangement"
                                    align="start"
                               >    
                                    <Tooltip
                                        color="white"
                                        title={<p>Click to select</p>}
                                    >
                                        <p className="series-edit-view-element-code hoverable-plus" onClick={() => handleSelectQuestion(q)}>{i}{' '}{q.Code}</p>
                                    </Tooltip>

                                    <Space size={'large'} align="start">
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
                                    </Space>
                                </Space>
                            )}
                        />
                    ))}
                </Row>
                :
                <Space
                    align="center"
                >
                    <Empty/>
                </Space>}    
            </div>
        )
    }

    return(
        <div>
            <QuestionsSearchTool onSetFirstIndex = {(i) => setFirstIndex(i)}/>
            <br/>
            {(isLoadingQuestions || isLoadingQuestionsByIds) && <Skeleton />}
            {(!(isLoadingQuestions || isLoadingQuestionsByIds) && questions) && renderQuestions()}


            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />
        </div>
    )
}