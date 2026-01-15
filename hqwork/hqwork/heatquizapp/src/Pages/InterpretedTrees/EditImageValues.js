import { Button, Col, Divider, Drawer, Row, Select, Spin, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useInterpretedTrees } from "../../contexts/InterpretedTreesContext";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { handleResponse } from "../../services/Auxillary";

export function EditImageValues({open, onClose, node, reloadData}){
    const {loadingEditImageValues, editImageValues, 
        interpretedValues, errorGetInterpretedValues, isLoadingInterpretedValues, getAllInterpretedValues,
    } = useInterpretedTrees()
    
    

    const [messageApi, contextHolder] = message.useMessage();

    const [selectedLeft, setSelectedLeft] = useState(null)
    const [selectedRight, setSelectedRight] = useState(null)
    const [selectedRatio, setSelectedRatio] = useState(null)
    const [selectedJump, setSelectedJump] = useState(null)

    useEffect(() => {
        getAllInterpretedValues()

        if(!node) return;

        const {Left, Right, Jump, RationOfGradients} = node

        setSelectedLeft(Left)
        setSelectedRight(Right)
        setSelectedJump(Jump)
        setSelectedRatio(RationOfGradients)

    }, [open])

    const renderChooseValues = () => {
        if(errorGetInterpretedValues){
            return(
                <ErrorComponent 
                    error={errorGetInterpretedValues}
                    onReload={() => getAllInterpretedValues()}
                />
            )
        }

         const {Left, Right, Jump, RatioOfGradients} = interpretedValues

         return(
            <Row 
            gutter={16}>
                <Col xs = {3}>
                    <small className="default-gray">Left</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.Left.filter(v => v.Id === option.value)[0]

                            setSelectedLeft(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedLeft || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                        Left.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
                <Col xs = {3}>
                    <small className="default-gray">Right</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.Right.filter(v => v.Id === option.value)[0]

                            setSelectedRight(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedRight || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                            Right.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
                <Col xs = {3}>
                    <small className="default-gray">Jump</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.Jump.filter(v => v.Id === option.value)[0]

                            setSelectedJump(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedJump || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                            Jump.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
                <Col xs = {3}>
                    <small className="default-gray">Ratio</small>
                    <Select
                        onChange={(v, option) => {
                            const findOption = interpretedValues.RatioOfGradients.filter(v => v.Id === option.value)[0]

                            setSelectedRatio(findOption)
                        }}
                        defaultValue={'select'}
                        value={(selectedRatio || {Value:'select'}).Value}
                        className="add-interpreted-images-values-bar"
                        options={
                            RatioOfGradients.map((d) => ({
                            value: d.Id,
                            label: d.Value
                        }))
                    }
                    />
                </Col>
            </Row>
         )
    }


    return(
        <div>
            {contextHolder}
            <Drawer
                title={"Edit Node Values"}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >   
                {isLoadingInterpretedValues && <Spin />}
                {!isLoadingInterpretedValues && interpretedValues && renderChooseValues()}
                <br/>

                <Button 
                    type="primary"
                    onClick={() => {
                        if(!(selectedLeft && selectedRight && selectedRatio && selectedJump)){
                            messageApi.destroy()
                            messageApi.warning('Please select values')
                        }
                       
                        let data = new FormData()
                        data.append('ImageId', node.Id)

                        data.append('LeftId', selectedLeft.Id)
                        data.append('RightId', selectedRight.Id)
                        data.append('RatioId', selectedRatio.Id)
                        data.append('JumpId', selectedJump.Id)

                        editImageValues(data).then((r) => handleResponse(r, messageApi, 'Updated successfully', 1, () => {
                            reloadData()
                            onClose()
                       }))
                        
                    }}
                    loading = {loadingEditImageValues || isLoadingInterpretedValues}
                >
                Update
                </Button>
                <Divider />
                <small className="default-gray">Node </small>
                <p className="default-title">
                    {(node || {}).Code} 
                </p>
            </Drawer>
        </div>
    )
}