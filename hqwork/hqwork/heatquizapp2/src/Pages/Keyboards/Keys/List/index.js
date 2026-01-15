import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { Col, Divider, Dropdown, Row, Skeleton, Space, Tooltip } from "antd";
import { KeysSearchTool } from "../../Shared/KeysSearchTool";
import { useState } from "react";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { useKeyboard } from "../../../../contexts/KeyboardContext";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { beautifyDate } from "../../../../services/Auxillary";
import { NUMERIC_KEY, VARIABLE_KEY } from "../../../../Components/Keyboard/constants";
import {PlusOutlined} from '@ant-design/icons';
import { AddVariableKeyVariant } from "./AddVariableKeyVariant";


export function KeysList(){
    const { keys, errorGetKeys, isLoadingKeys } = useKeyboard()


    const [firstIndex, setFirstIndex] = useState(0)

    const [showAddVariant, setShowAddVariant] = useState(false)
    const [selectedKey, setSelectedKey] = useState(null)

    const keyActionList = (k) => [
        k.Type === VARIABLE_KEY &&
        {
        label:'Add variant',
        key:'add_variant',
        icon: <PlusOutlined style={{color:'green'}} />,
        onClick: () => {
            setSelectedKey(k)
            setShowAddVariant(true)
        }
    }].filter(a => a)
    
    const renderKeys = () => {
        const {Keys} = keys

        return(
            <Row 
            gutter={[4,4]}
            className="hq-full-width">
                {Keys.map((k, ki) => {
                    const {Id, Type, DateCreated, Code, TextPresentation, List, VarKeys} = k

                    const variants = VarKeys.map(a => a.TextPresentation)
                    
                    return(
                        <Col 
                            xs={9}
                            key={Id}
                            className="hq-full-width hq-element-container"
                        >
                            <Space align="start">
                                <Space direction="vertical" align="start">
                                    <Space>
                                        <p className="default-gray">{ki + 1 + firstIndex}</p>
                                        <Dropdown
                                            menu={{
                                                title:'Actions',
                                                items:keyActionList(k)
                                            }}
                                        >
                                            <p className="default-title hoverable">{Code}</p>
                                        </Dropdown>
                                    </Space>

                                    <Space direction="vertical" align="start">
                                        <p className="default-gray">{List}</p>
                                        <p className="default-gray">{beautifyDate(DateCreated)}</p>
                                    </Space>
                                </Space>

                                &nbsp;
                                &nbsp;
                                &nbsp;

                                {Type === NUMERIC_KEY ?
                                <LatexRenderer
                                    latex={"$$" + TextPresentation + "$$"}
                                />
                                :
                                <Tooltip
                                    color="white"
                                    title={
                                        <div>
                                            <Row 
                                            gutter={[2,2]}
                                            className="hq-full-width" direction="vertical">
                                                {variants.map((v, vi) => 
                                                    <Col key={vi} className="hq-element-container">
                                                        <Space >
                                                            &nbsp;
                                                            &nbsp;
                                                            <LatexRenderer 
                                                                className={"default-black"}
                                                                latex={"$$" + v + "$$"}
                                                            />
                                                            &nbsp;
                                                            &nbsp;
                                                        </Space>
                                                    </Col>
                                                )}
                                            </Row>
                                        </div>
                                    }
                                >
                                    <Space>
                                        <LatexRenderer
                                            latex={"$$" + TextPresentation + "$$"}
                                        />
                                    </Space>
                                </Tooltip>
                                }
                            </Space>
                        </Col>
                    )
                })}
            </Row>
        )
        
    }

    return(
        <PagesWrapper>
            <Divider orientation="left">
                Keys
            </Divider>

            <KeysSearchTool 
                onSetFirstIndex={(i) => setFirstIndex(i)}
            />

            <br/>
            {isLoadingKeys && <Skeleton />}

            {errorGetKeys && !isLoadingKeys && 
                <ErrorComponent 
                    error={errorGetKeys}
                    onReload = {() => window.location.reload()}
                />
            }

            {!(isLoadingKeys ||  errorGetKeys) && keys && renderKeys()}

            <AddVariableKeyVariant 
                open={showAddVariant}
                onClose={() => setShowAddVariant(false)}
                variableKey={selectedKey}
            />
        </PagesWrapper>
    )
}