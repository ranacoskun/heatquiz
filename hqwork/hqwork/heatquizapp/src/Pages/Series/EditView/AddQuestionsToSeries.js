import { Button, Divider, Drawer, Dropdown, Empty, Row, Space, message } from "antd";
import React, {useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { SearchQuestionsList } from "../../Questions/SearchQuestionsList";
import {ForwardOutlined} from '@ant-design/icons';
import { CompactQuestionComponent } from "../../Questions/SearchQuestionsList/CompactQuestionComponent";
import {DeleteOutlined} from '@ant-design/icons';
import { QUESTION_TYPES_SEARCH_NAMES } from "../../Questions/List/constants";
import { useSeries } from "../../../contexts/SeriesContext";
import { handleResponse } from "../../../services/Auxillary";

export function AddQuestionsToSeries({open, onClose, Series, reloadSeries, selectedQuestions, onSelectQuestions}){
    if(!open) return <div/>;

    const {isLoadingAddQuestionsToSeries, addQuestionsToSeries} = useSeries()

    const [selectingQuestions, setSelectingQuestions] = useState(true)
    const [isMovingElements, setIsMovingElements] = useState(false)
    const [movingIndex, setMovingIndex] = useState(null)

    const existingQuestions = Series.Elements.map(e => e.QuestionId)

    const [api, contextHolder] = message.useMessage()

    const elementActionList = (q) => [{
        key: 'remove_element',
        label: 'Remove from series',
        icon: <DeleteOutlined /> ,
        onClick: () => {
            let _selectedQuestions = [...selectedQuestions]
            _selectedQuestions = _selectedQuestions.filter(a => a.Id !== q.Id)

            onSelectQuestions(_selectedQuestions)
        }
    }]

    const renderSelectedQuestions = () => {

        const qTypes = selectedQuestions
        .map((q) => QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === q.Type)[0].label)
        .sort((a, b) => a - b)
        .reduce((r, c) => {
            if(r[c]){
                r[c] += 1
            }
            else{
                r[c] = 1
            }

            return r
        }, {})

        const qTopics = selectedQuestions
        .map((q) => q.Subtopic.Topic.Name)
        .sort((a, b) => a - b)
        .reduce((r, c) => {
            if(r[c]){
                r[c] += 1
            }
            else{
                r[c] = 1
            }

            return r
        }, {})

        const qLODs = selectedQuestions
        .map((q) => q.LevelOfDifficulty.Name)
        .sort((a, b) => a - b)
        .reduce((r, c) => {
            if(r[c]){
                r[c] += 1
            }
            else{
                r[c] = 1
            }

            return r
        }, {})

        const qTime = selectedQuestions
        .map((q) => q.MedianPlayTime)

        const minQTime = Math.min(...qTime)
        const maxQTime = Math.max(...qTime)

        return(
            <div>
                
                {selectedQuestions.length ?
                <Space 
                className="series-edit-view-add-questions"
                size={'large'}>
                    <Space
                        direction='vertical'
                    >
                        <Button
                            size='small'
                            type={isMovingElements ? 'primary' :'default'}
                            onClick={() => setIsMovingElements(a => !a)}
                        >
                            Move elements
                        </Button>
                        {isMovingElements && (movingIndex !== null) &&
                        <Space>
                            <Button
                                size='small'
                                disabled={movingIndex === 0}
                                onClick={() => {

                                    const _selectedQuestions = [...selectedQuestions]
                                    const finalSelectedQuestions = [...selectedQuestions]

                                    const current= _selectedQuestions[movingIndex]
                                    const other= _selectedQuestions[movingIndex-1]

                                    finalSelectedQuestions[movingIndex] = other
                                    finalSelectedQuestions[movingIndex-1] = current

                                    onSelectQuestions(finalSelectedQuestions)
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

                                    const current= _selectedQuestions[movingIndex]
                                    const other= _selectedQuestions[movingIndex+1]

                                    finalSelectedQuestions[movingIndex] = other
                                    finalSelectedQuestions[movingIndex+1] = current

                                    onSelectQuestions(finalSelectedQuestions)
                                    setMovingIndex(movingIndex+1)
                                }}
                            >
                                Move right
                            </Button>
                        </Space>}
                    </Space>

                    <Space direction="vertical">
                        {Object.keys(qTypes).map(k => <Space className="series-edit-view-element-other-info"><small>{k}s</small> <small>{qTypes[k]}</small></Space>)}
                    </Space>

                    <Space direction="vertical"> 
                        {Object.keys(qTopics).map(k => <Space className="series-edit-view-element-other-info"><small>{k}</small> <small>{qTopics[k]}</small></Space>)}
                    </Space>

                    <Space direction="vertical">
                        {Object.keys(qLODs).map(k => <Space className="series-edit-view-element-other-info"><small>{k}</small> <small>{qLODs[k]}</small></Space>)}
                    </Space>
                    <Space className="series-edit-view-element-other-info">
                        <small>Median play time</small>
                        <small>({minQTime} - {maxQTime}) {' '}<i>seconds</i></small>
                    </Space>

                    <Space>
                        <Button
                            size="small"
                            type="primary"
                            loading={isLoadingAddQuestionsToSeries}
                            onClick={() => {
                                const VM = ({
                                    ...Series,
                                    Elements: selectedQuestions.map((q, i) => ({
                                        Order: i + 1,
                                        QuestionId: q.Id
                                    }))
                                })

                                addQuestionsToSeries(VM)
                                .then(
                                    (r) => 
                                    handleResponse(r, api, 'Questions added successfully', 1, () => {
                                        reloadSeries()
                                        onClose()
                                    }))
                            }}
                        >
                            Add questions
                        </Button>
                    </Space>
                </Space> : <div/>}

                <Divider/>

                {selectedQuestions.length ? 
                <Row
                    gutter={[12, 12]}
                >
                    {selectedQuestions.map((q, qi) => 
                        (
                            <CompactQuestionComponent 
                                q={q}
                                selectedQuestions={selectedQuestions}
                                qi={qi}
                                firstIndex={0}

                                onRenderCode = {(q, i) => {

                                    if(!isMovingElements){
                                        return(
                                            <Dropdown
                                                menu={{
                                                    items:elementActionList(q),
                                                    title:'Actions'
                                                }}
                                            >
                                                <p className="series-edit-view-element-code hoverable-plus">{i}{' '}{q.Code}</p>
                                            </Dropdown>
                                        )
                                    }
                                    else{
                                        const isSelectedForMoving = (qi === movingIndex)

                                        return(
                                        <p 
                                        className={isSelectedForMoving ? "series-edit-view-element-selected-moving" : "series-edit-view-element-code hoverable-plus"} 
                                        onClick={() => {
                                            if(movingIndex !== null){
                                                if(isSelectedForMoving){
                                                    setMovingIndex(null)
                                                    return
                                                }

                                                const _selectedQuestions = [...selectedQuestions]
                                                const finalSelectedQuestions = [...selectedQuestions]

                                                const current= _selectedQuestions[movingIndex]
                                                const other= _selectedQuestions[qi]

                                                finalSelectedQuestions[movingIndex] = other
                                                finalSelectedQuestions[qi] = current

                                                onSelectQuestions(finalSelectedQuestions)
                                                setMovingIndex(null)

                                            }
                                            else{
                                                setMovingIndex(qi)
                                            }
                                        }}>{i}{' '}{q.Code}</p>)
                                    }

                                }}
                            />
                        )
                    )}
                </Row>
                :
                <Space
                    align="center"
                >
                    <Empty
                        description="No questions selected"
                    />
                </Space>} 
            </div>
        )
    }

    return(
        <div>
        {contextHolder}
            <Drawer
            title={
                <Space size={'large'}>
                    <p>Add questions to series</p>

                    <Space>
                        <Button
                            size='small'
                            type={selectingQuestions ? 'primary' : 'default'}
                            onClick={() => {
                                setIsMovingElements(false)
                                setMovingIndex(null)
                                setSelectingQuestions(true)}
                            }
                        >
                            Select questions
                        </Button>
                        <Button
                            size="small"
                            type={!selectingQuestions ? 'primary' : 'default'}
                            onClick={() => setSelectingQuestions(false)}
                        >
                            {'View questions ('}{selectedQuestions.length}{') '} <ForwardOutlined /> {' Add'}
                        </Button>
                    </Space>
                </Space>
            }
            width={'100%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
                {selectingQuestions 
                && 
                <SearchQuestionsList
                    selectedQuestions={selectedQuestions}
                    onSelectQuestions={onSelectQuestions}
                    forbiddenQuestions = {existingQuestions}
                />}

                {!selectingQuestions && renderSelectedQuestions()}
            </Drawer>
        </div>
    )
}