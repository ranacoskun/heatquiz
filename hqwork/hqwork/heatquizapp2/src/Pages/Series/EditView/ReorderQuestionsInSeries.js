import { Button, Drawer, Row, Space, Tooltip, message } from "antd";
import React, {useEffect, useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { CompactQuestionComponent } from "../../Questions/SearchQuestionsList/CompactQuestionComponent";
import { useSeries } from "../../../contexts/SeriesContext";
import { handleResponse } from "../../../services/Auxillary";

export function ReorderQuestionsInSeries({open, onClose, Series, reloadSeries}){

    if(!open) return <div/>;

    const {isLoadingRearrangeSeries, rearrangeSeries} = useSeries()

    const [movingIndex, setMovingIndex] = useState(null)
    const [selectedQuestions, setSelectedQuestions] = useState([])

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(!Series || !Series.Elements) return;

        const {Elements} = Series

        let questions = Elements
        .sort((b, a) => b.Order - a.Order)

        const {Stats} = Series

        if(Stats){
            questions = questions.map((e, ei) => ({
                ...e,
                Question:{
                    ...e.Question,
                     MedianPlayTime: Stats[Elements[ei].Id].MedianPlayTime,
                    TotalGames: Stats[Elements[ei].Id].TotalPlay,
                    TotalCorrectGames:Stats[Elements[ei].Id].TotalSuccessPlay}
            }))
        }
        setSelectedQuestions(questions)
    },[open])

    const renderSelectedQuestions = () => {

        return(
            <div>
                <Row
                    gutter={[12, 12]}
                >
                    {selectedQuestions
                    .sort((b, a) => b.Order - a.Order)
                    .map((q, qi) => 
                        (
                            <CompactQuestionComponent 
                                q={q.Question}
                                selectedQuestions={[]}
                                qi={qi}
                                firstIndex={0}

                                onRenderCode = {(q, i) => {
                                    const isSelectedForMoving = (qi === movingIndex)

                                    return(
                                    <Tooltip
                                        color="white"
                                        title={<p>Click to select</p>}
                                    >
                                        <p 
                                        className={"default-title hoverable " + (isSelectedForMoving ? "series-edit-view-element-selected-moving" : "series-edit-view-element-code")} 
                                        onClick={() => {
                                            if(movingIndex !== null){
                                                if(isSelectedForMoving){
                                                    setMovingIndex(null)
                                                    return
                                                }

                                                const _selectedQuestions = [...selectedQuestions]
                                                const finalSelectedQuestions = [...selectedQuestions]

                                                const current= _selectedQuestions[movingIndex].Order
                                                const other= _selectedQuestions[qi].Order

                                                finalSelectedQuestions[movingIndex].Order = other
                                                finalSelectedQuestions[qi].Order = current

                                                setSelectedQuestions(finalSelectedQuestions)
                                                setMovingIndex(null)

                                            }
                                            else{
                                                setMovingIndex(qi)
                                            }
                                        }}>{i}{' '}{q.Code}</p>
                                    </Tooltip>)

                                }}
                            />
                        )
                    )}
                </Row> 
            </div>
        )
    }

    return(
        <div>
            {contextHolder}
        <Drawer
        title={
            <Space size={'large'}>
                <p>Reorder questions in series</p>

                <Button
                    size='small'
                    type='primary'
                    onClick={() => {
                        const VM = ({
                            ...Series,
                            Elements: selectedQuestions
                        })

                        rearrangeSeries(VM)
                        .then((r) => handleResponse(r, api, 'Updated successfully', 1, () => {
                            reloadSeries()
                            onClose()
                        }))
                    }}

                    loading={isLoadingRearrangeSeries}
                >
                        Update ordering
                </Button>

                {(movingIndex !== null) &&
                        <Space>
                            <Button
                                size='small'
                                disabled={movingIndex === 0}
                                onClick={() => {

                                    const _selectedQuestions = [...selectedQuestions]
                                    const finalSelectedQuestions = [...selectedQuestions]

                                    const current= _selectedQuestions[movingIndex].Order
                                    const other= _selectedQuestions[movingIndex-1].Order

                                    finalSelectedQuestions[movingIndex].Order = other
                                    finalSelectedQuestions[movingIndex-1].Order = current

                                    setSelectedQuestions(finalSelectedQuestions)
                                    setMovingIndex(movingIndex-1)
                                }}
                            >
                                Move left
                            </Button>
                            <Button
                                size='small'
                                disabled={(movingIndex+1) === selectedQuestions.length}
                                onClick={() => {
                                    const _selectedQuestions = [...selectedQuestions]
                                    const finalSelectedQuestions = [...selectedQuestions]

                                    const current= _selectedQuestions[movingIndex].Order
                                    const other= _selectedQuestions[movingIndex+1].Order

                                    finalSelectedQuestions[movingIndex].Order = other
                                    finalSelectedQuestions[movingIndex+1].Order = current

                                    setSelectedQuestions(finalSelectedQuestions)
                                    setMovingIndex(movingIndex+1)
                                }}
                            >
                                Move right
                            </Button>
                        </Space>}
            </Space>
        }
        width={'100%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {renderSelectedQuestions()}
        </Drawer>
        </div>
    )
}