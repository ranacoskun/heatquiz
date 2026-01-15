import React, { useEffect, useState } from "react";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import {Col, Divider, List, Row, Skeleton, Space, Steps, Tooltip, message } from "antd";
import { ErrorComponent } from "../../../../Components/ErrorComponent";
import { FixURL } from "../../../../services/Auxillary";
import { LatexRenderer } from "../../../../Components/LatexRenderer";
import { CENTER_DIRECTION, EAST_DIRECTION, NORTH_DIRECTION, SOUTH_DIRECTION, WEST_DIRECTION, FIRST_CLICK, SECOND_CLICK, THIRD_CLICK } from "./Constants";
import Xarrow from "react-xarrows";
import { CloseCircleFilled, CheckCircleFilled, SmileTwoTone, FrownTwoTone} from '@ant-design/icons';

import './Play.css'
import { Keyboard } from "../../../../Components/Keyboard";
import { checkKeyboardAnswerIsCorrect, checkKeyboardAnswerIsCorrectEnergyBalanceQuestionTermsOnly, validateKeyboardAnswer } from "../../KeyboardQuestion/Functions";
import { NextButton } from "../../../../Components/NextButton";
import { ViewSolutionComponent } from "../../../../Components/ViewSolutionComponent";
import { useAuth } from "../../../../contexts/AuthContext";
import { CommentInPlayComponent } from "../../../../Components/CommentInPlayComponent/CommentInPlayComponent";

export function EnergyBalanceQuestionPlay({Id, deadLoad, onUpdateSeriesPlayElements, nextAction, mapKey}){

    const { energyBalanceQuestionPlay, errorGetEnergyBalanceQuestionPlay, isLoadingEnergyBalanceQuestionPlay, getEnergyBalanceQuestionPlay,
        postQuestionStatistic} = useQuestions()

    const {currentPlayerKey} = useAuth()

    const boxRef = React.createRef()

    const [boxLocationX, setBoxLocationX] = useState(0)
    const [boxLocationY, setBoxLocationY] = useState(0)

    const [currentTab, setCurrentTab] = useState(0)

    const [selectedCV, setSelectedCV] = useState(null)

    const [CVValidation, setCVValidation] = useState({})

    const [termsFocused, setTermsFocused] = useState(false)

    const [termsContainer, setTermsContainer] = useState({
        North: [],
        South: [],
        East: [],
        West: [],
        Center: []
    })

    const [termsValidation, setTermsValidation] = useState({})
    
    const [selectedTerm, setSelectedTerm] = useState(null)

    const [selectedTermDefine, setSelectedTermDefine] = useState(null)
    const [selectedTermDefineIndex, setSelectedTermDefineIndex] = useState(0)
    
    const [newListBC, setNewListBC] = useState([])
    const [newListBCValidation, setNewListBCValidation] = useState([])
    const [selectedIndexBC, setSelectedIndexBC] = useState(0)
    
    const [newListIC, setNewListIC] = useState([])
    const [selectedIndexIC, setSelectedIndexIC] = useState(0)
    const [newListICValidation, setNewListICValidation] = useState([])

    const [energyBalanceIsCorrect, setEnergyBalanceIsCorrect] = useState(false)

    const [checkAnswer, setCheckAnswer] = useState(false)
    const [finalScore, setFinalScore] = useState('')

    const [startTime, setStartTime] = useState(0)

    const [api, contextHolder] = message.useMessage()

    const initializeQuestion = () => {
        setBoxLocationX(0)
        setBoxLocationY(0)

        setCurrentTab(0)

        setSelectedCV(null)

        setCVValidation({})

        setTermsContainer({
            North: [],
            South: [],
            East: [],
            West: [],
            Center: []
        })

        setTermsValidation({})

        setSelectedTerm(null)
        setSelectedTermDefine(null)
        setSelectedTermDefineIndex(0)

        setNewListBC([])
        setNewListBCValidation([])
        setSelectedIndexBC(0)

        setNewListIC([])
        setSelectedIndexIC(0)
        setNewListICValidation([])

        setEnergyBalanceIsCorrect(false)

        setCheckAnswer(false)

        setFinalScore(false)
    }

    useEffect(() => {
        if(!deadLoad) getEnergyBalanceQuestionPlay(Id)

        initializeQuestion()
    }, [Id])

    useEffect(() => {
        if(energyBalanceQuestionPlay){
            setStartTime(Date.now())
        }
     }, [energyBalanceQuestionPlay])

    useEffect(() => {
        if(checkAnswer){
            const _finalScore = getFinalScore()

            setFinalScore(_finalScore)
        }
    }, [checkAnswer])

    useEffect(() => {
        if(checkAnswer){
            const isCorrect = (finalScore === 1)

            if(onUpdateSeriesPlayElements){

                const finalStatus = ({
                    Correct: isCorrect,
                    Score: finalScore,
                    Answers: [],
                    Time: Date.now() - startTime,
                    Question: energyBalanceQuestionPlay
                })
    
                onUpdateSeriesPlayElements(finalStatus)
            }
    
            const statsVM = ({
                QuestionId: energyBalanceQuestionPlay.Id,
                Player: currentPlayerKey,
                Correct: isCorrect,
                TotalTime: Math.trunc(0.001 * (Date.now() - startTime)),
                Key: mapKey,
                Score: finalScore
            })
    
            postQuestionStatistic(statsVM)
        }
    }, [finalScore])


    useEffect(() => {
        if(boxRef && boxRef.current){

            const box = boxRef.current
            const styles = box.getBoundingClientRect()

            const {top, left} = styles

            setBoxLocationX(left)
            setBoxLocationY(top)
            
        }
    }, [boxRef])

    const calculateCPdimensions = (imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0) => {
        return({            
            width: (element.Width * specificedWidth) / (imageWidth),
            height: (element.Height * specificedHeight) /( imageHeight),
            left: (element.X * specificedWidth) / (imageWidth),
            top: (element.Y * specificedHeight) / (imageHeight),
        })
    }


    const renderSelectControlVolume = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, ControlVolumes, QuestionText} = energyBalanceQuestionPlay
     
        const newImageWidth = window.innerWidth * 0.40
        const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

        const smallImageWidth = window.innerWidth * 0.20
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        let cvDimesions = null

        if(selectedCV){
            cvDimesions =  calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,newImageWidth, newImageHeight, selectedCV)
        }

        return(
            <Space align="start" size={'large'}>
                <div>
                {QuestionText && 
                <div
                    className="eb-question-question-body"
                >
                    <div style = {{width: newImageWidth*0.95}}>
                        <LatexRenderer latex={QuestionText}/>
                    </div>
                </div>}
                <div 
                    style = {{
                        height:newImageHeight,
                        width: newImageWidth,
                        backgroundImage: `url(${FixURL((selectedCV && selectedCV.ImageURL) ||  Base_ImageURL)})`,
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'contain',
                        border:'1px solid gainsboro'
                    }}
                >

                    {selectedCV && 
                        <div style={{...cvDimesions, position:'relative', border:'1px dashed #28a745' }}>
                            <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
                        </div>    
                    }

                    </div>
                    
                </div>
                &nbsp;
                &nbsp;
                <List 
                    dataSource={ControlVolumes}
                    style={{overflowY:'scroll', height: window.innerHeight * 0.70}}
                    renderItem={(c) => {
                        const {Id, ImageURL} = c

                        const dimensions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, c)

                        return(
                            <div 
                                className="hoverable eb-question-control-volume"
                                key={Id}
                                style = {{
                                    height:smallImageHeight,
                                    width: smallImageWidth,
                                    backgroundImage: `url(${FixURL(ImageURL || Base_ImageURL)})`,
                                    backgroundPosition:'center',
                                    backgroundRepeat:'no-repeat',
                                    backgroundSize:'contain',
                                    cursor:'pointer'}}

                                    onClick = {() => setSelectedCV(c)}                    
                            >
                                <div style={{...dimensions, position:'relative', border:'1px dashed #007bff'}}>
                                    <div style={{width:'100%', height:'100%', backgroundColor:'#f1f4f8', opacity:'40%'}}></div>
                                </div>
                            </div>
                        )
                    }}
                />
            </Space>
        )
    }

    const addTermToDirection = (t, originalTerm, direction) => {
        //Clean the container from this term 
        let container = {}

        const directions = Object.keys(termsContainer)

        //Helper moves
        let shouldFlipDirection = false
        let shouldRemove = false
        let newCounter = FIRST_CLICK


        for(let d of directions){
            container[d] = termsContainer[d].filter(a => a.Id !== t.Id)
        }

        if(originalTerm){
            const isSameDirection = checkIfTermInDirection(t, direction)

            if(isSameDirection){
                if(originalTerm.clickCounter === FIRST_CLICK){
                    shouldFlipDirection = true
                    newCounter = SECOND_CLICK
                }
                else if(originalTerm.clickCounter === SECOND_CLICK){
                    shouldRemove = true
                }
                
            }
            else{
                newCounter = FIRST_CLICK
            }

            if(shouldRemove){
                removeTermFromBalance(t)
                return;
            }

            container[direction].push({
                ...originalTerm,
                Questions: t.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}})),
                Inflow: shouldFlipDirection ? !originalTerm.Inflow : originalTerm.Inflow,
                IsSource: shouldFlipDirection ? !originalTerm.IsSource : originalTerm.IsSource,
                clickCounter: newCounter
            })

        }
        else{
            container[direction].push({
                ...t,
                Questions: t.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}})),
                Inflow: true,
                IsSource: true,
                clickCounter: FIRST_CLICK
            })
        }

        setTermsContainer(container)

        setSelectedTerm(null)        
    }

    const removeTermFromBalance = (t) => {
        //Clean the container from this term 
        let container = {}

        const directions = Object.keys(termsContainer)

        for(let d of directions){
            container[d] = termsContainer[d].filter(a => a.Id !== t.Id)
        }   

        setTermsContainer(container)
    }

    const checkIfTermInDirection = (t, direction) => {
        const term = termsContainer[direction].filter(a=> a.Id === t.Id)[0]

        return (term ? [term, direction] : null)
    }

    const flipTermSign = (t, direction, currentSign) => {

        let container = {...termsContainer}

        let _containerD =  [...container[direction]]

        _containerD = _containerD.filter(a => a.Id != t.Id)

        let originalTerm = null

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            originalTerm = termsContainer[d].filter(a => a.Id === t.Id)[0]

            if(originalTerm) break;
        }

        if(originalTerm){
            _containerD.push({...t, Inflow: !currentSign, IsSource: !currentSign, Questions: originalTerm.Questions})

        }
        else{
            _containerD.push({...t, Inflow: !currentSign, IsSource: !currentSign})
        }

        container[direction] = _containerD

        setTermsContainer(container)
        
    }

    const renderItemInteractionLine = (t) => {
        const totalWidthHeight = 0.05*window.innerWidth
        const shapesGap = 0.1*totalWidthHeight
        const width1 = 0.125 * totalWidthHeight
        const width2 = totalWidthHeight - 2 * shapesGap - 2 * width1


        const isNorthSelected = checkIfTermInDirection(t, NORTH_DIRECTION)
        const isEastSelected = checkIfTermInDirection(t, EAST_DIRECTION)
        const isWestSelected = checkIfTermInDirection(t, WEST_DIRECTION)
        const isSouthSelected = checkIfTermInDirection(t, SOUTH_DIRECTION)
        const isCenterSelected = checkIfTermInDirection(t, CENTER_DIRECTION)

        const isSelected = (isNorthSelected || isEastSelected || isWestSelected || isSouthSelected || isCenterSelected)

        let includedTerm = isSelected && isSelected[0]
        let currentDirection = isSelected && isSelected[1]

        let selectedColor = '#28a745'

        if(includedTerm && currentDirection !== CENTER_DIRECTION && !includedTerm.Inflow){
            selectedColor = '#DC4C64'
        }

        const notSelectedStyle = {backgroundColor:'#f1f4f8', cursor:'pointer', border:'1px solid gray',} // 
        const selectedStyle = {backgroundColor:selectedColor, cursor:'pointer', border:'1px solid ' + selectedColor,} //border:'1px solid green', 

        return(
            <Space direction="vertical">
                <div style={{flexDirection:'row', display:'flex', width: totalWidthHeight, height:totalWidthHeight, border:'1px solid #f1f4f8'}}>
                
                    <div 
                        onClick={() => addTermToDirection(t, includedTerm, EAST_DIRECTION)}
                        style={{width:width1, height: width2, marginRight:shapesGap, marginTop: (shapesGap + width1), ...(isEastSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* East */}
                    </div>

                    <div style={{width:width2, height: totalWidthHeight, marginRight:shapesGap}}>
                        <div 
                            onClick={() => addTermToDirection(t, includedTerm, NORTH_DIRECTION)}
                            style={{width:width2, height: width1, marginBottom:shapesGap, ...(isNorthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* North */}
                        </div>

                        <div
                            onClick={() => addTermToDirection(t, includedTerm, CENTER_DIRECTION)} 
                            style={{width:width2, height: width2, marginBottom:shapesGap, ...(isCenterSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* Center */}
                        </div>

                        <div 
                            onClick={() => addTermToDirection(t, includedTerm, SOUTH_DIRECTION)}
                            style={{width:width2, height: width1, ...(isSouthSelected ? selectedStyle : notSelectedStyle)}}
                        >
                            {/* South */}
                        </div>
                    </div>

                    <div 
                        onClick={() => addTermToDirection(t, includedTerm, WEST_DIRECTION)}
                        style={{width:width1, height: width2, marginTop: (shapesGap + width1), ...(isWestSelected ? selectedStyle : notSelectedStyle)}}
                    >
                        {/* West */}
                    </div>
                </div>
                {isSelected && 
                <Space>
                    <small className="default-gray hq-clickable" onClick={() => removeTermFromBalance(t)}>Remove</small>
                </Space>}

                {isSelected && 
                <Space>
                    {isCenterSelected ? 
                     <div className="eb-question-erm-direction-container">
                        <div 
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.IsSource)}
                        className={"hq-clickable " + (!includedTerm.IsSource ? "eb-question-term-direction-inactive" : "eb-question-term-direction-neutral")}>
                            <span className="eb-question-term-word">Source term</span>
                        </div>

                        <div 
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.IsSource)}
                        className={"hq-clickable " + (includedTerm.IsSource ? "eb-question-term-direction-inactive" : "eb-question-term-direction-neutral")}>
                            <span className="eb-question-term-word">Unsteady term </span>
                        </div>
                    </div>
                    :
                    <div className="eb-question-erm-direction-container">
                        <div
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.Inflow)}
                        className={"hq-clickable " + (!includedTerm.Inflow ? "eb-question-term-direction-inactive" : "eb-question-term-direction-green")}>
                            <span className="eb-question-term-word">Inflow</span>
                        </div>

                        <div 
                        onClick={() => flipTermSign(t, currentDirection, includedTerm.Inflow)}
                        className={"hq-clickable " + (includedTerm.Inflow ? "eb-question-term-direction-inactive" : "eb-question-term-direction-red")}>
                            <span className="eb-question-term-word">Outflow</span>
                        </div>
                    </div>}    
                </Space>}
            </Space>
        )

    }

    const getEnergyBalanceEquation = () => {    
        let text = ""
    
        const heatSources = termsContainer[CENTER_DIRECTION].filter((t) => t.IsSource)
    
        const unsteady_flow_terms = termsContainer[CENTER_DIRECTION].filter((t) => !t.IsSource)
    
        const steady_flow_terms = [...termsContainer[NORTH_DIRECTION], ...termsContainer[SOUTH_DIRECTION], ...termsContainer[EAST_DIRECTION], ...termsContainer[WEST_DIRECTION]]
    
        if(!unsteady_flow_terms.length){
            text = '0 = '
        }
        else{
            for(let term of unsteady_flow_terms){
                text += "{\\color{green}" + '+' + term.Latex + "}"
            }
    
            text += " = "
        }
    
        if(!steady_flow_terms.length && !heatSources.length){
            text += '0'
        }
        else{
            for(let term of steady_flow_terms){
                text += "{\\color{"+(term.Inflow ? 'green' : 'red')+"}" + (term.Inflow ? '+' : '-') + term.Latex + "}"
            }
    
            for(let term of heatSources){
                text += "{\\color{green}" + '+' + term.Latex + "}"
            }
        }
    
        return text
    }

    const getEnergyBalanceEquationFinal = () => {    
        let text = ""
    
        const heatSources = termsContainer[CENTER_DIRECTION].filter((t) => t.IsSource)
    
        const unsteady_flow_terms = termsContainer[CENTER_DIRECTION].filter((t) => !t.IsSource)
    
        const steady_flow_terms = [...termsContainer[NORTH_DIRECTION], ...termsContainer[SOUTH_DIRECTION], ...termsContainer[EAST_DIRECTION], ...termsContainer[WEST_DIRECTION]]
    
        if(!unsteady_flow_terms.length){
            text = '0 = '
        }
        else{
            for(let term of unsteady_flow_terms){
                text += '+' + term.Latex
            }
    
            text += " = "
        }
    
        if(!steady_flow_terms.length && !heatSources.length){
            text += '0'
        }
        else{
            for(let term of steady_flow_terms){
                text +=  (term.Inflow ? '+' : '-') + term.Latex 
            }
    
            for(let term of heatSources){
                text += '+' + term.Latex
            }
        }
    
        return text
    }

    const getCorrectEnergyBalanceEquation = () => {   
        const {EnergyBalanceTerms} = energyBalanceQuestionPlay

        const ebts = EnergyBalanceTerms.filter((t) => !t.IsDummy)
        const text = "0 = " + ebts.reduce((a,b) => a += "+" + b.Latex + " ", '')
        return text
    }

    const checkEnergyBalanceEquation = () => {   
        const {EnergyBalanceTerms} = energyBalanceQuestionPlay

        const mandatoryEBTsIds = EnergyBalanceTerms.filter((t) => !t.IsDummy).map(a => a.Id)
        
        const addedTerms = getAddedTerms()
        const addedTermsIds = getAddedTerms().map(a => a.Id)

        const anyMandatoryNotAdded = mandatoryEBTsIds.filter(id => !addedTermsIds.includes(id)).length

        if(anyMandatoryNotAdded) return false;

        const anyAddedIsDummy = addedTerms.filter(a => a.IsDummy).length

        if(anyAddedIsDummy) return false;

        return true
    }

    const renderEnergyBalanceEquation = () => {
        const equation = getEnergyBalanceEquation()

        return(
            <Space direction="vertical" align="start">
                <br/>
                <p className="default-medium"><u>Energy balance equation</u></p>

                <LatexRenderer className={"default-medium"} latex={"$$" + equation + "$$"}/>
            </Space>
        )
    }

    const addTermToDirectionMainBox = (direction) => {
        if(!selectedTerm) return;
        
        //Clean the container from this term 
        let container = {}

        const directions = Object.keys(termsContainer)

        for(let d of directions){
            container[d] = termsContainer[d].filter(a => a.Id !== selectedTerm.Id)
        }

        let originalTerm = null

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            originalTerm = termsContainer[d].filter(a => a.Id === selectedTerm.Id)[0]

            if(originalTerm) break;
        }

        if(originalTerm){
            container[direction].push({...originalTerm, Questions: selectedTerm.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}}))})
        }
        else{
            container[direction].push({...selectedTerm, Inflow: true, IsSource: true, Questions: selectedTerm.Questions.map((q) => ({...q, AddedAnswer:{List:[], echoNumber:0}}))})

        }

        setTermsContainer(container)

        setSelectedTerm(null)
    }

    const getColorDirection = (direction) => {
        let terms = termsContainer[direction]

        if(!terms.length) return '#f1f4f8';

        if(direction === CENTER_DIRECTION) return '#28a745';

        const allInflow = !terms.map(a => !a.Inflow).filter(a => a).length
        const allOutflow = !terms.map(a => a.Inflow).filter(a => a).length

        if(allInflow) return '#28a745';

        if(allOutflow) return '#DC4C64';

        return '#f0ad4e';
    }

    const renderMainInteractionBox = (cvDimesions) => {

        const {width, height} = cvDimesions

        const totalWidth = width
        const totalHeight = height

        const shapesGapX = 0.1*totalWidth
        const shapesGapY = 0.1*totalHeight

        const width1 = 0.125 * totalWidth
        const width2 = totalWidth - 2 * shapesGapX - 2 * width1

        const height1 = 0.125 * totalHeight
        const height2 = totalHeight - 2 * shapesGapY - 2 * height1

        const northColorCalculation = getColorDirection(NORTH_DIRECTION)
        const southColorCalculation = getColorDirection(SOUTH_DIRECTION)
        const eastColorCalculation = getColorDirection(EAST_DIRECTION)
        const westColorCalculation = getColorDirection(WEST_DIRECTION)
        const centerColorCalculation = getColorDirection(CENTER_DIRECTION)
        
        const elementStyle = {backgroundColor:'#f1f4f8', opacity:'60%', cursor: selectedTerm ? 'pointer' : 'default'}

        return(
            <div
                ref={boxRef}
            >
                <div style={{flexDirection:'row', display:'flex'}}>
                
                <div 
                    onClick={() => addTermToDirectionMainBox(EAST_DIRECTION)}
                    style={{width:width1, height: height2, marginRight:shapesGapX, marginTop: (shapesGapY + height1), ...elementStyle, backgroundColor: eastColorCalculation}}
                >
                    {/* East */}
                </div>

                <div style={{marginRight:shapesGapX}}>
                    <div 
                        onClick={() => addTermToDirectionMainBox(NORTH_DIRECTION)}
                        style={{width:width2, height: height1, marginBottom:shapesGapY, ...elementStyle, backgroundColor: northColorCalculation}}
                    >
                        {/* North */}
                    </div>

                    <div
                        onClick={() => addTermToDirectionMainBox(CENTER_DIRECTION)}
                        style={{width:width2, height: height2, marginBottom:shapesGapY, ...elementStyle, backgroundColor: centerColorCalculation}}
                    >
                        {/* Center */}
                    </div>

                    <div 
                        onClick={() => addTermToDirectionMainBox(SOUTH_DIRECTION)}
                        style={{width:width2, height: height1, ...elementStyle, backgroundColor: southColorCalculation}}
                    >
                        {/* South */}
                    </div>
                </div>

                <div 
                        onClick={() => addTermToDirectionMainBox(WEST_DIRECTION)}
                        style={{width:width1, height: height2, marginTop: (shapesGapY + height1), ...elementStyle, backgroundColor: westColorCalculation}}
                >
                    {/* West */}
                </div>
            </div>
            </div>
        )
    }

    const renderNorthArrows = (cvDimesions) => {
        const northTerms = termsContainer[NORTH_DIRECTION]

        const {width, height, left, top} = cvDimesions

        const arrowLength = 0.025*window.innerWidth
        const latexSpace = 0.25 * arrowLength
        return(
            <div>
                {/* Base */}
                {northTerms.map((t, ti) => {
                    const {Id} = t

                    const tleft = ((ti+1)/(1+ northTerms.length)) * width

                    const style = {top: boxLocationY, left: boxLocationX + tleft , width:1, height:1, position:'absolute'}

                    return(
                        <div 
                        key={ti}
                        style={style}
                        id={Id + "BASE"}>

                        </div>
                    )
                })}

                {/* Tip */}
                {northTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tleft = ((ti+1)/(1+ northTerms.length)) * width
                    const style = {top: boxLocationY  - arrowLength, left:boxLocationX + tleft, width:1, height:1, position:'absolute'}
                    return(
                        <div 
                        style={style}
                        key={ti}
                        id={Id + "TIP"}>
                        </div>
                    )
                })}

                 {/* Latex */}
                 {northTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tleft = ((ti+1)/(1+ northTerms.length)) * width
                    const style = {top: boxLocationY  - arrowLength*1.75 - 25 * ti, left:boxLocationX + tleft, width:1, height:1, position:'absolute'}
                    return(
                        <div 
                        style={style}
                        key={ti}
                        >
                            <LatexRenderer latex={"$$" + Latex + "$$"} />
                        </div>
                    )
                })}

                {/* Arrow */}
                {northTerms.map((t, ti) => {
                    const {Id, Inflow} = t

                    const start = Id + (Inflow ? "TIP" : "BASE")
                    const end = Id + (!Inflow ? "TIP" : "BASE")
                    
                    

                    return(
                    <Xarrow
                        start={start} 
                        end={end} 
                        strokeWidth={2}
                        headSize={4}
                        startAnchor="auto"
                        endAnchor="auto"
                        color={Inflow ?"green":"red"}
                        path={"straight"}
                    />
                   )
                })}
            </div>
        )
    }

    const renderSouthArrows = (cvDimesions) => {
        const southTerms = termsContainer[SOUTH_DIRECTION]

        const {width, height, left, top} = cvDimesions

        const arrowLength = 0.025*window.innerWidth

        return(
            <div>
                {/* Base */}
                {southTerms.map((t, ti) => {
                    const {Id} = t

                    const tleft = ((ti+1)/(1+ southTerms.length)) * width

                    const style = {top: height + boxLocationY, left: boxLocationX + tleft , width:1, height:1, position:'absolute'}

                    return(
                        <div 
                        key={Id}
                        style={style}
                        id={Id + "BASE"}>

                        </div>
                    )
                })}

                {/* Tip */}
                {southTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tleft = ((ti+1)/(1+ southTerms.length)) * width

                    const style = {top: height + boxLocationY + arrowLength, left: boxLocationX + tleft , width:1, height:1, position:'absolute'}

                    return(
                        <div
                        key={Id}
                        style={style}
                        id={Id + "TIP"}>
                        </div>
                    )
                })}

                {/* Latex */}
                {southTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tleft = ((ti+1)/(1+ southTerms.length)) * width
                    const style = {top: height + boxLocationY + arrowLength + 25 * ti, left: boxLocationX + tleft , width:1, height:1, position:'absolute'}
                    return(
                        <div 
                        style={style}
                        key={ti}
                        >
                            <LatexRenderer latex={"$$" + Latex + "$$"} />
                        </div>
                    )
                })}

                {/* Arrow */}
                {southTerms.map((t, ti) => {
                    const {Id, Inflow} = t

                    const start = Id + (Inflow ? "TIP" : "BASE")
                    const end = Id + (!Inflow ? "TIP" : "BASE")
                    
                    return(
                    <Xarrow
                        start={start} 
                        end={end} 
                        strokeWidth={2}
                        headSize={4}
                        startAnchor="auto"
                        endAnchor="auto"
                        color={Inflow ?"green":"red"}
                        path={"straight"}
                    />
                   )
                })}
            </div>
        )
    }

    const renderEastArrows = (cvDimesions) => {
        const eastTerms = termsContainer[EAST_DIRECTION]

        const {width, height, left, top} = cvDimesions

        const arrowLength = 0.025*window.innerWidth

        return(
            <div>
                {/* Base */}
                {eastTerms.map((t, ti) => {
                    const {Id} = t

                    const tTop = ((ti+1)/(1+ eastTerms.length)) * height

                    const style = {top: boxLocationY + tTop, left: boxLocationX, width:1, height:1, position:'absolute'}

                    return(
                        <div 
                        key={Id}
                        style={style}
                        id={Id + "BASE"}>

                        </div>
                    )
                })}

                {/* Tip */}
                {eastTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tTop =  ((ti+1)/(1+ eastTerms.length)) * height

                    const style = {top:boxLocationY + tTop , left: boxLocationX - arrowLength, width:1, height:1, position:'absolute'}
                    return(
                        <div
                        key={Id}
                        style={style}
                        id={Id + "TIP"}>
                        </div>
                    )
                })}

                {/* Latex */}
                {eastTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tTop =  ((ti+1)/(1+ eastTerms.length)) * height
                    const style = {top:boxLocationY + tTop - 50, left: boxLocationX - arrowLength*1.5, width:1, height:1, position:'absolute'}
                    return(
                        <div 
                        style={style}
                        key={ti}
                        >
                            <LatexRenderer latex={"$$" + Latex + "$$"} />
                        </div>
                    )
                })}

                {/* Arrow */}
                {eastTerms.map((t, ti) => {
                    const {Id, Inflow} = t

                    const start = Id + (Inflow ? "TIP" : "BASE")
                    const end = Id + (!Inflow ? "TIP" : "BASE")
                    
                    return(
                    <Xarrow
                        start={start} 
                        end={end} 
                        strokeWidth={2}
                        headSize={4}
                        startAnchor="auto"
                        endAnchor="auto"
                        color={Inflow ?"green":"red"}
                        path={"straight"}
                    />
                   )
                })}
            </div>
        )
    }

    const renderWestArrows = (cvDimesions) => {
        const westTerms = termsContainer[WEST_DIRECTION]

        const {width, height, left, top} = cvDimesions

        const arrowLength = 0.025*window.innerWidth

        return(
            <div>
                {/* Base */}
                {westTerms.map((t, ti) => {
                    const {Id} = t

                    const tTop = ((ti+1)/(1+ westTerms.length)) * height

                    const style = {top: boxLocationY + tTop, left: boxLocationX + width, width:1, height:1, position:'absolute'}

                    return(
                        <div 
                        key={Id}
                        style={style}
                        id={Id + "BASE"}>

                        </div>
                    )
                })}

                {/* Tip */}
                {westTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tTop = ((ti+1)/(1+ westTerms.length)) * height

                    const style = {top:boxLocationY + tTop , left: boxLocationX + width + arrowLength, width:1, height:1, position:'absolute'}
                    return(
                        <div
                        key={Id}
                        style={style}
                        id={Id + "TIP"}>
                        </div>
                    )
                })}

                {/* Latex */}
                {westTerms.map((t, ti) => {
                    const {Id, Latex} = t

                    const tTop =  ((ti+1)/(1+ westTerms.length)) * height
                    const style = {top:boxLocationY + tTop - 25 , left: boxLocationX + width + arrowLength, width:1, height:1, position:'absolute'}
                    return(
                        <div 
                        style={style}
                        key={ti}
                        >
                            <LatexRenderer latex={"$$" + Latex + "$$"} />
                        </div>
                    )
                })}

                {/* Arrow */}
                {westTerms.map((t, ti) => {
                    const {Id, Inflow} = t

                    const start = Id + (Inflow ? "TIP" : "BASE")
                    const end = Id + (!Inflow ? "TIP" : "BASE")
                    
                    return(
                    <Xarrow
                        start={start} 
                        end={end} 
                        strokeWidth={2}
                        headSize={4}
                        startAnchor="auto"
                        endAnchor="auto"
                        color={Inflow ?"green":"red"}
                        path={"straight"}
                    />
                   )
                })}
            </div>
        )
    }

    const getFinalScore = () => {
        let finalTotal = 0
        let finalPosTotal = 0

        //Control volume 
        finalTotal += 1
        finalPosTotal += CVValidation ? 1 : 0

        const {BoundaryConditionLines, InitialConditionLines} = energyBalanceQuestionPlay

        finalTotal += BoundaryConditionLines.length + InitialConditionLines.length

        const BCScore = getBCScore() 
        const ICScore = getICScore() 

        finalPosTotal += BCScore + ICScore

        const {pointsTotal, pointsCorrectTotal} = termsValidation

        finalTotal +=  pointsTotal
        finalPosTotal += pointsCorrectTotal

        return (finalPosTotal + "/" + finalTotal)
    }

    const renderImageWithControlVolume = (hideEB) => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, QuestionText, PDFURL} = energyBalanceQuestionPlay
     
        const newImageWidth = (window.innerWidth * 0.4)
        const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

        let cvDimesions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,newImageWidth, newImageHeight, selectedCV)

        return(
            <div>
                {QuestionText && 
                <div
                    className="eb-question-question-body"
                >
                    <div style = {{width: newImageWidth*0.95}}>
                        <LatexRenderer latex={QuestionText}/>
                    </div>
                </div>}
                <div 
                    style = {{
                        height:newImageHeight,
                        width: newImageWidth,
                        backgroundImage: `url(${FixURL((selectedCV && selectedCV.ImageURL) || Base_ImageURL)})`,
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'contain',
                        border:'1px solid gainsboro',
                        opacity: termsFocused ? '40%' : '100%'
                    }}
                >

                    {selectedCV && 
                        <div style={{...cvDimesions, position:'relative' }}>
                                {renderMainInteractionBox(cvDimesions)}
                        </div>    
                    }

                    {renderNorthArrows(cvDimesions)}
                    {renderSouthArrows(cvDimesions)}
                    {renderEastArrows(cvDimesions)}
                    {renderWestArrows(cvDimesions)}
                 </div>
               
                 <br/>
                 {!hideEB && renderEnergyBalanceEquation()}

                 {checkAnswer && 
                    <Space align="start">
                        <Space
                            className="eb-question-question-final-score"
                            direction="vertical"
                            align="center"
                        >
                            <p className="default-title">{finalScore}</p>
                            <p className="default-gray default-small">Final score</p>
                        </Space>
                        {PDFURL && 
                        <ViewSolutionComponent 
                            question={energyBalanceQuestionPlay}
                            correct={finalScore === 1}
                        />}

                    {nextAction && 
                    <NextButton 
                        nextAction={() => nextAction()}
                      />}
                    </Space>
                 }
            </div>
        )
    }

    const renderEnergyBalanceTerms = () => {
        const {EnergyBalanceTerms} = energyBalanceQuestionPlay

        return(
            <div>
                <br/>
                <Space size={'large'} align="start">

                    {renderImageWithControlVolume()}

                    <Space direction="vertical" align="start" size={"large"}>
                        <p> Please add <strong>energy balance terms</strong> from the list. An energy balance can be established with a subset of terms or all of them. </p>
                        <List 
                        dataSource={EnergyBalanceTerms}
                        style={{overflowY:'scroll', height: window.innerHeight * 0.70, width:0.5*window.innerWidth}}
                        renderItem={(t, ti) => {
                            const {Id, Latex} = t
                            const isSelectedDrop = selectedTerm && selectedTerm.Id === t.Id
                            return(
                                <div key={Id}>
                                    <Space size={'large'} align="start" className={isSelectedDrop ? "highlighted" : ""}>
                                        <p className={!isSelectedDrop ? "default-gray" : "default-green"}>{ti+1}</p>

                                        {renderItemInteractionLine(t)}

                                        <Tooltip
                                            title={
                                                <div>
                                                    <p>To add the term to the balance:</p>
                                                    <br/>
                                                    <p>Click to select and drop in the control volume in the image</p>
                                                    
                                                    <p><u>Or</u></p>
                                                    
                                                    <p>Click on small control volume elements to the left to add the term to the balance</p>
                                                </div>

                                            }
                                            color="white"
                                            placement="right"
                                        >
                                            <div
                                                className={"hoverable-plus " + (isSelectedDrop ? "default-green" : "")}
                                                onClick={() => {
                                                    if(isSelectedDrop){
                                                        setSelectedTerm(null)
                                                        return
                                                    }

                                                    setSelectedTerm(t)
                                                }}
                                            >
                                                <LatexRenderer latex={"$$" + Latex + "$$"}/>
                                            </div>
                                        </Tooltip>
                                        
                                    </Space>

                                    <br/>
                                    <br/>
                                    <br/>
                                </div>
                            )
                        }}
                    />
                    </Space>
                </Space>
               
            </div>
        )
    }

    const getAddedTerms = () => {
        let addedTerms = []

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            addedTerms = [...addedTerms, ...termsContainer[d]]
        }

        return addedTerms
    }

    const getAddedTermsFinal = () => {
        let pointsTotal = 0
        let pointsCorrectTotal = 0

        const {EnergyBalanceTerms} = energyBalanceQuestionPlay

        let addedTerms = []

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            addedTerms = [...addedTerms, ...(termsContainer[d]).map((r) => ({...r, North: false, South: false, East: false, West: false, Center: false, [d]: true}))]
        }

        const allMandatoryTerms = EnergyBalanceTerms.filter((t) => !t.IsDummy)

        const mandatoryTermsNotIncluded = allMandatoryTerms
        .filter(t => !t.IsDummy && !addedTerms.map(x => x.Id).includes(t.Id))

        pointsTotal = pointsTotal + mandatoryTermsNotIncluded.reduce((r, c) => r += (2 + c.Questions.length), 0) /* 2: for direction & adding term*/ 

        const mandatoryTermsIncluded = allMandatoryTerms
        .filter(t => !t.IsDummy && addedTerms.map(x => x.Id).includes(t.Id))
        .map(t => {
            const existingAddedTerm = addedTerms.filter(a => a.Id === t.Id)[0]

            //Check direction
            let directionCorrect = false
            for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
                if(t[d] && existingAddedTerm[d]){
                    directionCorrect = true

                    break;
                }
            }

            //Check solution
            const solutionsValidity = existingAddedTerm.Questions.map((q, qi) => {
                const originalQuestion = t.Questions.filter(qq => qq.Id === q.Id)[0]

                //Check if it flipped or not
                const {Inflow: originalFlowDirection} = q
                const {Inflow: existingFlowDirection} = existingAddedTerm

                const isFlipped = (originalFlowDirection ^ existingFlowDirection) // true if one of them is true and the other is false (T + F pr F + T)

                const {answerStatus} = 
                checkKeyboardAnswerIsCorrectEnergyBalanceQuestionTermsOnly
                (
                q.AddedAnswer,
                t.Questions[qi].Answers,
                )

                return ({answerStatus, isFlipped})
            })


            return ({
                ...t, 
                Questions: existingAddedTerm.Questions,
                directionCorrect,
                solutionsValidity
            })
        })

        pointsTotal = pointsTotal + mandatoryTermsIncluded.reduce((r, c) => r += (2 + c.Questions.length), 0) /* 2: for direction & adding term */ 
        pointsCorrectTotal = pointsCorrectTotal + mandatoryTermsIncluded.reduce((r, c) => {
            const {directionCorrect, solutionsValidity} = c

            r = r + 1 //adding term

            r = r + (directionCorrect ? 1 : 0) // direction

            r = r + solutionsValidity.filter(a => a.answerStatus).length // correct definitions

            return r
        }, 0)

        const dummyTerms = addedTerms.filter(t => t.IsDummy)

        pointsCorrectTotal =  pointsCorrectTotal - dummyTerms.length

        pointsCorrectTotal = pointsCorrectTotal < 0 ? 0 : pointsCorrectTotal

        return({
            dummyTerms,
            mandatoryTermsIncluded,
            mandatoryTermsNotIncluded,

            pointsTotal,
            pointsCorrectTotal
        })
    }   

    const addAnswerToTermQuestion = (l) => {
        let originalTerm = null
        let originalDirection = null

        let originalIndex = null

        for(let d of [NORTH_DIRECTION, SOUTH_DIRECTION, EAST_DIRECTION, WEST_DIRECTION, CENTER_DIRECTION]){
            originalTerm = termsContainer[d].map((a, ai) => ({...a, index: ai})).filter(a => a.Id === selectedTermDefine.Id)[0]

            if(originalTerm){
                originalDirection = d
                originalIndex = originalTerm.index
                break;
            }
        }
        
        if(!originalTerm) return;

        let _terms = ({...termsContainer})

        _terms[originalDirection][originalIndex].Questions[selectedTermDefineIndex] = {..._terms[originalDirection][originalIndex].Questions[selectedTermDefineIndex], AddedAnswer: l}

        setTermsContainer(_terms)

    }

    const renderDefineSpecificTerm = () => {

        const {LatexText, Questions} = selectedTermDefine

        if(Questions.length > 1){
            const question = Questions[selectedTermDefineIndex]

            const {LatexCode: qCode, Keyboard: keyboard} = question

            let _latexCode = qCode
            if(_latexCode.trim().at(-1) !== '=') _latexCode += ' =';

            const list = question.AddedAnswer

            const reducedLatex ="\\textcolor{#0275d8}{"+ _latexCode + "}" + " " + list.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || ''

            const answerValidity = validateKeyboardAnswer(list)
            return(
            <div>
                <Row className="hq-full-width">
                        {Questions.map((q, qi) => {
                            const {LatexCode: qCode, Id: qId} = q

                            const isSelectedDefine = selectedTermDefineIndex === qi

                            const answerValidity = validateKeyboardAnswer(q.AddedAnswer)

                            const answerIsValid = (answerValidity === null)

                            let keyColor = ""

                            if(answerIsValid){
                                keyColor = "eb-question-term-selected-answered"
                            }

                            if(isSelectedDefine){
                                keyColor = "eb-question-term-selected-define"
                            }

                            return(
                                <Col
                                    key={qId}
                                    className={"keyboard-key-item " + (keyColor)}

                                    onClick={() => {
                                        setSelectedTermDefineIndex(qi)
                                    }}
                                >
                                    <LatexRenderer latex={"$$" + qCode + "$$"} />
                                </Col>
                            )
                        })}
                    </Row>

                    <div size={"large"} align="start">
                        {LatexText &&
                        <Space direction="vertical" align="start">
                            <p className="default-gray">Instruction</p>
                            <LatexRenderer latex={LatexText} />
                        </Space>}
                        <br/>
                    </div>

                    <div className="eb-question-term-answer-zone">
                        {reducedLatex && 
                        <LatexRenderer 
                            latex={"$$"+reducedLatex+"$$"}
                        />}
                    </div>
                    <small className="default-red">{answerValidity || ""}</small>
                    <br/>
                    <br/>
                    <Keyboard 
                        Id={keyboard.Id}

                        List={list}

                        onEnterKey={(l) => addAnswerToTermQuestion(l)}
                    />
            </div>
            )
        }

        else{

            const question = Questions[0]

            const {Keyboard: keyboard, LatexCode} = question

            let _latexCode = LatexCode
            if(_latexCode.trim().at(-1) !== '=') _latexCode += ' =';

            const list = question.AddedAnswer

            const answerValidity = validateKeyboardAnswer(list)

            const reducedLatex ="\\textcolor{#0275d8}{"+ _latexCode + "}" + " " + list.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || ''


            return(
                <div>
                    <div size={"large"} align="start">
                        {LatexText &&
                        <Space direction="vertical" align="start">
                            <p className="default-gray">Instruction</p>
                            <LatexRenderer latex={LatexText} />
                        </Space>}
                        <br/>
                    </div>

                    <div>
                        {reducedLatex && 
                        <LatexRenderer 
                            className="eb-question-term-answer-zone"
                            latex={"$$"+reducedLatex+"$$"}
                        />}
                    </div>
                    <small className="default-red">{answerValidity || ""}</small>
                    <br/>
                    <br/>
                    <Keyboard 
                        Id={keyboard.Id}

                        List={list}

                        onEnterKey={(l) => addAnswerToTermQuestion(l)}
                    />
                </div>
            )
        }
    }

    const renderDefineSelectedTerms = () => {
        const addedTerms = getAddedTerms()

        return(
            <Space size={'large'} align="start">
                {renderImageWithControlVolume()}

                <Space direction="vertical" align="start">
                    <Row className="hq-full-width">
                        {addedTerms.map((t) => {
                            const {Id, Latex} = t

                            const isSelectedDefine = selectedTermDefine && selectedTermDefine.Id === Id

                            const answerValidity = validateKeyboardAnswer(t.Questions[0].AddedAnswer)

                            const answerIsValid = (answerValidity === null)

                            let keyColor = ""

                            if(answerIsValid){
                                keyColor = "eb-question-term-selected-answered"
                            }

                            if(isSelectedDefine){
                                keyColor = "eb-question-term-selected-define"
                            }

                            return(
                                <Col
                                    key={Id}
                                    className={"keyboard-key-item " + (keyColor)}

                                    onClick={() => {
                                        if(isSelectedDefine){
                                            setSelectedTermDefine(null)
                                            return
                                        }

                                        setSelectedTermDefine(t)
                                        setSelectedTermDefineIndex(0)
                                    }}
                                >
                                    <LatexRenderer latex={"$$" + Latex + "$$"} />
                                </Col>
                            )
                        })}
                    </Row>

                    {selectedTermDefine && renderDefineSpecificTerm()}
                </Space>
            </Space>
        )
    }

    const renderAddBCs = () => {
        const {BoundryConditionKeyboardId} = energyBalanceQuestionPlay

        return(
            <div className="hq-full-width">
            <p
                        className="default-green hq-clickable"
                        onClick={() => {
                            let _terms = [...newListBC]

                            _terms.push({
                                List:[],
                                echoNumber:0
                            })

                            setSelectedIndexBC(_terms.length - 1)

                            setNewListBC(_terms)
                        }}
                    >Add new boundary condition</p>
                    <br/>
                    <br/>
                    {newListBC.map((a, ai) => {

                        const {List} = a

                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        const checkTerm = validateKeyboardAnswer(a, true)

                        const termSelected = (ai === selectedIndexBC)

                        return(
                            <Space
                                key={ai}
                                className="hq-full-width eb-question-bc-ic-line"
                                direction="vertical"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove boundary condition</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...newListBC]

                                                _terms = _terms.filter((t, ti) => ai !== ti)
                                                setNewListBC(_terms)

                                                setSelectedIndexBC(0)
                                            }}
                                        />
                                    </Tooltip>
                                    <Space
                                        className={"hoverable-plus " + (termSelected ? "default-title highlighted" : "default-gray")}
                                        onClick={() => setSelectedIndexBC(ai)}
                                    >
                                        &nbsp;
                                        <p
                                         className={(termSelected ? "default-title highlighted" : "default-gray")}
                                        >{ai+1}</p>
                                        &nbsp;
                                        <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                    </Space>
                                </Space>

                                <small className="default-red">{checkTerm}</small>
                            </Space>
                        )
                    })}

                    <br/>
                    <br/>
                    {newListBC.length ?
                    <Keyboard
                        Id={BoundryConditionKeyboardId}
                        List={newListBC[selectedIndexBC]}
                        onEnterKey={(l) => {
                            let _terms = [...newListBC]

                            _terms[selectedIndexBC] = l
                            setNewListBC(_terms)
                        }}

                        isEnergyBalance={true}
                    /> : <div/>}
            </div>
        )
    }

    const renderBoundaryConditions = () => {
        
        return(
            <Space size={'large'} align="start">
                {renderImageWithControlVolume()}
                <Space direction="vertical" align="start">
                    {renderAddBCs()}
                </Space>
            </Space>
        )
    }

    const renderAddICs = () => {
        const {InitialConditionKeyboardId} = energyBalanceQuestionPlay

        return(
            <div className="hq-full-width">
            <p
                        className="default-green hq-clickable"
                        onClick={() => {
                            let _terms = [...newListIC]

                            _terms.push({
                                List:[],
                                echoNumber:0
                            })

                            setSelectedIndexIC(_terms.length - 1)

                            setNewListIC(_terms)
                        }}
                    >Add new initial condition</p>
                    <br/>
                    <br/>
                    {newListIC.map((a, ai) => {

                        const {List} = a

                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                        const checkTerm = validateKeyboardAnswer(a, true)

                        const termSelected = (ai === selectedIndexIC)
                        return(
                            <Space
                                key={ai}
                                className="hq-full-width eb-question-bc-ic-line"
                                direction="vertical"
                            >
                                <Space>
                                    &nbsp;
                                    <Tooltip 
                                        title={<p>Click to remove initial condition</p>}
                                        color="white"
                                    >
                                        <CloseCircleFilled 
                                            style={{cursor:'pointer', color:'red'}}

                                            onClick={() => {
                                                let _terms = [...newListIC]

                                                _terms = _terms.filter((t, ti) => ai !== ti)
                                                setNewListIC(_terms)

                                                setSelectedIndexIC(0)
                                            }}
                                        />
                                    </Tooltip>
                                   
                                    <Space
                                        className={"hoverable-plus " + (termSelected ? "default-title highlighted" : "default-gray")}
                                        onClick={() => setSelectedIndexIC(ai)}
                                    >
                                        &nbsp;
                                        <p
                                         className={(termSelected ? "default-title highlighted" : "default-gray")}
                                        >{ai+1}</p>
                                        &nbsp;
                                        <LatexRenderer latex={"$$" +  reducedLatex + "$$"} />
                                    </Space>
                                </Space>

                                <small className="default-red">{checkTerm}</small>
                            </Space>
                        )
                    })}

                    <br/>
                    <br/>
                    {newListIC.length ?
                    <Keyboard
                        Id={InitialConditionKeyboardId}
                        List={newListIC[selectedIndexIC]}
                        onEnterKey={(l) => {
                            let _terms = [...newListIC]

                            _terms[selectedIndexIC] = l
                            setNewListIC(_terms)
                        }}

                        isEnergyBalance={true}
                    /> : <div/>}
            </div>
        )
    }

    const renderInitialConditions = () => {
        
        return(
            <Space size={'large'} align="start">
                {renderImageWithControlVolume()}
                <Space direction="vertical" align="start">
                    {renderAddICs()}
                </Space>
            </Space>
        )
    }

    const getBCScore = () => {
        const pos = newListBCValidation.filter(a => a).length
        const neg = newListBCValidation.filter(a => !a).length

        let finalscore = (pos - neg)
        finalscore = (finalscore < 0) ? 0 : finalscore

        return finalscore
    }

    const getICScore = () => {
        const pos = newListICValidation.filter(a => a).length
        const neg = newListICValidation.filter(a => !a).length

        let finalscore = (pos - neg)
        finalscore = (finalscore < 0) ? 0 : finalscore

        return finalscore
    }

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

    const renderCorrectControlVolume = () => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, ControlVolumes, } = energyBalanceQuestionPlay

        const correctCV = ControlVolumes.filter(a => a.Correct)[0]
        
        const {ImageURL, Comment} = correctCV

        const smallImageWidth = window.innerWidth * 0.20
        const smallImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*smallImageWidth

        const dimensions = calculateCPdimensions(Base_ImageURL_Width, Base_ImageURL_Height,smallImageWidth, smallImageHeight, correctCV)

        return(
            <Space>
                <div 
                    className="hoverable eb-question-control-volume"
                    key={Id}
                    style = {{
                        height:smallImageHeight,
                        width: smallImageWidth,
                        backgroundImage: `url(${FixURL(ImageURL || Base_ImageURL)})`,
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'contain',
                    }}

                    >
                        <div style={{...dimensions, position:'relative', border:'1px dashed green'}}>
                            <div style={{width:'100%', height:'100%', backgroundColor:'green', opacity:'40%'}}></div>
                        </div>
                    </div>

                    {CVValidation ? 
                        <Tooltip
                            color="white"
                            title={<p>Control volume selected correctly</p>}
                        >
                            <i className="default-green hq-clickable">+1</i>
                        </Tooltip>
                        : 
                        <Tooltip
                            color="white"
                            title={<p>Control volume selected correctly</p>}
                        >
                            <i className="default-red hq-clickable">-1</i>
                        </Tooltip>}
                {Comment && <CommentInPlayComponent comment={Comment}/>}
            </Space>
        )
    }

    const renderFinalPage = () => {
        const {BoundaryConditionLines, InitialConditionLines} = energyBalanceQuestionPlay

        const BCScore = getBCScore() + "/" + BoundaryConditionLines.length
        const ICScore = getICScore() + "/" + InitialConditionLines.length

        const equation = getEnergyBalanceEquationFinal()
        const correctEB = getCorrectEnergyBalanceEquation()
        
        const {pointsTotal, pointsCorrectTotal, dummyTerms, mandatoryTermsIncluded, mandatoryTermsNotIncluded} = termsValidation

        const TermsScore = pointsCorrectTotal + "/" + pointsTotal

        return(
            <Space align="start" size={'large'}>
                <div>
                    {renderImageWithControlVolume(true)}
                </div>
                <div style={{width: 0.55*window.innerWidth, overflowY:'scroll', height: window.innerHeight * 0.70}}>
                <Divider orientation="left">
                    <Space size={'large'}>
                        <span className="default-gray hq-normal-font-weight">Control volume</span> <span className="default-title hq-normal-font-weight">{CVValidation ? "1/1" : "0/0"}</span>
                    </Space>
                </Divider>
                {renderCorrectControlVolume()}
                {BoundaryConditionLines.length ? 
                        <div className="hq-full-width">
                        <Divider orientation="left">
                                <Space size={'large'}>
                                    <span className="default-gray hq-normal-font-weight">Boundary conditions</span> <span className="default-title hq-normal-font-weight">{BCScore}</span>
                                </Space>
                               
                            </Divider>
                            <Space size={'large'} align="start">
                            <div>
                                    <p className="default-title">Your solution</p>
                                    {newListBC.map((a, ai) => {
                                        const status = newListBCValidation[ai]
                                        const {List} = a

                                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                                        return(
                                            <div
                                                key={ai}
                                            >
                                                <Space>
                                                    <p className="default-gray">{ai+1}</p>

                                                    <LatexRenderer latex={"$$" + reducedLatex + "$$"} />

                                                    {status ? <CheckCircleFilled className="default-green"/> : <CloseCircleFilled className="default-red"/>}

                                                    {status ? <i className="default-green">+1</i> : <i className="default-red">-1</i>}
                                                </Space>
                                            </div>    
                                        )
                                    })}
                                </div>
                                <Col xs={6} />
                                <div>
                                    <p className="default-green">Correct terms</p>
                                    {BoundaryConditionLines.map((a, ai) => {
                                        const {Id, Comment} = a

                                        const answerReduced = a.AnswerElements
                                        .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                        .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')
                                        
                                        return(
                                            <div
                                                key={Id}
                                            >
                                                <Space>
                                                    <p className="default-gray">{ai+1}</p>

                                                    <LatexRenderer latex={"$$" + answerReduced + "$$"} />
                                                    {Comment && <CommentInPlayComponent comment={Comment} />}
                                                </Space>
                                            </div>    
                                        )
                                    })}
                                </div>
                                
                            </Space>
                        </div> : <div/>}

                        {InitialConditionLines.length ? 
                            <div className="hq-full-width">
                            <Divider orientation="left">
                                <Space size={'large'}>
                                    <span className="default-gray hq-normal-font-weight">Initial conditions</span> <span className="default-title hq-normal-font-weight">{ICScore}</span>
                                </Space>
                            </Divider>
                            <Space size={'large'} align="start">

                                <div>
                                    <p className="default-title">Your solution</p>
                                    {newListIC.map((a, ai) => {
                                        const status = newListICValidation[ai]

                                        const {List} = a

                                        const reducedLatex = List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'
                                        
                                        return(
                                            <div
                                                key={ai}
                                            >
                                                <Space>
                                                    <p className="default-gray">{ai+1}</p>

                                                    <LatexRenderer latex={"$$" + reducedLatex + "$$"} />

                                                    {status ? <CheckCircleFilled className="default-green"/> : <CloseCircleFilled className="default-red"/>}

                                                    {status ? <i className="default-green">+1</i> : <i className="default-red">-1</i>}
                                                </Space>
                                            </div>    
                                        )
                                    })}
                                </div>

                                <Col xs={6} />
                                
                                <div>
                                    <p className="default-green">Correct terms</p>
                                    {InitialConditionLines.map((a, ai) => {
                                        const {Id, Comment} = a

                                        const answerReduced = a.AnswerElements
                                        .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                        .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')
                                        
                                        return(
                                            <div
                                                key={Id}
                                            >
                                                <Space>
                                                    <p className="default-gray">{ai+1}</p>

                                                    <LatexRenderer latex={"$$" + answerReduced + "$$"} />

                                                    {Comment && <CommentInPlayComponent comment={Comment} />}
                                                </Space>
                                            </div>    
                                        )
                                    })}
                                </div>
                            </Space>
                        </div> : <div/>}

                        <Divider orientation="left">
                            <Space size={'large'}>
                                <span className="default-gray hq-normal-font-weight">
                                    Energy balance
                                </span>
                                <span className="default-title hq-normal-font-weight">{energyBalanceIsCorrect ? "1/1" : "0/1"}</span>
                            </Space>
                        </Divider>
                        <Space size={'large'}>
                            <div>
                                <p className="default-title">Your solution</p>
                                <LatexRenderer latex={"$$" + equation + "$$"}/>
                            </div>

                            <Col xs={24} />
                            
                            <div>
                                <p className="default-green">Correct energy balance</p>
                                <Space>
                                    <LatexRenderer latex={"$$" + correctEB + "$$"}/>
                                    <CommentInPlayComponent 
                                        comment={"This only one possible combination, term signs can be positive (+) or negative (-)"}
                                    />
                                </Space>
                            </div>
                        </Space>

                        <Divider orientation="left">
                            <Space size={'large'}>
                                <span className="default-gray hq-normal-font-weight">
                                    Energy terms
                                </span>
                                <span className="default-title hq-normal-font-weight">{TermsScore}</span>
                            </Space>
                        </Divider>
                        {mandatoryTermsNotIncluded.map((t, ti) => {
                            const {Id, Latex, Questions, Comment} = t

                            return(
                                <div key={Id}>
                                    
                                    <div className="hq-element-container">
                                    <Space>
                                        <p className="default-gray">{ti+1}</p>
                                        {renderItemBox(t)}
                                        <LatexRenderer latex={"$$" + Latex + "$$"} /> 
                                        <Tooltip
                                            color="white"
                                            title={<p>Term not included</p>}
                                        >
                                            <i className="default-red hq-clickable">-2</i>
                                        </Tooltip>
                                        {Comment && <CommentInPlayComponent comment={Comment} />}

                                    </Space>

                                    <br/>
                                    {Questions.map((q) => { 
                                        const {Id, LatexCode, Answers} = q

                                        return(
                                            <div
                                                key={Id}
                                            >
                                                <Space>
                                                    <LatexRenderer latex={"$$" + LatexCode  + "$$"} />
                                                    <Tooltip
                                                        color="white"
                                                        title={<p>Definition not provided</p>}
                                                    >
                                                        <i className="default-red hq-clickable">-1</i>
                                                    </Tooltip>
                                                </Space>
                                                {Answers.map((a, ai) => {

                                                const answerReduced = a.AnswerElements
                                                .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                                .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                                                return(
                                                    <div
                                                        key={ai}
                                                        style={{width:'fit-content'}}
                                                    >
                                                        <LatexRenderer latex={"$$" + answerReduced + "$$"}/>
                                                    </div>
                                                )
                                                })}

                                                <br/>
                                            </div>
                                        )

                                    })}

                                <small className="default-red eb-question-red-background">You failed to add this term</small>
                                </div>

                                </div>
                            )
                        })}

                        {mandatoryTermsIncluded.map((t, ti) => {
                            const {Id, Latex, Questions, directionCorrect, solutionsValidity, Comment} = t
                            return(
                                <div key={Id}>
                                    <div className="hq-element-container">
                                    <Space size={'large'}>
                                        <p className="default-gray">{mandatoryTermsNotIncluded.length + ti + 1}</p>
                                        
                                        <Space>
                                            {renderItemBox(t)}
                                            {directionCorrect ? 
                                            <Tooltip
                                                color="white"
                                                title={<p>You assigned direction correctly</p>}
                                            >
                                                <i className="default-green hq-clickable">+1</i>
                                            </Tooltip>
                                             : 
                                            <Tooltip
                                                color="white"
                                                title={<p>You assigned direction incorrectly, correct direction is shown here</p>}
                                            >
                                                <i className="default-red hq-clickable">-1</i>
                                            </Tooltip>}
                                        </Space>
                                        
                                        <Space>
                                            <LatexRenderer latex={"$$" + Latex + "$$"} /> 
                                            <Tooltip
                                                color="white"
                                                title={<p>Term included</p>}
                                            >
                                                <i className="default-green hq-clickable">+1</i>
                                            </Tooltip>
                                        </Space>
                                        {Comment && <CommentInPlayComponent comment={Comment} />}
                                    </Space>

                                    <br/>
                                    {Questions.map((q, qi) => { 
                                        const {Id, LatexCode, Answers, AddedAnswer} = q

                                        const reducedLatex = AddedAnswer.List.reduce((a,b) => a += ' ' + (b.code === '*' ? '\\cdot': b.code), '') || '-'

                                        const answerValidity = solutionsValidity[qi]
                                        const {answerStatus, isFlipped} = answerValidity

                                        return(
                                            <div
                                                key={Id}
                                            >
                                                <Space direction="vertical" align="start">
                                                    <Space>
                                                        <LatexRenderer latex={"$$" + LatexCode  + "$$"} />
                                                        
                                                    </Space>
                                                    <Space align="end">
                                                        <div>
                                                            {Answers.map((a, ai) => {

                                                                let answerReduced = a.AnswerElements
                                                                .sort((c,d) => c.Id > d.Id ? 1 : -1)
                                                                .reduce((a,b) => a += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot': b.Value)), '')

                                                                if(isFlipped){
                                                                    answerReduced = "-(" + answerReduced + ")"
                                                                }

                                                                return(
                                                                    <div
                                                                        key={ai}
                                                                        style={{width:'fit-content'}}
                                                                    >
                                                                        <LatexRenderer latex={"$$" + answerReduced + "$$"}/>
                                                                    </div>
                                                                )
                                                            })}
                                                            <p className="default-green">Correct solution</p>
                                                        </div>
                                                        &nbsp;
                                                        &nbsp;
                                                        &nbsp;
                                                        <div>
                                                            <Space>
                                                            <LatexRenderer latex={"$$" + reducedLatex + "$$"}/>
                                                            {answerStatus ? <CheckCircleFilled className="default-green"/> : <CloseCircleFilled className="default-red"/>}
                                                            
                                                            {answerStatus ?
                                                            <Tooltip
                                                                    color="white"
                                                                    title={<p>Definition correct</p>}
                                                                >
                                                                    <i className="default-green hq-clickable">+1</i>
                                                                </Tooltip>
                                                                : 
                                                                <Tooltip
                                                                    color="white"
                                                                    title={<p>Definition incorrect</p>}
                                                                >
                                                                    <i className="default-red hq-clickable">-1</i>
                                                            </Tooltip>}

                                                            </Space>
                                                            <p className="default-title">Your solution</p>
                                                        </div>

                                                    </Space>
                                                </Space>

                                                <Divider/>
                                            </div>
                                        )

                                    })}
                                </div>
                                </div>
                            )
                        })}

                        {dummyTerms.map((t, ti) => {
                            const {Id, Latex, Comment} = t

                            return(
                                <div key={Id}>
                                    <div className="hq-element-container">

                                    <Space>
                                        <p className="default-gray">{mandatoryTermsNotIncluded.length + mandatoryTermsIncluded.length + ti+1}</p>
                                        <LatexRenderer latex={"$$" + Latex + "$$"} /> 
                                        <Tooltip
                                            color="white"
                                            title={<p>Dummy term included</p>}
                                        >
                                            <i className="default-red hq-clickable">-1</i>
                                        </Tooltip>
                                        {Comment && <CommentInPlayComponent comment={Comment} />}
                                    </Space>
                                    <br/>
                                    <small className="default-red eb-question-red-background">You added this <u>dummy</u> term to energy balance</small>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
           
            </Space>
        )
    }

    const renderContent = () => {
        const {BoundaryConditionLines, InitialConditionLines} = energyBalanceQuestionPlay

        const finalPageIndex = getFinalPageIndex() 
        const ICPageIndex = getICPageIndex()

        const map = {
            0: () => renderSelectControlVolume(),
            1: () => renderEnergyBalanceTerms(),
            2: () => renderDefineSelectedTerms(),
            [finalPageIndex]: () => renderFinalPage()

        }

        if(BoundaryConditionLines.length){
            map[3] = (() => renderBoundaryConditions())
        }

        if(InitialConditionLines.length){
            map[ICPageIndex] = (() => renderInitialConditions())
        }

        return map[currentTab]()
    }

    const validateFinalPage = () => {
        const {BoundaryConditionLines, InitialConditionLines} = energyBalanceQuestionPlay

        const addedTerms = getAddedTerms()

        if(!selectedCV) {
            return "Please select a control volume"
        }

        if(!addedTerms.length){
            return "Please add terms to the energy balance"
        }
        
        const definitionsNotValid = addedTerms.filter(a => a.Questions.filter(q => validateKeyboardAnswer(q.AddedAnswer)).length)

        if(definitionsNotValid.length){
            return "Some term definitions are not correct"
        }   

        if(BoundaryConditionLines.length && !newListBC.length){
            return "Please add boundary conditions"
        }

        const BCdefinitionsNotValid = newListBC.filter(a => validateKeyboardAnswer(a, true)).length

        if(BCdefinitionsNotValid){
            return "Some boundary condition definitions are not correct"
        } 

        if(InitialConditionLines.length && !newListIC.length){
            return "Please add initial conditions"
        }

        const ICdefinitionsNotValid = newListIC.filter(a => validateKeyboardAnswer(a, true)).length     

        if(ICdefinitionsNotValid){
            return "Some initial condition definitions are not correct"
        } 

        return null
    }

    const getFinalPageIndex = () => {
        const {BoundaryConditionLines, InitialConditionLines} = energyBalanceQuestionPlay

        let finalPageIndex = 3 

        if(BoundaryConditionLines.length) finalPageIndex = finalPageIndex + 1; 
        if(InitialConditionLines.length) finalPageIndex = finalPageIndex + 1; 

        return finalPageIndex
    }

    const getICPageIndex = () => {
        const {BoundaryConditionLines} = energyBalanceQuestionPlay

        let ICPageIndex = 3 

        if(BoundaryConditionLines.length) ICPageIndex = ICPageIndex + 1; 

        return ICPageIndex
    }
    

    const onChange = (t) => {

        if(checkAnswer) return;

        let finalPageIndex = getFinalPageIndex() 

        const validation = validateFinalPage()

        if(t === finalPageIndex && validation){
            api.destroy()
            api.warning(validation)
        }

        const addedTerms = getAddedTerms()

        if(t !== 0 && !selectedCV){
            
            api.destroy()
            api.warning("Please select a control volume")
            return
        }

        if(t === 2){
            if(!addedTerms.length){
                api.destroy()
                api.warning("Please add terms to energy balance")
                return;
            }

            setSelectedTermDefine(addedTerms[0])
            setSelectedTermDefineIndex(0)
        }

        if(t === finalPageIndex){
            if(validation){
                return
            }

            const CVCorrect = (selectedCV && selectedCV.Correct)

            setCVValidation(CVCorrect)

            const {BoundaryConditionLines, InitialConditionLines} = energyBalanceQuestionPlay

            const BCValidation = newListBC.map((a) => {

                const {answerStatus} = checkKeyboardAnswerIsCorrect(a, BoundaryConditionLines, true)
                return answerStatus
            })

            const ICValidation = newListIC.map((a) => {

                const {answerStatus} = checkKeyboardAnswerIsCorrect(a, InitialConditionLines, true)


                return answerStatus
            })

            setNewListBCValidation(BCValidation)
            setNewListICValidation(ICValidation)

            const EBIsCorrect = checkEnergyBalanceEquation()

            setEnergyBalanceIsCorrect(EBIsCorrect)

            const termsCheck = getAddedTermsFinal()

            setTermsValidation(termsCheck)

            setCheckAnswer(true)

            
        }

        setCurrentTab(t)
    }

    const renderQuestion = () => {
        const summaryValidation = validateFinalPage()

        const {BoundaryConditionLines, InitialConditionLines} = energyBalanceQuestionPlay

        const finalPageIndex = getFinalPageIndex() 
        const ICPageIndex = getICPageIndex()

        const items = [{
            key:'CV',
            title: <p className={currentTab === 0 ? "default-title highlighted" : "default-gray"}>Control volume</p>
        },
        {
            key:'EBQ',
            title: <p className={currentTab === 1 ? "default-title highlighted" : "default-gray"}>Energy balance equation</p>
        },
        {
            key:'Definitions',
            title: <p className={currentTab === 2 ? "default-title highlighted" : "default-gray"}>Definitions</p>
        }]

        
        if(BoundaryConditionLines.length){
            items.push(
                {
                    key:'Boundary conditions',
                    title: <p className={currentTab === 3 ? "default-title highlighted" : "default-gray"}>Boundary conditions</p>
                })
        }

        if(InitialConditionLines.length){
            items.push(
                {
                    key:'Initial conditions',
                    title: <p className={currentTab === ICPageIndex ? "default-title highlighted" : "default-gray"}>Initial conditions</p>
                })
        }

        items.push(
            {
                key:'Summary',
                title: <p className={currentTab === finalPageIndex ? "default-title highlighted" : "default-gray"}>Summary - Check answer</p>,
                icon: !summaryValidation ? <SmileTwoTone /> : <FrownTwoTone />
            })

        return(
            <div>
                <Steps 
                    
                    onChange={onChange}

                    current={currentTab}

                    items={items}
                />
                <br/>
                {renderContent()}
            </div>
        )
    }

    return(
        <div>
            {contextHolder}
            {isLoadingEnergyBalanceQuestionPlay && <Skeleton />}

            {errorGetEnergyBalanceQuestionPlay && !isLoadingEnergyBalanceQuestionPlay && 
            <ErrorComponent 
                error={errorGetEnergyBalanceQuestionPlay}
                onReload={() => getEnergyBalanceQuestionPlay(Id)}
            />}

            {!(isLoadingEnergyBalanceQuestionPlay || errorGetEnergyBalanceQuestionPlay) && energyBalanceQuestionPlay && renderQuestion()}
        </div>
    )
}