import {Avatar, Divider, Drawer, Space, Spin } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { LatexRenderer } from "../../Components/LatexRenderer";
import { beautifyDatetime, getShortenedName } from "../../services/Auxillary";
import { useStudentFeedback } from "../../contexts/StudentFeedbackContext";
import { useEffect } from "react";
import { ErrorComponent } from "../../Components/ErrorComponent";

export function ViewFeedbackList({open, onClose, question}){
    if(!open) return <div/>;

    const {loadingQuestionFeedback, questionFeedback, getQuestionFeedbackError, getQuestionFeedback,} = useStudentFeedback()

    useEffect(() => {
      if(open){
        getQuestionFeedback(question)
      }
    }, [open])

    const {Latex,  Base_ImageURL, Code} = question

    return(
        <Drawer
        title="Student feedback"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}

        footer={
          <div>
          <p className="default-title">{Code}</p>
          <Space size={'large'} align="start">
              <div>
                  <img
                      src = {Base_ImageURL}
                      alt="question"
                      className="question-feedback-image"
                      
                  />
              </div>
              <div>
                  {Latex && <LatexRenderer latex={Latex}/>}
              </div>
          </Space>
      </div>}
    >   
        {loadingQuestionFeedback && <Spin/>}

        {getQuestionFeedbackError && !loadingQuestionFeedback && 
          <ErrorComponent 
            error={getQuestionFeedbackError}
            onReload={() => getQuestionFeedback(question)}
          />}

        {!loadingQuestionFeedback && questionFeedback && 
        questionFeedback.map((d, di) => 
          {
            const {Player, DateCreated, FeedbackContent} = d

            const shortenedName = getShortenedName(Player)
            return(
              <div 
                key={di}
              >
                <Space
                  size={'large'}
                >
                  <Space
                    size={'small'}
                  >
                    <Avatar 
                      className='commenter-avatar'
                    >
                      {shortenedName}
                    </Avatar>
                    <p>{Player}</p>
                  </Space>

                  <p>{beautifyDatetime(DateCreated)}</p>
                </Space>
                <p>{FeedbackContent}</p>
                <Divider/>
              </div>)
          })
        }

        <br/>
        
    </Drawer>
    )
}