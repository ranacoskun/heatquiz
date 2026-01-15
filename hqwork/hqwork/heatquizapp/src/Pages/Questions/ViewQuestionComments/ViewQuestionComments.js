import {Avatar, Button, Divider, Drawer, List, Skeleton, Space, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, MessageTwoTone } from '@ant-design/icons';
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { useComments } from "../../../contexts/CommentsContext";
import { useEffect } from "react";
import { Mention, MentionsInput } from "react-mentions";

import './ViewQuestionComments.css'
import { beautifyDatetime, getShortenedName, handleResponse } from "../../../services/Auxillary";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { useUsers } from "../../../contexts/UsersContext";

export function ViewQuestionComments({open, onClose, question}){

    if(!open) return <div/>;

    const {
        loadingQuestionComments, questionComments, getQuestionCommentsError, getQuestionComments,
        loadingAddComment, addComment
    } = useComments()

    const {users} = useUsers()

    const [newComment, setNewComment] = useState('')

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            setNewComment('')
            getQuestionComments(question)
        }
    }, [open])


    const renderAddComment = () => {

        return(
            <div>
                <MentionsInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    
                    placeholder ="Add new comment, use @ to tag users"
                    a11ySuggestionsListLabel={"Suggested mentions"}
                    style = {{
                        border:'1px solid rgb(240,240,240)',
                        borderRadius:'0.25em',
                        marginBottom:'1vh',
                        control: {
                            backgroundColor: 'whitesmoke',
                            border:'1px solid transparent'
                        },
                        '&multiLine': {
                            control: {
                                fontFamily: 'Segoe UI',
                                minHeight: 63,
                                },
                                highlighter: {
                                    padding: 9,
                                    border: '1px solid transparent',
                                },
                                input: {
                                    padding: 9,
                                    border: '1px solid silver',
                                },
                            },
                            '&singleLine': {
                                display: 'inline-block',
                                width: 180,
                                highlighter: {
                                    padding: 1,
                                    border: '2px inset transparent',
                                },
                                input: {
                                    padding: 1,
                                    border: '2px inset',
                                },
                            },
                            suggestions: {
                                list: {
                                    backgroundColor: 'white',
                                    border: '1px solid rgba(0,0,0,0.15)',
                                    fontSize: 16,
                                },
                                item: {
                                    padding: '5px 15px',
                                    borderBottom: '1px solid rgba(0,0,0,0.15)',
                                    '&focused': {
                                        backgroundColor: '#cee4e5',
                                    },
                                },
                            },
                        }}>

                            <Mention
                            data={(users||[]).map((u) => ({
                                id: u.Name, 
                                display: u.Name
                            }))} 
                            style = {{backgroundColor: "#cee4e5"}}
                            />
                        </MentionsInput> 
                        <Button
                            loading={loadingAddComment}
                            size='small'
                            onClick={() => {
                                if(!newComment.trim()){
                                    api.destroy()
                                    api.warning('Please add a comment')
                                    
                                    return
                                }

                                let data = new FormData()

                                data.append("QuestionId", question.Id)

                                data.append("Comment",newComment)
                                data.append("IsLatex", false)
                                
                                let comment = newComment
                                let tags = []
                                comment.split("@").forEach((c) => {
                                    let x = "@" + c

                                    let m = x.match(/\@\[(.*?)\]/)
                                    if(m){
                                        tags.push(m[1])
                                    }
                                })

                                if(tags.length){
                                    tags.forEach(t => data.append("Tags", t))
                                }

                                addComment(data).then((r) => 
                                handleResponse(r, api, 'Comment added successfully', 0.75, () => {
                                    setNewComment('')
                                    getQuestionComments(question)
                                }))
                            }}

                            icon={<MessageTwoTone  />}
                        >
                                Send comment
                        </Button>
                        <Divider/>
            </div>
        )
    }

    const renderComments = () => {
        const {CommentSection} = questionComments

        let comments = []

        if(CommentSection){
            comments = CommentSection.Comments
        }

        comments = comments.sort((a, b) => b.Id - a.Id)

        return(
            <List 
                dataSource={comments}

                renderItem={(c, ci) => {
                    const {AddedByName, AddedByProfilePicture, DateCreated, Text} = c

                    const shortenedName = getShortenedName(AddedByName)

                    return(
                        (
                            <div
                                key={ci}
                            >
                                <Space
                                    size={'small'}
                                    align='start'
                                >
                                     <Avatar 
                                        className='commenter-avatar'
                                        src = {AddedByProfilePicture}
                                        >
                                            {shortenedName}
                                    </Avatar>
                                    <Space
                                        direction="vertical"
                                    >
                                        <Space
                                            size={'large'}
                                        >
                                            <p>{AddedByName}</p>
                                            <p>{beautifyDatetime(DateCreated)}</p>
                                        </Space>
                                        

                                        <MentionsInput
                                            value={Text}
                                            disabled
                                            style={{
                                            control: {
                                                backgroundColor: 'white',
                                                border: '0px solid silver',
                                            },
                                            '&multiLine': {
                                            
                                                input: {
                                                padding: 1,
                                                border: '0px solid silver',
                                                },
                                            },
                                            '&singleLine': {
                                                
                                                input: {
                                                padding: 1,
                                                border: '0px inset',
                                                },
                                            }}}>

                                            <Mention
                                            data={([])} 
                                            style = {{backgroundColor: "#cee4e5"}}
                                            />
                                        </MentionsInput>
                                    </Space>
                                </Space>      
                                <br/>
                                <br/>
                            </div>
                        )
                    )
                }}
            />
        )
    }

    return(
        <Drawer
        title="Question comments"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}

        footer={
          <div>
          <p className="question-code">{question.Code}</p>
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
    
        {loadingQuestionComments && <Skeleton />}

        {getQuestionCommentsError && !loadingQuestionComments && 
            <ErrorComponent
                error={getQuestionCommentsError}
                onReload={() => {getQuestionComments(question)}}
            />
        }

        {(!loadingQuestionComments) && renderAddComment()}
        {(!loadingQuestionComments && questionComments) && renderComments()}
         
    </Drawer>
    )
}