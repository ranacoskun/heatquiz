import React, { useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Divider, Dropdown, List, Skeleton, Space, Tooltip } from "antd";
import { QuestionsSearchTool } from "./QuestionsSearchTool";
import { useQuestions } from "../../../contexts/QuestionsContext";
import { beautifyDate, beautifyNumber } from "../../../services/Auxillary";
import {EditOutlined, TrophyOutlined, CopyOutlined, DeleteOutlined, ApartmentOutlined, CommentOutlined, NotificationOutlined} from '@ant-design/icons';
import { QuestionPlayPocket } from "../QuestionPlayPocket/QuestionPlayPocket";
import { ViewFeedbackList } from "../../StudentFeedback/ViewFeedbackList";
import { ViewQuestionComments } from "../ViewQuestionComments/ViewQuestionComments";
import { ViewQuestionRelations } from "../ViewQuestionRelations/ViewQuestionRelations";
import { CopyQuestion } from "../CopyQuestion/CopyQuestion";
import { useNavigate } from "react-router-dom";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { QuestionMeanTimeStatistics } from "../../../Components/QuestionMeanTimeStatistics";

export function QuestionList(){

    const {questions, isLoadingQuestions, errorGetQuestions} = useQuestions()
    const naviagate = useNavigate()

    const [firstIndex, setFirstIndex] = useState(0)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)

    const [showViewFeedbackListModal, setShowViewFeedbackListModal] = useState(false)
    const [showViewQuestionCommentsModal, setShowQuestionCommentsModal] = useState(false)
    const [showViewQuestionRelationsModal, setShowQuestionRelationsModal] = useState(false)
    const [showCopyQuestionModal, setShowCopyQuestionModal] = useState(false)

    const questionActionList = (q) => [{
        key: 'view_edit_question',
        label: 'View / edit',
        icon: <EditOutlined/>,
        onClick: () => naviagate('/question_view_edit/'+q.Id+'/'+q.Type)
    },
    {
        key: 'play_question',
        label: 'Play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowPlayQuestionModal(true)
        }
    },
    {
        key: 'copy_question',
        label: 'Copy',
        icon: <CopyOutlined/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowCopyQuestionModal(true)
        }
    },
    {
        key: 'view_relations',
        label: 'Relations',
        icon: <ApartmentOutlined/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowQuestionRelationsModal(true)
        }
    },
    {
        key: 'view_comments',
        label: 'Comments',
        icon: <CommentOutlined /> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowQuestionCommentsModal(true)
        }
    },
    {
        key: 'view_feedback',
        label: 'Student feedback',
        icon: <NotificationOutlined /> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowViewFeedbackListModal(true)
        }
    },
    {
        key: 'delete_question',
        label: 'Delete',
        icon: <DeleteOutlined/> ,
        onClick: () => {}
    }]

    const renderQuestions = () => {
        const Questions = questions.Questions
        
        return(
           <div>
                <List 
                    dataSource={Questions}
                    renderItem={(q, qi) => {
                        const correctPlayPerc = (q.TotalGames ? (100 *  (q.TotalCorrectGames/(q.TotalGames || 1))).toFixed(0) + '%' : '-')
                        const wrongPDFPerc = (q.TotalPDFViewsWrong ? (100*(q.TotalPDFViewsWrong/q.TotalPDFViews)).toFixed(0) : 0) + '%'

                        return (
                        <Space 
                            size={'large'}
                            className="question-list-item-container-0"
                        >
                            <div className="question-list-item-container-0-internal">
                                <div className="question-list-item-container-1">
                                    <Dropdown
                                        menu={{
                                            items:questionActionList(q),
                                            title:'Actions'
                                        }}
                                    >
                                        <p className="hoverable-plus">
                                            <span className="default-gray">{firstIndex + qi+1}{' '}</span>
                                            {q.Code}
                                        </p>
                                    </Dropdown>
                                    <br/>

                                    <p className="default-gray">{q.AddedByName}</p>
                                    <p className="default-gray">{beautifyDate(q.DateCreated)}</p>

                                    <br/>

                                    <p className="default-gray">{q.LevelOfDifficulty.Name}</p>
                                    <p className="default-gray">{q.Subtopic.Topic.Name} - {q.Subtopic.Name}</p>

                                </div>

                                <img 
                                    className="question-list-item-img"
                                    src={q.Base_ImageURL}
                                    alt={q.Code}
                                />

                                <div className="question-list-item-stats">
                                    <small className="default-gray">Play statistics</small>
                                    <Space size={'large'}>
                                        <p>{beautifyNumber(q.TotalGames)}</p>
                                        <p className="default-green">
                                            {beautifyNumber(q.TotalCorrectGames)}
                                            <small className="default-gray"> {' '}({correctPlayPerc}) </small>
                                        </p>
                                    </Space>


                                    {q.PDFURL && 
                                    <>
                                        <br/>
                                        <small className="default-gray">PDF view statistics</small>
                                        <Space size={'large'}>
                                            <p>{beautifyNumber(q.TotalPDFViews)} <small className="default-gray"> views </small></p>
                                            <Tooltip
                                                title={<p>Percentage of PDF clicks following a wrong answer</p>}
                                                color="white"
                                            >
                                            <p className="default-red">{wrongPDFPerc}</p>
                                            </Tooltip>
                                        </Space>
                                    </>}

                                    <br/>
                                    <QuestionMeanTimeStatistics
                                        question={q}
                                        style={{width:1000, height:800}}
                                    >
                                        <Space direction="vertical">
                                            <small className="default-gray">Median play time</small>
                                            <Space size={'large'}>
                                                <p>{q.MedianPlayTime} <small className="default-gray"> seconds </small></p>
                                            </Space>
                                        </Space>
                                    </QuestionMeanTimeStatistics>
                                    
                                </div>
                            </div>
                            
                        </Space>)
                    }}
                
                />
           </div>
        )
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                Questions List
            </Divider>

            <QuestionsSearchTool onSetFirstIndex = {(i) => setFirstIndex(i)}/>

            <br/>

            {isLoadingQuestions && <Skeleton />}
            {(!isLoadingQuestions && questions) && renderQuestions()}

            {errorGetQuestions && !isLoadingQuestions &&
                <ErrorComponent 
                    error={errorGetQuestions}
                    onReload={() => window.location.reload()}
                />
            }

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />

            <ViewFeedbackList
                open={showViewFeedbackListModal}
                onClose={()=> setShowViewFeedbackListModal(false)}
                question={selectedQuestion}
            />

            <ViewQuestionComments 
                open={showViewQuestionCommentsModal}
                onClose={()=> setShowQuestionCommentsModal(false)}
                question={selectedQuestion}
            />

            <ViewQuestionRelations 
                open={showViewQuestionRelationsModal}
                onClose={()=> setShowQuestionRelationsModal(false)}
                question={selectedQuestion}
            />

            <CopyQuestion 
                open={showCopyQuestionModal}
                onClose={()=> setShowCopyQuestionModal(false)}
                question={selectedQuestion}
            />
        </PagesWrapper>
    )
}