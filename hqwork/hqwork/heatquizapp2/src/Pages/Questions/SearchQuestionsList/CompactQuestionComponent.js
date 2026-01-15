import React from "react";
import { Col, Space, Tooltip } from "antd";
import {beautifyDate, beautifyNumber } from "../../../services/Auxillary";
import {ClockCircleOutlined, AreaChartOutlined} from '@ant-design/icons';

import './SearchQuestionsList.css'
import { QUESTION_TYPES_SEARCH_NAMES } from "../List/constants";


export function CompactQuestionComponent({q, qi, firstIndex, selectedQuestions, onRenderCode}){

    const {MedianPlayTime, TotalGames, TotalCorrectGames, Code, Base_ImageURL, AddedByName, DateCreated , Type, Subtopic, LevelOfDifficulty} = q  

    const correctPlayPerc = (TotalGames ? (100 *  (TotalCorrectGames/(TotalGames || 1))).toFixed(0) + '%' : '')

    const qType = QUESTION_TYPES_SEARCH_NAMES.filter(a => a.value === Type)[0].label
    const qTopic = Subtopic.Topic.Name

    const questionIsSelected = selectedQuestions.map(a => a.Id).includes(q.Id)

    return (
        <Col 
            key={q.Id}
            xs={6}>
                <div
                    className={"series-edit-view-element" + (questionIsSelected ? " question-list-component-item-selected" : '')}
                >
                    <div
                        className="series-edit-view-element-internal"
                    >
                            {onRenderCode(q, qi+firstIndex+1)}

                            <p className="series-edit-view-element-other-info">{AddedByName}</p>
                            <p className="series-edit-view-element-other-info">{beautifyDate(DateCreated)}</p>


                            <img
                                alt={Code}
                                src={Base_ImageURL}
                                className="series-edit-view-element-img"
                            />
                            <div className="series-edit-view-element-other-info">
                                            
                                <Space
                                    size={'large'}
                                >   
                                    <p>{qType}</p>
                                    <p>-</p>
                                    <p>{qTopic}</p>
                                    <p>-</p>
                                    <p style={{borderBottom:1, borderBottomStyle:'solid', borderBottomColor:LevelOfDifficulty.HexColor}}>{LevelOfDifficulty.Name}</p>
                                </Space>
                                <Space
                                    size={'large'}
                                >
                                    <Space>
                                        <AreaChartOutlined  style={{color:'green'}}/>
                                        <Tooltip
                                            title='Success rate (%)'
                                        >
                                        <p>{correctPlayPerc}</p>
                                        </Tooltip>
                                    </Space>
                                    <Space size={'large'}>
                                        <Tooltip
                                            title='Total play'
                                        >
                                        <p>{beautifyNumber(q.TotalGames)}</p>
                                        </Tooltip>
                                                    
                                    </Space>

                                    <Space>
                                        <ClockCircleOutlined />
                                        <Tooltip
                                            title='Median play time (seconds)'
                                        >
                                        <p>{MedianPlayTime}
                                        <i><small>{' '}seconds </small></i>
                                        </p>
                                        </Tooltip>
                                    </Space>
                                </Space>

                            </div>
                        </div>
                    </div>
                </Col>)
}