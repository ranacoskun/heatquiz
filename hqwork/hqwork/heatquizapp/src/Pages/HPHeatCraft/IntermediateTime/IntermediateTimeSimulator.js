import { Button, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";

import pump from'./pump.png';
import waterhose from'./waterhose.png';
import wall from'./wall.jpg';
import {PauseOutlined, CaretRightOutlined, RedoOutlined} from '@ant-design/icons';
import { ITS_MAX_POWER, ITS_MIN_HEIGHT, ITS_REQ_HEIGHT } from "./Constants";

var timer;

export function IntermediateTimeSimulator(){

    const [firstHeight, setFirstHeight] = useState([540])
    const [firstLoss, setFirstLoss] = useState([0])
    const [firstPower, setFirstPower] = useState([0])

    const [secondHeight, setSecondHeight] = useState([540])
    const [secondLoss, setSecondLoss] = useState([0])
    const [secondPower, setSecondPower] = useState([0])

    const [secondPowerOn, setSecondPowerOn] = useState(false)

    const [animationRunning, setAnimationRunning] = useState(true)

    const resetAnimation = () => {
        setFirstHeight([540])
        setSecondHeight([540])

        setSecondPowerOn(false)
    }

    useEffect(() => {
        timer = setInterval(() => {
            doCalculations()
        }, 125)

        return () => clearInterval(timer)
    }, [firstHeight, animationRunning])

    useEffect(() => {
        const cSecondHeight = secondHeight.at(-1)
        const triggerPowerSecond = cSecondHeight > ITS_MIN_HEIGHT
        const shutPowerDown = cSecondHeight > ITS_REQ_HEIGHT

        if(secondPowerOn){
            setSecondPowerOn(shutPowerDown)

        }
        else{
            setSecondPowerOn(triggerPowerSecond)
        }

    }, [secondHeight])

    const doCalculations = () => {
        if(!animationRunning) return; 

        const cFirstHeight = firstHeight.at(-1)
        const cSecondHeight = secondHeight.at(-1)

        const percentageFirst = 100 * ((620 - cFirstHeight)/200) 
        const percentageSecond = 100 * ((620 - cSecondHeight)/200) 

        const cLossFirst = percentageFirst * 0.01
        const cLossSecond = percentageSecond * 0.01

        const pFirst = cLossFirst * 5 + (cFirstHeight - ITS_REQ_HEIGHT) * 0.01

        const pSecond = secondPowerOn ? ITS_MAX_POWER : 0

        const newT1 = cFirstHeight - (pFirst) + cLossFirst * 5

        const newT2 = cSecondHeight - (pSecond) *0.65 + cLossSecond * 5

        let t1Array = [...firstHeight]
        if(t1Array.length > 139){
            t1Array.shift()
        }
        t1Array.push(newT1)

        setFirstHeight(t1Array)

        let l1Array = [...firstLoss]
        if(l1Array.length > 139){
            l1Array.shift()
        }
        l1Array.push(cLossFirst)

        setFirstLoss(l1Array)

        let p1Array = [...firstPower]
        if(p1Array.length > 139){
            p1Array.shift()
        }
        p1Array.push(pFirst)

        setFirstPower(p1Array)

        let t2Array = [...secondHeight]
        if(t2Array.length > 139){
            t2Array.shift()
        }
        t2Array.push(newT2)
        setSecondHeight(t2Array)

        let l2Array = [...secondLoss]
        if(l2Array.length > 139){
            l2Array.shift()
        }
        l2Array.push(cLossSecond)
        setSecondLoss(l2Array)

        let p2Array = [...secondPower]
        if(p2Array.length > 139){
            p2Array.shift()
        }
        p2Array.push(pSecond)
        setSecondPower(p2Array)

    }

    const getValues = () => {
        const cFirstHeight = firstHeight.at(-1)
        const cSecondHeight = secondHeight.at(-1)

        const percentageFirst = 100 * ((620 - cFirstHeight)/200) 
        const percentageSecond = 100 * ((620 - cSecondHeight)/200) 
        
        const cLossFirst = firstLoss.at(-1)
        const cLossSecond = secondLoss.at(-1)

        const pFirst = firstPower.at(-1)
        const pSecond = secondPower.at(-1)
        

        return ({cFirstHeight, cSecondHeight, percentageFirst, percentageSecond, cLossFirst, cLossSecond, pFirst, pSecond})
    }

    const {cFirstHeight, percentageFirst, cLossFirst, pFirst, cSecondHeight, percentageSecond, cLossSecond, pSecond} = getValues()
    const average = array => array.reduce((a, b) => a + b) / array.length;

    const avg1 = average(firstPower)
    const avg2 = average(secondPower)
    const y1 = (180 - (avg1/ITS_MAX_POWER) * 90)
    const y2 = (180 - (avg2/ITS_MAX_POWER) * 90)
    return(
        <PagesWrapper>
            <Space direction="vertical">
            <Space>
                <p className="default-title default-large">Intermediate Time Simulation</p>                   

                <Tooltip
                    color="white"
                    title={<p>Restart animation</p>}
                >
                    <Button size="small" type="default" icon={<RedoOutlined className="default-title"/>}
                        onClick={() => {
                            resetAnimation()
                        }}
                    />
                </Tooltip>
                
                <Tooltip
                    color="white"
                    title={<p>{animationRunning ? "Stop" : "Start "} animation</p>}
                >
                    <Button size="small" type="default" icon={animationRunning ? <PauseOutlined className="default-title"/> : <CaretRightOutlined className="default-title"/>}
                        onClick={() => setAnimationRunning(!animationRunning)}
                    />
                </Tooltip>
            </Space>
            <Space align="start">
                <div>
                    <svg style={{width:1500, height:700, border:'1px solid blue'}}>
                        { /* Main well */}
                        <text fill="blue" x={80} y={50} fontSize="16px"> CASE A</text>
                        <text fill="blue" x={80} y={70} fontSize="16px"> Continous operation</text>

                        {/* Plot */}
                        <text fill="blue" x={60} y={100} fontSize="14px">P</text>
                        <line x1={80} x2={80} y1={90} y2={180} stroke="gray" />
                        <line x1={80} x2={220} y1={180} y2={180} stroke="gray" />
                        {firstPower.map((p, pi) => {
                            const y = (180 - (p/ITS_MAX_POWER) * 90)
                            return(
                                <circle cx={80 + pi} cy={y} r={1} stroke="green"/>
                            )
                            
                        })}
                    <line x1={80} y1={y1} y2={y1} x2={200} stroke="orange"/>

                        <image 
                            href={wall}
                            x={80}
                            y={320}
                            width={28}
                        />
                        <image 
                            href={wall}
                            x={380}
                            y={320}
                            width={28}
                        />
                        <image 
                            href={waterhose}
                            x={230}
                            y={250}
                            width={40}
                        />

                       {cLossFirst && 
                       <svg x={420} y={500}>
                            <line x1={0} y1={5} x2={60 * cLossFirst} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={60 * cLossFirst} y={0}>
                                <path d="M 0 0 L 10 5 L 0 10 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>}                      

                        <rect x={107} width={276} y={cFirstHeight} height={610-cFirstHeight} fill="lightblue" /> 
                        {/* pump */}
                        <image 
                            href={pump}
                            x={355}
                            y={100}
                        />

                        <circle cx={412} cy={108} r={4} stroke="green" fill="lightgreen">
                            <animate
                                 attributeName="fill"
                                 begin="0s"
                                 dur="1.5s"
                                 to="green"
                                 from="lightgreen"
                                 repeatCount="indefinite"
                            />
                        </circle>
                        <line x1={355} y1={125} x2={300} y2={125} stroke="blue" strokeWidth={2} />
                        <line x1={300} y1={125} x2={300} y2={270} stroke="blue" strokeWidth={2} />
                        <line x1={265} y1={270} x2={300} y2={270} stroke="blue" strokeWidth={2} />

                        <line x1={83} y1={610} x2={405} y2={610} stroke="black" strokeWidth={3} />
                        <line x1={70} y1={420} x2={425} y2={420} stroke="#e68a00" strokeWidth={2} strokeDasharray={5} />
                        {/* connection */}
                        <svg x={440} y={115}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <line x1={410} y1={125} x2={446} y2={125} stroke="blue" strokeWidth={2} />

                        <svg x={440} y={550}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <line x1={450} y1={566} x2={450} y2={590} stroke="blue" strokeWidth={2} />

                        { /* Main well 2 */}
                        <text fill="blue" x={780} y={50} fontSize="16px"> CASE B</text>
                        <text fill="blue" x={780} y={70} fontSize="16px">Intermittent operation</text>

                        {/* Plot */}
                        <text fill="blue" x={760} y={100} fontSize="14px">P</text>
                        <line x1={780} x2={780} y1={90} y2={180} stroke="gray" />
                        <line x1={780} x2={920} y1={180} y2={180} stroke="gray" />
                        {secondPower.map((p, pi) => {
                            const y = (180 - (p/ITS_MAX_POWER) * 90)
                            return(
                                <circle cx={780 + pi} cy={y} r={1} stroke="green"/>
                            )
                            
                        })}
                        <line x1={780} y1={y2} y2={y2} x2={920} stroke="orange"/>

                        <image 
                            href={wall}
                            x={780}
                            y={320}
                            width={28}
                        />
                        <image 
                            href={wall}
                            x={1080}
                            y={320}
                            width={28}
                        />
                        <rect x={807} width={276} y={cSecondHeight} height={610-cSecondHeight} fill="lightblue" /> 
                        <line x1={783} y1={610} x2={1105} y2={610} stroke="black" strokeWidth={3} />
                        <line x1={770} y1={420} x2={1125} y2={420} stroke="#e68a00" strokeWidth={2} strokeDasharray={5} />
                        

                        <image 
                            href={waterhose}
                            x={930}
                            y={250}
                            width={40}
                        />

                        {cLossSecond && 
                       <svg x={1120} y={500}>
                            <line x1={0} y1={5} x2={60 * cLossSecond} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={60 * cLossSecond} y={0}>
                                <path d="M 0 0 L 10 5 L 0 10 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>} 
                        {/* pump */}
                        <image 
                            href={pump}
                            x={1055}
                            y={100}
                        />    
                        {secondPowerOn && 
                        <circle cx={1112} cy={108} r={4} stroke="green" fill="lightgreen">
                            <animate
                                 attributeName="fill"
                                 begin="0s"
                                 dur="1.5s"
                                 to="green"
                                 from="lightgreen"
                                 repeatCount="indefinite"
                            />
                        </circle>}

                        <line x1={1055} y1={125} x2={1000} y2={125} stroke={secondPowerOn ? "blue" : "gray"} strokeWidth={secondPowerOn ? 2 : 1} />
                        <line x1={1000} y1={125} x2={1000} y2={270} stroke={secondPowerOn ? "blue" : "gray"} strokeWidth={secondPowerOn ? 2 : 1} />
                        <line x1={965} y1={270} x2={1000} y2={270} stroke={secondPowerOn ? "blue" : "gray"} strokeWidth={secondPowerOn ? 2 : 1} />                  
                        {/* connection */}
                        <svg x={1140} y={115}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <line x1={1110} y1={125} x2={1146} y2={125} stroke={secondPowerOn ? "blue" : "gray"} strokeWidth={secondPowerOn ? 2 : 1} />

                        <svg x={1140} y={550}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <line x1={1150} y1={566} x2={1150} y2={590} stroke={secondPowerOn ? "blue" : "gray"} strokeWidth={secondPowerOn ? 2 : 1} />
                        {/* External water */}
                        <rect x={0} width={1500} y={612} height={90} fill="lightblue" />  
                        <rect x={0} width={83} y={590} height={90} fill="lightblue" />  
                        <rect x={1108} width={400} y={590} height={90} fill="lightblue" />  
                        <rect x={407} width={376} y={590} height={90} fill="lightblue" />  

                    </svg>
                </div>
                
            </Space>
            </Space>
        </PagesWrapper>
    )
}