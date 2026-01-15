import React from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { Button, Col, Divider, Dropdown, Popconfirm, Row, Skeleton, Space, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, FilePdfOutlined, EyeOutlined, AlignLeftOutlined} from '@ant-design/icons';
import { useState } from "react";
import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import { useEffect } from "react";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { useDatapools } from "../../../contexts/DatapoolsContext";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { AddInformation } from "./AddInformation";
import { EditInformationName } from "./EditInformationName";
import { EditInformationLatex } from "./EditInformationLatex";
import { EditInformationDocument } from "./EditInformationDocument";
import { handleResponse } from "../../../services/Auxillary";
import { ViewInformationAssignedQuestions } from "./ViewInformationAssignedQuestions";
import { AssignQuestionsToInformation } from "./AssignQuestionsToInformation";

export function QuestionInformationList(){
    
    const {
        isLoadinginformationList, informationList, errorGetAllQuestionInformation, getAllQuestionInformation,
        removeQuestionInformationDocument
    } = useAssistanceObjects()

    const [api, contextHolder] = message.useMessage()

    const [selectedInfo, setSelectedInfo] = useState(null)

    const [showAddInformation, setShowAddInformation] = useState(false)
    const [showEditInfoName, setShowEditInfoName] = useState(false)
    const [showEditInfoLatex, setShowEditInfoLatex] = useState(false)
    const [showEditInfoDocument, setShowEditInfoDocument] = useState(false)

    const [showViewAssignedQuestions, setShowViewAssignedQuestions] = useState(false)
    const [showAssignQuestions, setShowAssignQuestions] = useState(false)

    const {selectedDatapool} = useDatapools()
    
    useEffect(() => {
        getAllQuestionInformation()
    }, [selectedDatapool])
    
    const listActionsList = (l) => [
        {
            key: 'edit_list_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setSelectedInfo(l)
                setShowEditInfoName(true)
            }
        },
        {
            key: 'edit_document',
            label: 'Edit document ',
            icon: <FilePdfOutlined/>,
            onClick: () => {
                setShowEditInfoDocument(true)
                setSelectedInfo(l)
            }
        },
        l.Latex.trim() && l.PDFURL &&
        {
            key: 'remove_document',
            label: 
                <Popconfirm
                title="Remove document"
                description="Are you sure to delete this document?"
                        onConfirm={() => {
                            const data = new FormData()
                            data.append('Id', l.Id)

                            removeQuestionInformationDocument(data)
                            .then(r => handleResponse(r, api, 'Removed', 1, () => getAllQuestionInformation()))
                        }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                placement="right"
            >
                Remove document
            </Popconfirm>,
            icon: <DeleteOutlined/>,
            onClick: () => {}
        },
        {
            key: 'edit_latex',
            label: 'Edit LaTeX ',
            icon: <AlignLeftOutlined />,
            onClick: () => {
                setShowEditInfoLatex(true)
                setSelectedInfo(l)
            }   
        },
        {
            key: 'view_assigned_questions',
            label: 'View assigned questions',
            icon: <EyeOutlined/>,
            onClick: () => {
                setShowViewAssignedQuestions(true)
                setSelectedInfo(l)
            }
        },
        {
            key: 'ssigned_questions',
            label: 'Asign new questions',
            icon: <PlusOutlined style={{color:'green'}}/>,
            onClick: () => {
                setShowAssignQuestions(true)
                setSelectedInfo(l)
            }
        },
        {
        key: 'delete_list',
        label: 
        <Popconfirm
            title="Remove list"
            description="Are you sure to delete this list?"
                    onConfirm={() => {

                    }}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
            placement="right"
        >
        
            Delete
        </Popconfirm>,
        icon: <DeleteOutlined />,
        onClick: () => {
            
        }
    }].filter(a => a)

    const renderLists = () => {
        
        return(
            <Row 
                className="hq-full-width"
                gutter={[4,4]}
            >
                {informationList.map((l, li) => {
                    const {Id, Code, AddedByName, PDFURL, Latex} = l

                    return(
                        <Col
                            key={Id}
                            xs={6}
                            className="hq-element-container"
                        >
                            <Row>
                                <Col xs={24}>
                                    <Space direction="vertical" align="start" >
                                        <Space className="hq-full-width">
                                            <p className="default-gray">{li+1}</p>
                                            <Dropdown
                                                menu={{
                                                    title:'Actions',
                                                    items: listActionsList(l)
                                                }}
                                            >
                                                <p className="default-title hoverable">{Code}</p>
                                            </Dropdown>
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
        <PagesWrapper>
            {contextHolder}
            <Divider orientation="left">
                <Space>
                    <p>Question explanation list</p>

                    <Button 
                        icon={<PlusOutlined style={{color:'green'}} />}
                        size="small"
                        onClick={() => setShowAddInformation(true)}
                    >
                        Add
                    </Button>
                </Space>
            </Divider>

            <br/>
            {isLoadinginformationList && <Skeleton />}
            {errorGetAllQuestionInformation && !isLoadinginformationList &&
                <ErrorComponent 
                    error={errorGetAllQuestionInformation}
                    onReload={() => getAllQuestionInformation()}
                />
            }

            {!(isLoadinginformationList && errorGetAllQuestionInformation) && informationList && renderLists()}

            <AddInformation 
                open={showAddInformation}
                onClose={() => setShowAddInformation(false)}
                reloadData={() => getAllQuestionInformation()}
            />

            <EditInformationName 
                open={showEditInfoName}
                onClose={() => setShowEditInfoName(false)}
                reloadData={() => getAllQuestionInformation()}

                info={selectedInfo}
            />

            <EditInformationLatex 
                open={showEditInfoLatex}
                onClose={() => setShowEditInfoLatex(false)}
                reloadData={() => getAllQuestionInformation()}

                info={selectedInfo}
            />

            <EditInformationDocument 
                open={showEditInfoDocument}
                onClose={() => setShowEditInfoDocument(false)}
                reloadData={() => getAllQuestionInformation()}

                info={selectedInfo}

            />

            <ViewInformationAssignedQuestions 
                open={showViewAssignedQuestions}
                onClose={() => setShowViewAssignedQuestions(false)}
                reloadData={() => getAllQuestionInformation()}

                info={selectedInfo}
            />

            <AssignQuestionsToInformation 
                open={showAssignQuestions}
                onClose={() => setShowAssignQuestions(false)}
                reloadData={() => getAllQuestionInformation()}

                info={selectedInfo}
            />
        </PagesWrapper>
    )
}