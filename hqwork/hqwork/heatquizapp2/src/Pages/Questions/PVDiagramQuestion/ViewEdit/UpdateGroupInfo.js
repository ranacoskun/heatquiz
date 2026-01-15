import React, { useEffect, useState } from "react";
import {Button, ColorPicker, Divider, Drawer, message, Space, Switch } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";
import { PlayPVDiagramQuestionInteractivePlot } from "../Shared/PlayPVDiagramQuestionInteractivePlot";
import Input from "antd/es/input/Input";

export function UpdateGroupInfo({open, onClose, group, reloadQuestion}) {

    if(!open) return <div/>;
    const [newCode, setNewCode] = useState('')

    const [newLineColor, setNewLineColor] = useState('')
    const [newLineWidth, setNewLineWidth] = useState(1)

    const [isClosedLoop, setIsClosedLoop] = useState(false)
    const [isPointsOnlyPlay, setIsPointsOnlyPlay] = useState(false)

    const {isLoadingEditPVDiagramQuestionGroupInfo,  editPVDiagramQuestionGroupInfo} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(open){
            const {Code, LineColor, LineWidth, IsClosedLoop, IsPointsOnlyPlay} = group

            setNewCode(Code)

            setNewLineColor(LineColor)
            setNewLineWidth(LineWidth)

            setIsClosedLoop(IsClosedLoop)
            setIsPointsOnlyPlay(IsPointsOnlyPlay)
        }
    }, [open])

    const {Code, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height} = group

    const smallWidth = 0.2 * window.innerWidth
    const resizeFactor = (smallWidth/Base_ImageURL_Width)

    const smallHeight = (Base_ImageURL_Height * resizeFactor)

    return(
        <Drawer
        title={
        <Space size="large">
            <p>Update Group Info</p>
            <Button 
                size="small"
                type="primary"

                loading={isLoadingEditPVDiagramQuestionGroupInfo}

                onClick={() => {
                    if(!newCode.trim()){
                        api.destroy()
                        api.warning("Please add code")
                        return
                    }

                    const VM = ({
                        ...group,
                        Code: newCode,
                        LineColor: newLineColor,
                        LineWidth: newLineWidth,
                    })

                    editPVDiagramQuestionGroupInfo(VM).then(r => handleResponse(r, api, "Updated successfuly", 1, () => {
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
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <Space align="start">
            <p className="default-title">{Code}</p>
            <PlayPVDiagramQuestionInteractivePlot 
                style={{width:smallWidth, height:smallHeight}}

                imageURL = {Base_ImageURL}

                groups = {[group].map(g => ({
                    ...g,
                     LineWidth: newLineWidth,
                    LineColor: newLineColor,
                    points: g.Points.map(p => ({
                        ...p,
                        name: p.Name,
                        color: p.InnerColor,
                        borderColor: p.OuterColor,
        
                        x: p.X * (resizeFactor),
                        y: p.Y * (resizeFactor),
                        cx:p.CX * (resizeFactor),
                        cy: p.CY * (resizeFactor),
        
                        marginX: Math.ceil(p.MarginX * (resizeFactor)),
                        marginY: Math.ceil(p.MarginY * (resizeFactor)) 
                })
            )}))}

            selectedGroupIndex = {null}

            onSelectedPointMove = {(pi) => {}}

            onPointMove = {(p) => {}}

            onSelectedCPPointMove = {(pi) => {}}

            onCPPointMove = {(p) => {}}

            selectedPointMoveIndex = {null}
            selectedCPPointMoveIndex = {null}

            highlightedPoint = {null}
            highlightedRelation = {null}

            showSolution = {true}
        />
        </Space>       
        <Divider/>
        <Space direction="vertical" size="large" align="start">
            <div>
                <p className="default-gray">Code</p>
                <Input
                    value={newCode}
                    className="hq-full-width"

                    onChange={(v) => {
                        const value = v.target.value

                        setNewCode(value)
                    }}
                />
            </div>
            <div>
                <p className="default-gray">Line color</p>
                <ColorPicker
                    value={newLineColor}
                    defaultValue={newLineColor} 
                    className="hq-full-width"

                    onChange={(c, h) => {
                        setNewLineColor(h)
                    }}
                    showText = {true}
                />
                <p className="highlighted">{newLineColor}</p>
            </div>
            <div>
                <p className="default-gray">Line width</p>
                <Input
                    value={newLineWidth}
                    className="hq-full-width"
                    type="number"
                    min="1"

                    onChange={(v) => {
                        const value = v.target.value

                        if(value < 0) return;

                        setNewLineWidth(value)
                    }}
                />
            </div>
            <div>
                <p className="default-gray">Points only play</p>

                <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={isPointsOnlyPlay}
                    onChange = {(c) => {}}
                />
            </div>
            <div>
                <p className="default-gray">Closed loop</p>

                <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={isClosedLoop}
                    onChange = {(c) => {}}
                />
            </div>
        </Space>
        
    </Drawer>
    )
}