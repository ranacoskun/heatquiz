import React, { useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Badge, Button, Col, DatePicker, Divider, Dropdown, Row, Skeleton, Space, message } from "antd";
import './index.css'
import { useComments } from "../../contexts/CommentsContext";
import { ErrorComponent } from "../../Components/ErrorComponent";
import {MessageOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';
import { QuestionPlayPocket } from "../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { ViewQuestionComments } from "../Questions/ViewQuestionComments/ViewQuestionComments";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

export function NotificationsList(){

    const {loadingSearchUserComments, searchUserCommentsResult: Comments,  searchUserCommentsError, searchUserComments} = useComments()

    const [fromData, setFromData] = useState(null)
    const [toData, setToData] = useState(null)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [showViewQuestionCommentsModal, setShowQuestionCommentsModal] = useState(false)

    const [selectedQuestion, setSelectedQuestion] = useState({})

    const [api, contextHolder] = message.useMessage()

    const navigate = useNavigate()

    const searchData = () => {
        if(!(fromData && toData)){
            api.destroy()
            api.warning("Please add dates")
            return
        }

        const VM =({
            From: fromData,
            To: toData
        })

        searchUserComments(VM)
    }


    function SearchLine(){
        return(
                <div className="notifications-search-input">
                    <small className="default-gray">Date range</small>
                    <RangePicker 
                    
                    onChange={(v) => {
                        const fromData = v[0].format('DD.MM.YYYY') + ' 00:00:00'
                        const toData = v[1].format('DD.MM.YYYY') + ' 23:59:59'

                        setFromData(fromData)
                        setToData(toData)
                    }}/>
                    <Space align="center">
                        <Button 
                            className="notifications-search-btn"
                            onClick={searchData}
                        >
                            Search 
                        </Button>
                        {numberOfComments ? 
                        <p>
                            {numberOfComments} <strong>new</strong> comments 
                        </p> :< div/>}
                    </Space>
                </div>
        )
    }

    const getNumberOfComments = () => {
        if(!Comments) return ''

        return Comments.reduce((r, c) => r += c.NumberOfComments, 0)
    }

    const questionActionList = (q) => [{
        key: 'view_edit_question',
        label: 'View edit question',
        icon: <EditOutlined/>,
        onClick: () => navigate('/question_view_edit/'+q.Id+'/'+q.Type)
    },
    {
        key: 'play_question',
        label: 'Play question',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowPlayQuestionModal(true)
        }
    }]

    const renderComments = () => {

        return(
            <Row>
                {Comments.map((f) => {
                 const {Text, CommentSection, NumberOfComments} = f

                 const {Question} = CommentSection
                 const {Code, Base_ImageURL} = Question
 
                    
                 return(
                    <Col xs={6}> 
                        <Space className="hq-element-container hq-light-background" direction="vertical" align="start">
                            <Space direction="vertical">
                                <Space direction="vertical" className="hq-full-width" align="center"> 
                                    <Dropdown
                                        menu={{
                                            title:'Actions',
                                            items:questionActionList(Question)
                                        }}
                                    >
                                        <p className="hoverable hoverable-plus">{Code}</p>
                                    </Dropdown>
                                    <img
                                        src = {Base_ImageURL}
                                        alt="question"
                                        className="question-feedback-image"
                                    />
                                </Space>
                                <Space 
                                align="start" 
                                className="sample-feedback-section" 
                                onClick={() => {
                                    setShowQuestionCommentsModal(true)
                                    setSelectedQuestion(Question)
                                }}
                                >
                                        <div className="sample-feedback-icon">
                                            <Badge 
                                            count={NumberOfComments} size="small">
                                                <MessageOutlined />
                                            </Badge>
                                        </div>
                                        
                                        <p className="sample-feedback">
                                        {Text}
                                        </p>
                                </Space>
                            </Space>
                        </Space>
                    </Col>)

            })}
            </Row>
        )
    }

    const numberOfComments = getNumberOfComments()

    return(
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                User comments
            </Divider>

            {SearchLine()}
            <Divider/>

            {loadingSearchUserComments && <Skeleton />}

            {searchUserCommentsError && !loadingSearchUserComments && 
                <ErrorComponent 
                    error={searchUserCommentsError}
                />
            }

            {!(loadingSearchUserComments || searchUserCommentsError) && Comments && renderComments()}

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />

            <ViewQuestionComments 
                open={showViewQuestionCommentsModal}
                onClose={()=> setShowQuestionCommentsModal(false)}
                question={selectedQuestion}
            />  
        </PagesWrapper>
    )
}