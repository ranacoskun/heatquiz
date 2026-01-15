import React, { useEffect, useState } from "react";
import { useSeries } from "../../contexts/SeriesContext";
import { Button, Col, Divider, Dropdown, FloatButton, Input, List, Progress, QRCode, Row, Skeleton, Space, Spin, Tooltip, message, notification } from "antd";
import { red, green } from '@ant-design/colors';
import { getRandomSeriesElements } from "./Functions";
import { convertSecondsToHHMMSS, goToQuestionViewEdit, goToSeriesViewEdit } from "../../services/Auxillary";

import { CLICKABLE_QUESTION_PARAMETER, DIAGRAM_QUESTION_PARAMETER, ENERGY_BALANCE_QUESTION_PARAMETER, FBD_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER, PV_DIAGRAM_QUESTION_PARAMETER } from "../../Pages/Questions/List/constants";
import { ClickableQuestionPlay } from "../../Pages/Questions/ClickableQuestion/Play";
import { KeyboardQuestionPlay } from "../../Pages/Questions/KeyboardQuestion/Play";
import { MultipleChoiceQuestion } from "../../Pages/Questions/MultipleChoiceQuestion/Play";
import { ForwardOutlined, QuestionCircleOutlined, FilePdfOutlined, CheckCircleFilled, CloseCircleFilled,
     ClockCircleOutlined, StarFilled, AreaChartOutlined, TrophyOutlined, NotificationOutlined, QrcodeOutlined, RollbackOutlined, MoreOutlined, EyeOutlined, RocketTwoTone, BuildTwoTone } from '@ant-design/icons';

import './SeriesPlay.css'
import { LatexRenderer } from "../LatexRenderer";
import { QuestionPlayPocket } from "../../Pages/Questions/QuestionPlayPocket/QuestionPlayPocket";
import { useStudentFeedback } from "../../contexts/StudentFeedbackContext";
import { SendFeedback } from "../../Pages/StudentFeedback/SendFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { ViewSolutionComponent } from "../ViewSolutionComponent";
import { ErrorComponent } from "../ErrorComponent";
import { DisplayClickableQuestionAnswers } from "./DisplayClickableQuestionAnswers";
import { EnergyBalanceQuestionPlay } from "../../Pages/Questions/EnergyBalanceQuestion/Play";
import { CurrentQuestionTypeNotSupported } from "./CurrentQuestionTypeNotSupported";
import { FBDQuestionPlay } from "../../Pages/Questions/FBDQuestion/Play";
import { DiagramQuestionPlay } from "../../Pages/Questions/DiagramQuestion/Play";
import { PVDiagramQuestionPlay } from "../../Pages/Questions/PVDiagramQuestion/Play";
import { Timer } from "../Timer/Timer";

export function SeriesPlay({Code, onExitSeries, onFinishPlaySeries, mapKey, mapName, mapElementName}){
    
    const { 
        isLoadingSeries, Series, getSeries, errorGetSeries,
        isLoadingSeriesStatistics, SeriesStatistics, getSeriesStatistics,
        postSeriesStatistic
    } = useSeries()

    const {
        loadingReferenceQuestion, referenceQuestionResult, referenceQuestionError, referenceQuestion
    } = useStudentFeedback()

    const {isStudent} = useAuth()

    const baseDiv = React.createRef()

    const [topOffset, setTopOffset] = useState(0)

    const [seriesElements, setSeriesElements] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [playedElements, setPlayedElements] = useState([])

    const [startTime, setStartTime] = useState(0)
    const [stopTimer, setStopTimer] = useState(false)

    const [showFinalPage, setShowFinalPage] = useState(false)

    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)
    const [showSendFeedbackModal, setShowSendFeedbackModal] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(false)
    const {currentPlayerKey} = useAuth()

    const [messageApi, contextHolder] = message.useMessage();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const loadData = () => {
        getSeries(Code)
        setSeriesElements([])
        setCurrentIndex(0)
        setStopTimer(false)

        setShowFinalPage(false)
    }

    useEffect(() => {
       loadData()
    }, [Code])

    useEffect(() => {
        if(Series){

            //Get series data from server
            getSeriesStatistics(Series.Id)

            let elements = []
            const {IsRandom, Elements, RandomSize} = Series

            //Generate random questions from question pools out of question collection assigned in the series
            if(IsRandom){
                elements = getRandomSeriesElements(Elements, RandomSize)
            }
            else{
                elements = Elements
            }

            setSeriesElements(elements)

            const baseDivCurrent = baseDiv.current

            if(baseDivCurrent){
                setTopOffset(baseDivCurrent.getBoundingClientRect().top)
            }

            setStartTime(Date.now())
            //Set a 1 second interval timer
            /*timer = setInterval(() => {
                setPlayTime(seconds => seconds + 1)
              }, 1000);

              return () => clearInterval(timer);timer = setInterval(() => {
                setPlayTime(seconds => seconds + 1)
              }, 1000);

              return () => clearInterval(timer);*/

           
        }
    }, [Series])

    useEffect(() => {
        //Stop timer
        if(playedElements.length === seriesElements.length){
            if(playedElements.length) setStopTimer(true);
        }
    }, [playedElements])

    useEffect(() => {
        if(showFinalPage){
            //Post series play statistics to the database
            let statData = new FormData()

            statData.append('SeriesId', Series.Id)
            statData.append('Player', currentPlayerKey)

            if(mapKey){
                statData.append('MapKey', mapKey)
            }

            if(mapName){
                statData.append('MapName', mapName)
            }

            if(mapElementName){
                statData.append('MapElementName', mapElementName)
            }

            statData.append('SuccessRate', playedElements.filter(a => a.Correct).length+"/"+playedElements.length)
            const totalTime = 0.001 * (Date.now() - startTime)
            console.log(totalTime)
            statData.append('TotalTime', totalTime)
            statData.append('OnMobile',  false)

            postSeriesStatistic(statData)


            //Update series progress saved locally 
            if(onFinishPlaySeries){
                onFinishPlaySeries(playedElements)
            }

        }
    }, [showFinalPage])

    const canGoNext = (playedElements.length === (currentIndex+1))
    const shouldGoToFinalPage = (playedElements.length === seriesElements.length)


    //Go to final page
    //Show gained points
    const goToFinalPage = () => {
        setShowFinalPage(true)
        let totalScore = 0

        notificationApi.destroy()
        
        notificationApi.open({
            message: 'Summary',
            description:
            <div>
                {playedElements.map((e, ei) => {
                    const {Question, Score} = e
                    const {Code} = Question
                    const score = Math.trunc(parseFloat(Score) * 10)
                    totalScore += score

                    return(
                        <div key={e.Id}>
                            <p >{ei + 1} {'- '} {Code}{' '} <span className="default-green">{' '}{score.toFixed(0) + ' XP'}</span></p>
                        </div>
                    )
                })}
                <Divider/>
                <small >
                    Total
                </small>

                <p className="default-green">{totalScore.toFixed(0) + ' XP'}</p>
            </div>,
            duration: 0,
        })
    }

    //Go to next question
    const goNext = () => {
        if(shouldGoToFinalPage){
            goToFinalPage()
            return
        }

        //Increment current index 
        setCurrentIndex(index => index+1)
    }


    //Update played series elements with stats regarding success, selected answers and play time
    const updateSeriesPlayElements = (el) => {
        const _playedElements = [...playedElements]

        _playedElements.push(el)

        setPlayedElements(_playedElements)
    }

    //Side action buttons
    const renderActionButtons = () => {
        const currentElement = seriesElements[currentIndex]

        if(!currentElement) return <div/>;

        const qInfo = currentElement.Question.Information

        const question = currentElement.Question
        
        return(
        <FloatButton.Group
            shape="square"
            style={{
                top:topOffset,
                height:'fit-content',
            }}
            >
            {onExitSeries && 
            <FloatButton 
                tooltip="Go back to map"
                onClick={() => onExitSeries()}
                icon={<RollbackOutlined />} 
            
            />
                
            }
            {!showFinalPage &&
            <FloatButton 

            badge={{count:canGoNext ? 'Next' : ''}}
            onClick={() => {

                if(shouldGoToFinalPage){
                    goToFinalPage()
                    return
                }

                if(canGoNext){
                    goNext()
                }
                else{
                    messageApi.destroy()
                    messageApi.warning('Please finish playing current question!')
                }
            }}
            icon={<ForwardOutlined />} 
            
            />}

            {qInfo && !showFinalPage && 
            <FloatButton 
            onClick={() => {
                const {PDFURL, Latex} = qInfo

                if(!Latex){
                    window.open(PDFURL)
                }

                notificationApi.destroy()
                

                notificationApi.open({
                    message: 'Explanation',
                    description:
                    <div>
                        <LatexRenderer 
                            latex={Latex}
                        />
                        {PDFURL && 
                        <span>
                            <br/>
                            <Button
                                size="small"
                                onClick={() => window.open(PDFURL)}
                                icon={<FilePdfOutlined />}
                            >
                                Help document
                            </Button>
                        </span>}
                    </div>,
                    duration: 0,
                })
            }}  
            icon={<QuestionCircleOutlined  />} 
            tooltip='Help'
            />
            }

            {!showFinalPage && !isStudent && 
            <Tooltip
                color="white"
                placement="left"

                title={
                    <Space direction="vertical">
                        <Button
                            className="hq-fill-width"
                            onClick={() => goToQuestionViewEdit(question)}
                            size="small"
                        >
                            <Space> 
                                <RocketTwoTone />
                                View/Edit question
                            </Space>
                        </Button>
                        <Button
                            className="hq-fill-width"
                            onClick={() => goToSeriesViewEdit(Series)}
                            size="small"
                        >
                            <Space> 
                                <BuildTwoTone />
                                View/Edit series
                            </Space>
                        </Button>
                    </Space>
                }
            >
                <FloatButton 
                icon={<EyeOutlined />} 
            />
            </Tooltip>}
            
        </FloatButton.Group>
        )
    }

    const renderQuestion = () => {
        if(!seriesElements.length) return <div/>;

        const question = seriesElements[currentIndex].Question
        const {Type, Id} = question


        const selectionList = {
            [CLICKABLE_QUESTION_PARAMETER]: () => 
            <ClickableQuestionPlay 
                Id={Id}
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                showSolution={true}

                nextAction = {() => goNext()}

                mapKey={mapKey}
            />,
            [KEYBOARD_QUESTION_PARAMETER]: () => 
            <KeyboardQuestionPlay 
                Id={Id} 
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                showSolution={true}

                nextAction = {() => goNext()}

                mapKey={mapKey}
            />,
            [MULTIPLE_CHOICE_QUESTION_PARAMETER]: () => 
            <MultipleChoiceQuestion 
                Id={Id}
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                showSolution={true}
                
                nextAction = {() => goNext()}

                mapKey={mapKey}
            />,
            [ENERGY_BALANCE_QUESTION_PARAMETER]: () => 
            <EnergyBalanceQuestionPlay 
                Id={Id}
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                
                nextAction = {() => goNext()}

                mapKey={mapKey}
            />,

            [FBD_QUESTION_PARAMETER]: () => 
            <FBDQuestionPlay 
                Id={Id}
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                
                nextAction = {() => goNext()}

                mapKey={mapKey}
            />,

            [DIAGRAM_QUESTION_PARAMETER]: () => 
            <DiagramQuestionPlay 
                Id={Id}
                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                
                nextAction = {() => goNext()}

                mapKey={mapKey}
            />,

            [PV_DIAGRAM_QUESTION_PARAMETER]: () => 
            <PVDiagramQuestionPlay 
                Id={Id} 

                onUpdateSeriesPlayElements = {updateSeriesPlayElements}
                
                nextAction = {() => goNext()}

                mapKey={mapKey}
            />,

        }

        const playQuestionRender = selectionList[Type]

        if(playQuestionRender) return playQuestionRender()
        else return <CurrentQuestionTypeNotSupported />

        
    }

    const renderMultipleChoiceQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question, Answers} = element
        const {Code, Base_ImageURL, Choices, Latex} = Question

        return(
            <Space 
                size={'large'}
            >
                <div
                    URL={Base_ImageURL}
                    id = {Code}
                >
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        className="series-play-final-page-item-img"
                    />
                </div>

                <div>
                    <LatexRenderer 
                        latex={Latex}
                    />
                    <br/>
                    <Row>
                        {Choices.map((c, ci) => {
                        const {ImageURL, Latex, Id, Correct} = c
                        const isSelected = Answers.map(a => a.Id).includes(Id)

                        const choiceCorrectness = (Correct)   

                        let className = !isSelected ? "multiple-choice-question-play-choice-container-final-page" : "multiple-choice-question-play-choice-container-selected-final-page"

                        className += choiceCorrectness ? ' multiple-choice-question-play-choice-container-correct' : ' multiple-choice-question-play-choice-container-incorrect'

                        return(
                            <Col
                                key={c.Id}
                                className={className}
                            >
                                <div
                                    className="multiple-choice-question-play-choice-container-inner"
                                >
                                    <p
                                        className="multiple-choice-question-play-index"
                                    >
                                        {ci+1}
                                    </p>
                                    <Space
                                    direction="vertical"
                                    >
                                        {ImageURL && 
                                        <img 
                                            alt={"choice"+ci+1}
                                            src={ImageURL}
                                            className="multiple-choice-question-play-choice-img"
                                        />}

                                        {Latex &&
                                        <LatexRenderer 
                                            latex={Latex}
                                        />}
                                    </Space>

                                    
                                </div>
                            </Col>)
                    })}
                    </Row>
                </div>
            </Space>
        )
    }

    const renderKeyboardQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question, Answers} = element
        const {Code, Base_ImageURL, Latex, Answers: correctAnswers} = Question

        const reducedLatex = Answers[0].List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

        return(
            <Space 
                size={'large'}
            >
                <div
                    URL={Base_ImageURL}
                    id = {Code}

                >
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        className="series-play-final-page-item-img"
                    />
                </div>
                
                <div>
                    <LatexRenderer 
                        latex={Latex}
                    />
                    <br/>
                    <small className="default-gray">Your answer</small>
                    <LatexRenderer latex={"$$"+reducedLatex+"$$"} />

                    <small className="default-gray">Correct answer(s)</small>
                    <List 
                        dataSource={correctAnswers}
                        renderItem={(a, ai) => {
                            const answerReduced = a.AnswerElements
                            .sort((c,d) => c.Id > d.Id ? 1 : -1)
                            .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                            return(
                                <div 
                                    key={ai}
                                >
                                    <LatexRenderer 
                                        latex={"$$"+answerReduced+"$$"}
                                    />
                                </div>
                            )
                        }}
                    />
                </div>
            </Space>
        )
    }

    const renderClickableQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question, Answers} = element

        return(
            <Row className="hq-full-width" gutter={[2,2]}>
                <Col>
                    <small className="default-gray">Your answer(s)</small>
                    <DisplayClickableQuestionAnswers 
                        Question={Question}
                        Answers = {Answers}
                    />
                </Col>
                <Col xs={1} />
                <Col>
                    <small className="default-gray"><span className="default-green">Correct</span> answer(s)</small>
                    <DisplayClickableQuestionAnswers 
                        Question={Question}
                    />
                </Col>
            </Row>
        )

    }

    const renderEnergyBalanceQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question} = element
        const {Code, Base_ImageURL, QuestionText} = Question

        return(
            <Space 
                size={'large'}
                align="start"
            >
                <div
                    URL={Base_ImageURL}
                    id = {Code}

                >
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        className="series-play-final-page-item-img"
                    />
                </div>

                {QuestionText && <div>
                    <LatexRenderer 
                        latex={QuestionText}
                    />
                </div>}
            </Space>
            )

    }

    const renderDiagramQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question} = element
        const {Code, Base_ImageURL, QuestionText} = Question

        return(
            <Space 
                size={'large'}
                align="start"
            >
                <div
                    URL={Base_ImageURL}
                    id = {Code}

                >
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        className="series-play-final-page-item-img"
                    />
                </div>

                {QuestionText && <div>
                    <LatexRenderer 
                        latex={QuestionText}
                    />
                </div>}
            </Space>
            )
    } 

    const renderPVDiagramQuestionFinalPage = (index) => {
        const element = playedElements[index]

        const {Question} = element
        const {Code, Base_ImageURL, QuestionText} = Question

        return(
            <Space 
                size={'large'}
                align="start"
            >
                <div
                    URL={Base_ImageURL}
                    id = {Code}

                >
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        className="series-play-final-page-item-img"
                    />
                </div>

                {QuestionText && <div>
                    <LatexRenderer 
                        latex={QuestionText}
                    />
                </div>}
            </Space>
            )
    }

    const elementActionList = (index) => [
    {
        key: 'play_question',
        label: 'Re-play',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element

            setSelectedQuestion(Question)
            setShowPlayQuestionModal(true)
        }
    },
    {
        key: 'ref_question',
        label: 'Reference question',
        icon: <QrcodeOutlined style={{color:'green'}} /> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element

            referenceQuestion(Question)

            const {Code} = Question

            notificationApi.destroy()

            notificationApi.open({
                message: 'Reference',
                description:
                <div>

                    {loadingReferenceQuestion && <Skeleton />}

                    {(!loadingReferenceQuestion && referenceQuestionResult && 
                        <div>
                            <Space 
                            direction="vertical" align="center">
                                <p>{Code}</p>
                                <QRCode value={referenceQuestionResult || '-'} />
                                <Input
                                    placeholder="-"
                                    maxLength={60}
                                    value={referenceQuestionResult}
                                    disabled = {true}
                                />
                            </Space>

                        </div>)}
                </div>,
                duration: 0,
            })
        }
    },
    {
        key: 'send_feedback',
        label: 'Send feedback',
        icon: <NotificationOutlined 
        style={{color:'blueviolet'}}
        /> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element

            setShowSendFeedbackModal(true)
            setSelectedQuestion(Question)
        }
    },
    !isStudent  
    && 
    {
        key: 'edit_view',
        label: 'Edit/View question',
        icon: <EyeOutlined 
        style={{color:'blueviolet'}}
        /> ,
        onClick: () => {
            const element = playedElements[index]
            const {Question} = element
            goToQuestionViewEdit(Question)
        }
    }].filter(a => a)

    const renderFinalPage = () => {

        const answersDisplayIndexer = (type, index) => {
            const comp = ({
                [MULTIPLE_CHOICE_QUESTION_PARAMETER]: (index) => renderMultipleChoiceQuestionFinalPage(index),
                [KEYBOARD_QUESTION_PARAMETER]: (index) =>  renderKeyboardQuestionFinalPage(index),
                [CLICKABLE_QUESTION_PARAMETER]: (index) =>  renderClickableQuestionFinalPage(index),
                [ENERGY_BALANCE_QUESTION_PARAMETER]: (index) => renderEnergyBalanceQuestionFinalPage(index),
                [DIAGRAM_QUESTION_PARAMETER]: (index) => renderDiagramQuestionFinalPage(index),
                [PV_DIAGRAM_QUESTION_PARAMETER]: (index) => renderPVDiagramQuestionFinalPage(index)
    
            })[type]

            if(comp) return comp(index)
            else return <CurrentQuestionTypeNotSupported />
             
        }
        
        let StatsMap = {}
    
        if(SeriesStatistics && SeriesStatistics.ElementStats){
            for(let e of SeriesStatistics.ElementStats){
                StatsMap[e.Id] = e
            }
        }

        return(
            <Row>
                {seriesElements.map((e, ei) => {
                     const {Question} = e
                     const {Code, Type, PDFURL} = Question
 
                     const playStats = playedElements[ei]
                     const {Correct, Score, Time} = playStats
                     const time = Math.ceil(Time/1000)

                    const score = Math.trunc(parseFloat(Score) * 10).toFixed(0) + ' XP'

                    let eStats = StatsMap[e.Id]

                    let successPercentage = 0
                    let medianPlayTime = 0

                    if(eStats){
                        const {TotalPlay, TotalSuccessPlay, MedianPlayTime} = eStats
        
                        successPercentage = (100*TotalSuccessPlay/(TotalPlay+1)).toFixed(0) + "%"
                        medianPlayTime =  MedianPlayTime
                    }

                    return( 
                        <Col
                            key={e.Id}
                            lg={{span:12}}
                            md={{span:12}}
                            sm={{span:12}}
                            xs={{span:24}}
                            className="series-play-final-page-item-container-base"
                        >
                            <div className="series-play-final-page-item-container">
                                <div className="series-play-final-page-item-container-inner">
                                   
                                    <Space 
                                    className="series-play-final-page-item-header"
                                    size={'middle'}>
                                    
                                    <Dropdown
                                        menu={{
                                            items:elementActionList(ei),
                                            title:'Actions'
                                        }}
                                    >
                                        <Space className="hoverable-plus">
                                            <MoreOutlined />
                                            <p >
                                                {Code}
                                            </p>
                                        </Space>
                                    </Dropdown>
                                    <span>
                                    {Correct ? 
                                        <CheckCircleFilled
                                        className="default-green"
                                        /> 
                                        : 
                                        <CloseCircleFilled
                                        className="default-red"
                                        />
                                    }
                                    </span>
                                    </Space>


                                    {answersDisplayIndexer(Type, ei)}
                                    <Divider />
                                    <Space size={'large'}>
                                        <Space
                                            size={'large'}
                                            align="start"
                                        >
                                            <div
                                            className="series-play-final-page-item-statistics-score-time"
                                            >
                                                <Space size={'small'}>
                                                    <StarFilled 
                                                        className="default-orange"
                                                    />
                                                    <p>{score}</p>
                                                    {PDFURL && 
                                                    <ViewSolutionComponent 
                                                        question={Question}
                                                        correct={Correct}
                                                    />}
                                                </Space>   
                                                <Space size={'small'}>
                                                    <span><ClockCircleOutlined /> </span>
                                                    <p>{time} {''} <i>
                                                        <small
                                                            className="default-gray"
                                                        >
                                                        seconds
                                                        </small>
                                                        </i></p>
                                                    
                                                </Space>   
                                                                                         
                                            </div>
                                            <div>
                                                <small
                                                    className="default-gray"
                                                >
                                                    How others performed
                                                </small>
                                                {isLoadingSeriesStatistics && <Spin/>}

                                                {!isLoadingSeries && 
                                                <div>
                                                     <p
                                                         className="default-gray"
                                                    >
                                                            Success rate
                                                    </p>
                                                    <Space size={'small'}>
                                                        <AreaChartOutlined  
                                                            className="default-green"
                                                        />
                                                        <p>{successPercentage}</p>
                                                        
                                                    </Space>   
                                                    <br/>
                                                    <p
                                                         className="default-gray"
                                                    >
                                                            Median play time
                                                    </p>
                                                    <Space size={'small'}>
                                                        <span><ClockCircleOutlined /> </span>
                                                        <p>{medianPlayTime} {''} <i>
                                                            <small
                                                                className="default-gray"
                                                            >
                                                            seconds
                                                            </small>
                                                            </i></p>
                                                        
                                                    </Space> 
                                                </div>}
                                            </div>
                                            <div>
                                                <Button
                                                    icon={<NotificationOutlined style={{color:'blueviolet'}} />}
                                                    size="small"
                                                    onClick={() => {                                                
                                                        setShowSendFeedbackModal(true)
                                                        setSelectedQuestion(Question)
                                                    }}>
                                                    Send feedback
                                                </Button>
                                            </div>

                                        </Space>

                                    </Space>
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>
        )
    }

    const renderSeries = () => {
        const {Code} = Series
        const progress = Math.trunc(100 * (playedElements.length/seriesElements.length)) 
        return(
            <div
            >
                <Space 
                className="series-play-top-header"
                size={'large'}>
                    <p>{Code}</p>
                    
                    <Timer stop={stopTimer}/>
                    <Progress 
                    
                    percent={progress} 
                    
                    steps={seriesElements.length}

                    strokeColor={playedElements.map(e => e.Correct ? green[6]:red[5])} />
                </Space>
                <Divider />
                {!showFinalPage && renderQuestion()}
                {showFinalPage && renderFinalPage()}

                {renderActionButtons()}

            </div>
        )
    }

    return(
        <div
            ref={baseDiv}
        >
            {contextHolder}
            {notificationContextHolder}
            {isLoadingSeries && <Skeleton />}
            {!isLoadingSeries && Series && renderSeries()}

            {errorGetSeries && !isLoadingSeries && 
                <ErrorComponent 
                    error={errorGetSeries}
                    onReload={() => loadData()}
                />
            }

            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />

            <SendFeedback 
                open={showSendFeedbackModal}
                onClose={() => setShowSendFeedbackModal(false)}
                question={selectedQuestion}
            />
        </div>
    )
}