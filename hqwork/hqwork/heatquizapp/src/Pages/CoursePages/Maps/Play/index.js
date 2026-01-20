import React from "react";
import { PagesWrapper } from "../../../../PagesWrapper";
import { useParams } from "react-router-dom";
import { useMaps } from "../../../../contexts/MapsContext";
import { useSeries } from "../../../../contexts/SeriesContext";
import { useEffect } from "react";
import { Button, Col, FloatButton, Input, Modal, Result, Row, Skeleton, Space, message, notification } from "antd";
import { useState } from "react";
import { ZoomInOutlined, ZoomOutOutlined, CloseOutlined, FlagTwoTone, LockTwoTone, PushpinOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { MAP_SCALE_REDUCTION } from "./constants";
import { SeriesPlay } from "../../../../Components/SeriesPlay";
import { FixURL, goToMapPlay } from "../../../../services/Auxillary";

import './Play.css'
import { getMapKey_LS, getMapPlayStatisticsRequest_LS, recordMapVisit_LS, updateMapKey_LS, updateMapPlayStatisticsRequest_LS } from "../../../../services/Maps";
import { useAuth } from "../../../../contexts/AuthContext";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { PlayQuestionnaireInSeries } from "../../../Questionnaire/PlayInSeries/PlayQuestionnaireInSeries";
import { AudioPlayerComponent } from "../../../../Components/AudioPlayer/AudioPlayer";
import { ForethoughtPhase } from "./ForethoughtPhase";

var PDF_BTN = require('./Images/Button_PDF.png')
var VIDEO_BTN = require('./Images/Button_Video.png')
var LINK_BTN = require('./Images/Button_Link.png')
var SERIES_BTN = require('./Images/Button_QuestionSeries.png')

export function MapPlay(){
    const {
        loadingMap, getMapError, map, getMap,
        addMapPDFStatistic
    } = useMaps()
    const {
        SeriesViewEdit, getSeriesViewEdit, isLoadingSeriesViewEdit
    } = useSeries()
    const {id} = useParams()

    const [api, contextHolder] = message.useMessage()
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const {currentPlayerKey} = useAuth()

    const [playStats, setPlayStats] = useState(null)

    const [imageIntialWidth, setImageIntialWidth] = useState(0)
    const [imageBaseWidth, setImageBaseWidth] = useState(0)
    const [topOffset, setTopOffset] = useState(0)

    const baseRef = React.createRef()
    const [zoomScaleIndex, setZoomScaleIndex] = useState(0)

    const [playSeries, setPlaySeries] = useState(false)
    const [selectedMapElement, setSelectedMapElement] = useState(null)
    const [selectedPlaySeries, setSelectedPlaySeries] = useState(null)
    const [selectedPlayQuestionnaire, setSelectedPlayQuestionnaire] = useState(null)

    const [localMapKey, setLocalMapKey] = useState(null)
    const [showSetLocalKey, setShowSetLocalKey] = useState(false)
    const [newKey, setNewKey] = useState(null)

    const [currentAudio, setCurrentAudio] = useState("")
    
    const [showForethoughtPhase, setShowForethoughtPhase] = useState(false)
    const [pendingSeries, setPendingSeries] = useState(null)
    const [pendingMapElement, setPendingMapElement] = useState(null)
    const [topicsSubtopics, setTopicsSubtopics] = useState(null)
    const [preparationResources, setPreparationResources] = useState(null)
    const [selectedGoals, setSelectedGoals] = useState([])

    const initialize = () => {
        getMap(id + "/" + currentPlayerKey)
        
        //Get map play statistics on this device
        const result = getMapPlayStatisticsRequest_LS(id) 
        
        setPlayStats(result)

        setPlaySeries(false)
        setSelectedPlaySeries(null)
        setShowForethoughtPhase(false)
        setPendingSeries(null)
        setPendingMapElement(null)
        setTopicsSubtopics(null)

        //Get locally stored map-specific key
        const key = getMapKey_LS(id)
        setLocalMapKey(key)

        //Record a visit
        recordMapVisit_LS(id)
    }

    useEffect(() => {
        if(currentPlayerKey) initialize();
    }, [id, currentPlayerKey])

    useEffect(() => {
        if(getMapError){
            api.destroy()
            api.error(getMapError)
        }
    }, [getMapError])

    useEffect(() => {
        if(map && baseRef){
            const styles = baseRef.current.getBoundingClientRect()
            const width = styles.width
            
            const parentStyles = window.getComputedStyle(baseRef.current.parentNode)
            const offset = parseInt(parentStyles.getPropertyValue('padding-top').replace('px', ' '))

            setImageIntialWidth(width)
            setImageBaseWidth(width)
            setTopOffset(offset)
        }
    }, [map])


    const getElementPositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth)/BackgroundImageWidth)* p.Width,
        height: ((imageWidth)/BackgroundImageWidth)*p.Length ,
        left: ((imageWidth)/BackgroundImageWidth)*p.X,
        top:  ((imageWidth)/BackgroundImageWidth)*p.Y + topOffset,
    })

    const getBadgePositionStyle = (imageWidth, BackgroundImageWidth, p) => ({
        width: ((imageWidth)/BackgroundImageWidth)* p.Badge_Width,
        height: ((imageWidth)/BackgroundImageWidth)*p.Badge_Length ,
        left: ((imageWidth)/BackgroundImageWidth)*p.Badge_X,
        top:  ((imageWidth)/BackgroundImageWidth)*p.Badge_Y + topOffset,
    })

    const playSeriesActivate = (s, e) => {
        notificationApi.destroy()
        
        // Check if this is map 31 - show forethought phase first
        if(String(id) === "31") {
            setPendingSeries(s)
            setPendingMapElement(e)
            // Fetch extended series data to get topics/subtopics
            if(s && s.Code) {
                getSeriesViewEdit(s.Code)
            }
        } else {
            // For other maps, proceed directly to quiz
            setPlaySeries(true)
            setSelectedPlaySeries(s)
            setSelectedMapElement(e)
        }
    }
    
    // Extract topics/subtopics and preparation resources from series data
    useEffect(() => {
        if(SeriesViewEdit && String(id) === "31") {
            const topicsMap = {}
            const pdfLinksSet = new Set()
            const videoLinksSet = new Set()
            
            if(SeriesViewEdit.Elements) {
                SeriesViewEdit.Elements.forEach(element => {
                    // Get question from element (could be ClickableQuestion, KeyboardQuestion, MultipleChoiceQuestion, or Question)
                    // Note: Extension data is on the base Question property, not on the specific question types
                    const question = element.Question || 
                                   element.ClickableQuestion || 
                                   element.KeyboardQuestion || 
                                   element.MultipleChoiceQuestion
                    
                    if(question) {
                        // Priority: Use Extension data if available (for CourseMap 31), otherwise use QuestionBase data
                        let topicName = null
                        let subtopicName = null
                        
                        // Check Extension on the question (Extension comes from QuestionBase)
                        // Debug: Log Extension data to verify it's present
                        if(String(id) === "31" && question.Id) {
                            console.log('Question ID:', question.Id, 'Extension:', question.Extension, 'Extension keys:', question.Extension ? Object.keys(question.Extension) : 'null')
                        }
                        
                        if(question.Extension && question.Extension.Topic) {
                            // Use extension data (from QuestionMap31Extension table)
                            topicName = question.Extension.Topic
                            subtopicName = question.Extension.Sub_Topic || null
                            
                            // Collect PDF and video links from extension table
                            if(question.Extension.Link_Pdf) {
                                pdfLinksSet.add(question.Extension.Link_Pdf)
                            }
                            if(question.Extension.Link_Videos) {
                                videoLinksSet.add(question.Extension.Link_Videos)
                            }
                        } else if(question.Subtopic) {
                            // Fallback to QuestionBase data
                            const subtopic = question.Subtopic
                            const topic = subtopic.Topic
                            
                            if(topic && subtopic) {
                                topicName = topic.Name || topic.Code || 'Unknown Topic'
                                subtopicName = subtopic.Name || subtopic.Code || 'Unknown Subtopic'
                            }
                        }
                        
                        if(topicName) {
                            if(!topicsMap[topicName]) {
                                topicsMap[topicName] = new Set()
                            }
                            if(subtopicName) {
                                topicsMap[topicName].add(subtopicName)
                            }
                        }
                    }
                })
            }
            
            // Convert Sets to Arrays
            const topicsSubtopicsData = Object.keys(topicsMap).map(topicName => ({
                topic: topicName,
                subtopics: Array.from(topicsMap[topicName])
            }))
            
            // Prepare resources: Combine map element links with question-specific links (deduplicated)
            const mapElementPDF = pendingMapElement?.PDFURL
            const mapElementVideo = pendingMapElement?.VideoURL || pendingMapElement?.ExternalVideoLink
            
            const allPDFs = new Set()
            const allVideos = new Set()
            
            // Add map element resources first (if available)
            if(mapElementPDF) allPDFs.add(mapElementPDF)
            if(mapElementVideo) allVideos.add(mapElementVideo)
            
            // Add question-specific resources (will automatically deduplicate)
            pdfLinksSet.forEach(url => {
                if(url && url.trim() !== '') {
                    allPDFs.add(url)
                }
            })
            videoLinksSet.forEach(url => {
                if(url && url.trim() !== '') {
                    allVideos.add(url)
                }
            })
            
            // Convert to arrays with metadata
            const resources = {
                pdfs: Array.from(allPDFs).map(url => ({
                    url: url,
                    type: 'pdf',
                    source: url === mapElementPDF ? 'map' : 'question'
                })),
                videos: Array.from(allVideos).map(url => ({
                    url: url,
                    type: 'video',
                    source: url === mapElementVideo ? 'map' : 'question'
                }))
            }
            
            setTopicsSubtopics(topicsSubtopicsData)
            setPreparationResources(resources)
            setShowForethoughtPhase(true)
        }
    }, [SeriesViewEdit, id, pendingMapElement])
    
    const handleForethoughtComplete = (forethoughtData) => {
        // Store forethought data if needed (could be saved to localStorage or sent to backend)
        console.log('Forethought phase completed:', forethoughtData)
        
        // Store goals for self-reflection phase
        if (forethoughtData.goals) {
            setSelectedGoals(forethoughtData.goals)
        }
        
        // Proceed to quiz
        setShowForethoughtPhase(false)
        setPlaySeries(true)
        setSelectedPlaySeries(pendingSeries)
        setSelectedMapElement(pendingMapElement)
        
        // Clear pending data
        setPendingSeries(null)
        setPendingMapElement(null)
    }   

    const renderRequiredElement = (e, requiredElementFull, Threshold) => {
        const {Title} = e

        notificationApi.open({
            message: Title,
            style:{width:'25vw', minWidth:'400px'},
            description:
            <Result 
                icon={<LockTwoTone />}
                subTitle={
                    <div>
                        <p>Solve at least <u>{Threshold}%</u> of question series of element </p>
                        <strong
                        className="map-required-element-modal-click"
                        onClick={() => onClickElement(requiredElementFull)}>
                            {requiredElementFull.Title}
                        </strong>
                        <p>successfully to unlock</p>
                    </div>
                }
            />
             ,
             duration: 0,
             placement:'top',
             icon:<FlagTwoTone/>
        })
    }

    const addPDFStat = (e) => {
        const data = new FormData()
        data.append('ElementId', e.Id)
        data.append('Player', currentPlayerKey)

        addMapPDFStatistic(data)
    }

    const onClickElement = (e) => {
        try {
            notificationApi.destroy()
            setSelectedMapElement(e)

            const {QuestionSeries, PDFURL, ExternalVideoLink, VideoURL, Relations, MapAttachment, QuestionnaireRelation, AudioURL} = e

            if(QuestionnaireRelation){
                notificationApi.open({
                    style:{width:'36vw', minWidth:'400px'},
                    message: 'Survey Required',
                    description:
                     <Row
                        gutter={[4,4]}
                     >
                        <Space>
                            <p className="default-gray">Before accessing educational material please click to do a survey:</p>
                            <Button 
                                size="small"
                                icon={<ArrowRightOutlined className="default-title"/>}
                                onClick={() => {
                                    setSelectedPlayQuestionnaire(QuestionnaireRelation.Questionnaire)
                                    notificationApi.destroy()
                                }}
                            />
                        </Space>
                     </Row>,
                     duration: 0,
                     placement:'top',
                     icon:<FlagTwoTone/>
                })

                return
            }

            const requiredElementsIdsInitial = Relations ? Relations.map(a => a.RequiredElementId) : []

            const requiredElements = map.Elements.filter(e => e.QuestionSeries && requiredElementsIdsInitial.includes(e.Id))
            let requiredElementsThresholds = {}

            for(let r of Relations || []){
                requiredElementsThresholds[r.RequiredElementId] = r.Threshold 
            }
        
            for(let re of requiredElements){
                const {QuestionSeries: requiredSeries} = re

                let existingElementIndex = playStats.ElementsProgress.map((a, ai) => a.Id === re.Id ? (ai) : null)[0]

                const progress = playStats.ElementsProgress[existingElementIndex]

                const threshold = requiredElementsThresholds[re.Id]

                if(!progress){

                    renderRequiredElement(e, re, threshold)

                    return
                }
            
                const finalProgress = evaluateElementProgress(requiredSeries, progress)

                if(finalProgress < threshold){

                    renderRequiredElement(e, re, threshold)

                    return
                }
            }

          

            //Only question series 
            if(QuestionSeries && !(PDFURL || ExternalVideoLink || VideoURL || MapAttachment || AudioURL)){
                playSeriesActivate(QuestionSeries, e)
                return
            }

        //Only pdf
        if(PDFURL && !(QuestionSeries || ExternalVideoLink || VideoURL|| MapAttachment || AudioURL)){
            window.open(PDFURL)
            addPDFStat(e)
            return
        }   

        //Only link
        if(ExternalVideoLink && !(PDFURL || QuestionSeries || VideoURL|| MapAttachment || AudioURL)){
            window.open(ExternalVideoLink)
            return
        }

        //Only video
        if(VideoURL && !(PDFURL || QuestionSeries || ExternalVideoLink|| MapAttachment || AudioURL)){
            window.open(VideoURL)
            return
        }

        //Only Audio
        if(AudioURL && !(PDFURL || QuestionSeries || ExternalVideoLink|| MapAttachment || VideoURL)){
            setCurrentAudio("")
            setCurrentAudio(AudioURL)
            notificationApi.destroy()
            
            return
        }

        const {Title, CourseMapElementImages} = e

        let seriesImage = null
        let pdfImage = null
        let videoImage = null
        let linkImage = null

        if(CourseMapElementImages){
            seriesImage = CourseMapElementImages.Play
            pdfImage = CourseMapElementImages.PDF
            videoImage = CourseMapElementImages.Video
            linkImage = CourseMapElementImages.Link
        }

        notificationApi.open({
            style:{width:'36vw', minWidth:'400px'},
            message: Title,
            description:
             <Row
                gutter={[4,4]}
             >
                {QuestionSeries && 
                <Col>
                    <img 
                        alt="series"
                        className="map-element-modal-img"
                        src={seriesImage || SERIES_BTN}
                        onClick={() => playSeriesActivate(QuestionSeries, e)}
                    />
                </Col>}

                {PDFURL && 
                <Col>
                    <img 
                        alt="pdf"
                        className="map-element-modal-img"
                        src={pdfImage || PDF_BTN}
                        onClick={() => {
                            addPDFStat(e)
                            window.open(PDFURL)
                        }}
                    />
                </Col>}
                
                {ExternalVideoLink && 
                    <Col>
                        <img 
                            alt="link"
                            className="map-element-modal-img"
                            src={linkImage || LINK_BTN}
                            onClick={() => window.open(ExternalVideoLink)}
                        />
                    </Col>
                }
                
                {AudioURL && 
                    <Col>
                       <img 
                            alt="video"
                            className="map-element-modal-img"
                            src={VIDEO_BTN}
                            onClick={() => {
                                setCurrentAudio("")
                                setCurrentAudio(AudioURL)
                                notificationApi.destroy()
                               
                            }}
                        />
                    </Col>}


            {MapAttachment && 
                <Col>
                    <Space direction="vertical" align="center">
                        <img 
                            alt="map"
                            className="map-element-modal-img"
                            src={MapAttachment.Map.LargeMapURL}
                            onClick={() => goToMapPlay(MapAttachment.Map)}
                        />
                        <small className="default-gray">{MapAttachment.Map.Title}</small>
                    </Space>
                </Col>
            }
             </Row>,
             duration: 0,
             placement:'top',
             icon:<FlagTwoTone/>
        })
        } catch(error) {
            console.error('Error clicking element:', error)
            api.error('An error occurred: ' + error.message)
        }

    }

    const getBadgeForElement = (badges, element) => {
        // console.log(badges, element, playStats)

        if(!playStats) return null;

        const {QuestionSeries} = element
        let existingElementIndex = playStats.ElementsProgress.map((a, ai) => a.Id === element.Id ? (ai) : null).filter(a => a)[0]

        if([null, undefined].includes(existingElementIndex)) return null;

        const progress = playStats.ElementsProgress[existingElementIndex]

        const finalProgress = evaluateElementProgress(QuestionSeries, progress)
        console.log(finalProgress)

        const findBadge = badges.filter(a => a.Progress <= finalProgress).sort((a, b) => b.Progress - a.Progress)[0]
        console.log(findBadge)

        return findBadge
    }

    const evaluateElementProgress = (targetSeries, progress) => {

        const targetSeriesQuestions = targetSeries.Elements.map(e => e.QuestionId)

        const questionsPlayedCorrectlyInsideSeries = progress.Progress.filter(a => a.Correct).filter(a => targetSeriesQuestions.includes(a.QuestionId))

        const positiveScore = (questionsPlayedCorrectlyInsideSeries.length)

        const targetPlayScore = targetSeries.IsRandom ? targetSeries.RandomSize : targetSeries.Elements.length

        const finalProgress = Math.trunc((100 * positiveScore)/targetPlayScore)

        return finalProgress
    }

    const renderElement = (e) => {
        const {BackgroundImage, Badges, QuestionSeries} = e
        const {LargeMapWidth, ShowBorder} = map

        let toBeDrawBadge = Badges.length && !(e.Badge_X && e.Badge_Y) && QuestionSeries ? getBadgeForElement(Badges, e) : null

        const positionStyle = getElementPositionStyle(imageBaseWidth, LargeMapWidth, e)
        const badgePositionStyle = toBeDrawBadge ? getBadgePositionStyle(imageBaseWidth, LargeMapWidth, e) : null

        const elementStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            cursor:'pointer',
            position: 'absolute',

            [BackgroundImage ? "backgroundImage" : ""]:  "url(" + FixURL(BackgroundImage) + ")",

            border:ShowBorder ? 1 : 0, 
            borderColor: 'gray',
            borderStyle: 'solid'
        })

        return(
            <span
                key={e.Id}
                style={{
                    ...elementStyle,
                    ...positionStyle
                }}

                onClick={() => onClickElement(e)}
            >
                {toBeDrawBadge &&
                <img 
                    alt="badge"
                    className="hq-img"
                    style={badgePositionStyle}
                    src={toBeDrawBadge.URL}
                />}
                
            </span>
        )
    }

    const renderBadge = (e) => {
        
        const {Badges} = e
        const {LargeMapWidth, ShowBorder} = map

        let toBeDrawBadge = getBadgeForElement(Badges, e)

        if(!toBeDrawBadge) return <span key={'empty-badge-' + e.Id}/>;

        const positionStyle = getBadgePositionStyle(imageBaseWidth, LargeMapWidth, e)

        const elementStyle = ({
            alignItems:'center',
            justifyContent:'center',
            display:'flex',
            flexDirection:'column',
            position: 'absolute',

            border:ShowBorder ? 1 : 0, 
            borderColor: 'green',
            borderStyle: 'solid'
        })

        return(
        <span 
            key = {'badge-' + e.Id}
            style = {{
                ...elementStyle,
                ...positionStyle
            }}
        >
             <img 
                src = {toBeDrawBadge.URL}
                alt="badge"
                style = {{
                    width: '100%',
                    height:'100%'
                }}
                />
        </span>)

    }

    const renderMap = () => {
        const {LargeMapURL, LargeMapWidth, LargeMapLength, Title, Elements} = map

        const imageWidth = imageBaseWidth 
        const imageHeight = (LargeMapLength/LargeMapWidth) * imageWidth

        return(
            <div style={{width: imageWidth, height: imageHeight}}>
                <img 
                    src={LargeMapURL}
                    alt={Title}
                    style={{width: imageWidth, height: imageHeight}}
                />

                {Elements.map((e) => renderElement(e))}
                {Elements.filter(e => e.Badge_X && e.Badge_Y && e.Badges.length).map((e) => renderBadge(e))}

                
            </div>
        )
    }

    const ZoomIn = () => {
        const newIndex = zoomScaleIndex === (MAP_SCALE_REDUCTION.length - 1) ? zoomScaleIndex : zoomScaleIndex + 1
        setZoomScaleIndex(newIndex)
        
        const scale = MAP_SCALE_REDUCTION[newIndex]

        setImageBaseWidth(imageIntialWidth/scale)
    }

    const ZoomOut = () => {
        const newIndex = zoomScaleIndex === (0) ? zoomScaleIndex : zoomScaleIndex - 1
        setZoomScaleIndex(newIndex)

        const scale = MAP_SCALE_REDUCTION[newIndex]

        setImageBaseWidth(imageIntialWidth/scale)
    }

    const renderActionList = () => (
    <FloatButton.Group
        shape="circle"
        style={{
            right: 30,
        }}
        >
        
        {currentAudio && 
            <div style={{transform:'rotate(-90deg)'}}>
                <AudioPlayerComponent URL={currentAudio}/>
            </div>
        }
        {currentAudio &&<FloatButton
            tooltip={"Close audio"}
            onClick={() => setCurrentAudio(null)} icon={<CloseOutlined />} 
        />}
        {!(playSeries  || selectedPlayQuestionnaire) && 
        <div>
        <FloatButton
            tooltip={(localMapKey ? localMapKey : "click to set a local key for this map")}
            onClick={() => setShowSetLocalKey(true)} icon={<PushpinOutlined />} 
        />
        <FloatButton onClick={() => ZoomOut()} icon={<ZoomInOutlined  />} />
        <FloatButton onClick={() => ZoomIn()} icon={<ZoomOutOutlined />} />
        </div>}
        
    </FloatButton.Group>)


const setLocalKey = () => {
        
    return(
        <Modal
            open={showSetLocalKey}
            footer={null}
            onCancel={() => setShowSetLocalKey(false)}
        >
            <small className="default-gray">Key</small>
            <Input
                placeholder="Local key"
                type="text"
                onChange={(v) => setNewKey(v.target.value)}
                value={newKey}
            />
            <br/>
            <br/>
            <Button
                size="small"
                type="primary"
                onClick={() => {
                    updateMapKey_LS(id, newKey)
                    
                    initialize()
                    setShowSetLocalKey(false)
                }}
            >
                Update
            </Button>
          
        </Modal>
    )
}

    return(
        <PagesWrapper>
            <div
                ref={baseRef}
            >
                {contextHolder}
                {notificationContextHolder}

                {loadingMap && <Skeleton />}

                {map &&
                <div>
                    {!loadingMap && !playSeries && !selectedPlayQuestionnaire && !showForethoughtPhase && renderMap()}
                    {renderActionList()}
                </div>}

                {getMapError && !loadingMap && 
                    <ErrorComponent 
                        error={getMapError}
                        onReload={() => initialize()}
                    />
                }
                
                {showForethoughtPhase && pendingMapElement &&
                    <ForethoughtPhase
                        onComplete={handleForethoughtComplete}
                        mapElementName={pendingMapElement.Title}
                        topicsSubtopics={topicsSubtopics}
                        isLoadingTopics={isLoadingSeriesViewEdit}
                        preparationResources={preparationResources}
                    />
                }
                    
                {playSeries && selectedPlaySeries && 
                    <SeriesPlay 
                        Code={selectedPlaySeries.Code}
                        mapId={id}
                        goals={selectedGoals}
                        onExitSeries = {() => {
                            setPlaySeries(false)
                            setShowForethoughtPhase(false)
                            setPendingSeries(null)
                            setPendingMapElement(null)
                            setSelectedGoals([])
                        }}
                        onFinishPlaySeries = {(data) => {
                            let _selectedMapElement = ({...selectedMapElement})

                            const {QuestionSeries} = _selectedMapElement

                            let _playStats = ({...playStats})

                            const progress =
                            ({
                                Id: selectedMapElement.Id,
                                Progress: (data.map((a) => ({QuestionId: a.Question.Id, Correct: a.Correct})))
                            })
                           
                            
                            let existingElementIndex = _playStats.ElementsProgress
                            .map((a, ai) => (a.Id === _selectedMapElement.Id) ? ai : null)
                            .filter(a => a !== null)[0]

                            const exsitingProgress = playStats.ElementsProgress[existingElementIndex]

                            //value in (0 - 100)%
                            const finalProgressPercentage = evaluateElementProgress(QuestionSeries, progress)

                            if(exsitingProgress){
                                    const existingProgressPercentage = evaluateElementProgress(QuestionSeries, exsitingProgress)

                                    if(finalProgressPercentage > existingProgressPercentage){
                                        _playStats.ElementsProgress[existingElementIndex] = progress
                                    }
                            }
                            else{
                                _playStats.ElementsProgress.push(progress)

                            }

                            const updatedPlayStats = updateMapPlayStatisticsRequest_LS(({..._playStats, Id: id}))
                            setPlayStats(updatedPlayStats)
                        }}

                        mapKey = {localMapKey}
                        mapName={map.Title}
                        mapElementName={selectedMapElement.Title}
                    />
                }

                {selectedPlayQuestionnaire && 
                <PlayQuestionnaireInSeries
                    id={selectedPlayQuestionnaire.Id}
                    onFinish={() => {
                        setSelectedPlayQuestionnaire(null)
                        setSelectedMapElement(null)
                        initialize()
                    }}
                    Key = {localMapKey}
                    mapElement={selectedMapElement}
                />}

                {setLocalKey()}
            </div>
        </PagesWrapper>
    )
}