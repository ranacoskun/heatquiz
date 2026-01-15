import React, { useEffect, useState } from "react";
import { Drawer, Timeline, Space, Pagination, Dropdown, Skeleton } from "antd";
import {ArrowLeftOutlined, InsertRowLeftOutlined, SolutionOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';
import { useReports } from "../../contexts/ReportsContext";
import './PlayerTimeline.css'
import { beautifyDatetime } from "../../services/Auxillary";
import { useNavigate } from "react-router-dom";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { QuestionPlayPocket } from "../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { SeriesPlayPocket } from "../Series/Play/SeriesPlayPocket";

const QUESTION_TYPE = 0
const SERIES_TYPE = 2

export function PlayerTimeline({open, onClose, selectedPlayer}){

    const {
        loadingPlayerTimelineReport, getPlayerTimelineReportError, playerTimelineReport, getPlayerTimelineReport
    } = useReports()

    const navigate = useNavigate()

    const [seriesRefs, setSeriesRefs] = useState([])
    const [currentSeriesIndex, setCurrentSeriesIndex] = useState(1)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)

    const [showPlaySeriesModal, setShowPlaySeriesModal] = useState(false)
    const [selectedSeries, setSelectedSeries] = useState({Code:''})

    const {Code: player} = selectedPlayer

    useEffect(() => {
        if(open){
            setSeriesRefs([])
            setCurrentSeriesIndex(1)

            getPlayerTimelineReport(selectedPlayer)
        }

    }, [open])

    useEffect(() => {
        let newSeriesRefs = []

        if(playerTimelineReport){
            playerTimelineReport
            .filter((s) => s.Type === SERIES_TYPE)
            .forEach(() => {
                const newRef = React.createRef()
                newSeriesRefs.push(newRef)
            })
        }
       
        setSeriesRefs(newSeriesRefs)
        setCurrentSeriesIndex(1)

    }, [playerTimelineReport])


    const onSeriesChange = (p) => {
        seriesRefs[p-1]
        .current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start"
        })

        setCurrentSeriesIndex(p)
    }   

    const questionActionList = (q) => [{
        key: 'view_edit_question',
        label: 'View edit question',
        icon: <EditOutlined/>,
        onClick: () => navigate('/question_view_edit/'+q.Id+'/'+q.Type)
    },
    {
        key: 'play_question',
        label: 'Play question',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowPlayQuestionModal(true)
        }
    }]

    const seriesActionList = (s) => [{
        key: 'view_edit_series',
        label: 'View edit series',
        icon: <EditOutlined/>,
        onClick: () => navigate('/series_edit_view/'+s.Code)
    },
    {
        key: 'play_series',
        label: 'Play series',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setShowPlaySeriesModal(true)
            setSelectedSeries(s)
        }
    }]
    
    return(
        <div>
            <Drawer
                title={
                <div className="hq-opposite-arrangement">
                    <p>Player timeline:  {' ' + player}</p>

                    {seriesRefs.length ? 
                    <Space size={'middle'}>
                        <p>Series {' '}</p>
                        <Pagination
                            simple 
                            defaultCurrent={1} 
                            total={seriesRefs.length} 
                            current={currentSeriesIndex}
                            onChange={onSeriesChange}
                            pageSize={1}
                        />
                    </Space> : <div/>}
                </div>}
                width={'50%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
            >
            {loadingPlayerTimelineReport && <Skeleton/>}

            {getPlayerTimelineReportError && !loadingPlayerTimelineReport && 
                <ErrorComponent 
                    error={getPlayerTimelineReportError}
                    onReload={() => getPlayerTimelineReport(selectedPlayer)}
                />
            }

            <div>
            {!loadingPlayerTimelineReport && playerTimelineReport && 
                <Timeline 
                    items={playerTimelineReport.map((r, ri) => {
                        const {
                            Type, Correct, DateCreated, Score, TotalTime,
                            SeriesCode, SeriesId,
                            QuestionId, QuestionCode, QuestionType, ImageURL,
                            Map, MapKey, MapElement
                        } = r

                        const seriesIndex = 
                        playerTimelineReport.slice(0, ri)
                        .filter((s) => s.Type === SERIES_TYPE)
                        .length

                        if(Type === QUESTION_TYPE) {
                            return({
                                color: Correct ? 'green' : 'red',
                                children: (
                                    <>
                                        <div className="hq-opposite-arrangement">
                                            <div>
                                                
                                                <Dropdown
                                                    menu={{
                                                        items:questionActionList(({
                                                            Id: QuestionId,
                                                            Type: QuestionType
                                                        })),
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <p className="default-title hoverable">{QuestionCode}</p>
                                                </Dropdown>
                                                <small className="player-timeline-datetime-score">
                                                    {Score} 
                                                    {' '} - {' '}{TotalTime}{' '} s                                                
                                                </small>
                                            </div>
                                            <div>
                                                <p className="player-timeline-datetime-score">{beautifyDatetime(DateCreated)}</p>
                                                {MapKey && 
                                                <Space size={'small'}>
                                                        <SolutionOutlined className="default-orange"/>
                                                        <small className="player-timeline-datetime-score">
                                                            {MapKey}
                                                        </small>
                                                </Space>
                                                }
                                                
                                            </div>
                                        </div>
                                        <img 
                                            src={ImageURL}
                                            className="question-image-player-timeline"
                                            alt={QuestionCode}
                                        />
                                    </>
                                )
                            })
                        }

                        else if(Type === SERIES_TYPE){
                            return({
                                color: 'blue',
                                dot:<InsertRowLeftOutlined />,
                                children: (
                                    <div 
                                        ref={seriesRefs[seriesIndex]}
                                        className="player-timeline-series-line"
                                    >
                                        <div className="hq-opposite-arrangement">
                                            <div>
                                                <Dropdown
                                                    menu={{
                                                        items:seriesActionList(({
                                                            Id: SeriesId,
                                                            Code: SeriesCode
                                                        })),
                                                        title:'Actions'
                                                    }}
                                                >
                                                <p className="default-title hoverable">{SeriesCode}</p>
                                                </Dropdown>
                                                <small className="player-timeline-datetime-score">
                                                    {Score} 
                                                    {' '} - {' '}{TotalTime}{' '} s                                                
                                                </small>
                                            </div>
                                            <div>
                                                <p className="player-timeline-datetime-score">{beautifyDatetime(DateCreated)}</p>
                                                {MapKey && 
                                                <Space size={'small'}>
                                                        <SolutionOutlined className="default-orange" />
                                                        <small className="player-timeline-datetime-score">
                                                            {MapKey}
                                                        </small>
                                                </Space>
                                                }
                                                
                                            </div>
                                        </div>
                                        <div className="hq-opposite-arrangement">
                                            <p>{Map} {' / '} {MapElement}</p>
                                        </div>
                                        <br/>
                                    </div>
                                )
                            })
                        }
                        else return null
                    }).filter(a => a)}
                />
            }
            </div>
            </Drawer>

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />

            <SeriesPlayPocket 
                open={showPlaySeriesModal}
                onClose={() => setShowPlaySeriesModal(false)}
                Code={selectedSeries.Code}
            />
        </div>
    )
}