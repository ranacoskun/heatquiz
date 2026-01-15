import React, { useEffect, useState } from "react";
import { RELATION_TYPE, SLIDER_POINT_RAD, VERTICAL_MARGIN } from "./Constants";
import {checkMaxMinimum, checkSectionIsLinear, claculateStartEndAngles, claculateStartEndSlopes, computePointInCanvas, convertRadToDegrees, drawCircle, drawCurve, drawLine, drawText, getClosestPointOnLine} from './Functions'

export function PlayQuestionInteractivePlot({
    style, OriginX, OriginY, title, sections, displayOnly,
    plotIndex, plotIsActive, 
    movingSectionVertical, movingSectionVerticalIndex, movingSectionCP, movingSectionCPIndex, highligthSummarySection, highligthSummaryRelation,
    onSetActivePlot, onMoveSelectVertical, onMoveSectionVertical, onMoveSelectControlVolume, onMoveControlVolume, onUpdateLabelsRelations, 
}){

    const plotRef = React.createRef()

    const [offset, setOffset] = useState(0)
    const [ctx, setCtx] = useState(null)
    const [cursorType, setCursorType] = useState('none')
    const [currentPoint, setCurrentPoint] = useState(null)

    const [localSections, setLocalSections] = useState([])

    const [movingSection, setMovingSection] = useState(0)

    const [mightBeMovedSectionCP, setMightBeMovedSectionCP] = useState(null)
    const [mightBeMovedSectionTip, setMightBeMovedSectionTip] = useState(null)

    const [secondPointMightMoving, setSecondPointMightMoving] = useState(null)
    const [secondPointCPMightMoving, setSecondPointCPMightMoving] = useState(null)

    const [secondPointMoving, setSecondPointMoving] = useState(null)
    const [secondPointMovingCP, setSecondPointMovingCP] = useState(null)

    useEffect(() => {
        //Initialize
        setLocalSections([...sections])
    
        setMovingSection(null)

        setMightBeMovedSectionCP(null)
        setMightBeMovedSectionTip(null)

        setSecondPointMightMoving(null)
        setSecondPointCPMightMoving(null)

        setSecondPointMoving(null)
        setSecondPointMovingCP(null)
    }, [OriginX, OriginY, sections])

    useEffect(() => {
        if(plotRef && plotRef.current){
            const _ctx = plotRef.current.getContext('2d')

            setCtx(_ctx)
        }
    }, [plotRef])

    useEffect(() => {
        //Initial drawing
        drawPlot()

    }, [ctx])

    useEffect(() => {
        drawPlot()
    }, [currentPoint, highligthSummarySection, highligthSummaryRelation])

    //Drawing functions
    const drawAxis = () => {
        if(!ctx) return;

        const {width, height} = style

        const origin_X = (OriginX/100) * width
        const origin_Y = (OriginY/100) * height

        //X-axis
        drawLine(ctx, 0, height + offset - origin_Y, width, height + offset - origin_Y, '#cccccc', 1)

        //Y-axis
        drawLine(ctx, origin_X, offset, origin_X, offset + height, '#cccccc', 1)
    }

    const drawSection = (section, firstSection = false, finalSection = false, isFrozen = false, next_section = null) => {
        if(!ctx) return;

        const {width, height} = style

        if(isFrozen && next_section){
            ctx.fillStyle = "rgb(242, 242, 242)";
            ctx.fillRect( 0.01*width*section.x, offset,  0.01*width*(next_section.x - section.x), height);
        }

        //draw section line
        drawLine(ctx, 0.01*width*section.x, offset, 0.01*width*section.x, offset+height,'#a6a6a6')

        if(displayOnly) return;

        //circle #1
        if(!firstSection) drawCircle(ctx, 0.01*width*section.x, offset + height - (0.01 * section.y1 * height), SLIDER_POINT_RAD, 'red', '#a6a6a6')

        //circle #2
        if(!finalSection) drawCircle(ctx, 0.01*width*section.x, offset + height - (0.01 * section.y2 * height), SLIDER_POINT_RAD, 'red', '#a6a6a6')
    
        if(!finalSection) 
        {
            //Control cicle #1
            drawCircle(ctx, 0.01*width*section.c1x, offset + height - (0.01 * section.c1y * height), SLIDER_POINT_RAD, 'blue', '#a6a6a6')
            
            //Control cicle #2
            drawCircle(ctx, 0.01*width*section.c2x, offset + height - (0.01 * section.c2y * height), SLIDER_POINT_RAD, 'gray', '#a6a6a6')
        }

        //Draw helper lines
        if(next_section){
            //Draw if slopes are horizontal or vertical 
            const {y2, x, c1x, c1y, c2x, c2y} = section
            const {y1, x:x_other} = next_section

            if(y2 === y1 && isFrozen) 
            drawLine(ctx,
                0.01*width*x,
                offset + height - 0.01 * height * y2,
                0.01*width*x_other,
                offset + height - 0.01 * height * y1,
                'orange'
                )

            const slope1_horizantal_vertical = (c1y === y2 || c1x == x)

            drawLine(
                ctx,
                0.01*width*x,
                offset + height - 0.01 * height * y2,
                0.01*width*c1x,
                offset + height - 0.01 * height * c1y,
                slope1_horizantal_vertical ? 'blue': '#cccccc'
            )

            const slope2_horizantal_vertical = (c2y === y1 || c2x == x_other)

            drawLine(
                ctx,
                0.01*width*c2x,
                offset + height - 0.01 * height * c2y,
                0.01*width*x_other,
                offset + height - 0.01 * height * y1,
                slope2_horizantal_vertical ? 'blue': '#cccccc'
            )
        }

        
    }   

    const drawCrossSectionHelperLines = () => {

        if(!(movingSectionVertical || movingSectionCP)) return;

        const section = movingSectionVertical || movingSectionCP
        const sectionIndex = movingSectionVertical ? movingSectionVerticalIndex : movingSectionCPIndex

        const other_section = 
            secondPointMoving || movingSectionCP ? 
            //next section
            localSections[sectionIndex+1]
            :
            //previous section 
            localSections[sectionIndex-1]
                
        const movingY2 = secondPointMoving || secondPointMovingCP  || movingSectionCP

        //draw same y sections
        {
            const sectionY = section[movingY2 ? "y2" : "y1"]
            const sections_same_y = localSections
            .filter((s, i) => { 
                if (i === sectionIndex) return true

                if (i === 0) return s.y2 === sectionY

                if (i === (localSections.length-1)) return s.y1 === sectionY

                return ((s.y1 === sectionY) || (s.y2 === sectionY))
            })

            const firstX = Math.min(...sections_same_y.map((s) => s.x))
            const lastX = Math.max(...sections_same_y.map((s) => s.x))

            if(sections_same_y) 
            drawLine(
                ctx,

                0.01 * width * firstX,
                offset + height - 0.01 * height * sectionY,

                0.01 * width * lastX,
                offset + height - 0.01 * height * sectionY,
                'orange'
            )
        }

        //Draw same slop 
        {
            const {a_c1: base_a_c1, a_c2: base_a_c2} = 
            claculateStartEndAngles(
                movingY2 ? section : other_section,
                movingY2 ? other_section : section)

            let base_a = secondPointMoving || movingSectionCP  ?  base_a_c1 : base_a_c2
            base_a = secondPointMovingCP  ?  base_a_c2 : base_a
                
            const sections_same_slop = localSections.slice(0, localSections.length-1).map((section,i) => {
                
                const next_section = localSections[i+1]
                const {a_c1, a_c2} = claculateStartEndAngles(section, next_section)

                let c1_equal = false
                let c2_equal = false

                if(Math.abs(base_a - a_c1) < 1)  c1_equal = true
                if(Math.abs(base_a - a_c2) < 1)  c2_equal = true

                if(movingSectionVertical){                    
                    if(sectionIndex === i && secondPointMoving) c1_equal = false  
                    if(sectionIndex === i+1 && !secondPointMoving) c2_equal = false  
                }

                if(movingSectionCP){
                    if(sectionIndex === i && !secondPointMovingCP) c1_equal = false  
                    if(sectionIndex === i && secondPointMovingCP) c2_equal = false  
                }

                return ({section, next_section, c1_equal, c2_equal, })
            })


            for(let r of sections_same_slop){
                if(r.c1_equal){
                    drawLine(
                        ctx, 
                        r.section.x * 0.01 * width,
                        height + offset - 0.01 * height * r.section.y2,

                        r.section.c1x * 0.01 * width,
                        height + offset - 0.01 * height * r.section.c1y,
                        'green'
                    )
                }

                if(r.c2_equal){
                    drawLine(
                        ctx, 
                        r.section.c2x * 0.01 * width,
                        height + offset - 0.01 * height * r.section.c2y,

                        r.next_section.x * 0.01 * width,
                        height + offset - 0.01 * height * r.next_section.y1,
                        'green'
                    )
                }
            }
        }

        //Draw invert slop
        {
            const {a_c1: base_a_c1, a_c2: base_a_c2} = 
            claculateStartEndAngles(
                movingY2 ? section : other_section,
                movingY2 ? other_section : section)

            let base_a = secondPointMoving || movingSectionCP  ?  base_a_c1 : base_a_c2
            base_a = secondPointMovingCP  ?  base_a_c2 : base_a
            base_a = -base_a
            const sections_inverse_slop = localSections.slice(0, localSections.length-1).map((section,i) => {
                
                const next_section = localSections[i+1]
                const {a_c1, a_c2} = claculateStartEndAngles(section, next_section)

                let c1_equal = false
                let c2_equal = false

                if(Math.abs(base_a - a_c1) < 1)  c1_equal = true
                if(Math.abs(base_a - a_c2) < 1)  c2_equal = true

                if(movingSectionVertical){                    
                    if(sectionIndex === i && secondPointMoving) c1_equal = false  
                    if(sectionIndex === i+1 && !secondPointMoving) c2_equal = false  
                }

                if(movingSectionCP){
                    if(sectionIndex === i && !secondPointMovingCP) c1_equal = false  
                    if(sectionIndex === i && secondPointMovingCP) c2_equal = false  
                }

                return ({section, next_section, c1_equal, c2_equal, })
            })


            for(let r of sections_inverse_slop){
                if(r.c1_equal){
                    drawLine(
                        ctx, 
                        r.section.x * 0.01 * width,
                        height + offset - 0.01 * height * r.section.y2,

                        r.section.c1x * 0.01 * width,
                        height + offset - 0.01 * height * r.section.c1y,
                        'purple'
                    )
                }

                if(r.c2_equal){
                    drawLine(
                        ctx, 
                        r.section.c2x * 0.01 * width,
                        height + offset - 0.01 * height * r.section.c2y,

                        r.next_section.x * 0.01 * width,
                        height + offset - 0.01 * height * r.next_section.y1,
                        'purple'
                    )
                }
            }
        }
    }

    const drawSectionHelperLines = () => {
        const {width, height} = style

        if(!(movingSectionVertical || movingSectionCP)) return;


        const section = movingSectionVertical || movingSectionCP
        const sectionIndex = movingSectionVertical ? movingSectionVerticalIndex : movingSectionCPIndex
        const secondPointChanged = secondPointMoving || secondPointMovingCP

        const movingY2 = secondPointChanged || movingSectionCP

        const other_section =  movingY2 ? localSections[sectionIndex+1] : localSections[sectionIndex-1]
        
        //draw lines between y points and cps
        const c1_horizontal = movingY2 ? (section.y2 === section.c1y) : (other_section.y2 === other_section.c1y)
        const c1_vertical = movingY2 ? (section.x === section.c1x) : (other_section.x === other_section.c1x)

        const c2_horizontal = movingY2 ? (other_section.y1 === section.c2y) : (section.y1 === other_section.c2y)
        const c2_vertical =  movingY2 ? (other_section.x === section.c2x) : (section.x === other_section.c2x)

        if(movingY2){
            drawLine(ctx,
                0.01 * width * section.x,
                offset + height - 0.01 * height * section.y2,

                0.01 * width * section.c1x,
                offset + height - 0.01 * height * section.c1y,
                c1_horizontal || c1_vertical ? 'blue' : '#cccccc'
            )

            drawLine(ctx,
                0.01 * width * other_section.x,
                offset + height - 0.01 * height * other_section.y1,

                0.01 * width * section.c2x,
                offset + height - 0.01 * height * section.c2y,
                c2_horizontal || c2_vertical ? 'blue' : '#cccccc'
            )
        }
        else{
            drawLine(ctx,
                0.01 * width * other_section.x,
                offset + height - 0.01 * height * other_section.y2,

                0.01 * width * other_section.c1x,
                offset + height - 0.01 * height * other_section.c1y,
                c1_horizontal || c1_vertical ? 'blue' : '#cccccc'
            )

            drawLine(ctx,
                0.01 * width * section.x,
                offset + height - 0.01 * height * section.y1,

                0.01 * width * other_section.c2x,
                offset + height - 0.01 * height * other_section.c2y,
                c2_horizontal || c2_vertical ? 'blue' : '#cccccc'
            )
        }

        //draw if y points are linear through cp points
        const x_c1_m = movingY2 ? 
        (section.y2 - section.c1y)/(section.x - section.c1x) 
        :
        (other_section.y2 - other_section.c1y)/(other_section.x - other_section.c1x)

        const c1_other_x_m = movingY2 ? 
        (section.c1y - other_section.y1)/(section.c1x - other_section.x) 
        :
        (other_section.c1y - section.y1)/(other_section.c1x - section.x) 

        const angle_x_c1 = convertRadToDegrees(Math.atan2(x_c1_m, 1))
        const angle_c1_other_x_m = convertRadToDegrees(Math.atan2(c1_other_x_m, 1))

        const linear_x_c1_other_x = Math.abs(angle_x_c1 - angle_c1_other_x_m) < 0.75

        if(linear_x_c1_other_x && movingY2) 
        drawLine(
            ctx,
            
            0.01 * width * section.x,
            offset + height - 0.01 * height * section.y2,

            0.01 * width * other_section.x,
            offset + height - 0.01 * height * other_section.y1,

            'red'
        )

        if(linear_x_c1_other_x && !movingY2) 
        drawLine(
            ctx,
            
            0.01 * width * other_section.x,
            offset + height - 0.01 * height * other_section.y2,

            0.01 * width * section.x,
            offset + height - 0.01 * height * section.y1,
            'red'
        )

        const x_c2_m = movingY2 ? 
        (section.y2 - section.c2y)/(section.x - section.c2x) 
        :
        (other_section.y2 - other_section.c2y)/(other_section.x - other_section.c2x)

        const c2_other_x_m = movingY2 ? 
        (section.c2y - other_section.y1)/(section.c2x - other_section.x) 
        :
        (other_section.c2y - section.y1)/(other_section.c2x - section.x) 

        const angle_x_c2 = convertRadToDegrees(Math.atan2(x_c2_m, 1))
        const angle_c2_other_x_m = convertRadToDegrees(Math.atan2(c2_other_x_m, 1))

        const linear_x_c2_other_x = Math.abs(angle_x_c2 - angle_c2_other_x_m) < 0.75

        if(linear_x_c2_other_x && movingY2) 
        drawLine(
            ctx,
            
            0.01 * width * section.x,
            offset + height - 0.01 * height * section.y2,

            0.01 * width * other_section.x,
            offset + height - 0.01 * height * other_section.y1,

            'red'
        )

        if(linear_x_c2_other_x && !movingY2) 
        drawLine(
            ctx,
            
            0.01 * width * other_section.x,
            offset + height - 0.01 * height * other_section.y2,

            0.01 * width * section.x,
            offset + height - 0.01 * height * section.y1,
            'red'
        )
    }

    const drawHelperLines = () => {
        // Draw intersectional relations helper lines
        drawCrossSectionHelperLines()

        // Draw moving section helper lines
        drawSectionHelperLines()
    }

    const drawStartPosition = (highligthSummarySection) => {
        const {width, height} = style

        const {SectionIndex, Status} = highligthSummarySection

        const highlightedSection = localSections[SectionIndex]
        const highlightedSectionNext = localSections[SectionIndex + 1]

        const {marginY2Neg, marginY2Pos, correct_y2} = highlightedSection

        if(highlightedSection){
            if(marginY2Pos && highlightedSectionNext){
                ctx.fillStyle = "#e6ffe6";
                ctx.fillRect( 
                    0.01 * width * highlightedSection.x,
                    offset + height - 0.01 * height * (correct_y2 + marginY2Pos),
                    0.01 * width * (highlightedSectionNext.x - highlightedSection.x),
                    0.01 * height * marginY2Pos);
                ctx.stroke();
            }

            if(marginY2Neg && highlightedSectionNext){
                ctx.fillStyle = "#e6ffe6";
                ctx.fillRect( 
                    0.01 * width * highlightedSection.x,
                    offset + height - 0.01 * height * (correct_y2),
                    0.01 * width * (highlightedSectionNext.x - highlightedSection.x),
                    0.01 * height * marginY2Neg);
                ctx.stroke();
            }

            if((marginY2Neg || marginY2Pos) && highlightedSectionNext){
                drawLine(
                    ctx, 
                    0.01 * width * highlightedSection.x,
                    offset + height - 0.01 * height * (correct_y2),
                    0.01 * width * highlightedSectionNext.x,
                    offset + height - 0.01 * height * (correct_y2),
                    'green', 1
                    )
            }

            drawCircle(ctx, 
                0.01 * width * highlightedSection.x,
                offset + height - 0.01 * height * highlightedSection.y2,
                SLIDER_POINT_RAD*1.5,'gray', (Status || displayOnly) ? '#ccffcc' : '#ffcccc')          
           
        }
    }

    const drawEndPosition = (highligthSummarySection) => {
        const {width, height} = style
        const {SectionIndex, Status} = highligthSummarySection

        const highlightedSection = localSections[SectionIndex]
        const highlightedSectionNext = localSections[SectionIndex + 1]
        
        const {marginY1Neg, marginY1Pos, correct_y1} = highlightedSectionNext
        
        
        if(marginY1Pos && highlightedSectionNext){
            ctx.fillStyle = "#e6ffe6";
            ctx.fillRect( 
                0.01 * width * highlightedSection.x,
                offset + height - 0.01 * height * (correct_y1 + marginY1Pos),
                0.01 * width * (highlightedSectionNext.x - highlightedSection.x),
                0.01 * height * marginY1Pos);
            ctx.stroke();
        }

        if(marginY1Neg && highlightedSectionNext){
            ctx.fillStyle = "#e6ffe6";
            ctx.fillRect( 
                0.01 * width * highlightedSection.x,
                offset + height - 0.01 * height * (correct_y1),
                0.01 * width * (highlightedSectionNext.x - highlightedSection.x),
                0.01 * height * marginY1Neg);
            ctx.stroke();
        }

        if((marginY1Neg || marginY1Pos) && highlightedSectionNext){
            drawLine(
                ctx, 
                0.01 * width * highlightedSection.x,
                offset + height - 0.01 * height * (correct_y1),
                0.01 * width * highlightedSectionNext.x,
                offset + height - 0.01 * height * (correct_y1),
                'green', 1
                )
        }

        if(highlightedSectionNext){
            drawCircle(ctx, 
                0.01 * width * highlightedSectionNext.x,
                offset + height - 0.01 * height * highlightedSectionNext.y1,
                SLIDER_POINT_RAD*1.5,'gray', (Status || displayOnly) ? '#ccffcc' : '#ffcccc')
        }
    }

    const drawStartEndPositionRelation = (highligthSummarySection) => {
        const { width, height} = style
        const {SectionIndex, Status} = highligthSummarySection

        const highlightedSection = localSections[SectionIndex]
        const highlightedSectionNext = localSections[SectionIndex+1]

        if(highlightedSection && highlightedSectionNext){

            drawLine(ctx, 
                0.01 * width * highlightedSection.x,
                offset + height - 0.01 * height * highlightedSection.y2,
                0.01 * width * highlightedSectionNext.x,
                offset + height - 0.01 * height * highlightedSection.y2,
                (Status || displayOnly) ? '#66ff66' : '#ff6666',
                2, true)

            drawLine(ctx, 
                    0.01 * width * highlightedSection.x,
                    offset + height - 0.01 * height * highlightedSectionNext.y1,
                    0.01 * width * highlightedSectionNext.x,
                    offset + height - 0.01 * height * highlightedSectionNext.y1,
                    (Status || displayOnly) ? '#66ff66' : '#ff6666',
                    2, true)
        }
    }

    const drawStartSlope = (highligthSummarySection) => {
        const {width, height} = style
        const {SectionIndex, Status} = highligthSummarySection

        const highlightedSection = localSections[SectionIndex]

        if(highlightedSection){
            drawLine(ctx, 
                0.01 * width * highlightedSection.x,
                offset + height - 0.01 * height * highlightedSection.y2,
                0.01 * width * highlightedSection.c1x,
                offset + height - 0.01 * height * highlightedSection.c1y,
                (Status || displayOnly) ? 'green' : 'red',
                4, true)
        }
    }

    const drawEndSlope = (highligthSummarySection) => {
        const {width, height} = style
        const {SectionIndex, Status} = highligthSummarySection

        const highlightedSectionNext = localSections[SectionIndex + 1]

        const highlightedSection = localSections[SectionIndex]

        if(highlightedSection && highlightedSectionNext){
            drawLine(ctx, 
                0.01 * width * highlightedSection.c2x,
                offset + height - 0.01 * height * highlightedSection.c2y,
                0.01 * width * highlightedSectionNext.x,
                offset + height - 0.01 * height * highlightedSectionNext.y1,
                (Status || displayOnly) ? 'green' : 'red',
                4, true)
        }
    }

    const drawGradientRelation = (highligthSummarySection) => {
        const {width, height} = style
        const {SectionIndex, Status} = highligthSummarySection

        
        const highlightedSection = localSections[SectionIndex]
        const highlightedSectionNext = localSections[SectionIndex+1]

        if(highlightedSection && highlightedSectionNext){
            drawLine(ctx, 
                0.01 * width * highlightedSection.x,
                offset + height - 0.01 * height * highlightedSection.y2,
                0.01 * width * highlightedSection.c1x,
                offset + height - 0.01 * height * highlightedSection.c1y,
                (Status || displayOnly) ? 'green' : 'red',
                4, true)

            drawLine(ctx, 
                    0.01 * width * highlightedSection.c2x,
                    offset + height - 0.01 * height * highlightedSection.c2y,
                    0.01 * width * highlightedSectionNext.x,
                    offset + height - 0.01 * height * highlightedSectionNext.y1,
                    (Status || displayOnly) ? 'green' : 'red',
                    4, true)
        }
    }

    const drawLinearHighlight = (highligthSummarySection) => {
        const {width, height} = style
        const {SectionIndex, Status} = highligthSummarySection

        const highlightedSection = localSections[SectionIndex]
        const highlightedSectionNext = localSections[SectionIndex+1]

        if(highlightedSection && highlightedSectionNext){
            drawCurve(ctx,
                0.01*width*highlightedSection.x,
                (height+offset - (0.01 * highlightedSection.y2 * height)),
                0.01*width*highlightedSectionNext.x,
                (height+offset - (0.01 * highlightedSectionNext.y1 * height)), 

                0.01*width*highlightedSection.c1x,
                (height+offset - (0.01 * highlightedSection.c1y * height)),

                0.01*width*highlightedSection.c2x,
                (height+offset - (0.01 * highlightedSection.c2y * height)),
                (Status || displayOnly) ?  'green' : 'red',
                3
                )
        }
    }

    const drawHighlightsSameSection = () => {
        const { width, height} = style

        const drawingFuncs = {
            "IsStartPositionLabelSelected": (a) => drawStartPosition(a),
            "IsEndPositionLabelSelected": (a) => drawEndPosition(a),
            "IsPositionRelationLabelSelected": (a) => drawStartEndPositionRelation(a),

            "IsGradientStartLabelSelected": (a) => drawStartSlope(a),
            "IsGradientEndLabelSelected": (a) => drawEndSlope(a),
            "IsRatioOfGradientsLabelSelected": (a) => drawGradientRelation(a),

            "IsLinearLabelSelected": (a) => drawLinearHighlight(a),
            "IsMaximumSelected": () => {},
            "IsMinimumSelected": () => {},
        }
        
        console.log(highligthSummarySection)
        if(highligthSummarySection){
            const {Type} = highligthSummarySection
            const {SectionIndex} = highligthSummarySection

            const highlightedSection = sections[SectionIndex]
            const highlightedSectionNext = sections[SectionIndex + 1]
            
            drawingFuncs[Type](highligthSummarySection)

            if(highlightedSection && highlightedSectionNext){
                drawLine(
                    ctx,
                    0.01 * width * highlightedSection.x,
                    offset + height + 5,
                    0.01 * width * highlightedSection.x,
                    offset + height + 15,
                    'blue', 2
                )

                drawLine(
                    ctx,
                    0.01 * width * highlightedSection.x,
                    offset + height + 10,
                    0.01 * width * highlightedSection.x + 20,
                    offset + height + 10,
                    'blue', 2
                )

                drawLine(
                    ctx,
                    0.01 * width * highlightedSectionNext.x,
                    offset + height + 5,
                    0.01 * width * highlightedSectionNext.x,
                    offset + height + 15,
                    'blue', 1
                )

                drawLine(
                    ctx,
                    0.01 * width * highlightedSectionNext.x,
                    offset + height + 10,
                    0.01 * width * highlightedSectionNext.x - 20,
                    offset + height + 10,
                    'blue', 1
                )
                
            }
        }
    }

    const drawHighlightsSectionRelations = () => {
        const {width, height} = style

        if(highligthSummaryRelation){
            const {FirstSectionIndex, FirstSectionLocation, SecondSectionIndex, SecondSectionLocation, Type, Status} = highligthSummaryRelation

            const firstSection = localSections[FirstSectionIndex]
            const firstSectionNext = localSections[FirstSectionIndex+1]
            const secondSection = localSections[SecondSectionIndex]
            const secondSectionNext = localSections[SecondSectionIndex+1]

            if(Type == RELATION_TYPE.POSITION){
                drawCircle(ctx, 
                    0.01 * width * (FirstSectionLocation ==='Start' ? firstSection.x : firstSectionNext.x),
                    offset + height - 0.01 * height * (FirstSectionLocation ==='Start' ? firstSection.y2 : firstSectionNext.y1),
                    SLIDER_POINT_RAD*1.5,'gray', (Status || displayOnly) ? '#ccffcc' : '#ffcccc')

                drawCircle(ctx, 
                    0.01 * width * (SecondSectionLocation ==='Start' ? secondSection.x : secondSectionNext.x),
                    offset + height - 0.01 * height *(SecondSectionLocation ==='Start' ? secondSection.y2 : secondSectionNext.y1),
                    SLIDER_POINT_RAD*1.5,'gray', (Status || displayOnly) ? '#ccffcc' : '#ffcccc')
            }

            if(Type == RELATION_TYPE.SLOPE ){
                drawLine(ctx, 
                    0.01 * width * (FirstSectionLocation ==='Start' ? firstSection.x : firstSection.c2x),
                    offset + height - 0.01 * height * (FirstSectionLocation ==='Start' ? firstSection.y2 : firstSection.c2y),
                    0.01 * width * (FirstSectionLocation ==='Start' ? firstSection.c1x : firstSectionNext.x),
                    offset + height - 0.01 * height * (FirstSectionLocation ==='Start' ? firstSection.c1y : firstSectionNext.y1),
                    (Status || displayOnly) ? 'green' : 'red',
                    4, true)

                drawLine(ctx, 
                        0.01 * width * (SecondSectionLocation ==='Start' ? secondSection.x : secondSection.c2x),
                        offset + height - 0.01 * height * (SecondSectionLocation ==='Start' ? secondSection.y2 : secondSection.c2y),
                        0.01 * width * (SecondSectionLocation ==='Start' ? secondSection.c1x : secondSectionNext.x),
                        offset + height - 0.01 * height * (SecondSectionLocation ==='Start' ? secondSection.c1y : secondSectionNext.y1),
                        (Status || displayOnly) ? 'green' : 'red',
                        4, true)
            }
        }
    }

    const drawPlot = () => {

        const {width, height} = style

        if(!ctx) return;

        //clean the drawing 
        ctx.clearRect(0, 0, width + 2 * SLIDER_POINT_RAD, height + 2 * VERTICAL_MARGIN);

        //Draw axis
        drawAxis()

        //draw cursor
        if(currentPoint) drawCircle(ctx, currentPoint.x, currentPoint.y, SLIDER_POINT_RAD*0.5, 'green', 'lightgreen')

        //draw localSections
        for(let [i,s] of localSections.entries()){ 
            const nextSection = localSections[i+1]
            drawSection(s, i == 0, (i == localSections.length-1), s.IsFrozen, nextSection)

            if(nextSection){
                drawText(ctx, 0.01*width*(s.x + nextSection.x)/2, height + VERTICAL_MARGIN, (1+i), 'black', "11px Arial")
            }

            if(i <= (localSections.length-1) && i > 0){
                const prevSection = localSections[i-1]
                drawCurve(ctx,
                    0.01*width*prevSection.x,
                    (height+offset - (0.01 * prevSection.y2 * height)),
                    0.01*width*s.x,
                    (height+offset - (0.01 * s.y1 * height)), 

                    0.01*width*prevSection.c1x,
                    (height+offset - (0.01 * prevSection.c1y * height)),

                    0.01*width*prevSection.c2x,
                    (height+offset - (0.01 * prevSection.c2y * height)),
                    displayOnly ? 'green' :'#006080',
                    displayOnly ? 2 :1,
                    )
            }
        }

        drawHelperLines()
        drawHighlightsSameSection()
        drawHighlightsSectionRelations()
    }

    //Mouse functions 
    const onMovingYPoint = (point) => {
        
        const {height} = style
        
        const sectionIndex = movingSectionVerticalIndex
        const section = movingSectionVertical

        let shouldSnapHorizontalOwn = false
        let snapYOwn = 0

        let shouldSnapHorizontal = false
        let snapY = 0

        let shouldSnapLinearC1 = false
        let snapLinearC1_Y = 0

        let shouldSnapLinearC2 = false
        let snapLinearC2_Y = 0

        let shouldSnapSameSlop = false
        let snapSameSlop_Y = 0

        let shouldSnapInverseSlop = false
        let snapInverseSlop_Y = 0


        let shouldSnapHorizontalCP = false
        let snapHorizontalCP_Y = 0
        
        //Horizontal snapping with same section 
        {   
            const section_y_point = (offset+height-0.01*height*section[secondPointMoving ? 'y1' : 'y2'])
            shouldSnapHorizontalOwn = (Math.abs(section_y_point - point.y) < 5) 

            shouldSnapHorizontalOwn = shouldSnapHorizontalOwn && ((sectionIndex != 0) && (sectionIndex != (localSections.length-1)))
            snapYOwn = section_y_point
        }
        //Horizontal snapping with y points
        {
            const near_horizontal_sections_min_y = localSections
            .map((s, i) =>{
                let vY1 = (offset + height - s.y1 * 0.01 * height)
                let vY2 = (offset + height - s.y2 * 0.01 * height)

                if(i===0) return ({vY1:NaN, vY2, i});

                if((i+1)===localSections.length) return  ({vY1, vY2:NaN, i});

                return ({vY1, vY2, i})    
            })

            .filter((s,i) => (i !== sectionIndex))

            .filter((r, i) => 
            (r.vY1 && Math.abs(r.vY1-point.y) <= 5)
            ||  
            (r.vY2 && Math.abs(r.vY2-point.y) <= 5))

            .map((r) => Math.min(r.vY1 ? Math.abs(r.vY1-point.y): Infinity, r.vY2 ? Math.abs(r.vY2-point.y) : Infinity))

            shouldSnapHorizontal = (near_horizontal_sections_min_y.length !== 0)
            snapY = Math.min(...near_horizontal_sections_min_y) + point.y
        }

        //Linear in same section snapping
        {
            const other_section = 
            secondPointMoving ? 
            //next section
            localSections[sectionIndex+1]
            :
            //previous section 
            localSections[sectionIndex-1]

            const other_section_y = secondPointMoving ? other_section.y1 : other_section.y2
            const other_section_x =  other_section.x

            //C1
            const c1_x = secondPointMoving ? section.c1x : other_section.c1x
            const c1_y = secondPointMoving ? section.c1y : other_section.c1y

            const m_c1 = (other_section_y-c1_y)/(other_section_x - c1_x)

            const yLinear_x_c1 = other_section_y + m_c1 * (section.x - other_section_x)

            //C2
            const c2_x = secondPointMoving ? section.c2x : other_section.c2x
            const c2_y = secondPointMoving ? section.c2y : other_section.c2y

            const m_c2 = (other_section_y-c2_y)/(other_section_x - c2_x)

            const yLinear_x_c2 = other_section_y + m_c2 * (section.x - other_section_x)

            snapLinearC1_Y = (offset+height-0.01*height*yLinear_x_c1)
            snapLinearC2_Y = (offset+height-0.01*height*yLinear_x_c2)

            shouldSnapLinearC1 = (Math.abs(snapLinearC1_Y - point.y) < 5)
            shouldSnapLinearC2 = (Math.abs(snapLinearC2_Y - point.y) < 5)
        }

        //Horizontal snapping with cp
        {
            const prev_s = localSections[sectionIndex-1]

            shouldSnapHorizontalCP = secondPointMoving ?
            (Math.abs(point.y - (offset + height - 0.01 * height * section.c1y)) < 5)
            : (Math.abs(point.y - (offset + height - 0.01 * height * prev_s.c2y)) < 5)

            snapHorizontalCP_Y = secondPointMoving ? section.c1y : prev_s.c2y
            snapHorizontalCP_Y = offset + height - 0.01 * height * snapHorizontalCP_Y
        }

        //Simmilar start / end slop as other localSections 
        {
            const other_section = 
            secondPointMoving ? 
            //next section
            localSections[sectionIndex+1]
            :
            //previous section 
            localSections[sectionIndex-1]
            
            const sections_same_slop = localSections
            .map((s,i) => {
                
                const next_s = localSections[i+1]

                if(!next_s) return null

                const {m_c1, m_c2} = claculateStartEndSlopes(s, next_s)

                let ySanp_c1 = 0
                let ySanp_c2 = 0

                if(secondPointMoving){
                    ySanp_c1 = section.c1y  + m_c1 * (section.x - section.c1x)
                    ySanp_c1 = offset + height - ySanp_c1 * 0.01*height

                    ySanp_c2 = section.c1y + m_c2 * (section.x - section.c1x)
                    ySanp_c2 = offset + height - ySanp_c2 * 0.01*height
                }
                else{
                    ySanp_c1 = other_section.c2y + m_c1 * (section.x - other_section.c2x)
                    ySanp_c1 = offset + height - ySanp_c1 * 0.01*height

                    ySanp_c2 = other_section.c2y + m_c2 * (section.x - other_section.c2x)
                    ySanp_c2 = offset + height - ySanp_c2 * 0.01*height

                }
                const diff_c1 = Math.abs(ySanp_c1 - point.y)
                const diff_c2 = Math.abs(ySanp_c2 - point.y)

                const ignoreC1 = (i === sectionIndex && (secondPointMoving))
                const ignoreC2 = (i+1 === sectionIndex && (!secondPointMoving))
               
                if(!ignoreC1 && diff_c1 < 5) return ({diff: diff_c1, value: ySanp_c1});
                if(!ignoreC2 && diff_c2 < 5) return ({diff: diff_c2, value: ySanp_c2});

                return null
            })


            shouldSnapSameSlop = sections_same_slop.filter((a) => a).length
            snapSameSlop_Y = shouldSnapSameSlop ? 
            sections_same_slop.filter((a) => a).sort((a,b) => a.diff - b.diff)[0].value : 0
        }

        //Inverse start / end slop as other localSections 
        {
            const other_section = 
            secondPointMoving ? 
            //next section
            localSections[sectionIndex+1]
            :
            //previous section 
            localSections[sectionIndex-1]
            
            const sections_inverse_slop = localSections
            .map((s,i) => {
                
                const next_s = localSections[i+1]

                if(!next_s) return null

                let {m_c1, m_c2} = claculateStartEndSlopes(s, next_s)
                
                //Invert slopes
                m_c1 = -m_c1
                m_c2 = -m_c2

                let ySanp_c1 = 0
                let ySanp_c2 = 0

                if(secondPointMoving){
                    ySanp_c1 = section.c1y  + m_c1 * (section.x - section.c1x)
                    ySanp_c1 = offset + height - ySanp_c1 * 0.01*height

                    ySanp_c2 = section.c1y + m_c2 * (section.x - section.c1x)
                    ySanp_c2 = offset + height - ySanp_c2 * 0.01*height
                }
                else{
                    ySanp_c1 = other_section.c2y + m_c1 * (section.x - other_section.c2x)
                    ySanp_c1 = offset + height - ySanp_c1 * 0.01*height

                    ySanp_c2 = other_section.c2y + m_c2 * (section.x - other_section.c2x)
                    ySanp_c2 = offset + height - ySanp_c2 * 0.01*height

                }
                const diff_c1 = Math.abs(ySanp_c1 - point.y)
                const diff_c2 = Math.abs(ySanp_c2 - point.y)

                const ignoreC1 = (i === sectionIndex && (secondPointMoving))
                const ignoreC2 = (i+1 === sectionIndex && (!secondPointMoving))
             
                if(!ignoreC1 && diff_c1 < 5) return ({diff: diff_c1, value: ySanp_c1});
                if(!ignoreC2 && diff_c2 < 5) return ({diff: diff_c2, value: ySanp_c2});

                return null
            })


            shouldSnapInverseSlop = sections_inverse_slop.filter((a) => a).length
            snapInverseSlop_Y = shouldSnapInverseSlop ? 
            sections_inverse_slop.filter((a) => a).sort((a,b) => a.diff - b.diff)[0].value : 0
        }

        const limit_top_y = offset
        const limit_bottom_y = offset+height

        let y = point.y
        
        if(shouldSnapHorizontal) y = snapY;
        if(shouldSnapHorizontalCP) y = snapHorizontalCP_Y;
        if(shouldSnapLinearC1) y = snapLinearC1_Y;
        if(shouldSnapLinearC2) y = snapLinearC2_Y;
        if(shouldSnapSameSlop) y = snapSameSlop_Y;
        if(shouldSnapInverseSlop) y = snapInverseSlop_Y;
        if(shouldSnapHorizontalOwn) y = snapYOwn;

        y = Math.min(Math.max(y, limit_top_y), limit_bottom_y)

        const yFinal = Math.trunc(100*(offset+height-y)/height) //
        onMoveSectionVertical(yFinal, secondPointMoving)  
    }

    const onMovingCPPoint = (point) => {
        
        let shouldSnapHorizontalCP = false
        let snapHorizontalCP_Y = 0

        let shouldSnapLinearCP = false
        let snapLinearCP_Y = 0
        let snapLinearCP_X = 0

        let shouldSnapSameSlopCP = false
        let snapSameSlopCP_Y = 0
        let snapSameSlopCP_X = 0

        const section = movingSectionCP
        const sectionIndex = movingSectionCPIndex

        const next_section = localSections[sectionIndex + 1]

        //Horizontal with y point
        {
            const ySnap_y2 = offset + height - 0.01 * height * section.y2 
            const ySnap_y1 = offset + height - 0.01 * height * next_section.y1 

            if(Math.abs(ySnap_y1 - point.y) < 5) {
                shouldSnapHorizontalCP = true
                snapHorizontalCP_Y = ySnap_y1
            }

            if(Math.abs(ySnap_y2 - point.y) < 5) {
                shouldSnapHorizontalCP = true
                snapHorizontalCP_Y = ySnap_y2
            }
        }

        //Snap linear with y point
        {   
            const m = (section.y2 - next_section.y1)/(section.x - next_section.x)
            let nearst_point = [0, 0]
            //Moving cp 2
            if(secondPointMovingCP){
                nearst_point = getClosestPointOnLine(section.y2, m, section.c2x - section.x, section.c2y)
            }
            //Moving cp 1
            else{
                nearst_point = getClosestPointOnLine(section.y2, m, section.c1x - section.x, section.c1y)
            }   

            
            snapLinearCP_X = nearst_point[0] + section.x
            snapLinearCP_X =  0.01 * width * snapLinearCP_X

            snapLinearCP_Y = nearst_point[1]
            snapLinearCP_Y = offset + height - 0.01 * height * snapLinearCP_Y

            if((Math.abs(point.y - snapLinearCP_Y) < 10) && (Math.abs(point.x - snapLinearCP_X) < 10)) 
            shouldSnapLinearCP = true;
            

        }

        //Snap same slop 
        {
            const sections_same_slop = localSections
            .map((s,i) => {
                const next_s = localSections[i+1]

                if(!next_s) return null

                let {m_c1, m_c2} = claculateStartEndSlopes(s, next_s)
                
                let nearst_point_1 = [0, 0]
                let nearst_point_2 = [0, 0]

                const ignoreC1 = (i === sectionIndex && !secondPointMovingCP)
                const ignoreC2 = (i === sectionIndex && secondPointMovingCP)

                //Moving cp 2
                if(secondPointMovingCP){
                    
                    nearst_point_1 = getClosestPointOnLine(section.y2, m_c1, section.c2x - section.x, section.c2y)
                    nearst_point_2 = getClosestPointOnLine(section.y2, m_c2, section.c2x - section.x, section.c2y)
                }
                //Moving cp 1
                else{
                    nearst_point_1 = getClosestPointOnLine(section.y2, m_c1, section.c1x - section.x, section.c1y)
                    nearst_point_2 = getClosestPointOnLine(section.y2, m_c2, section.c1x - section.x, section.c1y)
                } 

                let snapLinearCP_1_X = nearst_point_1[0] + section.x
                snapLinearCP_1_X =  0.01 * width * snapLinearCP_1_X
    
                let snapLinearCP_1_Y = nearst_point_1[1]
                snapLinearCP_1_Y = offset + height - 0.01 * height * snapLinearCP_1_Y

                let snapLinearCP_2_X = nearst_point_2[0] + section.x
                snapLinearCP_2_X =  0.01 * width * snapLinearCP_2_X
    
                let snapLinearCP_2_Y = nearst_point_2[1]
                snapLinearCP_2_Y = offset + height - 0.01 * height * snapLinearCP_2_Y

                let diff = 0
                let value = ({x:0, y:0})

                let diff_1 = ignoreC1 ? Infinity : 
                Math.hypot(Math.abs(snapLinearCP_1_X - point.x), Math.abs(snapLinearCP_1_Y - point.y))

                let diff_2 = ignoreC2 ? Infinity : 
                Math.hypot(Math.abs(snapLinearCP_2_X - point.x), Math.abs(snapLinearCP_2_Y - point.y))

                diff = diff_1 < diff_2 ? diff_1 : diff_2

                value.x = diff_1 < diff_2 ? snapLinearCP_1_X : snapLinearCP_2_X
                value.y = diff_1 < diff_2 ? snapLinearCP_1_Y : snapLinearCP_2_Y

                return ({i, diff, value, ignoreC1, ignoreC2})
            })
            .filter((a) => a)
            .filter((a) => a.diff < 5)
            .sort((a, b)  => a.diff - b.diff)

            shouldSnapSameSlopCP = sections_same_slop.length

            if(shouldSnapSameSlopCP){
                const value = sections_same_slop[0]

                snapSameSlopCP_X = value.value.x
                snapSameSlopCP_Y = value.value.y
            }
        }

        const limit_left_x = movingSectionCP.x * 0.01 * width
        const limit_right_x = localSections[movingSectionCPIndex+1].x * 0.01 * width

        const limit_top_y = offset
        const limit_bottom_y = offset+height
        
        let y = point.y
        let x = point.x

        if(shouldSnapHorizontalCP) y = snapHorizontalCP_Y

        if(shouldSnapLinearCP){
            y = snapLinearCP_Y
            x = snapLinearCP_X
        }

        if(shouldSnapSameSlopCP){
            y = snapSameSlopCP_Y
            x = snapSameSlopCP_X
        }

        x = Math.min(Math.max(x, limit_left_x), limit_right_x)
        y = Math.min(Math.max(y, limit_top_y), limit_bottom_y)
        
        onMoveControlVolume(parseFloat((100 * x/width).toFixed(1)), Math.trunc(100 * (offset+height-y)/height), secondPointMovingCP)
        return
    }

    const onMouseMove = (e) => {
        
        const {width, height} = style
    
        if(displayOnly || !plotIsActive) return

        const point = computePointInCanvas(e, plotRef)
        setCurrentPoint(point)

        //Moving Y points
        if(movingSectionVertical && !movingSection){
            onMovingYPoint(point)
        }

        //Moving control points
        if(movingSectionCP && !movingSectionVertical && !movingSection){
            onMovingCPPoint(point)
        }
        
        //Section - y1, y2
        const mouseAroundSectionTip = localSections.map((s,i) => ({index:i, ...s})).filter((s,i) => Math.abs(0.01*width*s.x - point.x) < SLIDER_POINT_RAD*2 && Math.abs((offset+height - (0.01 * s.y1 * height)) - point.y) < SLIDER_POINT_RAD*2)
        const _mightBeMovedSectionTip = mouseAroundSectionTip[0]

        const mouseAroundSectionTip2 = localSections.map((s,i) => ({index:i, ...s})).filter((s,i) => Math.abs(0.01*width*s.x - point.x) < SLIDER_POINT_RAD*2 && Math.abs((offset+height - (0.01 * s.y2 * height)) - point.y) < SLIDER_POINT_RAD*2)
        const _mightBeMovedSectionTip2 = mouseAroundSectionTip2[0]

        //Section - c1, c2
        const mouseAroundSectionCP = localSections.map((s,i) => ({index:i, ...s})).filter((s,i) => Math.abs(0.01*width*s.c1x - point.x) < SLIDER_POINT_RAD*2 && Math.abs((offset+height - (0.01 * s.c1y * height)) - point.y) < SLIDER_POINT_RAD*2)
        const _mightBeMovedSectionCP = mouseAroundSectionCP[0]

        const mouseAroundSectionCP2 = localSections.map((s,i) => ({index:i, ...s})).filter((s,i) => Math.abs(0.01*width*s.c2x - point.x) < SLIDER_POINT_RAD*2 && Math.abs((offset+height - (0.01 * s.c2y * height)) - point.y) < SLIDER_POINT_RAD*2)
        const _mightBeMovedSectionCP2 = mouseAroundSectionCP2[0]

        let nextSectionIsFrozen = false
        const nextSection = _mightBeMovedSectionTip2 && localSections[_mightBeMovedSectionTip2.index]
        if(nextSection && nextSection.IsFrozen) nextSectionIsFrozen = true

        setCursorType(
            mouseAroundSectionTip.length || mouseAroundSectionTip2.length ||
            mouseAroundSectionCP.length || mouseAroundSectionCP2.length
            ? 'pointer' : 'none',)

            
        setMightBeMovedSectionTip(!nextSectionIsFrozen ? (_mightBeMovedSectionTip || _mightBeMovedSectionTip2) : _mightBeMovedSectionTip)
        setSecondPointMightMoving(!nextSectionIsFrozen && _mightBeMovedSectionTip2)
        
        setMightBeMovedSectionCP(_mightBeMovedSectionCP || _mightBeMovedSectionCP2)
        setSecondPointCPMightMoving(_mightBeMovedSectionCP2)  
        
        
    }

    const onMouseClick = (e) => {
        
        if(displayOnly || !plotIsActive) return

        if(mightBeMovedSectionTip && !movingSectionVertical){           
            //Check if section is frozen 
            if(mightBeMovedSectionTip.IsFrozen && secondPointMightMoving) return;

            const prev_s = localSections[mightBeMovedSectionTip.index - 1]

            if(prev_s && prev_s.IsFrozen && (!secondPointMightMoving ||  (mightBeMovedSectionTip.index+1 === localSections.length))) return

            onMoveSelectVertical(mightBeMovedSectionTip.index)

            setSecondPointMoving(secondPointMightMoving && (mightBeMovedSectionTip.index+1 !== localSections.length))
         
            return
        }

        if(mightBeMovedSectionCP && !movingSectionCP && !mightBeMovedSectionTip && !movingSectionVertical){

            //Check if section is frozen 
            if(mightBeMovedSectionCP.IsFrozen) return;

            onMoveSelectControlVolume(mightBeMovedSectionCP.index)

            setSecondPointMovingCP(secondPointCPMightMoving)

            return
        }

       
        if(movingSectionVertical){
            onUpdateLabelsRelations(constituteLabelsRelations())

            onMoveSelectVertical(null)

            setSecondPointMoving(false)

            return
        }

        if(movingSectionCP){

            onUpdateLabelsRelations(constituteLabelsRelations())
            onMoveSelectControlVolume(null)

            setSecondPointMovingCP(false)

            return
        }

        
    }

    //Calculate functions
    const constituteLabelsRelations =() =>{

        const sectionLabels = localSections.map((s, i) =>{
            const next_s = localSections[i+1]
            if(!next_s) return null

            const positionStart = s.y2
            const positionEnd = next_s.y1

            const {m_c1, m_c2} = claculateStartEndSlopes(s, next_s)
            
            let positionRelation = ''

            if(s.y2 > next_s.y1) positionRelation = '>'
            else if(s.y2 < next_s.y1) positionRelation = '<'
            else positionRelation = '='

            const linear = checkSectionIsLinear(s, next_s)

            let gradientStart = ''   
            
            if(m_c1 === 0) gradientStart = 'zero'
            if(m_c1 < 0) gradientStart = 'negative'
            if(m_c1 > 0) gradientStart = 'positive'

            let gradientEnd = ''   
            
            if(m_c2 === 0) gradientEnd = 'zero'
            if(m_c2 < 0) gradientEnd = 'negative'
            if(m_c2 > 0) gradientEnd = 'positive'

            let ratioOfGradients = ''

            if(Math.abs(m_c1 - m_c2) < 0.1) ratioOfGradients = '='
            else if(m_c1 > m_c2) ratioOfGradients = '>'
            else ratioOfGradients = '<'


            const min_max = checkMaxMinimum(s, next_s)

            const hasMaximum = min_max.filter((r) => r.der2<0 && Math.abs(r.der2) > 200).length !== 0
            const hasMinimum = min_max.filter((r) => r.der2>0 && Math.abs(r.der2) > 200).length !== 0

            return ({
                positionStart, 
                positionEnd,
                positionRelation,
                gradientStart,
                gradientEnd,
                ratioOfGradients,
                linear,
                hasMaximum,
                hasMinimum
            })
        })

        const positionRelations = localSections.map((s, i) => {
            const next_s = localSections[i+1]
            if(!next_s) return []

            return [
                {key: (i+1) + '-start', value: s.y2, value2:'Start', section_x: s.x, sectionIndex:i, section:s},
                {key: (i+1) + '-end', value: next_s.y1, value2:'End', section_x: s.x, sectionIndex:i, section:s}
            ]
        })

        .reduce((r, c) => [...c, ...r], [])

        .reduce((rg, cg) => {
            rg[cg.value] = [...(rg[cg.value] || []), cg]
            return rg
        }, {})

        const gradientSortingRelations = localSections.map((s, i) => {
            const next_s = localSections[i+1]
            if(!next_s) return []

            const {a_c1, a_c2} = claculateStartEndAngles(s, next_s)

            return [
                {key: (i+1) + '-start-gradient', value: a_c1, value2:'Start', section_x: s.x, sectionIndex:i, section:s },
                {key: (i+1) + '-end-gradient', value: a_c2, value2:'End', section_x: s.x, sectionIndex:i, section:s}
            ]
        })
        .reduce((r, c) => [...c, ...r], [])
        .reduce((rg, cg) => {
            rg[cg.value] = [...(rg[cg.value] || []), cg]
            return rg
        }, {})

        let gradientInvertedRelations = {}

        const ignoreInvertAngles = [0, 180, -180, 90, -90]

        for(let k of Object.keys(gradientSortingRelations)){
            
            if (k in ignoreInvertAngles) continue

            const postive_key = k
            const postive_data = gradientSortingRelations[postive_key]

            const negative_key = -Number(postive_key)
            const negative_data = gradientSortingRelations[negative_key]

            const negative_key_already_used = gradientInvertedRelations[negative_key]
            
            if(!negative_key_already_used){
                if(negative_data){
                    gradientInvertedRelations[Number(postive_key)] 
                    = ({positive: postive_data, negative:negative_data})
                }

                
            }
        }


        return ({sectionLabels, positionRelations, gradientSortingRelations, gradientInvertedRelations})
    }


    const {width, height, opacity} = style

    return(
        <div 
           
           style = {{justifyContent:'center',  opacity: opacity || '100%'}}>
                <canvas
                        style = {{
                            cursor: cursorType,
                            width: width + 2 * SLIDER_POINT_RAD,
                            opacity: (plotIsActive || displayOnly) ? '100%' : '70%'
                        }}

                        width = {width + 2 * SLIDER_POINT_RAD}
                        height = {height + 2 * VERTICAL_MARGIN}

                        ref = {plotRef}

                        onMouseEnter={() => {}}
                        onMouseLeave={() => {}}

                        onMouseMove={onMouseMove}
                        onClick = {onMouseClick}
                    />
                    <div>
                    <p style={{width:'100%', textAlign:'center'}}>{title}
                    {!(plotIsActive || displayOnly)
                    &&
                    <small 
                    className="ml-1"
                    style={{width:'100%', textAlign:'center', lineHeight:0}}>
                        <i
                        style={{cursor:'pointer'}}
                        className="text-muted"
                         onClick={() => onSetActivePlot(plotIndex)}
                        >(click to activate plot)</i>
                    </small>}
                    </p>
                    </div>
           </div> 
            )
}