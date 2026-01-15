import React, { useEffect, useState } from "react";

import { SLIDER_POINT_RAD } from "./Constants";
import { computePointInCanvas, drawCircle, drawLine, drawText } from "./Functions";

export function AddQuestionInteractivePlot({
    style, OriginX, OriginY, title, sections,
    plotIndex, plotIsActive, isAddingSection,
    movingSectionVertical, movingSectionVerticalIndex, movingSectionCP, movingSectionCPIndex, highligthSummarySection, highligthSummaryRelation,
    onSetActivePlot, onMoveSelectVertical, onMoveSectionVertical, onMoveSelectControlVolume, onMoveControlVolume, onUpdateLabelsRelations, 
}){

    const plotRef = React.createRef()

    const [offset, setOffset] = useState(0)
    const [ctx, setCtx] = useState(null)

    const [currentPoint, setCurrentPoint] = useState(null)
    const [cursorType, setCursorType] = useState(null)


    const {width, height} = style

    useEffect(() => {
        if(plotRef && plotRef.current){

            const _ctx = plotRef.current.getContext('2d')

            setCtx(_ctx)
        }
    }, [plotRef])

    useEffect(() => {
        //Occasional drawing
        drawPlot()
    }, [ctx, width, height, OriginX, OriginY, title])

    useEffect(() => {
        //Dynamic drawing
        drawPlot()
    }, [sections, currentPoint, isAddingSection])

    const onMouseEnter = (e) => {

    }

    const onMouseLeave = (e) => {
        setCurrentPoint(null)
    }

    const onMouseMove = (e) => {
        const point = computePointInCanvas(e, plotRef)
        setCurrentPoint(point)
    }

    const onMouseClick = (e) => {

    }

    

    const drawAxis = () => {
        //X - axis
        drawLine(ctx, 0, (100 - OriginY) * 0.01 * height, width, (100 - OriginY) * 0.01 * height, 'red', 1, false)

        //Y - axis
        drawLine(ctx, OriginX * 0.01 * width, 0, OriginX  * 0.01 * width, height, 'red', 1, false)
    }

    const drawAddingSection = () => {
        const sectionX = currentPoint.x

        drawLine(ctx, sectionX, height + offset, sectionX,  offset, 'green', 1);
        const widthPerc = (100*(sectionX)/width).toFixed(1) + '%'
        drawText(ctx, offset, offset/2, widthPerc, 'green')
    }

    const drawPlot = () => {
        if(!ctx) return;

        ctx.clearRect(
            -SLIDER_POINT_RAD,
            -SLIDER_POINT_RAD,
            width + 2 * SLIDER_POINT_RAD,
            height + 2 * SLIDER_POINT_RAD
            )

        //1- Draw axis
        drawAxis()

        //2- Draw cursor 
        if(currentPoint) drawCircle(ctx, currentPoint.x, currentPoint.y, SLIDER_POINT_RAD*0.5, 'green', 'lightgreen')

        //3- Adding section
        if(isAddingSection && currentPoint) drawAddingSection();
    }

    return(
        <div style = {{justifyContent:'center', width: width + SLIDER_POINT_RAD}}>
            <canvas
                ref = {plotRef}

                style = {{
                    ...style,
                    cursor: cursorType,
                    height:height + offset * 2,
                    width:width + SLIDER_POINT_RAD
                }}

                width = {width + SLIDER_POINT_RAD}
                height = {height + offset * 2}


                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                onClick = {onMouseClick}
            />
            <p style = {{textAlign:'center', width:'100%'}}>{title}</p>
        </div>)
}