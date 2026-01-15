import React, { useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { Button, DatePicker, Divider, Dropdown, Input, List, Select, Skeleton, Space, Spin, Statistic, Tabs, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useDatapools } from "../../contexts/DatapoolsContext";
import {BarChartOutlined, BorderHorizontalOutlined, StarFilled, EditOutlined, TrophyOutlined, DownloadOutlined} from '@ant-design/icons';

import './Reports.css'
import { useReports } from "../../contexts/ReportsContext";
import { convertSecondsToHHMMSS, downloadFile } from "../../services/Auxillary";
import { PlayerTimeline } from "./PlayerTimeline";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { useNavigate } from "react-router-dom";
import { QuestionPlayPocket } from "../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { SeriesPlayPocket } from "../Series/Play/SeriesPlayPocket";
import { ReportGraphicalStatistics } from "../../Components/ReportGraphicalStatistics";

const { RangePicker } = DatePicker;

export function Reports(){
    const {datapools, errorGetDatapools, isLoadingDatapools} = useDatapools()

    const [searchKey, setSearchKey] = useState("")

    const [fromTimeData, setFromTimeDate] = useState(null)
    const [toTimeData, setToTimeDate] = useState(null)

    const [selectedDatapool, setSelectedDatapool] = useState({label:'Please select ...'})

    const [showNumericStats, setShowNumericStats] = useState(true)

    const [showPlyerTimeline, setShowPlyerTimeline] = useState(false)
    const [selectedPlyerTimeline, setSelectedPlyerTimeline] = useState(false)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)

    const [showPlaySeriesModal, setShowPlaySeriesModal] = useState(false)
    const [selectedSeries, setSelectedSeries] = useState({Code:''})

    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate()


    const {
        loadingNumericStats,
        numericStats,
        getNumericStatsError,
        getNumericStats,

        loadingGraphicalStats,
        graphicalStats,
        getGraphicalStatsError,
        getGraphicalStats
    } = useReports()

    const onRangeChange = (d) => {
        const fromTD = d[0].format('DD.MM.YYYY HH:mm:ss')
        const toTD = d[1].format('DD.MM.YYYY HH:mm:ss') 

        setFromTimeDate(fromTD)
        setToTimeDate(toTD)

    }

    const checkValidDataSelected = () => {
        if(!(fromTimeData && toTimeData)) {
            messageApi.destroy()
            messageApi.warning('Please add date-time range for search')
            
            return false
        } 

        if(!selectedDatapool.value) {
            messageApi.destroy()
            messageApi.warning('Please select which datapool you are querying')
            
            return false
        } 

        return true
    }

    const loadNumericStatistics = () => {
        if(!checkValidDataSelected()) return

        const VM = ({
            Code:searchKey,
            datapool_id:selectedDatapool.value,
            From:fromTimeData,
            To:toTimeData
        })
        
        getNumericStats(VM)

        setShowNumericStats(true)
    }

    const loadGraphicalStatistics = () => {
        if(!checkValidDataSelected()) return

        const VM = ({
            Code:searchKey,
            datapool_id:selectedDatapool.value,
            From:fromTimeData.substring(0, 10) + " 00:00:00",
            To:toTimeData.substring(0, 10) + " 00:00:00"
        })
        
        getGraphicalStats(VM)

        setShowNumericStats(false)
    }

    const handlePlayerReportRequest = (player) => {
        const VM = ({
            Code: player,
            From: numericStats.From,
            To: numericStats.To,
            datapool_id: numericStats.DataPool.Id
        })

        setShowPlyerTimeline(true)
        setSelectedPlyerTimeline(VM)
        
    }

    const downloadButton = (title, action) => (
        <Button
            size="small"
            onClick={action}
            icon={<DownloadOutlined />}
        >
            {title || 'Download'}
        </Button>
    )

    const downloadQuestionsReport = () => {
        const {Statsitics, DataPool} = numericStats

        const download = Statsitics.map((r) => ({
            Key: r.Key ||"-",
            Player: r.Player ||"-",
            DateTime: (r.DateCreated),
            QuestionCode: r.QuestionCode.replace(',', ''),                                    
            Correct: r.Correct,
            Topic: r.Topic,
            Subtopic: r.Subtopic,
            LevelOfDifficulty: r.LevelOfDifficulty
        }))

        let text = ""
        text += "DataPool: " + DataPool + ";\n"

        for(let d of download){
            text += d.DateTime + ", " + d.Key + ", " + d.Player + ", " + d.QuestionCode +  ","+  d.Correct+"," + d.LevelOfDifficulty+"," + d.Topic+","+ d.Subtopic + ";\n"
        }

        downloadFile(text, (searchKey||"QuestionsAnyKey")+".txt", "txt")
    }

    const downloadPlayersReport = () => {
        const {Players, DataPool} = numericStats

        const download = Players.map((r) => ({
            Key: r.Player, 
            Time: convertSecondsToHHMMSS(r.TotalPlayTime),
            TotalGames: r.TotalGames
        }))

        let text = ""
        text += "DataPool: " + DataPool + ";\n"

        for(let d of download){
            text += d.Key + ", " + d.TotalGames + ", " + d.Time + ";\n"
        }

        downloadFile(text, "Players.txt", "txt")
    }

    const downloadSeriesReport = () => {
        const {SeriesStastics, DataPool} = numericStats

        const download = SeriesStastics.map((s) => ({
            DateCreated: s.DateCreated,

            Key: s.Key ||"-",
            Player: s.Player||"-",
            
            Series: s.Series,
            TotalTime: s.TotalTime,
            SuccessRate: s.SuccessRate||"-",

            Map: s.Map||"-",
            MapElement: s.MapElement||"-",

            OnMobile: s.OnMobile,
        }))

        let text = ""
        text += "DataPool: " + DataPool + ";\n"

        for(let d of download){
            text += d.DateCreated + ", " + d.Key + ", " + d.Player + ", " + d.Series +  ","+  d.TotalTime+"," + d.SuccessRate+"," + d.Map+","+ d.MapElement+ ","+d.OnMobile + ";\n"
        }

        downloadFile(text, "Series.txt", "txt")
    }

    const downloadMapKeysReport = () => {
        const {Keys, DataPool} = numericStats

        const download = Keys.map((r) => ({
            Key: r
        }))

        let text = ""
        text += "DataPool: " + DataPool + ";\n"

        for(let d of download){
            text += d.Key + ";\n"
        }

        downloadFile(text, "Keys.txt", "txt")
    }

    const downloadSolutionKeysReport = () => {
        const {SolutionKeys, DataPool} = numericStats

        const download = SolutionKeys.map((r) => ({
            Key: r.Key,
            DateTime: (r.DateCreated),
            Map: r.Map.Title
        }))

        let text = ""
        text += "DataPool: " + DataPool + ";\n"

        for(let d of download){
            text += d.DateTime + ", " + d.Key + ", " + d.Map + ";\n"
        }

        downloadFile(text, "SolutionKeys.txt", "txt")
    }

    const downloadPDFClicksReport = () => {
        const {MapPDFStastics, DataPool} = numericStats

        const download = MapPDFStastics.map((s) => ({
            DateCreated: s.DateCreated,

            Player: s.Player||"-",
    
            Map: s.Map||"-",
            MapElement: s.MapElement||"-",
    
            OnMobile: s.OnMobile,
        }))

        let text = ""
        text += "DataPool: " + DataPool + ";\n"

        for(let d of download){
            text += d.DateCreated + ", " + d.Player  +  ","+  d.Map+","+ d.MapElement+ ","+d.OnMobile + ";\n"
        }

        downloadFile(text, "PDFClicks.txt", "txt")
    }


    function searchLine(){
        const rangePresets = [
            {
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
            <Space>
                <div className="section-base search-key-section">
                    <small className="default-gray">Key</small>
                    <Input 
                        value={searchKey}
                        onChange={(v) => setSearchKey(v.target.value)}
                        placeholder="Player / Map key (not mandatory)"
                    />
                </div>
                <div className="section-base search-datetime-section">
                    <small className="default-gray">Date time range</small>
                    <RangePicker
                        presets={rangePresets}
                        showTime
                        format="YYYY/MM/DD HH:mm:ss"
                        onChange={onRangeChange}
                    />
                </div>
                <div className="section-base search-datapool-section">
                    <small className="default-gray">Datapool</small>
                    {!(isLoadingDatapools || errorGetDatapools) && 
                        <Select
                        onChange={(v, option) => setSelectedDatapool(option)}
                        defaultValue={'please select'}
                        value={selectedDatapool}
                        className='navigation-bar-datapools-select'
                        options={(datapools || []).map((d) => ({
                            value: d.Id,
                            label: d.NickName
                            }))}
                        />}

                        {isLoadingDatapools && 
                        <div>
                        <Spin/>
                        </div>}
                </div>
                <div>
                    <p className="default-white">
                        .
                    </p>
                    <Button 
                        onClick={loadNumericStatistics}
                        icon={<BorderHorizontalOutlined style={{color:'#777'}}/>}
                    >
                        Load numeric statistics 
                    </Button>
                </div>
                <div>
                    <p className="default-white">
                        .
                    </p>
                    <Button 
                        onClick={loadGraphicalStatistics}
                        icon={<BarChartOutlined style={{color:'#777'}}/>}
                    >
                        Load graphical statistics  
                    </Button>
                </div>
            </Space>
        )
    }

  
    function renderNumericStatistics(){
        const tabs =[
            {
                label: 'Questions',
                key: 1,
                children: renderQuestionStats(),
            },
            {
                label: 'Players',
                key: 2,
                children: renderPlayerStats(),
            },
            {
                label: 'Series',
                key: 3,
                children: renderSeriesStats(),
            },
            {
                label: 'Map keys',
                key: 4,
                children: renderMapKeyStats(),
            },
            {
                label: 'PDF clicks',
                key: 5,
                children: renderPDFStats(),
            }
        ]

        return(
            <Tabs
                defaultActiveKey = '1'
                type="card"
                items={tabs}
            />
        )
    }

    function renderGraphicalStatistics(){
        const {DailyQuestionStatsEveryDay} = graphicalStats

        return(
            <ReportGraphicalStatistics
                data ={DailyQuestionStatsEveryDay}
                style = {{width: 1200, height: 700}}
            />
        )
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

    function renderQuestionStats(){
        const {Statsitics, SuccessfulGames:successfulGames, UnsuccessfulGames: unsuccessfulGames} = numericStats

        const nTotal = Statsitics.length
        const nTotalUnique = Statsitics.map((r) => r.QuestionId).filter((item, i, ar) => ar.indexOf(item) === i).length

        const nCorrect = Statsitics.filter((r) => r.Correct).length 
        const nPercCorrect = (100*(nCorrect/(nTotal+1))).toFixed(0)

        const nWrong = Statsitics.filter((r) => !r.Correct).length 
        const nPercWrong = (100*(nWrong/(nTotal+1))).toFixed(0)


        return(
            <div className="stats-block">
                
                <Space 
                    align="start"
                    size={"large"}
                >
                    <Statistic title="Total games played" value={nTotal} valueStyle={{color:'grey'}}/>
                    <Statistic title="Total unique games played" value={nTotalUnique} valueStyle={{color:'grey'}}/>
                        
                    <Statistic 
                    title="Correctly" 
                    value={nCorrect} 
                    valueStyle={{color:'green'}}
                    suffix={<small className="default-gray">({nPercCorrect}%)</small>}
                    />

                    <Statistic 
                    title="Incorrectly" 
                    value={nWrong} 
                    valueStyle={{color:'red'}}
                    suffix={<small className="default-gray">({nPercWrong}%)</small>}
                    />

                    {downloadButton('Download', () => downloadQuestionsReport())}
                </Space>
                <br/>
                <br/>
                <Space>
                    <div >
                        <p className="list-title">Top 10 successful games</p>
                        <div className="list">
                            <List
                            dataSource={successfulGames}

                            renderItem={(g, gi) => {
                                const {QuestionCode, TotalGamesCorrect, TotalGames, QuestionImage} = g

                                return(
                                    <List.Item>
                                    <Space className="hq-full-width" align="start" direction="vertical">
                                        <Space className="question-code-stats-line  hq-opposite-arrangement">
                                            <Dropdown
                                                    menu={{
                                                        items:questionActionList(g),
                                                        title:'Actions'
                                                    }}
                                                >
                                                     <p className="stats-name hoverable hoverable-plus">
                                                        <span className="default-gray">{gi+1}</span>{' '}{QuestionCode}
                                                    </p>
                                            </Dropdown>
                                            <p className="question-percentage-correct">
                                                {TotalGamesCorrect}/{TotalGames} {' '}({(100*(TotalGamesCorrect/TotalGames)).toFixed(0)}%)
                                            </p> 

                                        </Space>
                                        <img 
                                            src = {QuestionImage}
                                            className="report-question-image"
                                            alt={QuestionCode}
                                        />
                                    </Space>
                                    </List.Item>
                                )
                            }}
                            />  
                        </div>
                                                  
                    </div>
                    <div>
                        <p className="list-title">Top 10 unsuccessful games</p>
                        <div className="list">
                            <List
                            dataSource={unsuccessfulGames}

                            renderItem={(g, gi) => {
                                const {QuestionCode, TotalGamesIncorrect, TotalGames, QuestionImage} = g

                                return(
                                    <List.Item>
                                        <Space className="hq-full-width" align="start" direction="vertical">
                                            <Space className="question-code-stats-line hq-opposite-arrangement">
                                                <Dropdown
                                                    menu={{
                                                        items:questionActionList(g),
                                                        title:'Actions'
                                                    }}
                                                >
                                                     <p className="stats-name hoverable hoverable-plus">
                                                        <span className="default-gray">{gi+1}</span>{' '}{QuestionCode}
                                                    </p>
                                                </Dropdown>
                                                <span  className="question-percentage-incorrect">{TotalGamesIncorrect}/{TotalGames}{' '}({(100*(TotalGamesIncorrect/TotalGames)).toFixed(0)}%)</span> 

                                            </Space>
                                            <img 
                                                src = {QuestionImage}
                                                className="report-question-image"
                                                alt={QuestionCode}
                                            />
                                        </Space>
                                    </List.Item>
                                )
                            }}
                            />  
                        </div>
                         
                    </div>
                </Space>
            </div>
        )
    }

    function renderPlayerStats(){
        const {Players, SuccessfulPlayers} = numericStats
        const {Statsitics} = numericStats

        const nTotalGames = Statsitics.length
        const nTotal = Players.length
        const perPlayerAvg = Math.trunc(Players.reduce((a,b) => a += b.TotalGames, 0)/(nTotal+1))

        return(
            <div className="stats-block">
                <Space 
                align="start"
                size={"large"}>
                    <Statistic 
                        title="Total games played" 
                        value={nTotalGames} 
                        valueStyle={{color:'grey'}}
                    />

                    <Statistic title="Players" 
                        value={nTotal}
                        valueStyle={{color:'grey'}}
                    />
                    <Statistic title="Avg. per-player games played " 
                        value={perPlayerAvg}
                        valueStyle={{color:'grey'}}
                    />

                    {downloadButton('Download', () => downloadPlayersReport())}
                </Space>
                <br/>
                <br/>
                <Space>
                    <div >
                        <p className="list-title">Top players</p>
                        
                        <div className="list">
                            <List
                            dataSource={Players}

                            renderItem={(p, pi) => {

                                return(
                                    <List.Item>
                                        <div 
                                        onClick={() => handlePlayerReportRequest(p.Player)}
                                        className="list-item">
                                            <div className="hq-opposite-arrangement">
                                                <p className="stats-name hoverable hoverable-plus">
                                                    <span className="default-gray">{pi+1}{' '}</span>
                                                    {p.Player + ' '}{pi === 0 && <StarFilled className="default-orange"/>}
                                                </p>
                                                
                                                <Tooltip title={<p>total games played</p>} color="white" placement="top" >
                                                    <p>{p.TotalGames}</p>
                                                </Tooltip>  

                                                <Tooltip title={<p>total play time HH:mm:ss</p>} color="white" placement="top" >
                                                    <p>{convertSecondsToHHMMSS(p.TotalPlayTime)}</p>
                                                </Tooltip>
                                               
                                            </div>
                                        </div>
                                    </List.Item>
                                )
                            }}
                            />  
                        </div>
                                                  
                    </div>
                    <div>
                        <p className="list-title">Top successful players</p>
                        <div className="list">
                            <List
                            dataSource={SuccessfulPlayers}

                            renderItem={(p, pi) => {
    
                                return(
                                    <List.Item>
                                        <div 
                                        onClick={() => handlePlayerReportRequest(p.Player)}
                                        className="list-item">
                                            <div className="hq-opposite-arrangement">
                                                <p className="stats-name hoverable hoverable-plus">
                                                    <span className="default-gray">{pi+1}{' '}</span>
                                                    {p.Player + ' '}{pi === 0 && <StarFilled className="default-green"/>}
                                                </p>

                                                <Tooltip title={<p>total games played correctly</p>} color="white" placement="top">
                                                    <p>{p.TotalGamesCorrect}</p>
                                                </Tooltip>

                                                <Tooltip title={<p>total play time HH:mm:ss</p>} color="white" placement="top">
                                                    <p>{convertSecondsToHHMMSS(p.TotalPlayTime)}</p>
                                                </Tooltip>
                                                
                                            </div>
                                        </div>
                                    </List.Item>
                                )
                            }}
                            />  
                        </div>
                         
                    </div>
                </Space>
            </div>
        )
    }

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

    function renderSeriesStats(){
        const {SeriesStasticsGrouped, SeriesStasticsUniqueCount, SeriesStasticsOnMobileCount} = numericStats

        const nTotal = SeriesStasticsGrouped.length
        const nTotalUnique = SeriesStasticsUniqueCount
        const nOnMobile = SeriesStasticsOnMobileCount
        const nPercOnMobile = (100*(nOnMobile/(nTotal+1))).toFixed(0)

        const totalPlayTime = convertSecondsToHHMMSS(SeriesStasticsGrouped.reduce((r, c) => r += c.TotalPlayTime, 0))

        return(
            <div className="stats-block">
                <Space 
                align="start"
                size={"large"}>
                    <Statistic 
                        title="Total series played" 
                        value={nTotal} 
                        valueStyle={{color:'grey'}}
                    />

                    <Statistic 
                        title="Total unique series played" 
                        value={nTotalUnique} 
                        valueStyle={{color:'grey'}}
                    />

                    <Statistic title="On mobile" 
                        value={nOnMobile}
                        valueStyle={{color:'grey'}}
                        suffix={<small className="default-gray">({nPercOnMobile}%)</small>}

                    />
                    <Statistic title="Total play time" 
                        value={totalPlayTime}
                        valueStyle={{color:'grey'}}
                    />

                    {downloadButton('Download', () => downloadSeriesReport())}
                </Space>
                <br/>
                <br/>
                <Space>
                <div >
                    <p className="list-title">Top series played</p>
                        
                    <div className="list">
                    <List
                        dataSource={SeriesStasticsGrouped}

                        renderItem={(s, si) => {
                                

                                return(
                                    <List.Item>
                                        <Space className="hq-full-width" align="start" direction="vertical">
                                            <Space className="question-code-stats-line hq-opposite-arrangement" size={'large'}>
                                                <Dropdown
                                                    menu={{
                                                        items:seriesActionList({
                                                            Code: s.Series,
                                                        }),
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <p className="stats-name hoverable hoverable-plus"><span className="default-gray">{si+1}</span>{' '}{s.Series}</p>
                                                </Dropdown>
                                                <Space size={'large'}>
                                                    <Tooltip title={<p>Series play count</p>} color="white" placement="top">
                                                        <p>{s.Count}</p>
                                                    </Tooltip>

                                                   
                                                    <Tooltip title={<p>Play time</p>} color="white" placement="top" >
                                                        <p>{convertSecondsToHHMMSS(s.TotalPlayTime)}</p>
                                                    </Tooltip>
                                                        
                                                   
                                                    <Tooltip title={<p>Median play time</p>} color="white" placement="top" >
                                                        <p>{convertSecondsToHHMMSS(s.MedianPlayTime)}</p>
                                                    </Tooltip>
                                                    
                                                </Space>
                                            </Space>
                                        </Space>
                                    </List.Item>
                                )
                            }}
                            /> 
                    </div>
                </div>
                </Space>
            </div>
        )
    }

    function renderMapKeyStats(){
        const {Keys, SolutionKeys} = numericStats
       
        const nTotal = Keys.length
        const nTotalSolution = SolutionKeys.length

        return(
            <div className="stats-block">
                <Space 
                align="start"
                size={"large"}>
                    <Statistic 
                        title="Total keys" 
                        value={nTotal} 
                        valueStyle={{color:'grey'}}
                    />

                    <Statistic 
                        title="Total solution keys" 
                        value={nTotalSolution} 
                        valueStyle={{color:'grey'}}
                    />

                    {downloadButton('Download keys report', () => downloadMapKeysReport())}
                    {downloadButton('Download solution keys report', () => downloadSolutionKeysReport())}
                </Space>
            </div>
        )
    }

    const mapActionList = (m) => [{
        key: 'view_edit_map',
        label: 'View edit map',
        icon: <EditOutlined/>,
        onClick: () => navigate('/edit_view_map/'+m.Id)
    },
    {
        key: 'play_map',
        label: 'Play map',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => navigate('/playcoursemap/'+m.Id)
    }]

    function renderPDFStats(){
        const {MapPDFStastics, MapPDFStasticsGrouped} = numericStats
        const nTotal = MapPDFStastics.length

        return(
            <div className="stats-block">
                <Space 
                align="start"
                size={"large"}>
                    <Statistic 
                        title="Total clicks" 
                        value={nTotal} 
                        valueStyle={{color:'grey'}}
                    />

                    {downloadButton('Download', () => downloadPDFClicksReport())}
                </Space>

                <br/>
                <br/>
                <Space>
                <div >
                    <p className="list-title">Top PDF-Clicked maps</p>
                        
                    <div className="list">
                    <List
                        dataSource={MapPDFStasticsGrouped}

                        renderItem={(s, si) => {
                                

                                return(
                                    <List.Item>
                                         <Space className="hq-full-width" align="start" direction="vertical">
                                            <Space className="question-code-stats-line hq-opposite-arrangement" size={'large'}>
                                                <Dropdown
                                                    menu={{
                                                        items:mapActionList({
                                                            Map: s.Map,
                                                            Id: s.Id 
                                                        }),
                                                        title:'Actions'
                                                    }}
                                                >
                                                    <p className="stats-name hoverable hoverable-plus"><span className="default-gray">{si+1}</span>{' '}{s.Map}</p>
                                                </Dropdown>
                                                <Tooltip title={<p>PDF clicks</p>} color="white" placement="top" >
                                                    <p>{s.Count}</p>
                                                </Tooltip>
                                            </Space>
                                        </Space>
                                    </List.Item>
                                )
                            }}
                            /> 
                    </div>
                </div>
                </Space>
            </div>
        )
    }   

    return(
        <PagesWrapper>
            {contextHolder}
            {searchLine()}
            <Divider />

            {(loadingGraphicalStats || loadingNumericStats) && 
            <div>
                <p className="default-title">... Loading data ...</p>
                <Skeleton/>
            </div>}

            {!(loadingGraphicalStats || loadingNumericStats) && numericStats && showNumericStats && renderNumericStatistics()}

            {!(loadingGraphicalStats || loadingNumericStats) && graphicalStats && !showNumericStats && renderGraphicalStatistics()}

            {getNumericStatsError && !loadingNumericStats &&
                <ErrorComponent 
                    error={getNumericStatsError}
                    
                    onReload={() =>  loadNumericStatistics()}
                />}

            {getGraphicalStatsError && !loadingGraphicalStats &&
                <ErrorComponent 
                    error={getGraphicalStatsError}
                    
                    onReload={() =>  loadGraphicalStatistics()}
                />}

            <PlayerTimeline 
                open={showPlyerTimeline}
                onClose={() => setShowPlyerTimeline(false)}
                selectedPlayer={selectedPlyerTimeline}                
            />
            
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
        </PagesWrapper>
    )
}