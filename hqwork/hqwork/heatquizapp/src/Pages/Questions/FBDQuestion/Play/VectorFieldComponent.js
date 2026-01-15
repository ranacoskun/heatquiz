import React, { useEffect } from "react"
import { useState } from "react"
import { FixURL } from "../../../../services/Auxillary"
import { LatexRenderer } from "../../../../Components/LatexRenderer"
import { SVGLatexRenderer } from "./SVGLatexRenderer"
import { FBD_QUESTION_PLAY_ARROW_LENGTH } from "./Constants"

export function VectorFieldComponent({question, addedVTs, selectedVT, onDropVT}){
    const svgRef = React.createRef()

    const [imageWidth, setImageWidth] = useState(window.innerWidth * 0.25)
    const [imageHeight, setImageHeight] = useState(0)

    const [objects, setObjects] = useState([])

    const [addedTerms, setAddedTerms] = useState([])

    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)

    const [topOffset, setTopOffset] = useState(0)
    const [leftOffset, setLeftOffset] = useState(0)

    const [selectedOB, setSelectedOB] = useState(null)

    const [showRotationTool, setShowRotationTool] = useState(false)

    const [rotationAngle, setRotationAngle] = useState(0)

    const [sortedGroups, setSortedGroups] = useState([])

    useEffect(() => {
        const {Base_ImageURL_Width, Base_ImageURL_Height, ObjectBodies} = question

        const _height = (Base_ImageURL_Height/Base_ImageURL_Width)*imageWidth
        setImageHeight(_height)

        setObjects(ObjectBodies)
    }, [])

    useEffect(() => {
        setSelectedOB(null)

        setShowRotationTool(false)

    }, [selectedVT])   

    useEffect(() => {
        setSelectedOB(null)

        setShowRotationTool(false)

    }, [addedVTs])

    const convertDimensions = (o) => {
        const {X, Y, Width, Height} = o
        const {Base_ImageURL_Width, Base_ImageURL_Height} = question

        return({
            width: (Width * imageWidth)/Base_ImageURL_Width,
            height: (Height * imageHeight)/Base_ImageURL_Height,
            left: (X * imageWidth)/Base_ImageURL_Width,
            top: (Y * imageHeight)/Base_ImageURL_Height,
        })
    }

    const getPlacableBox = (x, y) => {
        const _ob = objects.filter((o, oi) => {
            const _d = convertDimensions(o)

            const {left:ox, top:oy, width, height} = _d

            const isX = (x-ox>=0) && (x-ox <= width)
            const isY = (y-oy>=0) && (y-oy <= height)

            if(isX && isY) return o;

            return null
        }).filter(a => a)[0]

        return _ob
    }

    const convertAngleToRad = (a) => Math.PI * (a / 180)

    const forcePlacementTool = () => {
        const {left, top, width, height} = convertDimensions(selectedOB)

        const _cx = left+width*0.5
        const _cy = top+height*0.5

        return(
            <svg width={100} height={130} x={_cx-50} y={_cy-50}>
                <circle cx={50} cy={50} r={46} fill="rgba(255,0,0,0.1)" stroke="rgba(255,0,0,0.75)"/> 
                <circle cx={50} cy={50} r={3} fill="rgba(255,0,0,1)" stroke="transparent"/> 

                <line x1={50} y1={50} x2={50} y2={0} stroke="gray" strokeWidth={1} />
                <line x1={50} y1={50} x2={0} y2={50} stroke="gray" strokeWidth={1} />
                <line x1={50} y1={100} x2={50} y2={50} stroke="gray" strokeWidth={1} />
                <line x1={50} y1={50} x2={100} y2={50} stroke="gray" strokeWidth={1} />

                <line x1={50} y1={50} x2={50 + 46*Math.cos(convertAngleToRad(rotationAngle))} y2={50 - 46*Math.sin(convertAngleToRad(rotationAngle))} stroke="red" strokeWidth={1} />

                <rect fill="rgba(255,255,255,0.8)" stroke="red" x={30} y={105} height={20} width={40} />
                <text fill="red" fontSize={12} x={40} y={120}>{Math.trunc(rotationAngle)} °</text> 
            </svg>
        )
    }

    const orderVTs = () => {
        const gs = addedVTs.reduce((g, c) => {
            if(!g[c.ObjectBody.Id]){
                g[c.ObjectBody.Id] = []
            }

            g[c.ObjectBody.Id].push(c)

            return g
        }, {})

        return gs
    }

    const orderedVTs = orderVTs()
    
    function renderArrow(key, x,y,angle,color="green"){

        const _L = FBD_QUESTION_PLAY_ARROW_LENGTH

        return(
            <svg key={key} x={x} y={y-6} transform={`rotate(${-angle}, ${x}, ${y})`}>
                <path fill={color} d= {`M0 4 L0 8 L${_L} 8 L${_L} 12 L${_L+12} 6 L${_L} 0 L${_L} 4 z`}/>
            </svg>
        )
    }

    function renderMomentArrow(key, x,y,color="green"){

        const _r = FBD_QUESTION_PLAY_ARROW_LENGTH * 0.5
        const _c = 2*Math.PI*_r

        return(
            <svg key={key} x={x -_r} y={y - _r}>
                <circle cx={_r} cy={_r} r={_r-4} fill="none" stroke={color} stroke-width="4" stroke-dasharray={_c} stroke-dashoffset={_c * 0.35}/>
                <line x1={2*_r-16} x2={2*_r-2} y2={_r} y1={_r+10} stroke={color} stroke-width="4" />
                <line x1={2*_r+2} x2={2*_r-4} y2={_r} y1={_r+12} stroke={color} stroke-width="4" />
            </svg>
        )
    }

    const findSameOppositeAngles = (angles) =>{
        // Normalize an angle to the range [0, 360)
        const normalizeAngle = (angle) => {
            angle = angle % 360;
            return angle < 0 ? angle + 360 : angle;
        };
    
        // Check if two angles are opposite
        const areOpposite = (angle1, angle2) => {
            const diff = Math.abs(normalizeAngle(angle1) - normalizeAngle(angle2));
            return diff === 180;
        };
    
        // Group angles by their normalized value and remove duplicates
        const angleGroups = {};
        const uniqueAngles = [...new Set(angles)]; // Remove duplicate angles
    
        uniqueAngles.forEach((angle) => {
            const normalized = normalizeAngle(angle);
            if (!angleGroups[normalized]) {
                angleGroups[normalized] = [];
            }
            angleGroups[normalized].push(angle);
        });
    
        const result = [];
        const usedNormalizedAngles = new Set(); // Track normalized angles to avoid duplicates
    
        // Iterate over each unique normalized angle
        Object.keys(angleGroups).forEach((normalizedAngleStr) => {
            const normalizedAngle = parseFloat(normalizedAngleStr);
            if (usedNormalizedAngles.has(normalizedAngle)) return;
    
            const currentAngles = angleGroups[normalizedAngle];
            const opposites = [];
            let sameDirectionAngles = [];
    
            // Find opposites for the current angle group
            Object.keys(angleGroups).forEach((otherNormalizedAngleStr) => {
                const otherNormalizedAngle = parseFloat(otherNormalizedAngleStr);
                if (usedNormalizedAngles.has(otherNormalizedAngle)) return;
    
                if (areOpposite(normalizedAngle, otherNormalizedAngle)) {
                    opposites.push(...angleGroups[otherNormalizedAngle]);
                    usedNormalizedAngles.add(otherNormalizedAngle);
                }
            });
    
            // Find same direction angles (excluding the current group)
            Object.keys(angleGroups).forEach((otherNormalizedAngleStr) => {
                const otherNormalizedAngle = parseFloat(otherNormalizedAngleStr);
                if (otherNormalizedAngle === normalizedAngle) return;
    
                if (normalizeAngle(otherNormalizedAngle) === normalizeAngle(normalizedAngle)) {
                    sameDirectionAngles.push(...angleGroups[otherNormalizedAngle]);
                }
            });
    
            // Combine same direction angles with the current group
            sameDirectionAngles = [...currentAngles.slice(1), ...sameDirectionAngles];
    
            // Add the current angle and its opposites/same direction angles to the result
            result.push([
                currentAngles[0],
                opposites.length > 0 ? [...new Set(opposites)] : [], // Remove duplicates in opposites
                sameDirectionAngles.length > 0 ? [...new Set(sameDirectionAngles)] : [], // Remove duplicates in same direction
            ]);
    
            usedNormalizedAngles.add(normalizedAngle);
        });
    
        return result;
    }

    const convertToPositiveAngle = (angle) => {
        // Normalize the angle to a value between 0 and 360
        const positiveAngle = angle % 360;
        return positiveAngle >= 0 ? positiveAngle : positiveAngle + 360;
    }

    const getVTBlocks = (_g) => {
        const vts = [..._g]

        const vtAngles = _g.map((vt) => vt.Angle)

        const anglePairs = findSameOppositeAngles(vtAngles)

        let vtBlocks = {}

        for(const p of anglePairs){
            const _posAngle = p[0]
            vtBlocks[_posAngle] = []
        }

        for(const p of anglePairs){
            const _posAngle = p[0]
            const _negAngles = p[1]
            const _sameDirectionAngles = p[2]

            const _selfVTs = vts.filter(v => Object.is(v.Angle, _posAngle))

            let _oppositeVTs = []
            let _sameDirectionVTs = []

            if(_negAngles && _negAngles.length){
                _oppositeVTs = vts.filter(v => _negAngles.includes(v.Angle)).map(r => ({...r, opposite: true}))
            }

            if(_sameDirectionAngles && _sameDirectionAngles.length){
                _sameDirectionVTs = vts.filter(v => _sameDirectionAngles.includes(v.Angle)).map(r => ({...r}))
            }

            vtBlocks[_posAngle].push(...[..._selfVTs, ..._sameDirectionVTs, ..._oppositeVTs])
        }

        return vtBlocks
    }

    console.log(leftOffset, topOffset)

    return( 
        <div>
            <svg ref={svgRef} width={imageWidth} height={imageHeight} style={{cursor:selectedVT ? "pointer" : "default"}}
                onMouseMove={(e) => {
                    e.persist()

                    const svgElement = svgRef && svgRef.current

                    if(svgElement){
                        const {top, left} = svgElement.getBoundingClientRect();
                        if(!showRotationTool){

                        setTopOffset(top)
                        setLeftOffset(left)

                        const y = (e.clientY - top)
                        const x = (e.clientX - left)

                        const _box = getPlacableBox(x,y)

                        if(_box){
                            const _d = convertDimensions(_box)

                            setMouseX(_d.left + _d.width * 0.5)
                            setMouseY(_d.top + _d.height * 0.5)
                        }
                        else{
                            setMouseX(x)
                            setMouseY(y)
                        }
                        }
                        else{
                            const {left:l, top:t, width, height} = convertDimensions(selectedOB)

                            const _cx = l + width*0.5
                            const _cy = t + height*0.5

                            const y = (e.clientY - top) 
                            const x = (e.clientX - left)

                            const _angle = (180/Math.PI) * Math.atan2(_cy - y, x - _cx)

                            setRotationAngle(_angle)
                        }
                    }
                }}

                onClick={(e) => {
                    const _box = getPlacableBox(mouseX,mouseY)

                    if(selectedVT && _box && !showRotationTool){
                        const {Linear} = selectedVT

                        if(Linear){
                            setShowRotationTool(true)
                        
                            setSelectedOB(_box)
                            return;
                        }
                        else{
                            const {left, top, width, height} = convertDimensions(_box)

                            const _x = left+width*0.5
                            const _y = top+height*0.5

                            onDropVT(0, _x, _y, _box)
                            return;
                        }

                        
                    }
                    else if(selectedVT && showRotationTool){
                        const {left, top, width, height} = convertDimensions(selectedOB)

                        const _x = left+width*0.5
                        const _y = top+height*0.5

                        onDropVT((parseInt(rotationAngle) || 0), _x, _y, selectedOB)

                        setShowRotationTool(false)
                        setSelectedOB(null)
                    }
                }}
            >
                <image 
                    width={imageWidth}
                    href={FixURL(question.Base_ImageURL)}
                    x = {0} y = {0}
                />

                {objects.map((o,oi) => {
                    const {Id} = o
                    const _d = convertDimensions(o)

                    return(
                        <rect key={Id} width={_d.width} height={_d.height} x={_d.left} y={_d.top} fill="rgba(0,0,0,0.1)" stroke="green" />
                    )
                })}

                {selectedVT && mouseX &&
                    <svg
                        x={mouseX-3} y={mouseY-3}
                    >   
                        <circle cx={3} cy={3} r={3} fill="green" />                        
                    </svg>
                }

                {showRotationTool && forcePlacementTool()}

                {Object.keys(orderedVTs).map((k, ki) => {
                    const _g = orderedVTs[k]
                    const {ObjectBody: OB} = _g[0]
                    const {Id} = OB
                    const {left, top, width, height} = convertDimensions(OB)

                    const _x = left+width*0.5
                    const _y = top+height*0.5

                    const vtBlocks = getVTBlocks(_g.filter(a => a.Linear))

                    return(
                    <svg key={"Arrows" + Id} x={_x - 100} y = {_y - 100} width={200} height={200}>
                        {Object.keys(vtBlocks).map((bk) => {
                            const data = vtBlocks[bk]
                            const _vt = data[0]
                            
                            const {Id, ArrowColor} = _vt

                            const _color = data.length > 1 ? "green" : ArrowColor

                            return(renderArrow(Id, 100, 100, bk, _color))
                        })}
                    </svg>)
                })}

                {Object.keys(orderedVTs).map((k, ki) => {
                    const _g = orderedVTs[k]
                    const {ObjectBody: OB} = _g[0]
                    const {Id} = OB
                    const {left, top, width, height} = convertDimensions(OB)

                    const _x = left+width*0.5
                    const _y = top+height*0.5

                    const vtBlocks = getVTBlocks(_g.filter(a => !a.Linear))

                    return(
                    <svg key={"Circles" + Id} x={_x - 100} y = {_y - 100} width={200} height={200}>
                        {Object.keys(vtBlocks).map((bk) => {
                            const data = vtBlocks[bk]
                            const _vt = data[0]
                            
                            const {Id, ArrowColor} = _vt

                            const _color = data.length > 1 ? "green" : ArrowColor

                            return(renderMomentArrow(Id, 100, 100, _color))
                        })}
                    </svg>)
                })}
            </svg>

            {selectedVT && 
                <span style={{position:'absolute', left: mouseX + leftOffset + 20, top:mouseY+topOffset + 20}}>
                    <LatexRenderer latex={"$" + selectedVT.Latex + "$"}/>
                </span>    
            }

            {/* Forces */}
            {Object.keys(orderedVTs).map((k, ki) => {
                    const _g = orderedVTs[k]
                    const {ObjectBody: OB} = _g[0]
                    const {Id} = OB
                    const {left, top, width, height} = convertDimensions(OB)

                    const _x = left+width*0.5
                    const _y = top+height*0.5

                    const vtBlocks = getVTBlocks(_g.filter(a => a.Linear))

                    return(
                    <span key={"Forces" + Id} style={{position:'absolute', left: _x + leftOffset, top:_y+topOffset}}>
                        {Object.keys(vtBlocks).map((bk) => {
                            const data = vtBlocks[bk]

                            const _vt = data[0]
                            
                            const {Id} = _vt

                            const _latex = data.reduce((r, c, ci) => r += (c.opposite ? "-" : (ci ? "+" : "")) + c.Latex + "", "")
                            
                            const _angleBK = convertToPositiveAngle(-bk)

                            const showFlip = (_angleBK >= 90 && _angleBK < 270)

                            return(
                            <span 
                            key={`inner-${Id}-${bk}`} 
                            style={{position:'absolute', display: 'inline-block', width: imageWidth,left:65, top:-10, transformOrigin:`${-65}px ${10}px`, transform:`rotate(${-bk}deg)`}}>
                                <span style={{position:'absolute', display: 'inline-block', transformOrigin:`50% 50%`, transform:`rotate(${showFlip ? 180 : 0}deg)`}}>
                                    <LatexRenderer latex={"$" + _latex + "$"}/>
                                </span>
                            </span>)
                        })}
                    </span>)
                })}

            {/* Momens */}
            {Object.keys(orderedVTs).map((k, ki) => {
                    const _g = orderedVTs[k]
                    const {ObjectBody: OB} = _g[0]

                    const momentVTs = _g.filter(a => !a.Linear)

                    if(!momentVTs.length) return (<div/>);

                    const {Id} = OB
                    const {left, top, width, height} = convertDimensions(OB)

                    const _x = left+width*0.5
                    const _y = top+height*0.5
                    
                    const _latex = momentVTs.reduce((r, c, ci) => r += (c.Clockwise ? "-" : (ci ? "+" : "")) + c.Latex + "", "")
                    return(
                    <span key={"Moments" + Id} style={{position:'absolute', left: _x + leftOffset-20, top:_y+topOffset+20}}>
                        <LatexRenderer latex={"$" + _latex + "$"}/>
                    </span>)
                })}
        </div>
    )
}