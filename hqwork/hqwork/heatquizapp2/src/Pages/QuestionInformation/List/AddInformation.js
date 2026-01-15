import { Button, Divider, Drawer, Form, Input, Space, message } from "antd";
import React, {useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import TextArea from "antd/es/input/TextArea";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { UploadPDF } from "../../../Components/UploadPDF";
import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import './index.css'
import { handleResponse } from "../../../services/Auxillary";

export function AddInformation({open, onClose, reloadData}){

    if(!open) return <div/>;

    const { isLoadingAddQuestionInformation, addQuestionInformation} = useAssistanceObjects()

    const [messageApi, contextHolder] = message.useMessage();

    const [newName, setNewName] = useState('')
    const [newLatex, setNewLatex] = useState('LaTeX content ....')

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    return( 
        <div>
            {contextHolder}
            <Drawer
                title={
                    <Space size={"large"}>
                        <p>Add explanation</p>

                        <Button 
                            type="primary"
                            size="small"
                            onClick={() => {
                                if(!newName.trim()){
                                    messageApi.destroy()
                                    messageApi.warning("Please add a name")

                                    return
                                }

                                if(!(newLatex.trim() || newPDF)){
                                    messageApi.destroy()
                                    messageApi.warning("Please add a document or LaTeX content")

                                    return
                                }

                                const data = new FormData()

                                data.append('Code', newName.trim())
                                data.append('PDF', newPDF)
                                data.append('Latex', newLatex)

                                addQuestionInformation(data)
                                .then(r => handleResponse(r, messageApi, 'Added successfully', 1, () => {
                                    reloadData()
                                    onClose()
                                }))
                               
                            }}
                            loading = {isLoadingAddQuestionInformation}
                        >
                        Add
                        </Button>     
                    </Space>
                }
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
                maskClosable={false}
            >   
                <p className="default-title highlighted">{' '}Add either a document or LaTeX content or both{' '}</p>

                <Divider orientation="left">
                    Name
                </Divider>
                <Form>
                    <Form.Item>
                        <Input 
                        placeholder="New name"
                        value={newName}
                        onChange={(v) => setNewName(v.target.value)}
                         
                        />
            
                    </Form.Item>
                </Form>       
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
                <Divider orientation="left">
                    LaTex 
                </Divider> 
                <TextArea 
                    value={newLatex}
                    rows={4} 
                    onChange={(v) => setNewLatex(v.target.value)}
                />
                <br/>
                <br/>
                <LatexRenderer latex={newLatex} />
                                
            </Drawer>
        </div>
    )
}