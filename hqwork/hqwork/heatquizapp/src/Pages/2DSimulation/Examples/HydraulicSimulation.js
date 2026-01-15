import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import house from'./house.PNG';
import pump from'./pump.png';
import radiator from'./radiator.png';
import tank from'./tank.png';
import { Button, Space } from "antd";
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
var timer;

const INCREASING_VALUE = 1
const CONSTANT_VALUE = 2
const DECREASING_VALUE = 3

export function HydraulicSimulation(){
    const baseWidth = 500

    const [includeSecondRadiator, setIncludeSecondRadiator] = useState(false)
    const [flipQloss, setFlipQLoss] = useState(false)
    const [limitP, setLimitP] = useState(false)

    //Variable
    const [TDesired, setTDesired] = useState(450)
    const [TOutside, setTOutside] = useState(550)

    //Calculated
    const [TInside, setTInside] = useState([500]) 
    const [QLoss, setQLoss] = useState([0])
    const [PIn, setPIn] = useState([0])
    const [COP, setCOP] = useState([])
    
    const doCalculations = () => {
        const cTInside = TInside.at(-1)
        let _QLoss =  (TOutside - cTInside) * 0.2 
        let qLossArray = [...QLoss]

        if(qLossArray.length > 289){
            qLossArray.shift()
        }
       
        qLossArray.push(_QLoss)
        
        setFlipQLoss(_QLoss < 0 ? true : false)

        setQLoss(qLossArray)
        let deltaT = (TDesired - TInside) * -1

        let heatingValue = 0.01

        let flowRate = (includeSecondRadiator ? 1.8: 1)

        let addedHeat = flowRate * heatingValue * deltaT

        let _PIn = (TDesired - cTInside) * (-1) * 0.25 +  _QLoss * 1.1 
        _PIn = (1/flowRate) * _PIn 
        // Limit P-in
        if(limitP){
            _PIn = (_PIn >= 0 ? +1 : -1) * (Math.min(Math.abs(_PIn), 40))
        }

        let pInArray = [...PIn]
        if(pInArray.length > 289){
            pInArray.shift()
        }
        pInArray.push(_PIn)
       
        setPIn(pInArray)

        let _TInside = cTInside - (flowRate*_PIn - 1.1*_QLoss)*0.1 

        let tInsideArray = [...TInside]
        if(tInsideArray.length > 289){
            tInsideArray.shift()
        }

        tInsideArray.push(_TInside)

        setTInside(tInsideArray)
    }

    useEffect(() => {
        timer = setInterval(() => {
            doCalculations()
        }, 125)

        return () => clearInterval(timer)
    }, [TInside])

    const getValues = () => {

        const cPIn = PIn.at(-1)
        const cQLoss = QLoss.at(-1)
        const cTInside = TInside.at(-1)

        let qLossStatus = CONSTANT_VALUE
        if(QLoss.length > 3){
            const qLossChange = (Math.abs(QLoss.at(-1)) - Math.abs(QLoss.at(-2)))

            if(qLossChange > 0){
                qLossStatus = INCREASING_VALUE
            }
            else if( qLossChange < 0){
                qLossStatus = DECREASING_VALUE
            }
        }

        let pInStatus = CONSTANT_VALUE
        if(PIn.length > 3){
            const pInChange = (Math.abs(PIn.at(-1)) - Math.abs(PIn.at(-2)))

            if(pInChange > 0){
                pInStatus = INCREASING_VALUE
            }
            else if( pInChange < 0){
                pInStatus = DECREASING_VALUE
            }
        }


        return ({cPIn, cQLoss, cTInside, qLossStatus, pInStatus})
    }

    const {cPIn, cQLoss, cTInside, qLossStatus, pInStatus, } = getValues()

    const getColor = (stat) => {
        const colors = {
            [CONSTANT_VALUE]:'gray',
            [INCREASING_VALUE]:'green',
            [DECREASING_VALUE]:'red'
        }

        return colors[stat]
    }

    const getName = (stat) => {
        const colors = {
            [CONSTANT_VALUE]:'-',
            [INCREASING_VALUE]:'⇈',
            [DECREASING_VALUE]:'⇊'
        }

        return colors[stat]
    }

    console.log(cPIn, cQLoss, cTInside, qLossStatus, pInStatus, )

    
    return(
        <PagesWrapper>
            <Space align="start">
                <div>
                    <svg             
                    style={{width:1080, height:750, border:'1px solid blue'}}>
                        <image 
                            href={house}
                            x={200}
                            y={150}
                            width={baseWidth}
                        />
                       
                        {/* T label */}
                        <line x1={68} x2={40} y1={TOutside} y2={TOutside} stroke="#FF3300" />
                        <line x1={70} x2={250} y1={TOutside} y2={TOutside} stroke="#FF3300" strokeDasharray="10"/>

                        <text x={5} y={TOutside - 5}>T outside</text>

                        {/* T label */}
                        <line x1={68} x2={40} y1={cTInside} y2={cTInside} stroke="#FF3300" />
                        <line x1={70} x2={250} y1={cTInside} y2={cTInside} stroke="#FF3300" strokeDasharray="10"/>
                        <text x={150} y={cTInside + 20}>T inside</text>
                        <line x1={70} x2={250} y1={TDesired} y2={TDesired} stroke="#FF3300" strokeDasharray="10"/>
                        <line x1={68} x2={40} y1={TDesired} y2={TDesired} stroke="#FF3300" />
                        <text x={5} y={TDesired - 10}>T desired</text>

                        <image 
                            href={radiator}
                            x={580}
                            y={450}
                        />

                        {includeSecondRadiator && 
                        <image 
                            href={radiator}
                            x={280}
                            y={450}
                        />}
                       
                        <image 
                            href={pump}
                            x={920}
                            y={450}
                        />
                        {/* P in */}
                        <text fill="green" x={945} y={440} fontSize="18px"> P in</text>
                        
                        
                        {/* pump - radiator */}
                        <line 
                            stroke="blue"
                            x1={927}
                            y1={455}
                            x2={927}
                            y2={440}
                        />
                                              
                        <line 
                            stroke="blue"
                            x1={927}
                            y1={440}
                            x2={600}
                            y2={440}
                        />

                        {includeSecondRadiator && 
                        <line 
                            stroke="blue"
                            x1={600}
                            y1={440}
                            x2={300}
                            y2={440}
                        />}
                        {includeSecondRadiator && 
                        <line 
                            stroke="blue"
                            x1={300}
                            y1={440}
                            x2={300}
                            y2={456}
                        />}         

                        <line 
                            stroke="blue"
                            x1={600}
                            y1={440}
                            x2={600}
                            y2={456}
                        />
                                              

                        {/* Metrics */}
                        <text x={5} y={17} fill="blue">Q Loss</text>
                        <text x={50} y={17} fill={cQLoss > 0 ? "green" : "red"}>{cQLoss > 0 ? "+" : "-"}</text>
                        <text x={65} y={17} fill={getColor(qLossStatus)}>{getName(qLossStatus)}</text>
                        <text x={85} y={17} fill="blue">P in</text>
                        <text x={120} y={17} fill={cPIn > 0 ? "green" : "red"}>{cPIn > 0 ? "+" : "-"}</text>
                        <text x={135} y={17} fill={getColor(pInStatus)}>{getName(pInStatus)}</text>
                        {/* Q loss */}

                        {flipQloss ? 
                        <svg>
                            <line x1 ={630} x2={680} y1={530} y2={530} stroke="green">
                            <animate
                                attributeName="x2"
                                begin="0s"
                                dur="4s"
                                from={"680"}
                                to={"660"}
                                repeatCount="indefinite" />
                            <animate
                                attributeName="x1"
                                begin="0s"
                                dur="4s"
                                from={630}
                                to={610}
                                repeatCount="indefinite" />
                            </line>
                            <polygon points="630,525 630,535 625,530" fill="green">
                            <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                from={"630,525 630,535 625,530"}
                                to={"610,525 610,535 605,530"}
                                repeatCount="indefinite" />
                            </polygon>

                            <line x1 ={630} x2={680} y1={505} y2={505} stroke="green">
                            <animate
                                attributeName="x2"
                                begin="0s"
                                dur="4s"
                                from={"680"}
                                to={"660"}
                                repeatCount="indefinite" />
                            <animate
                                attributeName="x1"
                                begin="0s"
                                dur="4s"
                                from={630}
                                to={610}
                                repeatCount="indefinite" />
                            </line>
                            <polygon points="630,500 630,510 625,505" fill="green">
                            <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                from={"630,500 630,510 625,505"}
                                to={"610,500 610,510 605,505"}
                                repeatCount="indefinite" />
                            </polygon>
                        </svg>
                        : 
                        <svg>
                            <line x1 ={630} x2={680} y1={530} y2={530} stroke="red">
                            <animate
                                attributeName="x1"
                                begin="0s"
                                dur="4s"
                                from={"630"}
                                to={"650"}
                                repeatCount="indefinite" />
                            <animate
                                attributeName="x2"
                                begin="0s"
                                dur="4s"
                                from={680}
                                to={700}
                                repeatCount="indefinite" />
                            </line>
                            <polygon points="680,525 680,535 685,530" fill="red">
                            <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                from={"680,525 680,535 685,530"}
                                to={"700,525 700,535 705,530"}
                                repeatCount="indefinite" />
                            </polygon>

                            <line x1 ={630} x2={680} y1={505} y2={505} stroke="red">
                            <animate
                                attributeName="x1"
                                begin="0s"
                                dur="4s"
                                from={"630"}
                                to={"650"}
                                repeatCount="indefinite" />
                            <animate
                                attributeName="x2"
                                begin="0s"
                                dur="4s"
                                from={680}
                                to={700}
                                repeatCount="indefinite" />
                            </line>
                            <polygon points="680,500 680,510 685,505" fill="red">
                            <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                from={"680,500 680,510 685,505"}
                                to={"700,500 700,510 705,505"}
                                repeatCount="indefinite" />
                            </polygon>
                        </svg>}
                        
                        <text x={680} y={560} fill={flipQloss ? "green" : "red"} fontSize="14px">{flipQloss ? "Q flow" : "Q loss"}</text>
                    </svg>
                </div>
                <div>
                    <Space>
                        <p className="default-title">Heat pump simulation</p>
                        <Space className="hq-element-container">
                            {includeSecondRadiator ? 
                            <MinusOutlined className="default-red hq-clickable" 
                                onClick={() => {
                                    setIncludeSecondRadiator(false)
                                }}
                            /> : 
                            <PlusOutlined className="default-green hq-clickable" 
                                onClick={() => {
                                    setIncludeSecondRadiator(true)
                                }}
                            />}
                            Radiator
                        </Space>
                        
                        <Space className="hq-element-container">
                        
                        <PlusOutlined className="default-green hq-clickable" 
                                onClick={() => {
                                    let _current = TDesired

                                    _current = _current - 10

                                    _current = Math.max(_current, 350)

                                    setTDesired(_current)
                                }}
                            />
                            <MinusOutlined className="default-red hq-clickable"
                                onClick={() => {
                                    let _current = TDesired

                                    _current = _current + 10

                                    _current = Math.min(_current, 600)

                                    setTDesired(_current)
                                }}
                            />
                            <p className="default-gray">T desired</p>
                        </Space>

                        <Space className="hq-element-container">
                            <PlusOutlined className="default-green hq-clickable" 
                                onClick={() => {
                                    let _current = TOutside

                                    _current = _current - 10

                                    _current = Math.max(_current, 510)

                                    setTOutside(_current)
                                }}
                            />
                            <MinusOutlined className="default-red hq-clickable"
                                onClick={() => {
                                    let _current = TOutside

                                    _current = _current + 10

                                    _current = Math.min(_current, 600)

                                    setTOutside(_current)
                                }}
                            />
                            <p className="default-gray">T outside</p>
                        </Space>

                        
                    </Space>
                    
                    <br/>
                    <Space align="center">
                        <p className="default-title">P in {(cPIn || 0).toFixed(2)} kW</p>

                            <Button
                                size="small"
                                type={limitP ? "primary" : "default"}
                                onClick={() => setLimitP(!limitP)}
                            >
                                Limit
                            </Button>
                            <p className="default-title">{limitP ? " (limited at 40KW)" : ""}</p>

                        </Space>
                    <svg  style={{width:600, height:200, border:'1px solid gray'}}>
                        <line x1={0} y1={100} x2={600} y2={100} stroke="gray" />
                        {PIn.map((v, vi) => {
                            const _y = 100 - (v/60) * (80)
                            return(
                                <circle cx={10 + vi * 2} cy={_y} r={1} fill={v < 0 ? "red" : "green"} />
                            )
                        })}
                        
                    </svg>

                    <p className="default-title">Q loss</p>
                    <svg  style={{width:600, height:200, border:'1px solid gray'}}>
                        <line x1={0} y1={100} x2={600} y2={100} stroke="gray" />
                        {QLoss.map((v, vi) => {
                            const _y = 100 - (v/40) * (80)
                            return(
                                <circle cx={10 + vi * 2} cy={_y} r={1} fill={v < 0 ? "red" : "green"} />
                            )
                        })}

                        
                    </svg>
                </div>
            </Space>
        </PagesWrapper>
    )
}