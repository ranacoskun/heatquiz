import React from "react";
import { useAuth } from "../../contexts/AuthContext";

import "./Dashboard.css"
import { useAssistanceObjects } from "../../contexts/AssistanceObjectsContext";
import { useState } from "react";
import { useEffect } from "react";
import {DatePicker, Drawer, Dropdown, List, Skeleton, Space, Tooltip } from "antd";
import dayjs from 'dayjs';
import { ErrorComponent } from "../../Components/ErrorComponent";

import {FilePdfOutlined, CaretRightOutlined, TrophyOutlined, FireFilled, DislikeOutlined, ControlOutlined, ArrowLeftOutlined, UndoOutlined, ApartmentOutlined, BugOutlined, CarOutlined} from '@ant-design/icons';
import { goToMapPlay } from "../../services/Auxillary";
import { SeriesPlayFake } from "../../Components/SeriesPlay/SeriesPlayFake";
const { RangePicker } = DatePicker;

export function StudentInfoDashboard(){
    const {currentPlayerKey} = useAuth()

    const {
        isLoadingGetStudentDashboardInfo, getStudentDashboardInfo, getStudentDashboardInfoResult: studentStats, errorGetStudentDashboardInfo: dataError,
      
        getDashboardRandomQuestionsResult: randomQuestions, isLoadingGetDashboardRandomQuestions, getDashboardRandomQuestions,
      
        getDashboardWorstPlayedQuestionsResult: worstPlayedQuestions, isLoadingGetDashboardWorstPlayedQuestions, getDashboardWorstPlayedQuestions
    } = useAssistanceObjects()

    const [fromDate, setFromDate] = useState(dayjs().add(-7, 'd')) 
    const [toDate, setToDate] = useState(dayjs().add(1, 'd')) 
    const [normalRange, setNormalRange] = useState(true) 

    const [showEditDate, setShowEditDate] = useState(false)

    const [showPlayQuestions, setShowPlayQuestions] = useState(false)

    const [isQuestionsRandom, setIsQuestionsRandom] = useState(true)
    const [selectedDatapool, setSelectedDatapool] = useState(null)

    const getData = () => {
        const data = new FormData()

        data.append("Player", currentPlayerKey)

        data.append("DateFrom", fromDate.format('DD.MM.YYYY HH:mm:ss'))
        data.append("DateTo", toDate.format('DD.MM.YYYY HH:mm:ss'))
    
        getStudentDashboardInfo(data)
    }

    useEffect(() => {
        

        if(currentPlayerKey){
            getData()
        }
    }, [currentPlayerKey, fromDate, toDate])

    const renderData = () => {
        const {
            questions,
            questionsFail,
            questionsSuccess,

            series,

            mPDFLinks,
            qPDFLinks,

            topicsPerformance
        } = studentStats

        return(
            <Space direction="vertical">
                <Space align="start" size="large">
                    <div>
                        <Space className="dashboard-info-title">
                            <FilePdfOutlined className="default-red default-x-larger"/>
                            <p>Visited documents</p>
                        </Space>
                        <div>
                        {mPDFLinks.length ? 
                        <List 
                            dataSource={mPDFLinks}
                            renderItem={(l, li) => {
                                const {Id, MapId, Code, MapCode, URL, Total} = l

                                return(
                                    <div key={Id}>
                                        <Dropdown
                                            className="hoverable-plus"
                                            menu={{
                                                items:[{
                                                    label:'Open document',
                                                    icon: <FilePdfOutlined />,
                                                    onClick:() => window.open(URL)
                                                },
                                                {
                                                    label:'Go to map',
                                                    icon: <CaretRightOutlined />,
                                                    onClick:() => goToMapPlay({Id:MapId})
                                                }]
                                            }}
                                        >
                                        <Space className="dashboard-info-line" align="start">
                                            <p className="default-gray default-small">{li+1}</p>
                                            <p className="default-title">{Code} - <span className="default-gray">{MapCode}</span></p>
                                        </Space>
                                        </Dropdown>
                                    </div>
                                )
                            }}
                        /> : <div/>}
                        {qPDFLinks.length ? 
                        <List 
                            dataSource={qPDFLinks}
                            renderItem={(l, li) => {
                                const {Id, Code, URL, ImageURL} = l

                                return(
                                    <div key={Id}>
                                        <Space className="hq-clickable dashboard-info-line hq-opposite-arrangement" title="open document" onClick={() => window.open(URL)} align="start">
                                            <Space align="start">
                                                <p className="default-gray default-small">{mPDFLinks.length + li+1}</p>
                                                <p className="default-title">{Code}</p>
                                            </Space>
                                            <img 
                                                src={ImageURL}
                                                alt={Code}
                                                style={{width:60}}
                                            />
                                        </Space>
                                    </div>
                                )
                            }}
                        /> : <div/>}
                        </div>
                    </div>
                    
                    <div>
                        <Space className="dashboard-info-title">
                            <FireFilled className="default-orange default-x-larger"/>
                            <p>Best plays</p>
                        </Space>
                        <div>
                        {questionsSuccess.length ? 
                        <List 
                            dataSource={questionsSuccess}
                            renderItem={(l, li) => {
                                const {Id, Code, ImageURL, Total, SuccessRate} = l

                                return(
                                    <div key={Id}>
                                        <Space className="dashboard-info-line hq-opposite-arrangement" size="large" align="start">
                                            <Space direction="vertical">
                                                <Space align="start">
                                                    <p className="default-gray default-small">{li+1}</p>
                                                    <p className="default-title">{Code}</p>
                                                </Space>
                                                <Space align="end">
                                                    <small className="default-green">{Total}</small>
                                                    <small className="default-green">{(SuccessRate*100).toFixed(0)} %</small>
                                                </Space>
                                            </Space>
                                            <img 
                                                src={ImageURL}
                                                alt={Code}
                                                style={{width:60}}
                                            />
                                        </Space>
                                    </div>
                                )
                            }}
                        /> : <div/>}
                        
                        </div>
                    </div>
                    <div>
                        <Space className="dashboard-info-title">
                            <DislikeOutlined className="default-red default-x-larger"/>
                            <p>Worst plays</p>
                        </Space>
                        <div>
                        {questionsFail.length ? 
                        <List 
                            dataSource={questionsFail}
                            renderItem={(l, li) => {
                                const {Id, Code, ImageURL, Total, FailRate} = l

                                return(
                                    <div key={Id}>
                                        <Space className="dashboard-info-line hq-opposite-arrangement" size="large" align="start">
                                            <Space direction="vertical">
                                                <Space align="start">
                                                    <p className="default-gray default-small">{li+1}</p>
                                                    <p className="default-title">{Code}</p>
                                                </Space>
                                                <Space align="end">
                                                    <small className="default-red">{Total}</small>
                                                    <small className="default-red">{(FailRate*100).toFixed(0)} %</small>
                                                </Space>
                                            </Space>
                                            <img 
                                                src={ImageURL}
                                                alt={Code}
                                                style={{width:60}}
                                            />
                                        </Space>
                                    </div>
                                )
                            }}
                        /> : <div/>}
                        
                        </div>
                    </div>

                    <div>
                        <Space className="dashboard-info-title">
                            <TrophyOutlined className="default-title default-x-larger"/>
                            <p>Most played series</p>
                        </Space>
                        <div>
                        {series.length ? 
                        <List 
                            dataSource={series}
                            renderItem={(l, li) => {
                                const {Id, Code, Total} = l

                                return(
                                    <div key={Id}>
                                        <Space className="dashboard-info-line hq-opposite-arrangement" size="large">
                                            <Space align="start">
                                                <p className="default-gray default-small">{li+1}</p>
                                                <p className="default-title">{Code}</p>
                                            </Space>
                                            <p className="default-gray default-small">{' '}{Total}</p>
                                        </Space>
                                    </div>
                                )
                            }}
                        /> : <div/>}
                        
                        </div>
                    </div>

                    <div>
                        <Space className="dashboard-info-title">
                            <ApartmentOutlined className="default-title default-x-larger"/>
                            <p>Topic-based performance</p>
                        </Space>
                        <div>
                        {topicsPerformance.length ? 
                        <List 
                            dataSource={topicsPerformance}
                            renderItem={(l, li) => {
                                const {Id, Name, Topics} = l

                                return(
                                    <div key={"tp"+ Id}>
                                        <Space className="dashboard-info-line" direction="vertical" align="start">
                                            <Space align="start">
                                                <p className="default-gray default-small">{li+1}</p>
                                                <p className="default-title">{Name}</p>

                                                <Tooltip
                                                    color="white"
                                                    title={<p>Play random 5 questions from this topic</p>}
                                                >
                                                    <CarOutlined 
                                                        className="hq-clickable default-gray hoverable-plus" 
                                                        onClick={() => {
                                                            const data = new FormData()

                                                            data.append("DatapoolId", Id)

                                                            getDashboardRandomQuestions(data)

                                                            setIsQuestionsRandom(true)
                                                            setShowPlayQuestions(true)
                                                            setSelectedDatapool(Name)
                                                        }}  
                                                    />
                                                </Tooltip>
                                                <Tooltip
                                                    color="white"
                                                    title={<p>Get worst played 5 questions from this topic</p>}
                                                >
                                                    <BugOutlined 
                                                        className="hq-clickable default-gray hoverable-plus"
                                                        onClick={() => {
                                                            const data = new FormData()

                                                            data.append("DatapoolId", Id)
                                                            data.append("player", currentPlayerKey)

                                                            getDashboardWorstPlayedQuestions(data)

                                                            setIsQuestionsRandom(false)
                                                            setShowPlayQuestions(true)
                                                            setSelectedDatapool(Name)
                                                        }} 
                                                    />
                                                </Tooltip>
                                            </Space>
                                            {Topics.map((t) => {
                                                const {Id: Idt, Name, Count, CountCorrect} = t
                                                const _perc = ((CountCorrect/Count) * 100).toFixed(0)
                                                return(
                                                    <Space key={"tpp" + Idt} align="end" className="hq-full-width hq-opposite-arrangement">
                                                        &nbsp;
                                                        &nbsp;
                                                        &nbsp;
                                                        <p className="default-gray">{Name}</p>
                                                        &nbsp;
                                                        &nbsp;
                                                        <Space align="end">
                                                            <p className="default-title">{Count}</p>
                                                            <small className="default-green">{_perc}%</small>
                                                        </Space>
                                                    </Space>
                                                )
                                            })}
                                        </Space>
                                    </div>
                                )
                            }}
                        /> : <div/>}
                        
                        </div>
                    </div>
                </Space>
            </Space>
        )
    }

    const onRangeChange = (d) => {
        if(!d){
          setFromDate(fromDate)
          setToDate(toDate)
          return
        }
        const fromTD = d[0]
        const toTD = d[1]
  
        setFromDate(fromTD)
        setToDate(toTD)

        setNormalRange(false)
        setShowEditDate(false)
  
    }

    const renderRangeModal = () => {
        const rangePresets = [
       {
          label: 'Last Day',
          value: [dayjs().add(-1, 'd'), dayjs()],
        },{
          label: 'Last 7 Days',
          value: [dayjs().add(-7, 'd'), dayjs()],
        },
        {
          label: 'Last 14 Days',
          value: [dayjs().add(-14, 'd'), dayjs()],
        },
        {
          label: 'Last 30 Days',
          value: [dayjs().add(-30, 'd'), dayjs()],
        }
    ];
        return(
            <Drawer
                title="Statistics Date Range"
                width={'50%'}
                onClose={() => setShowEditDate(false)}
                open={showEditDate}
                bodyStyle={{
                paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
                closable={true}
            >
                 <RangePicker
                    presets={rangePresets}
                    showTime
                    format="DD.MM.YYYY"
                    onChange={onRangeChange}
                />
            </Drawer>
        )
    }
    
    const renderPlayQuestions = () => {
        if(!showPlayQuestions) return <div/>;

        const data = 
        !(isLoadingGetDashboardRandomQuestions || isLoadingGetDashboardWorstPlayedQuestions) 
        ?
        (isQuestionsRandom ? randomQuestions : worstPlayedQuestions)
        : null

        return(
            <Drawer
                title="Play Questions"
                width={'100%'}
                onClose={() => setShowPlayQuestions(false)}
                open={showPlayQuestions}
                bodyStyle={{
                paddingBottom: 80,
                }}
                closeIcon={<ArrowLeftOutlined />}
                closable={true}
            >
                {(isLoadingGetDashboardRandomQuestions || isLoadingGetDashboardWorstPlayedQuestions) && <Skeleton />}

                {data && 
                <SeriesPlayFake 
                    Ids={data}
                    Code={`${selectedDatapool}  ${isQuestionsRandom? ": random questions" : ": worst played questions"}`}
                />}
            </Drawer>
        )
    }

    return(
        <div className="dashboard-info">
            <Space>
                {normalRange ? <small className="default-gray">Statistics over last week</small> : 
                <p className="default-large">
                    <span style={{color:'#000000'}}>
                        {fromDate.format('DD.MM.YYYY')}
                    </span>
                    <span className="default-gray">
                    {' '}-{' '}
                    </span>
                    <span style={{color:'#000000'}}>
                        {toDate.format('DD.MM.YYYY')}
                    </span>
                </p>
                }
                <ControlOutlined className="default-gray default-small hq-clickable" onClick={() => {
                    setShowEditDate(true)
                }}/>
                {normalRange ? <div/>: 
                <UndoOutlined title="reset range" className="default-gray default-small hq-clickable" onClick={() => {
                    setFromDate(dayjs().add(-7, 'd'))
                    setToDate(dayjs().add(1, 'd'))
                    setNormalRange(true)
                }}/>
                }
            </Space>
            <br/>
            {isLoadingGetStudentDashboardInfo && <Skeleton />}
            {!(isLoadingGetStudentDashboardInfo || dataError) && studentStats && renderData()}

            {dataError && <ErrorComponent 
                error={dataError}
                onReload={() => getData()}
            />}

            {renderRangeModal()}

            {renderPlayQuestions()}
        </div>
    )
}