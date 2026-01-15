import {Button, Col, Drawer, List, Row, Select, Skeleton, Space, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';

import { CLICKABLE_CHART, CLICKABLE_IMAGE } from "../Shared/Constants";
import { useInterpretedTrees } from "../../../../contexts/InterpretedTreesContext";
import { useClickTrees } from "../../../../contexts/ClickTreesContext";
import { useEffect } from "react";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function EditElementAnswer({open, onClose, element, type, reloadQuestion}){

    if(!open) return <div/>;

    const {interpretedTrees, errorGetInterpretedTrees, isLoadingInterpretedTrees, getAllInterpretedTrees} = useInterpretedTrees()
    const {clickTrees, errorGetClickTrees, isLoadingClickTrees, getAllClickTrees,} = useClickTrees()

    const {isLoadingEditClickableQuestionAnswer, editClickableQuestionAnswer} = useQuestions()

    const [selectedType, setSelectedType] = useState(CLICKABLE_IMAGE)
    const [selectedTree, setSelectedTree] = useState(null)
    const [selectedNode, setSelectedNode] = useState(null)
    const [selectedNodeSecond, setSelectedNodeSecond] = useState(null)
    const [showSubLeafs, setShowSubLeafs] = useState(false)

    const [api, contextHolder] = message.useMessage()

    useEffect(() =>{
        setSelectedType(type)

        setSelectedTree(null)
        setSelectedNode(null)
        setSelectedNodeSecond(null)
        setShowSubLeafs(false)

        getAllClickTrees()
        getAllInterpretedTrees()
    }, [])

    const renderSelectClickTreeAnswer = () => {
        if(selectedType === CLICKABLE_CHART) return <div/>;

        return (
            <div>
                {isLoadingClickTrees && <Skeleton />}

                {errorGetClickTrees && !isLoadingClickTrees &&
                    <ErrorComponent 
                        error={errorGetClickTrees}
                        onReload={() => getAllClickTrees()}
                    />}

                {!(isLoadingClickTrees && errorGetClickTrees) && clickTrees && 
                    <Select
                    onChange={(v, option) => {
                        const findSelectedTree = clickTrees.filter(t => t.Id === option.value)[0]

                        setSelectedTree(findSelectedTree)
                    }}
                    defaultValue={'please select'}
                    value={(selectedTree || {Name:'Please select'}).Name}
                    className='hq-full-width'
                    options={
                    (clickTrees || [])
                        .map((d) => ({
                        value: d.Id,
                        label: d.Name
                    }))
                }

                suffixIcon={<span>Selected tree</span>}

                />
                }

                {selectedTree && !showSubLeafs &&
                    <List 
                        dataSource={selectedTree.Images}

                        renderItem={(img) => {
                            const {Id, URL, Name, Leafs} = img

                            const isSelected = selectedNode && selectedNode.Id === img.Id

                            return(
                                <div 
                                    key={Id}
                                    className={"hq-full-width hq-clickable hoverable" + (isSelected ? " highlighted" : "")}
                                    onClick={() => {
                                        setSelectedNode(img)

                                        if(Leafs.length) {
                                            setShowSubLeafs(true)
                                        }
                                        
                                    }}
                                >
                                    <img 
                                        alt="node"
                                        src={URL}
                                        className="hq-img-size-1"
                                    />
                                    <small className="default-gray">{Name}</small>
                                </div>
                            )
                        }}
                        
                    />}

                    {selectedNode && showSubLeafs &&
                    <List 
                        dataSource={selectedNode.Leafs}

                        renderItem={(img) => {
                            const {Id, URL, Name} = img
                            const isSelected = selectedNodeSecond && selectedNodeSecond.Id === img.Id

                            return(
                                <div 
                                    key={Id}
                                    className={"hq-full-width hq-clickable hoverable" + (isSelected ? " highlighted" : "")}
                                    onClick={() => {
                                        setSelectedNodeSecond(img)
                                    }}
                                >
                                    <img 
                                        alt="node"
                                        src={URL}
                                        className="hq-img-size-1"
                                    />
                                    <small className="default-gray">{Name}</small>
                                </div>
                            )
                        }}
                        
                    />}
            </div>
        )
    }

    const renderSelectIntrpretedTreeAnswer = () => {
        if(selectedType === CLICKABLE_IMAGE) return <div/>;

        return (
            <div>
                {isLoadingInterpretedTrees && <Skeleton />}

                {errorGetInterpretedTrees && !isLoadingInterpretedTrees &&
                    <ErrorComponent 
                        error={errorGetInterpretedTrees}
                        onReload={() => getAllInterpretedTrees()}
                    />}

                {!(isLoadingInterpretedTrees && errorGetInterpretedTrees) && interpretedTrees && 
                    <Select
                    onChange={(v, option) => {
                        const findSelectedTree = interpretedTrees.filter(t => t.Id === option.value)[0]

                        setSelectedTree(findSelectedTree)
                    }}
                    defaultValue={'please select'}
                    value={(selectedTree || {Name:'Please select'}).Name}
                    className='hq-full-width'
                    options={
                    (interpretedTrees || [])
                        .map((d) => ({
                        value: d.Id,
                        label: d.Name
                    }))
                }

                suffixIcon={<span>Selected tree</span>}

                />
                }

                {selectedTree &&
                    <List 
                        dataSource={selectedTree.Images}

                        renderItem={(img) => {
                            const {Id, URL, Name} = img
                            const isSelected = selectedNode && selectedNode.Id === img.Id

                            return(
                                <div 
                                    key={Id}
                                    className={"hq-full-width hq-clickable hoverable" + (isSelected ? " highlighted" : "")}
                                    onClick={() => {
                                        setSelectedNode(img)
                                        
                                    }}
                                >
                                    <img 
                                        alt="node"
                                        src={URL}
                                        className="hq-img-size-1"
                                    />
                                    <small className="default-gray">{Name}</small>
                                </div>
                            )
                        }}
                        
                    />}

            </div>
        )
    }

    return(
        <Drawer
        title={
        <Space size={'large'}>
            <p>Select answer for element</p>

            <Button
                size="small"
                type="primary"

                loading={isLoadingEditClickableQuestionAnswer}

                onClick={() => {
                    const VM = ({
                        ...element,
                        IsImage: (type === CLICKABLE_IMAGE),
                        Answer: null,
                        AnswerId: (selectedNodeSecond || selectedNode).Id
                    })

                    editClickableQuestionAnswer(VM).then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                        reloadQuestion()
                        onClose()
                    }))
                }}
            >
                Update
            </Button>
        </Space>}
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {contextHolder}
        
            <Row gutter={[4,4]}>
                <Col xs={24}>
                    {renderSelectClickTreeAnswer()}
                </Col>
                <Col xs={24}>
                    {renderSelectIntrpretedTreeAnswer()}
                </Col>
            </Row>
        </Drawer>
    )
}