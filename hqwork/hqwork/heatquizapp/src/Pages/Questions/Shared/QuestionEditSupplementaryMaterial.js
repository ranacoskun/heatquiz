import {Button, Drawer, Space, Spin, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, FilePdfOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { useEffect } from "react";

import './QuestionEditView.css'
import { useQuestions } from "../../../contexts/QuestionsContext";
import { ALLOWED_PDF_EXTENSIONS, dummyRequest, getBase64, handleResponse } from "../../../services/Auxillary";
import Dragger from "antd/es/upload/Dragger";

export function QuestionEditSupplementaryMaterial({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {isLoadingEditQuestionSolution, editQuestionSolution,} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [loadingPDF, setLoadingPDF] = useState(false);
    const [newPDF, setNewPDF] = useState(null);
    const [newPDFURL, setNewPDFURL] = useState(null);
   
    useEffect(() => {
        if(open){
          
        }
    }, [open])

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingPDF(true);
          return;
        }
    
        if (info.file.status === 'done') {

            getBase64(info.file.originFileObj, (url) => {
            setLoadingPDF(false);
            setNewPDFURL(url);
            setNewPDF(info.file.originFileObj);
          });
        }
      };


    return(
        <Drawer
        title={
            <Space size={'large'}>
                <p>Edit question solution material</p>
                <Button
                    size="small"
                    type="primary"

                    onClick={() => {
                        if(!newPDF){
                            api.destroy()
                            api.warning('Please provide a pdf file')

                            return
                        }

                        const data = new FormData()

                        data.append('QuestionId', question.Id)
                        data.append('PDF', newPDF)
                        data.append('QuestionType', question.Type) // Should be removed


                        editQuestionSolution(data)
                        .then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                            reloadQuestion()
                            onClose()
                        }))
                    }}

                    loading={isLoadingEditQuestionSolution}
                >
                    Update
                </Button>
            </Space>           
        }
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
        <Dragger  
            customRequest={dummyRequest}
            accept={ALLOWED_PDF_EXTENSIONS}
            onChange={handleChange}
            showUploadList={false}
            
        >
            {!newPDFURL && <>
            <p className="ant-upload-drag-icon">
            <FilePdfOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </>}
            {loadingPDF && <Spin size="small"/>}
            {newPDFURL && 
                <iframe 
                title="question-solution"
                className="question-edit-view-upload-solution-pdf"
                src={newPDFURL}></iframe>
            }
        </Dragger>
        <br/>

        <Space>
        {question.PDFURL && <Button
            size="small"
            icon ={<FilePdfOutlined/>}
            onClick={() => window.open(question.PDFURL)}
        >
            Original solution
        </Button>}
        
        </Space>
    </Drawer>
    )
}