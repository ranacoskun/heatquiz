import { Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";

import pump from'./pump.png';
import tank from'./tank.png';
import wall from'./wall.jpg';
import wateroutlet from'./wateroutlet.png';
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';

var timer;

const INCREASING_VALUE = 1
const CONSTANT_VALUE = 2
const DECREASING_VALUE = 3

export function HydraulicSimulator(){

    const baseWidth = 500

    const [includeSecondOutlet, setIncludeSecondOutlet] = useState(false)
    const [flipVloss, setFlipVloss] = useState(false)

    //Variable
    const [HDesired, setHDesired] = useState(450)
    const [HOutside, setHOutside] = useState(550)
    const [TankHeight, setTankHeight] = useState(100)

    //Calculated
    const [HInside, setHInside] = useState([500]) 
    const [VLoss, setVLoss] = useState([])
    const [PIn, setPIn] = useState([])
    
    const doCalculations = () => {
        const cHInside = HInside.at(-1)
        let _VLoss =  (HOutside - cHInside) * 0.02
        let vLossArray = [...VLoss]

        if(vLossArray.length > 439){
            vLossArray.shift()
        }
       
        vLossArray.push(_VLoss)
            
        setFlipVloss(_VLoss < 0 ? true : false)

        setVLoss(vLossArray)
        const flowRate = 1 + 0.5 * (200 - TankHeight)/150;

        let _PIn =  flowRate *2 * (includeSecondOutlet ? 1.8 : 1);
        let _Qout =  _VLoss * 2;

        //if(_PIn < 0) _PIn = 0;

        // Limit P-in
        //_PIn = (_PIn >= 0 ? +1 : -1) * (Math.min(Math.abs(_PIn), 40))

        let pInArray = [...PIn]
        if(pInArray.length > 439){
            pInArray.shift()
        }
        pInArray.push(_PIn)
       
        setPIn(pInArray)
        let _HInside = cHInside + (_PIn - _Qout) * -1
        

        let hInsideArray = [...HInside]
        if(hInsideArray.length > 439){
            hInsideArray.shift()
        }

        hInsideArray.push(_HInside)

        setHInside(hInsideArray)
    }

    useEffect(() => {
        timer = setInterval(() => {
            doCalculations()
        }, 125)

        return () => clearInterval(timer)
    }, [HInside])

    const getValues = () => {

        const cPIn = PIn.at(-1)
        const cVloss = VLoss.at(-1)
        const cHInside = HInside.at(-1)

        let VlossStatus = CONSTANT_VALUE
        if(VLoss.length > 3){
            const VlossChange = (Math.abs(VLoss.at(-1)) - Math.abs(VLoss.at(-2)))

            if(VlossChange > 0){
                VlossStatus = INCREASING_VALUE
            }
            else if( VlossChange < 0){
                VlossStatus = DECREASING_VALUE
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


        return ({cPIn, cVloss, cHInside, VlossStatus, pInStatus})
    }


    const {cPIn, cVloss, cHInside, VlossStatus, pInStatus} = getValues()

    return(
        <PagesWrapper>
            <Space align="start">
                <div>
                    <svg style={{width:1080, height:700, border:'1px solid blue'}}>
                        

                        { /* Main well */}
                        <image 
                            href={wall}
                            x={200}
                            y={320}
                            width={28}
                        />
                        <image 
                            href={wall}
                            x={650}
                            y={320}
                            width={28}
                        />
                        {/* H inside */}
                        <rect x={227} y={cHInside} width={426} height={609 - cHInside} fill="#66FFFF"/>

                        <image 
                            href={wateroutlet}
                            x={603}
                            y={480}
                            width={50}
                        />
                        {includeSecondOutlet && 
                        <image 
                            href={wateroutlet}
                            x={603}
                            y={380}
                            width={50}
                        />}
                        
                        <line x1={203} y1={610} x2={677} y2={610} stroke="black" strokeWidth={3} />

                        {/* pump */}
                        <image 
                            href={pump}
                            x={920}
                            y={450}
                        />
                        {/* P in */}
                        <text fill="green" x={945} y={440} fontSize="14px"> P in</text>
                        {/* tank */}
                        <image 
                            href={tank}
                            x={800}
                            y={TankHeight}
                        />

                        {/* Lines */}
                        <line x1={900} x2={900} y1={600} y2={475} stroke="blue" />
                        <line x1={900} x2={920} y1={475} y2={475} stroke="blue" />

                        <line x1={929} x2={929} y1={460} y2={TankHeight+40} stroke="blue" />
                        <line x1={890} x2={929} y1={TankHeight+40} y2={TankHeight+40} stroke="blue" />

                        <line x1={853} x2={853} y1={TankHeight + 100} y2={500} stroke="blue" />

                        <line x1={677} x2={853} y1={500} y2={500} stroke="blue" />
                        <line x1={625} x2={677} y1={500} y2={500} stroke="blue" strokeDasharray="5"/>
                        {includeSecondOutlet && 
                        <svg>
                            <line x1={677} x2={853} y1={400} y2={400} stroke="blue" />
                            <line x1={625} x2={677} y1={400} y2={400} stroke="blue" strokeDasharray="5"/>
                        </svg>}

                        <circle cx={750} cy={500} r={3} stroke="blue">
                            <animate
                                attributeName="cx"
                                begin="0s"
                                dur={Math.trunc(20 - 3*cPIn) + "s"}
                                from={750}
                                to={690}
                                repeatCount="indefinite" 
                            />
                        </circle>

                        {includeSecondOutlet && 
                        <circle cx={750} cy={400} r={3} fill="blue">
                            <animate
                                attributeName="cx"
                                begin="0s"
                                dur={Math.trunc(20 - 3*cPIn) + "s"}
                                from={750}
                                to={690}
                                repeatCount="indefinite" 
                            />
                        </circle>}

                        {/* Outside well */}
                        <line x1={100} y1={400} x2={100} y2={750} stroke="gray" strokeWidth={2}/>
                        <line x1={1000} y1={400} x2={1000} y2={750} stroke="gray" strokeWidth={2}/>
                        <rect x={101} y={611} width={898} height={200} fill="lightblue"/>

                        {/* H desired */}

                        {/* H outside */}
                        <rect x={101} y={HOutside} width={102} height={611 - HOutside} fill="lightblue"/>
                        <rect x={650+28} y={HOutside} width={321} height={611 - HOutside} fill="lightblue"/>

                        {/* T label */}
                        <line x1={75} x2={100} y1={HOutside} y2={HOutside} stroke="#FF3300" />
                        <text x={20} y={HOutside - 5}>H outside</text>

                        <line x1={75} x2={100} y1={cHInside} y2={cHInside} stroke="#FF3300" />
                        <line x1={100} x2={205} y1={cHInside} y2={cHInside} stroke="#FF3300" strokeDasharray="10"/>
                        <text x={105} y={cHInside + 20}>H inside</text>

                        {/*<line x1={75} x2={100} y1={HDesired} y2={HDesired} stroke="#FF3300" />
                        <line x1={100} x2={205} y1={HDesired} y2={HDesired} stroke="#FF3300" strokeDasharray="10"/>
                        <text x={105} y={HDesired - 20}>H desired</text> */}

                        {/* Q loss */}
                        
                        <line x1 ={640} x2={680} y1={530} y2={530} stroke={flipVloss ? "green" : "red"} strokeWidth={2}>
                            <animate
                                attributeName="x1"
                                begin="0s"
                                dur="4s"
                                from={flipVloss?"660":"640"}
                                to={flipVloss?"640":"660"}
                                repeatCount="indefinite" />
                            <animate
                                attributeName="x2"
                                begin="0s"
                                dur="4s"
                                from={flipVloss?"700":"680"}
                                to={flipVloss?"680":"700"}
                                repeatCount="indefinite" />
                        </line>
                        {flipVloss ?
                        <polygon points={"640,525 640,535 635,530"} fill={"green"}> 
                            <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                to="640,525 640,535 635,530"
                                from="660,525 660,535 655,530"
                                repeatCount="indefinite" />
                        </polygon>
                        : 
                        <polygon points={"680,525 680,535 685,530"} fill={"red"}>
                            <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                from="680,525 680,535 685,530"
                                to="700,525 700,535 705,530"
                                repeatCount="indefinite" />
                        </polygon>}

                        <line x1 ={640} x2={680} y1={520} y2={520} stroke={flipVloss ? "green" : "red"} strokeWidth={2}>
                            <animate
                                attributeName="x1"
                                begin="0s"
                                dur="4s"
                                from={flipVloss?"660":"640"}
                                to={flipVloss?"640":"660"}
                                repeatCount="indefinite" />
                            <animate
                                attributeName="x2"
                                begin="0s"
                                dur="4s"
                                from={flipVloss?"700":"680"}
                                to={flipVloss?"680":"700"}
                                repeatCount="indefinite" />
                        </line>

                        {flipVloss ?
                        <polygon points={"640,515 640,525 635,520"} fill={"green"}> 
                        <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                from="660,515 660,525 655,520"
                                to="640,515 640,525 635,520"
                                repeatCount="indefinite" />
                        </polygon>
                        : 
                        <polygon points={"680,515 680,525 685,520"} fill={"red"}>
                            <animate
                                attributeName="points"
                                begin="0s"
                                dur="4s"
                                from="680,515 680,525 685,520"
                                to="700,515 700,525 705,520"
                                repeatCount="indefinite" />
                        </polygon>}  
                        <text x={680} y={550} fill={flipVloss ? "green" : "red"} fontSize="14px">{flipVloss ? "V flow" : "V loss"}</text>
                    </svg>
                </div>
                <div>
                    <Space>
                        <p className="default-title default-large">Hydraulic balancing simulation</p>

                        <Space className="hq-element-container">
                            {includeSecondOutlet ? 
                            <MinusOutlined className="default-red hq-clickable" 
                                onClick={() => {
                                    setIncludeSecondOutlet(false)
                                }}
                            /> : 
                            <PlusOutlined className="default-green hq-clickable" 
                                onClick={() => {
                                    setIncludeSecondOutlet(true)
                                }}
                            />}
                            Outlet
                        </Space>

                        <Space className="hq-element-container">
                            <PlusOutlined className="default-green hq-clickable" 
                                onClick={() => {
                                    let _current = HOutside

                                    _current = _current - 10

                                    _current = Math.max(_current, 510)

                                    setHOutside(_current)
                                }}
                            />
                            <MinusOutlined className="default-red hq-clickable"
                                onClick={() => {
                                    let _current = HOutside

                                    _current = _current + 10

                                    _current = Math.min(_current, 600)

                                    setHOutside(_current)
                                }}
                            />
                            <p className="default-gray">H outside</p>
                        </Space>
                        <Space className="hq-element-container">
                            <PlusOutlined className="default-green hq-clickable" 
                                onClick={() => {
                                    let _current = TankHeight

                                    _current = _current - 5

                                    _current = Math.max(_current, 50)

                                    setTankHeight(_current)
                                }}
                            />
                            <MinusOutlined className="default-red hq-clickable"
                                onClick={() => {
                                    let _current = TankHeight

                                    _current = _current + 5

                                    _current = Math.min(_current, 200)

                                    setTankHeight(_current)
                                }}
                            />
                            <p className="default-gray">Tank height</p>
                        </Space>

                        
                    </Space>
                    <br/>
                    
                    <p className="default-title">P in </p>
                    <svg  style={{width:500, height:200, border:'1px solid gray'}}>
                        {PIn.map((v, vi) => {
                            const _y = 200 - (v/4) * 80
                            return(
                                <circle cx={10 + vi * 1} cy={_y} r={1} fill={v < 0 ? "red" : "green"} />
                            )
                        })}
                        
                    </svg>

                    <p className="default-title">V loss</p>
                    <svg  style={{width:500, height:200, border:'1px solid gray'}}>
                        <line x1={0} y1={100} x2={500} y2={100} stroke="gray" />
                        {VLoss.map((v, vi) => {
                            const _y = 100 - (v/2) * (60)
                            return(
                                <circle cx={10 + vi * 1} cy={_y} r={1} fill={v < 0 ? "red" : "green"} />
                            )
                        })}

                        
                    </svg>
                </div>
            </Space>
        </PagesWrapper>
    )
}