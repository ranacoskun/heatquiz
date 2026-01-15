import React, { useEffect, useState } from "react";
import { computePointInCanvas, drawCircle, drawCurveOneCP, drawLine, drawRectangle, drawText } from "../../DiagramQuestion/Shared/Functions";
import { POINT_RAD, POINT_RAD_MAGNIFICATION_VALUE, CP_POINT_RAD, RELATION_X_POSITION, RELATION_Y_POSITION, RELATION_GRADIENT, RELATION_HIGHLIGHT_COLOR, SHAPE_HIGHLIGHT_COLOR, SLOPE_HIGHLIGHT_COLOR, SLOPE_RELATION_HIGHLIGHT_COLOR, CP_LIMIT_PERCENTAGE } from "./Constants";
import { calculateFinalSnippingCPPoint, calculateFinalSnippingPoint, getHoveredPoint, snippingCPPoint, snippingPoint, limitCPPoint } from "./Functions";

export function AddPVDiagramQuestionInteractivePlot({
    style, imageURL,
    isAdding, onAdd,
    groups, selectedGroupIndex, 
    points, selectedPointIndex,
    selectedPointMoveIndex, 
    onSelectedPointMove,
    onPointMove,

    selectedCPPointMoveIndex, 
    onSelectedCPPointMove,
    onCPPointMove,

    highlightedShape,
    highlightedSlope,
    highlightedRelation
}){
    const {width, height} = style

    const plotRef = React.createRef()

    const [ctx, setCtx] = useState(null)

    const [hoveredPointIndex, setHoveredPointIndex] = useState(null)
    const [hoveredCPPointIndex, setHoveredCPPointIndex] = useState(null)

    const [snippedPoint, setSnippedPoint] = useState(null)
    const [snippedCPPoint, setSnippedCPPoint] = useState(null)

    const [allPoints, setAllPoints] = useState([])
    const [currentPoints, setCurrentPoints] = useState([])
    const [closedLoop, setClosedLoop] = useState(false)
    const [groupIndex, setGroupIndex] = useState(null)

    const [cpLimit, setCPLimit] = useState(0)

    useEffect(() => {
        if(plotRef){
            const _ctx = plotRef.current.getContext('2d')

            setCtx(_ctx)
        }
    }, [plotRef])

    useEffect(() => {
        //Initial draw
        drawPlot()
    }, [ctx])

    useEffect(() => {
        //const avg = (width + height) * 0.5

        const limitation = CP_LIMIT_PERCENTAGE// * avg * 0.01

        setCPLimit(limitation)

    }, [width, height])

    useEffect(() => {
        if(!(Object.is(selectedPointMoveIndex, null) && Object.is(selectedPointMoveIndex, null))) return;
        if(!groups) return;

        let _points = []

        for(let [gi, g] of groups.entries()){
            const {Points: gPs} = g 
            let _ps = gPs.map((p, pi) => ({...p, groupIndex: gi, pointIndex: pi}))
            _points = [..._points, ..._ps]
        }

        setAllPoints(_points)
    }, [groups, selectedPointMoveIndex, selectedPointMoveIndex])

    useEffect(() => {
        const group = groups[groupIndex]

        if(!group) return;

        const {Points: cPoints, IsClosedLoop} = group

        setCurrentPoints(cPoints)
        setClosedLoop(IsClosedLoop)

    }, [groupIndex, groups])

    useEffect(() => {
        //Dynamic draw
        drawPlot()
    }, [
        ctx,
        groups, selectedGroupIndex,
        selectedPointIndex, selectedPointMoveIndex, selectedCPPointMoveIndex,
        highlightedRelation, highlightedShape, highlightedSlope])


    const renderPoint = (p, isSelected) => {
        const {x, y, Color, BorderColor, Name, MarginX, MarginY} = p

        //draw margins 
        drawRectangle(ctx, x - MarginX, y - MarginY, MarginX*2, MarginY*2, 'rgba(0, 0, 0, 1)', 'rgba(0, 180, 0, 0.2)')

        //draw point
        drawCircle(ctx, x, y, POINT_RAD * (isSelected ? POINT_RAD_MAGNIFICATION_VALUE : 1), BorderColor, Color)

        //draw text
        drawText(ctx, x + POINT_RAD * (isSelected ? POINT_RAD_MAGNIFICATION_VALUE : 1) * 1.5, y + POINT_RAD * (isSelected ? POINT_RAD_MAGNIFICATION_VALUE : 1) * 0.4, Name, 'gray')
    }


    const drawPointSnipping = () => {
        const currentPoint = currentPoints[selectedPointMoveIndex]

        const {x, y} = currentPoint

        const {sameXPoints, sameYPoints, sameMPoints} = snippedPoint

        //X
        for(let pi of sameXPoints){
            const otherP = currentPoints[pi]
            const {x: ox, y: oy} = otherP 

            //draw line snipping line 
            drawLine(ctx, x, y, ox, oy, 'orange' )
        }

        //Y
        for(let pi of sameYPoints){
            const otherP = currentPoints[pi]
            const {x: ox, y: oy} = otherP 

            //draw line snipping line 
            drawLine(ctx, x, y, ox, oy, 'orange' )
        }

        //Slope
        if(sameMPoints.length){
            const firstElement = sameMPoints[0]
            const {pi: firstIndex} = firstElement 
            const mp = currentPoints[firstIndex]
            const mp2 = currentPoints[firstIndex + 1]

            const {x: mx, y: my} = mp
            const {x: mx2, y: my2} = mp2

            const currentPoint = currentPoints[selectedPointMoveIndex]
            let nextPoint = currentPoints[selectedPointMoveIndex + 1]
            if(!nextPoint && closedLoop) nextPoint = currentPoints[0];

            const {x, y} = currentPoint
            const {x: nx, y: ny} = nextPoint

            drawLine(ctx, mx, my, mx2, my2, 'red' )
            drawLine(ctx, x, y, nx, ny, 'red' )
        }
        

    }

    const drawCPPointSnipping = () => {
        const currentPoint = currentPoints[selectedCPPointMoveIndex]
        let nextPoint = currentPoints[selectedCPPointMoveIndex + 1]

        if(!nextPoint && closedLoop) nextPoint = currentPoints[0];

        if(!nextPoint)return;

        const {x, y} = currentPoint
        const {x: ox, y: oy} = nextPoint

        drawLine(ctx, x, y, ox, oy, 'red' )
    }

    const drawHighlightedShape = () => {
        const group = groups[selectedGroupIndex]
        const {Points: gPoints} = group

        const p = gPoints[highlightedShape]
        let nextP = gPoints[highlightedShape + 1]

        if(!nextP) nextP = gPoints[0]

        const {x, y, cx, cy} = p
        const {x: nx, y: ny} = nextP
        //draw curve
        drawCurveOneCP(ctx, x, y, nx, ny, cx, cy, SHAPE_HIGHLIGHT_COLOR, 1)
    }

    const drawHighlightedSlope = () => {
        const group = groups[selectedGroupIndex]
        const {Points: gPoints} = group

        const p = gPoints[highlightedSlope]

        let nextP = gPoints[highlightedSlope + 1]

        if(!nextP) nextP = gPoints[0]

        const {x, y} = p
        const {x: nx, y: ny} = nextP

        //draw curve
        drawLine(ctx, x, y, nx, ny, SLOPE_HIGHLIGHT_COLOR, 1)
    }

    const drawHighlightedRelations = () => {
        const group = groups[selectedGroupIndex]
        const {Points: gPoints} = group

        const {firstIndex, secondIndex, type} = highlightedRelation
        const p1 = gPoints[firstIndex]
        const p2 = gPoints[secondIndex]

        const {x: x1, y: y1} = p1

        const {x: x2, y: y2} = p2

        if(type === RELATION_X_POSITION){

            //P1
            drawLine(ctx, x1, 0, x1, height, RELATION_HIGHLIGHT_COLOR, 1)

            //P2
            drawLine(ctx, x2, 0, x2, height, RELATION_HIGHLIGHT_COLOR, 1)

        }
        else if(type === RELATION_Y_POSITION){
            //P1
            drawLine(ctx, 0, y1, width, y1, RELATION_HIGHLIGHT_COLOR, 1)

            //P2
            drawLine(ctx, 0, y2, width, y2, RELATION_HIGHLIGHT_COLOR, 1)
        }
        else if(type === RELATION_GRADIENT){

            let p1Next = gPoints[firstIndex + 1]
            let p2Next = gPoints[secondIndex + 1]

            if(!p1Next) p1Next = gPoints[0]
            if(!p2Next) p2Next = gPoints[0]

            const {x: x1n, y: y1n} = p1Next
            const {x: x2n, y: y2n} = p2Next

            //P1
            drawLine(ctx, x1, y1, x1n, y1n, SLOPE_RELATION_HIGHLIGHT_COLOR, 1)

            //P2
            drawLine(ctx, x2, y2, x2n, y2n, SLOPE_RELATION_HIGHLIGHT_COLOR, 1)
        }

    }

    const drawGroup = (group) => {
        const {Points: points, IsClosedLoop: closedLoop, ConnectingLineColor: lineColor, ConnectingLineWidth: lineWidth, IsPointsOnlyPlay: pointsOnlyPlay} = group

         //draw points 
         points.forEach((p, pi) => {
            const isSelected = (selectedPointIndex === pi)

            renderPoint(p, isSelected)
        })

        //draw curves and ccontrol points
        const multiPointGraph = points.length > 2       

        for(let [pi,p] of points.entries()){
            //Points only no curves
            if(pointsOnlyPlay) continue;

            let nextP = points[pi + 1]
            if(!nextP && closedLoop && multiPointGraph) nextP = points[0];

            if(!nextP) continue;

            const {x, y, cx, cy} = p
            const {x: nx, y: ny} = nextP

            //draw curve
            drawCurveOneCP(ctx, x, y, nx, ny, cx, cy, lineColor, lineWidth)

            //control point
            drawCircle(ctx, cx, cy, CP_POINT_RAD, 'blue', '#a6a6a6')
            drawLine(ctx, x, y, cx, cy, 'rgba(0,0,0, 0.1)', 1)
            drawLine(ctx, nx, ny, cx, cy, 'rgba(0,0,0, 0.1)', 1)
        }

        //Draw snipping
        if(!Object.is(selectedPointMoveIndex, null) && snippedPoint) drawPointSnipping();

        //Omit when points only play
        if(!Object.is(selectedCPPointMoveIndex, null) && snippedCPPoint && !pointsOnlyPlay) drawCPPointSnipping();        
    }

    const drawPlot = () => {
        if(!ctx) return;

        //clear drawing 
        ctx.clearRect(0, 0, width, height)

       for(let g of groups){
           drawGroup(g)
       }

        //Draw highlighted shape
        if(!Object.is(highlightedShape, null)) drawHighlightedShape();
        if(!Object.is(highlightedSlope, null)) drawHighlightedSlope();

        //Draw highlighted relations
        if(highlightedRelation) drawHighlightedRelations();
    }


    const onMouseEnter = (e) => {}

    const onMouseLeave = (e) => {
        setHoveredPointIndex(null)
        setHoveredCPPointIndex(null)
    }

    

    const onMouseMove = (e) => {
        const mpoint = computePointInCanvas(e, plotRef)

        if(Object.is(selectedPointMoveIndex, null) && Object.is(selectedCPPointMoveIndex, null)){

            const _hoveredPointIndex = getHoveredPoint(allPoints, mpoint)

            if(_hoveredPointIndex){
                setHoveredPointIndex(_hoveredPointIndex)
                setHoveredCPPointIndex(null)

                return
            }

            const _hoveredCPPointIndex = getHoveredPoint(allPoints.map((p) => ({...p, x:p.cx, y:p.cy})), mpoint)
           
            if(_hoveredCPPointIndex){
                setHoveredPointIndex(null)
                setHoveredCPPointIndex(_hoveredCPPointIndex)
                return
            }

            setHoveredPointIndex(null)
            setHoveredCPPointIndex(null)

        }
        else if (!Object.is(selectedPointMoveIndex, null)){ 
            const _snippedPoint = snippingPoint(selectedPointMoveIndex, currentPoints, mpoint)

            setSnippedPoint(_snippedPoint)

            const finalPoint = calculateFinalSnippingPoint(_snippedPoint, currentPoints, mpoint)

            onPointMove(finalPoint, groupIndex)
        }  
        else if (!Object.is(selectedCPPointMoveIndex, null)){ 
            const limitedPoint = limitCPPoint(cpLimit, selectedCPPointMoveIndex, currentPoints, mpoint, closedLoop)

            const _snippedCPPoint = snippingCPPoint(selectedCPPointMoveIndex, currentPoints, limitedPoint, closedLoop)

            setSnippedCPPoint(_snippedCPPoint)
            
            const basePoint = currentPoints[selectedCPPointMoveIndex]
            const finalPoint = calculateFinalSnippingCPPoint(_snippedCPPoint, basePoint, limitedPoint)

            onCPPointMove(finalPoint, groupIndex)
        }
    }

    const onMouseClick = (e) => {
        if(isAdding){
            const point = computePointInCanvas(e, plotRef)

            onAdd(point)

            return;
        }

        if(!Object.is(selectedPointMoveIndex, null)){
            onSelectedPointMove(null)
            return;
        }

        if(!Object.is(selectedCPPointMoveIndex, null)){
            onSelectedCPPointMove(null)
            return;
        }

        if(hoveredPointIndex){
            
            const data = hoveredPointIndex[0]
            const {groupIndex, pointIndex} = data

            onSelectedPointMove(pointIndex)
            setGroupIndex(groupIndex)
            return;
        }

        if(hoveredCPPointIndex){
            const data = hoveredCPPointIndex[0]
            const {groupIndex, pointIndex} = data

            /*const group = groups[groupIndex]
            const {IsPointsOnlyPlay} = group

            if(IsPointsOnlyPlay) return;*/

            onSelectedCPPointMove(pointIndex)
            setGroupIndex(groupIndex)

            return;
        }

     }

    const calculateCursor = () => {
        const changeCursor = (isAdding || selectedPointMoveIndex || selectedCPPointMoveIndex || hoveredPointIndex || hoveredCPPointIndex) 

        return (changeCursor ? 'crosshair' : 'default')
    }   

    const cursorType = calculateCursor()

    return(
        <div>
            <canvas
                ref = {plotRef}

                    style = {{
                        ...style,
                        backgroundPosition:'center',
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'contain',
                        backgroundImage: `url(${imageURL})`,
                        cursor: cursorType,
                    }}

                    width = {width}
                    height = {height}


                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onMouseMove={onMouseMove}
                    onClick = {onMouseClick}
            />
        </div>
    )
}