import React, { useEffect } from "react"
import { useState } from "react"
import { FixURL, getUniqueValues } from "../../../../services/Auxillary"
import { VectorDirectionComponent } from "../Shared/VectorDirectionComponent"
import Xarrow from "react-xarrows";
import { LatexRenderer } from "../../../../Components/LatexRenderer";

export function CorrectVectorOnImage({question, addedVTs, selectedVT, onDropVT}){

    const canvasRef = React.createRef()

    const [ctx, setCtx] = useState()
    const [topOffset, setTopOffset] = useState(0)
    const [leftOffset, setLeftOffset] = useState(0)

    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    const [angleX, setAngleX] = useState(0)
    const [angleY, setAngleY] = useState(0)

    const [showSelectAngle, setShowSelectAngle] = useState(false)

    const [snippedBox, setSnippedBox] = useState(null) 

    const {Base_ImageURL_Width, Base_ImageURL_Height, Base_ImageURL, ObjectBodies} = question

    const newImageWidth = window.innerWidth * 0.25
    const newImageHeight =(Base_ImageURL_Height/Base_ImageURL_Width)*newImageWidth

    useEffect(() => {
        if(canvasRef && canvasRef.current){
            const _ctx = canvasRef.current.getContext('2d')

            const styles = canvasRef.current.getBoundingClientRect()
            const {top, left} = styles

            if(_ctx){
                setCtx(_ctx)
            }

            setTopOffset(top)
            setLeftOffset(left)
        }
    }, [canvasRef])

    useEffect(() => {
        drawPlot()
    }, [mouseX, mouseY, selectedVT])

    useEffect(() => {
        
    }, [addedVTs])

    const calculateCPdimensions = (imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0, fake) => {
        if(!fake){
            return({            
                width: (element.Width)  * (specificedWidth/imageWidth),
                height: (element.Height)* (specificedHeight/imageHeight),
                left: (element.X + Offset) * (specificedWidth/imageWidth),
                top: (element.Y) * (specificedHeight/imageHeight),
            })
        }
        else{
            return({            
                width: (element.Width) ,
                height: (element.Height),
                left: (element.X + Offset),
                top: (element.Y),
            })
        }
       
    }


    const getOrientedVTs = () => {
        let boxes = {

        }


        for(let vt of addedVTs){
            const boxesIds = Object.keys(boxes).map(a => Number(a))

            const {ObjectBody} = vt

            if(boxesIds.includes(ObjectBody.Id)){

                boxes[ObjectBody.Id].list.push({...vt, BodyObjectId: ObjectBody.Id})
            }
            else{
                boxes[ObjectBody.Id] = ({})
                
                boxes[ObjectBody.Id].body = ObjectBody
                boxes[ObjectBody.Id].list = [{...vt, BodyObjectId: ObjectBody.Id}]
            }

        }

        return boxes
    }

    const orientedBoxes = getOrientedVTs()
    const orientedBoxesKeys = Object.keys(orientedBoxes)

    const fakeOrientedBoxesList = orientedBoxesKeys.map(k => orientedBoxes[k].body).filter(a => a.fake)

    const handleSnipping = (e) => {
        let point = computePointInCanvas(e)

        let _snippedBox = null

        const boxes = [...fakeOrientedBoxesList, ...ObjectBodies].map((b) => {


            const dimensions = calculateCPdimensions (Base_ImageURL_Width, Base_ImageURL_Height, newImageWidth, newImageHeight, b)
            return({
                ...b,
                ...dimensions
            })
        })

        const closest_boxes = boxes.map((b) => {
            const insideX = (point.x >= b.left && point.x <= (b.width+b.left))
            const insideY = (point.y >= b.top && point.y <= (b.height+b.top))

            if(insideX && insideY) return b
            
            return null
        }).filter(a => a)

        if(closest_boxes.length){
            const first_box = closest_boxes[0]
            const centerX = first_box.left + 0.5*first_box.width
            const centerY = first_box.top + 0.5*first_box.height

            point.x = centerX
            point.y = centerY

            _snippedBox = first_box
        }

        return ({point, _snippedBox})
    }

    const onMouseEnter = (e) => {
        setMouseX(0)
        setMouseY(0)
    }

    const onMouseLeave = (e) => {
        setMouseX(0)
        setMouseY(0)
    }

   
    const onMouseMove = (e) => {
        const {point, _snippedBox} = handleSnipping(e)

        console.log(e)
        console.log(point)
    
        setMouseX(point.x)
        setMouseY(point.y)

        setSnippedBox(_snippedBox)
    }

    const onMouseClick = (e) => {
        if(!selectedVT) return;
        const {Linear} = selectedVT

        let point = computePointInCanvas(e)

        if(Linear){
            setShowSelectAngle(true)

            setAngleX(point.x)
            setAngleY(point.y)
        }
        else{
            setShowSelectAngle(false)
            onDropVT({...selectedVT, Clockwise: true}, 0, point.x, point.y, snippedBox)
        }
    }

    //Function to calculate point position inside canvas
    const computePointInCanvas = (e) => {
        const {clientX, clientY} = e

        const boundingRect = canvasRef.current.getBoundingClientRect();
            return {
                x: Math.floor(clientX - boundingRect.left),
                y: Math.floor(clientY - boundingRect.top)
            }
    }

    const drawDot = (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);

        ctx.strokeStyle = 'gray';
        ctx.fillStyle = 'green'

        ctx.fill();
        ctx.stroke();
    }

    const drawPlot = () => {
        if(!ctx) return;

        ctx.clearRect(0, 0, newImageWidth, newImageHeight)

        //Draw green point
        if(mouseX && mouseY && selectedVT){
            drawDot(mouseX, mouseY)
        }
    }

    const widthHeight = window.innerWidth*0.035

    const getOrderedList = (list) => {

        //Positive only reference
        let matrix = {}

        for(let vt of list){    
            if(!vt.Linear) continue;
            
            const currentKeys = Object.keys(matrix)

            const {Angle, BodyObjectId} = vt

            let _angle = Angle

            if(_angle < 0) _angle = _angle + 360


            let oppositeAngle = _angle + 180
            oppositeAngle = (oppositeAngle % 360)

            const key1 = "K" + BodyObjectId + _angle
            const key2 = "K" + BodyObjectId + oppositeAngle

            if(currentKeys.includes(key1)){
                matrix[key1].push({...vt, positiveDirection: true})
            }   
            else if(currentKeys.includes(key2)){
                matrix[key2].push({...vt, positiveDirection: false})
            }
            else{
                matrix[key1] = []
                matrix[key1].push({...vt, positiveDirection: true})
            }
        }

        return matrix
    }

    const getMomentsLatex = (list) => {
        let latex = ""
        let clockwiseCount = list.filter(a => !a.Linear).reduce((r, c) => r = (r || c.Clockwise), false)

        for(let vt of list){    
            if(vt.Linear) continue;
            
            const {Clockwise,} = vt 
            
            if(clockwiseCount){
                latex = latex + (Clockwise ? "+ " : '- ') + vt.Latex
            }
            else{
                latex = latex + (!Clockwise ? "+ " : '- ') + vt.Latex
            }
        }

        return ({latex, clockwiseCount})
    }

    return(
        <div>
             <canvas
                    style = {{
                            cursor: selectedVT ? 'crosshair' : 'default',
                            height:newImageHeight,
                            width:newImageWidth,
                            backgroundImage: `url(${FixURL(Base_ImageURL)})`,
                            backgroundPosition:'center',
                            backgroundRepeat:'no-repeat',
                            backgroundSize:'contain',
                            border:'1px solid green',
                        }}

                        width = {newImageWidth}
                        height = {newImageHeight}

                        ref = {canvasRef}

                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onMouseMove={onMouseMove}
                        onClick = {onMouseClick}
                    > 
                
                </canvas>
                {showSelectAngle && 
                <div
                    style={{position:'absolute', left:leftOffset + angleX - widthHeight/2, top:topOffset + angleY - widthHeight/2}}
                >
                    <VectorDirectionComponent 
                        onUpdateAngle={(angle) => {
                            onDropVT(selectedVT, angle, angleX, angleY, snippedBox)
                            setShowSelectAngle(false)
                        }}  

                        widthHeight={widthHeight}
                        angleStep={5}
                    />
                </div>}

                {orientedBoxesKeys.map((bk) => {
                    const {ArrowLength} = question

                    const b = orientedBoxes[bk]
                    const {body, list} = b
                    const {Id, fake} = body

                    const dimensions = calculateCPdimensions (Base_ImageURL_Width, Base_ImageURL_Height, newImageWidth, newImageHeight, body, 0, fake)
                    const {width, height, left, top} = dimensions

                    const orderedList = getOrderedList(list)
                    const {latex:momentsLatex, clockwiseCount: clockwise} = getMomentsLatex(list)

                    const orderedListKeys = Object.keys(orderedList)

                    return(     
                           <div>
                                <div
                                    key={"correct-" + Id}
                                    style={{position:'absolute', left: leftOffset + left , top: topOffset + top}}
                                >
                                    <div
                                    id={"correct-" +"B_START_" + Id}
                                    style={{left:width/2, top: height/2, position:'relative', width: 0, height:0}}
                                    >
                                    </div>
                                </div>

                                {momentsLatex 
                                &&
                                <div
                                    key={"correct-" +Id}
                                    style={{position:'absolute', left: leftOffset + left , top: topOffset + top}}
                                >
                                    <div style={{left:width/2, top: height/2, position:'relative'}} >
                                        <LatexRenderer latex={momentsLatex} />
                                    </div>
                                </div>}

                                {momentsLatex 
                                &&
                                <div
                                    key={"correct-" +Id}
                                    style={{position:'absolute', left: leftOffset + left , top: topOffset + top}}
                                >
                                    <div style={{left:width/2 - 10, top: height/2 - 10, position:'relative'}} >
                                       <p className="default-green default-larger">{clockwise ? "↻" : "↺"}</p>
                                    </div>
                                </div>}

                                {orderedListKeys.map((k, ki) => {
                                    const data = orderedList[k]

                                    const Angle = data[0].Angle

                                    const arrowRad = ArrowLength || 50
               
                                    const radAngle = Math.PI * (Angle/180)
                
                                    const extraX = Math.cos(radAngle) * arrowRad
                                    const extraY = Math.sin(-radAngle) * arrowRad
                                    
                                    const _left = leftOffset + left + width/2  + extraX
                                    const _top = topOffset + top + height/2 + extraY 
                               
                                    return(
                                        <div
                                            key={"correct-" +ki}
                                            style={{position:'absolute', left: _left, top: _top}}
                                            id={"correct-" +"VT_END_" + k}
                                        >
                                        </div>
                                    )
                                })}

                                {/* LaTeX */}
                                {orderedListKeys.map((k, ki) => {
                                    const data = orderedList[k]

                                    const Angle = data[0].Angle

                                    const arrowRad = ArrowLength || 70
               
                                    const radAngle = Math.PI * (Angle/180)
                
                                    const extraX = Math.cos(radAngle) * arrowRad
                                    const extraY = Math.sin(-radAngle) * arrowRad
                                    
                                    const _left = leftOffset + left + width/2  + extraX
                                    const _top = topOffset + top + height/2 + extraY 
                                    
                                    const latexReduced = data.reduce((r, c, ci) => {
                                        
                                        r = r + (ci ? (c.positiveDirection ? '+' : '-') : '') + c.Latex

                                        return r
                                    }, '')

                                   

                                    return(
                                        <div
                                            key={"correct-" +ki}
                                            style={{position:'absolute', left: _left, top: _top}}
                                        >
                                            <LatexRenderer latex={"$$" + latexReduced + "$$"}/>
                                        </div>
                                    )
                                })}

                                {orderedListKeys.map((k) => {
                                    const data = orderedList[k]

                                    let arrowColor = 'green'

                                    let arrowColorArray = getUniqueValues(data.map((a) => a.ArrowColor))

                                    if(arrowColorArray.length === 1){
                                        arrowColor = arrowColorArray[0]
                                    }

                                    return(<Xarrow
                                            key={"correct-" +Id}
                                            start={"correct-" +"B_START_" + Id}
                                            end={"correct-" +"VT_END_" + k}
                                            strokeWidth={2}
                                            headSize={4}
                                            startAnchor="auto"
                                            endAnchor="auto"
                                            color={arrowColor}
                                            path={"straight"}
                                    />)
                                })}


                                </div>)
                            })}
                
                

           
        </div>
    )
}