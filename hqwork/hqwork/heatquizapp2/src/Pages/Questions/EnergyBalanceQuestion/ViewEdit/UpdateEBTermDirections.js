import React, { useEffect, useState } from "react";
import {Button, Drawer, Space, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function UpdateEBTermDirections({open, onClose, ebTerm, reloadQuestion}) {

    if(!open) return <div/>;

    const {isLoadingEditEnergyBalanceEBT_Direction, editEnergyBalanceEBT_Direction} = useQuestions()

    const [api, contextHolder] = message.useMessage()

    const [northSelected, setNorthSelected] = useState(false)
    const [southSelected, setSouthSelected] = useState(false)
    const [eastSelected, setEastSelected] = useState(false)
    const [westSelected, setWestSelected] = useState(false)
    const [centerSelected, setCenterSelected] = useState(false)


    const renderItemBox = (t) => {
        const {Id, North: isNorthSelected, East: isEastSelected, West: isWestSelected, South: isSouthSelected, Center: isCenterSelected} = t

        const totalWidthHeight = 0.03*window.innerWidth
        const shapesGap = 0.1*totalWidthHeight
        const width1 = 0.125 * totalWidthHeight
        const width2 = totalWidthHeight - 2 * shapesGap - 2 * width1

        let selectedColor = 'rgba(2, 117, 216, 0.5)'

        const notSelectedStyle = {backgroundColor:'#f1f4f8', border:'1px solid #e6e6e6',}
        const selectedStyle = {backgroundColor:selectedColor, border:'1px solid #0275d8',} 

        return(
            <Space 
            key={Id}
            direction="vertical">
                <div style={{flexDirection:'row', display:'flex', width: totalWidthHeight, height:totalWidthHeight}}>
                
                    <div 
                        style={{width:width1, height: width2, marginRight:shapesGap, marginTop: (shapesGap + width1), ...(isEastSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* East */}
                    </div>

                    <div style={{width:width2, height: totalWidthHeight, marginRight:shapesGap}}>
                        <div 
                            style={{width:width2, height: width1, marginBottom:shapesGap, ...(isNorthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* North */}
                        </div>

                        <div
                            style={{width:width2, height: width2, marginBottom:shapesGap, ...(isCenterSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* Center */}
                        </div>

                        <div 
                            style={{width:width2, height: width1, ...(isSouthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* South */}
                        </div>
                    </div>

                    <div 
                        style={{width:width1, height: width2, marginTop: (shapesGap + width1), ...(isWestSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* West */}
                    </div>
                </div>
            </Space>
        )

    }

    const renderItemInteractionLine = (t) => {
        const totalWidthHeight = 0.08*window.innerWidth
        const shapesGap = 0.1*totalWidthHeight
        const width1 = 0.125 * totalWidthHeight
        const width2 = totalWidthHeight - 2 * shapesGap - 2 * width1

        let selectedColor = 'rgba(2, 117, 216, 0.5)'

        const notSelectedStyle = {backgroundColor:'#f1f4f8', cursor:'pointer', border:'1px solid #e6e6e6',} 
        const selectedStyle = {backgroundColor:selectedColor, cursor:'pointer', border:'1px solid #0275d8',} 

        return(
            <Space direction="vertical">
                <div style={{flexDirection:'row', display:'flex', width: totalWidthHeight, height:totalWidthHeight, border:'1px solid #f1f4f8'}}>
                
                    <div 
                            onClick={() => setEastSelected(!eastSelected)}
                            style={{width:width1, height: width2, marginRight:shapesGap, marginTop: (shapesGap + width1), ...(eastSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* East */}
                    </div>

                    <div style={{width:width2, height: totalWidthHeight, marginRight:shapesGap}}>
                        <div 
                            onClick={() => setNorthSelected(!northSelected)}
                            style={{width:width2, height: width1, marginBottom:shapesGap, ...(northSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* North */}
                        </div>

                        <div
                            onClick={() => setCenterSelected(!centerSelected)}
                            style={{width:width2, height: width2, marginBottom:shapesGap, ...(centerSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* Center */}
                        </div>

                        <div 
                            onClick={() => setSouthSelected(!southSelected)}
                            style={{width:width2, height: width1, ...(southSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* South */}
                        </div>
                    </div>

                    <div 
                            onClick={() => setWestSelected(!westSelected)}
                            style={{width:width1, height: width2, marginTop: (shapesGap + width1), ...(westSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* West */}
                    </div>
                </div>
            </Space>
        )

    }

    const {Code, Latex} = ebTerm

    return(
        <Drawer
        title="Update EB Term Directions"
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}

        footer={<div/>}
    >   
        {contextHolder}
        <small className="default-gray">Energy balance term & current directions</small>
        <br/>
        <br/>
        <Space>
            {renderItemBox(ebTerm)}
            <LatexRenderer latex={"$$" + Latex + "$$"}/>
            <p className="default-title">{Code}</p>
        </Space>
        <br/>
        <br/>
        <small className="default-gray">Select new direction(s)</small>
        <br/>
        <br/>
        {renderItemInteractionLine(ebTerm)}
        <br/>
        <br/>
        <br/>
        <Button 
            size="small"
            type="primary"

            loading={isLoadingEditEnergyBalanceEBT_Direction}

            onClick={() => {
                let data = new FormData()
                data.append("TermId", ebTerm.Id)

                data.append("West", westSelected)
                data.append("East", eastSelected)
                data.append("North", northSelected)
                data.append("South", southSelected)
                data.append("Center", centerSelected)
                data.append("IsDummy", false)

                editEnergyBalanceEBT_Direction(data).then(r => handleResponse(r, api, 'Updated', 1, () => {
                    reloadQuestion()
                }))
            }}
        >
            Update
        </Button>
    </Drawer>
    )
}