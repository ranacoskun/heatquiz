import React, { useEffect, useState } from "react";
import { getInvertedSlopesRelationsLabels, getPositionRelationsLabels, getRandomVerticalValue, getSlopesRelationsLabels, gradePlot } from "./Functions";
import { PlayQuestionInteractivePlot } from "./PlayQuestionInteractivePlot";

export function PlotsGroupViewer({question, checkAnswer, onUpdateSummary, onSwitchPlot, highligthSummarySection, highligthSummaryRelation, selectedPlotIndexHighlights}){

    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)

    const [answerPlots, setAnswerPlots] = useState([])
    const [plotsPlayed, setPlotsPlayed] = useState([])

    const [activePlotIndex, setActivePlotIndex] = useState(0)
    //const [highligthSummarySection, setHighligthSummarySection] = useState(0)
    //const [highligthSummaryRelation, setHighligthSummaryRelation] = useState(0)
    
    const [displayAnswer, setDisplayAnswer] = useState(false)
    const [plotsGrading, setPlotsGrading] = useState([])


    useEffect(() => {

        //Initialize
        setDisplayAnswer(false)
        setActivePlotIndex(0)

        const {Base_ImageURL_Width, Base_ImageURL_Height, Plots} = question

        //Set dimensions
        const _imageWidth = 0.45 * window.innerWidth
        const _imageHeight = (Base_ImageURL_Height/Base_ImageURL_Width) * _imageWidth

        setImageWidth(_imageWidth)
        setImageHeight(_imageHeight)

        //Set plots 
        const _plots = Plots.map((p) => ({
            ...p,
            
            MovingSectionVerticalIndex: null,
            MovingSectionVertical: null,

            MovingSectionCPIndex: null,
            MovingSectionCP: null,

            Sections: p.Sections.map((s, i) => {
                const next_s = p.Sections[i+1]
                const prev_s = p.Sections[i-1]

                if(s.IsFrozen) return ({
                    ...s,
                    y1: getRandomVerticalValue(),
                    correct_y2: s.y2, 
                    correct_y1: s.y1, 
                    Labels:[]})

                return(
                    ({
                        ...s,
                        Id:s.Id,
                        x: s.x,
                        y2: getRandomVerticalValue(), 
                        y1: (prev_s && prev_s.IsFrozen) ? s.y1 : getRandomVerticalValue(), 
                        correct_y2: s.y2, 
                        correct_y1: s.y1, 
                        c1x: next_s ? (0.75*s.x + 0.25*next_s.x) : 0,
                        c2x: next_s ? (0.25*s.x + 0.75*next_s.x) : 0,
                        c1y: getRandomVerticalValue(),
                        c2y:getRandomVerticalValue(),
                        IsFrozen: s.IsFrozen,
                        Labels:[]
                    })
                )
            }),

            Relations:[]
           
        }))

        setAnswerPlots(_plots)

    }, [question.Id])

    const calculateGrading = () => {
        const {Plots} = question

        let _plotsGrading = []
        
        //Check grading points foreach plot
        for(let [i, p] of Plots.entries()){
            const r = gradePlot(p, answerPlots[i])

            _plotsGrading.push(r)
        }

        return _plotsGrading
    }

    useEffect(() => {
        if(checkAnswer){
            //Check if all plots

            const {Plots} = question
        
            //Check all plots answered 
            if(Plots.length !== plotsPlayed.length){
                onUpdateSummary('Please play all plots, atleast one move should be made inside each plot', null)

                return
            } 

            const pg = calculateGrading()

            setPlotsGrading(pg)

            onUpdateSummary(null, pg)

            setDisplayAnswer(true)
        }

    }, [checkAnswer])

    useEffect(() => {
        onSwitchPlot(activePlotIndex)
    }, [activePlotIndex])

    const renderImage = () => {

    const {Base_ImageURL} = question
      
        return(
            <img 
                src = {Base_ImageURL}
                style = {{width:imageWidth, height:imageHeight}}
            />
        )
    }

    const calculateDimensions = (p) => {
        const {Base_ImageURL_Width, Base_ImageURL_Height} = question
        const {x1, x2, y1} = p
        let {y2} = p
        const Width = Math.abs(x2 - x1)
        let Height = Math.abs(y2 - y1) 
        Height = Height
        y2 = y2 + 0.125*Height

        return({
                position:'absolute',
                left: (imageWidth/Base_ImageURL_Width) * x1,
                top: (imageHeight/Base_ImageURL_Height) * (y2),
                width: (imageWidth/Base_ImageURL_Width) * Width,
                height: (imageHeight/Base_ImageURL_Height) * Height,// + (displayAnswer ? 100 : 50),
                
            })
    }

    const renderPlots = () => {

       return(
            answerPlots.map((p, pi) => {
            {
                const {OriginX , OriginY, Title, Sections} = p
                
                const dimensions = calculateDimensions(p)

                const grading = plotsGrading[pi]

                let score = ''

                if(displayAnswer){
                    score = grading[0] + ' / ' + grading[1]
                }

                return(
                    <span 
                    style = {{...dimensions}}
                    key = {p.Id}>
                        <PlayQuestionInteractivePlot 
                            style = {{...dimensions}}
                            
                            OriginX = {OriginX}
                            OriginY = {OriginY}

                            title = {Title}
                            sections = {Sections}
                            isAddingSection = {false}

                            onSetActivePlot = {(ai) => {
                                if(displayAnswer) return;

                                setActivePlotIndex(ai)
                            
                            }}
                            plotIndex = {pi}
                            plotIsActive = {(activePlotIndex === pi) || displayAnswer}

                            onMoveSelectVertical = {(i) => {

                                if(displayAnswer) return;
                                
                                let Plots = [...answerPlots]

                                for(let p of Plots){
                                    p = ({...p, 
                                        MovingSectionVerticalIndex: null,
                                        MovingSectionVertical: null,
                    
                                        MovingSectionCPIndex: null,
                                        MovingSectionCP: null,
                                    })
                                }
                                Plots[pi].MovingSectionVerticalIndex = i
                                Plots[pi].MovingSectionVertical =  Plots[pi].Sections[i]

                                setAnswerPlots(Plots)
                            }}

                            onMoveSectionVertical = {(y, secondPoint) => {
                                if(displayAnswer) return;
                            
                                let Plots = [...answerPlots]

                                Plots[pi].Sections[p.MovingSectionVerticalIndex][secondPoint ? "y2" : "y1"] = y

                                setAnswerPlots(Plots)
                            
                            }}

                            onMoveSelectControlVolume = {(i) => {

                                if(displayAnswer) return;
                        
                                let Plots = [...answerPlots]

                                for(let p of Plots){
                                    p = ({...p, 
                                        MovingSectionVerticalIndex: null,
                                        MovingSectionVertical: null,
                    
                                        MovingSectionCPIndex: null,
                                        MovingSectionCP: null,
                                    })
                                }
                                Plots[pi].MovingSectionCPIndex = i
                                Plots[pi].MovingSectionCP =  Plots[pi].Sections[i]
                                
                                setAnswerPlots(Plots)
                              
                            }}

                            onMoveControlVolume = {(x, y, secondPoint) => {
                                if(displayAnswer) return;
                            
                                //this.stopAnimation()

                                let Plots = [...answerPlots]

                                Plots[pi].Sections[p.MovingSectionCPIndex][secondPoint ? "c2x" : "c1x"] = x
                                Plots[pi].Sections[p.MovingSectionCPIndex][secondPoint ? "c2y" : "c1y"] = y

                                setAnswerPlots(Plots)

                            }}
                            onUpdateLabelsRelations = {(v) => {
                                if(displayAnswer) return;

                                
                                //this.stopAnimation()

                                let Plots = [...answerPlots]
                                let PlotsPlayed = [...plotsPlayed]

                                Plots[pi].Sections =  Plots[pi].Sections.map((s, si) => ({
                                    ...s, 
                                    Labels: v.sectionLabels[si]
                                }))

                                const pr = getPositionRelationsLabels(v.positionRelations)
                                const gsr = getSlopesRelationsLabels(v.gradientSortingRelations)
                                const isr = getInvertedSlopesRelationsLabels(v.gradientInvertedRelations)

                                Plots[pi].Relations = [
                                    ...pr,
                                    ...gsr,
                                    ...isr,
                                ]

                                if(!PlotsPlayed.includes(p.Id)) PlotsPlayed.push(p.Id)
                                
                                setAnswerPlots(Plots)
                                setPlotsPlayed(PlotsPlayed)
                               
                            }}

                            movingSectionVertical = {p.MovingSectionVertical}
                            movingSectionVerticalIndex = {p.MovingSectionVerticalIndex}

                            movingSectionCP = {p.MovingSectionCP}
                            movingSectionCPIndex = {p.MovingSectionCPIndex}

                            highligthSummarySection = {(selectedPlotIndexHighlights === pi)? highligthSummarySection : null}
                            highligthSummaryRelation = {selectedPlotIndexHighlights === pi ? highligthSummaryRelation : null}
                        />
                        
                    </span>)

                    }}))
   }

   const renderCorrectPlots = () => {
    const {Plots} = question

    return(
        Plots.map((p, pi) => {
        {
            const {OriginX , OriginY, Title, Sections} = p
            
            const dimensions = calculateDimensions(p)

            return(
                <span 
                style = {{...dimensions}}
                key = {p.Id}>
                    <PlayQuestionInteractivePlot 
                        style = {{...dimensions, opacity:'30%'}}
                        displayOnly
                        OriginX = {OriginX}
                        OriginY = {OriginY}

                        title = {Title}
                        sections = {Sections}

                        onSetActivePlot = {(ai) => {}}
                        plotIndex = {pi}
                        plotIsActive

                        onMoveSelectVertical = {(i) => {}}

                        onMoveSectionVertical = {(y, secondPoint) => {}}

                        onMoveSelectControlVolume = {(i) => {}}

                        onMoveControlVolume = {(x, y, secondPoint) => {}}

                        onUpdateLabelsRelations = {(v) => {}}
                    />
                    
                </span>)

                }}))
   }

    return(
        <div style={{flexDirection:'row', display:'flex', alignContent:'flex-start', alignItems:'flex-start', height:imageHeight*1.5}}>
           {renderImage()}
           {renderPlots()}
           {checkAnswer && renderCorrectPlots()}
        </div>
    )
}