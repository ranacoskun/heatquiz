import {Col, Drawer, List, Row, Select, Skeleton, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';

import { CLICKABLE_CHART, CLICKABLE_IMAGE } from "./Constants";
import { useInterpretedTrees } from "../../../../contexts/InterpretedTreesContext";
import { useClickTrees } from "../../../../contexts/ClickTreesContext";
import { useEffect } from "react";
import { ErrorComponent } from "../../../../Components/ErrorComponent";

export function SetElementAnswer({open, onClose, elementIndex, onSelect}){

    if(!open) return <div/>;

    const {interpretedTrees, errorGetInterpretedTrees, isLoadingInterpretedTrees, getAllInterpretedTrees} = useInterpretedTrees()
    const {clickTrees, errorGetClickTrees, isLoadingClickTrees, getAllClickTrees,} = useClickTrees()

    const [selectedType, setSelectedType] = useState(CLICKABLE_IMAGE)
    const [selectedTree, setSelectedTree] = useState(null)
    const [selectedNode, setSelectedNode] = useState(null)
    const [showSubLeafs, setShowSubLeafs] = useState(false)

    const [api, contextHolder] = message.useMessage()

    useEffect(() =>{
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

                            return(
                                <div 
                                    key={Id}
                                    className={"hq-full-width hq-clickable hoverable"}
                                    onClick={() => {
                                        setSelectedNode(img)

                                        if(Leafs.length) {
                                            setShowSubLeafs(true)
                                        }
                                        else{
                                            onSelect(CLICKABLE_IMAGE, img)
                                            onClose()
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

                            return(
                                <div 
                                    key={Id}
                                    className={"hq-full-width hq-clickable hoverable"}
                                    onClick={() => {
                                        onSelect(CLICKABLE_IMAGE, img)
                                        onClose()
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

                            return(
                                <div 
                                    key={Id}
                                    className={"hq-full-width hq-clickable hoverable"}
                                    onClick={() => {
                                        onSelect(CLICKABLE_CHART, img)
                                        onClose()
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
        title={"Select answer for element #" + elementIndex}
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {contextHolder}
        
            <Row gutter={[4,4]}>
                <Col xs={12}>
                    <Select
                        className="hq-full-width"
                        onChange={(v, option) => {
                            setSelectedType(v)
                            setSelectedTree(null)
                            setSelectedNode(null)
                            setShowSubLeafs(false)
                        }}
                        defaultValue={'please select'}
                        value={selectedType}
                        options={([CLICKABLE_IMAGE, CLICKABLE_CHART]).map((d) => ({
                            value: d,
                            label: d
                        }))}

                        suffixIcon={<span>Answer type</span>}
                    />
                </Col>
                <Col xs={12}>
                    {renderSelectClickTreeAnswer()}
                    {renderSelectIntrpretedTreeAnswer()}
                </Col>
                
            </Row>
        </Drawer>
    )
}