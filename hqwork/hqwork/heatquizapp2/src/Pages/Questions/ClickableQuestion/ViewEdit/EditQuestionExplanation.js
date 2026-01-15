import {Button, Col, Drawer, Row, Skeleton, Space, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined, FilePdfOutlined} from '@ant-design/icons';

import { handleResponse } from "../../../../services/Auxillary";
import { useEffect } from "react";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useAssistanceObjects } from "../../../../contexts/AssistanceObjectsContext";

export function EditQuestionExplanation({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {
        isLoadinginformationList, informationList, errorGetAllQuestionInformation, getAllQuestionInformation,
        isLoadingAssignQuestionsInformation, assignQuestionsInformation,         
    } = useAssistanceObjects()

    useEffect(() => {
        if(open){
            getAllQuestionInformation()
        }
    }, [open])

    useEffect(() => {
        const {Information} = question

        if(Information && informationList){
            const findInfo = informationList.filter(a => a.Id === Information.Id)[0]
            
            //This can be null
            setSelectedInfo(findInfo)
        }
    }, [informationList])

    const [selectedInfo, setSelectedInfo] = useState(null)

    const [api, contextHolder] = message.useMessage()

    const renderLists = () => {
        

        return(
            <Row 
                className="hq-full-width"
                gutter={[4,4]}
            >
                {informationList.map((l, li) => {
                    const {Id, Code, AddedByName, PDFURL, Latex} = l

                    const isSelected = selectedInfo && selectedInfo.Id === Id

                    return(
                        <Col
                            key={Id}
                            xs={24}
                            className={"hq-element-container hoverable" + (isSelected ? " highlighted" : "")}
                            onClick={() => setSelectedInfo(l)}
                        >
                            <Row>
                                <Col xs={24}>
                                    <Space direction="vertical" align="start" >
                                        <Space className="hq-full-width">
                                            <p className="default-gray">{li+1}</p>
                                            
                                            <p className="default-title">{Code}</p>
                                        </Space>

                                        <Space direction="vertical" align="start">
                                            <small className="default-gray">{AddedByName}</small>
                                        </Space>
                                    </Space>
                                </Col>
                                <Col xs={24}>
                                    {PDFURL && 
                                    <div>
                                        <br/>
                                        <Button
                                            size="small"
                                            onClick={() => window.open(PDFURL)}
                                            icon={<FilePdfOutlined style={{color:'red'}}/>}
                                        >
                                            Document
                                        </Button>
                                        <br/>
                                    </div> }
                                    <br/>

                                    {Latex && 
                                    <LatexRenderer 
                                        latex={Latex}
                                    />}
                                </Col>
                            </Row>
                        </Col>
                    )
                })}
            </Row>
        )
    }

    return(
        <Drawer
        title={
        <Space size={'large'}>
            <p>Edit question explanation</p>

            <Button
                size="small"
                type="primary"

                loading={isLoadingAssignQuestionsInformation}

                onClick={() => {
                    if(!selectedInfo){
                        api.destroy()
                        api.warning("Please select one explanation")
                        return
                    }

                    let data = new FormData()
        
                    data.append("Id", selectedInfo.Id)
                    data.append("QuestionIds", question.Id)

                    assignQuestionsInformation(data)
                    .then(r => handleResponse(r, api, 'Assigned successfully', 1, () => {
                        onClose()
                        reloadQuestion()
                    }))
                }}
            >
                Update
            </Button>
        </Space>}
        width={'50%'}
        onClose={onClose}
        open={open}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {contextHolder}
            
            {isLoadinginformationList && <Skeleton />}
            {errorGetAllQuestionInformation && !isLoadinginformationList &&
                <ErrorComponent 
                    error={errorGetAllQuestionInformation}
                    onReload={() => getAllQuestionInformation()}
                />
            }

            {!(isLoadinginformationList && errorGetAllQuestionInformation) && informationList && renderLists()}
        </Drawer>
    )
}