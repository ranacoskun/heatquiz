import React, { useEffect, useState } from "react";
import { FixURL } from "../../../../services/Auxillary";
import { PlayQuestionSVGInteractivePlot } from "./PlayQuestionSVGInteractivePlot";

import {getRandomVerticalValue} from "./Functions.js"

export function PlotsGroupSVGViewer({question}){
    const {Code, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height, Plots} = question

    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)

    const [answerPlots, setAnswerPlots] = useState(([]))

    const [selectedPlotIndex, setSelectedPlotIndex] = useState(0)

    useEffect(() => {
        //Set dimensions
        const _imageWidth = 0.3 * window.innerWidth
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

    const convertToPercentage = (s, x, y) => {
        let _x = 0
        let _y = 0

        
        
        return({x:_x,y:_y})
    }
   
   return(
    <div>
        <svg 
            width={imageWidth}
            height={imageHeight*1.25}
        >
            <image 
                width={imageWidth}
                height={imageHeight}
                href={FixURL(Base_ImageURL)}
                x = {0} y = {0}
                alt={Code}
            />
            {answerPlots.map((p,pi) => {
                const _d = calculateDimensions(p)
                
                return(
                    <PlayQuestionSVGInteractivePlot 
                        plot = {p} 
                        plotIndex = {pi} 

                        dimensions = {_d} 

                        isPlotActive={Object.is(selectedPlotIndex, pi)} 
                        onPlotChange = {(i) => {setSelectedPlotIndex(i)}}

                        onMovePoint={(si, p, x, y) => {
                            let _plots = [...answerPlots]

                            const section = _plots[si]

                            const {x: _x, y: _y} =convertToPercentage(section, x, y)


                            switch (p){
                                case "y1":{
                                    _plots[selectedPlotIndex].Sections[si].y1 = y

                                    break;
                                }

                                case "y2":{
                                    _plots[selectedPlotIndex].Sections[si].y2 = y

                                    break;
                                }

                                case "c1":{
                                    _plots[selectedPlotIndex].Sections[si].c1x = x
                                    _plots[selectedPlotIndex].Sections[si].c1y = y

                                    break;
                                }

                                case "c2":{
                                    _plots[selectedPlotIndex].Sections[si].c2x = x
                                    _plots[selectedPlotIndex].Sections[si].c2y = y
                                    break;
                                }

                                default:{

                                    break;
                                }

                                setAnswerPlots(_plots)
                            }

                        }}
                    />
                )
            })}
        </svg>
    </div>
   )
}