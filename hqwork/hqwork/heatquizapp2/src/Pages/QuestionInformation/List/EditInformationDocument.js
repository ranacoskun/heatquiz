import { Button, Divider, Drawer, message } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { useState } from "react";

import './index.css'
import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { handleResponse } from "../../../services/Auxillary";
import { UploadPDF } from "../../../Components/UploadPDF";

export function EditInformationDocument({open, onClose, info, reloadData}){

    if(!open) return <div/>;

    const {isLoadingEditQuestionInformationDocument, editQuestionInformationDocument} = useAssistanceObjects()

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const [api, contextHolder] = message.useMessage()

    return(
        <Drawer
        title="Edit explanation document"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={
            <div>
                <p className="default-title">{info.Code}</p>
            </div>
        }
        >
        {contextHolder}
        <Divider orientation="left">
            Document
        </Divider>
        <div > 
            <UploadPDF 
                pdfURL={newPDFURL}

                className="add-question-explanation-upload-pdf"
                pdfClassName="add-question-explanation-upload-pdf-internal"

                onSetPDF={(url, pdf) => {
                    setNewPDFURL(url)
                    setNewPDF(pdf)
                }}
            />
        </div>
                
        <br/>
        <br/>
        <Button
            size="small"
            type="primary"
            onClick={() => {
                if(!newPDF){
                    api.destroy()
                    api.warning('Please add document')

                    return
                }

                const data = new FormData()

                data.append('Id', info.Id)
                data.append('PDF', newPDF)

                editQuestionInformationDocument(data)
                .then((r) => handleResponse(r, api, 'Updated successfully', 1, () => {
                    onClose()
                    reloadData()
                }))
                
            }}

            loading={isLoadingEditQuestionInformationDocument}
        >
            Update
        </Button>
        </Drawer>
    )
}