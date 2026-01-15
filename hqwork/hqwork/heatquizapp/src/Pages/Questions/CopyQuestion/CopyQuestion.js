import {Button, Drawer, Form, Input, Space, message,} from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { LatexRenderer } from "../../../Components/LatexRenderer";

import { useQuestions } from "../../../contexts/QuestionsContext";
import { handleResponse } from "../../../services/Auxillary";

export function CopyQuestion({open, onClose, question}){

    if(!open) return <div/>;

    const {isLoadingCopyQuestion, copyQuestion} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [newCode, setNewCode] = useState('')

    useEffect(() => {
        if(open){
            setNewCode('')
        }
    }, [open])

    return(
        <Drawer
        title="Copy question"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}

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

      maskClosable={false}
    >   
        {contextHolder}

        <Form>
            <Form.Item>
                <small className="default-gray">Code</small>
                <Input 
                    placeholder="New code"
                    value={newCode}
                    onChange={(v) => setNewCode(v.target.value)}
                />
            </Form.Item>
        </Form>

        <Button 
            size="small"
            type="primary"
            onClick={() => {
                if(!newCode.trim()){
                    api.destroy()
                    api.warning('Please add code')
                }

                const VM = ({
                    QuestionId: question.Id,
                    Code: newCode
                })

                copyQuestion(VM)
                .then((r) => handleResponse(r, api, 'Copied successfully', 1, () => {
                    onClose()

                }))
            }}

            loading={isLoadingCopyQuestion}
        >
            Copy
        </Button>
    </Drawer>
    )
}