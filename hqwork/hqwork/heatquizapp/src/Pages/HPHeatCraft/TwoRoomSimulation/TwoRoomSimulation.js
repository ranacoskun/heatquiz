import { Button, Space, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";

import pump from'./pump.png';
import waterhose from'./waterhose.png';
import wall from'./wall.jpg';
import houseFull from'./houseFull.jpg';
import radiator1 from'./radiator 1.png';
import radiator2 from'./radiator 2.png';
import radiatorsRays from'./radiatorsRays.png';
import {PauseOutlined, CaretRightOutlined, RedoOutlined} from '@ant-design/icons';
import { ITS_MAX_POWER, ITS_MIN_HEIGHT, ITS_REQ_HEIGHT } from "./Constants";

var timer;

export function TwoRoomSimulation(){

    const [firstHeight, setFirstHeight] = useState([600])
    const [firstLoss, setFirstLoss] = useState([0])
    const [firstPower, setFirstPower] = useState([0])

    const [secondHeight, setSecondHeight] = useState([600])
    const [secondLoss, setSecondLoss] = useState([0])
    const [secondPower, setSecondPower] = useState([0])

    const [secondPowerOn, setSecondPowerOn] = useState(false)

    const [animationRunning, setAnimationRunning] = useState(true)

    const resetAnimation = () => {
        setFirstHeight([600])
        setSecondHeight([600])

        setSecondPowerOn(false)
    }

    useEffect(() => {
        timer = setInterval(() => {
            doCalculations()
        }, 125)

        return () => clearInterval(timer)
    }, [firstHeight, animationRunning])

    const doCalculations = () => {
        if(!animationRunning) return; 

        const cFirstHeight = firstHeight.at(-1)
        const cSecondHeight = secondHeight.at(-1)

        const percentageFirst = 100 * ((620 - cFirstHeight)/100) 
        const percentageSecond = 100 * ((620 - cSecondHeight)/100) 

        const cLossFirst = percentageFirst * 0.01
        const cLossSecond = percentageSecond * 0.01 * 1.25

        const pFirst = cLossFirst * 5 + (cFirstHeight - ITS_REQ_HEIGHT) * 0.01

        const pSecond = cLossSecond * 5 + (cSecondHeight - ITS_REQ_HEIGHT) * 0.01

        const newT1 = cFirstHeight - (pFirst) + cLossFirst * 5

        const newT2 = cSecondHeight - (pSecond) + cLossSecond * 5

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

        const percentageFirst = 100 * ((620 - cFirstHeight)/100) 
        const percentageSecond = 100 * ((620 - cSecondHeight)/100) 
        
        const cLossFirst = firstLoss.at(-1)
        const cLossSecond = secondLoss.at(-1)

        const pFirst = firstPower.at(-1)
        const pSecond = secondPower.at(-1)
        

        return ({cFirstHeight, cSecondHeight, percentageFirst, percentageSecond, cLossFirst, cLossSecond, pFirst, pSecond})
    }

    const {cFirstHeight, percentageFirst, cLossFirst, pFirst, cSecondHeight, percentageSecond, cLossSecond, pSecond} = getValues()

    const convertToTemperature = (h) => (14 + 10 * (1/100)*(620 - h)).toFixed(1)
    const dampenTemperature = (t) => 620 - (620 - t) * 0.38 
    const convertP = (p) => (180 - (p/ITS_MAX_POWER) * 90)
    const matrix = [90, 105, 120, 135, 150, 165, 180];

    const getCurrentLines = (cP) => {

        for (let i = 0; i < matrix.length - 1; i++) {
            if (cP >= matrix[i] && cP <= matrix[i + 1]) {
              return [matrix[i], matrix[i + 1]];
            }
        }
    }

    const borderLinesFirst = getCurrentLines(convertP(pFirst))
    const borderLinesSecond = getCurrentLines(convertP(pSecond))
    


    return(
        <PagesWrapper>
            <Space direction="vertical">
            <Space>
                <p className="default-title default-large">Two Room Simulation</p>                   

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
                        <svg x={80}>
                        { /* Main well */}
                        <text fill="blue" x={80} y={50} fontSize="16px"> CASE A</text>
                        <text fill="blue" x={80} y={70} fontSize="16px"> Combined operation</text>

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

                        {matrix.map((m) => {
                            const isBetween = borderLinesFirst.includes(m)
                            return(<line x1={80} x2={220} y1={m} y2={m} stroke={isBetween ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"} />)
                        })}
                     
                        <image 
                            href={houseFull}
                            x={35}
                            y={200}
                            width={500}
                        />  
                        <rect x={97} width={378} y={493} height={125} fill="rgba(255, 255, 255, 1)" />             

                        {/* pump */}
                        <image 
                            href={pump}
                            x={355}
                            y={175}
                        />

                        <circle cx={412} cy={183} r={4} stroke="green" fill="lightgreen">
                            <animate
                                 attributeName="fill"
                                 begin="0s"
                                 dur="1.5s"
                                 to="green"
                                 from="lightgreen"
                                 repeatCount="indefinite"
                            />
                        </circle>
                        <svg x={440} y={190}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <line x1={410} y1={200} x2={446} y2={200} stroke="blue" strokeWidth={2} />

                        {/* Radiator 1 */}
                        <image 
                            href={radiator1}
                            x={90}
                            y={550}
                            width={90}
                        />   
                        
                        <image 
                            href={radiatorsRays}
                            x={105}
                            y={535}
                            width={30}
                        >
                            <animate
                                 attributeName="x"
                                 begin="0s"
                                 dur="2s"
                                 values="125;105;125"
                                 repeatCount="indefinite"
                            />
                        </image>
                        <line x1={166} x2={190} y1={585} y2={585} stroke="blue" strokeWidth={2}/>
                        <svg x={183} y={575}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>

                        <text fill="blue" x={189} y={575} fontSize="12px">1</text>
                       
                        {/* Radiator 2 */}       
                        <image 
                            href={radiator2}
                            x={310}
                            y={570}
                            width={48}
                        />   
                        <image 
                            href={radiatorsRays}
                            x={320}
                            y={548}
                            width={24}
                        >
                            <animate
                                 attributeName="x"
                                 begin="0s"
                                 dur="2s"
                                 values="320;330;320"
                                 repeatCount="indefinite"
                            />
                        </image>
                        <line x1={355} x2={382} y1={595} y2={595} stroke="blue" strokeWidth={2}/>
                        <svg x={370} y={585}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <text fill="blue" x={377} y={585} fontSize="12px">2</text>
                        
                        <line x1={300} x2={300} y1={485} y2={619} stroke="#454545" strokeWidth={8} />             

                       {cLossFirst && 
                       <svg x={500} y={560}>
                            <line x1={0} y1={5} x2={50 * cLossFirst} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={50 * cLossFirst} y={0}>
                                <path d="M 0 0 L 10 5 L 0 10 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>}

                        {cLossFirst && 
                       <svg x={20} y={560} transform="rotate(180deg)">
                            <line x1={60} y1={5} x2={60 - 50 * cLossFirst} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={50 - 50 * cLossFirst} y={0}>
                                <path d="M 10 0 L 10 10 L 0 5 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>}

                        <line x1={97} x2={476} y1={cFirstHeight} y2={cFirstHeight} stroke="rgba(255, 0, 0, 0.35)" strokeWidth={2}/> 
                        <text fill="red" x={100} y={515} fontSize="14px">{convertToTemperature(cFirstHeight)} °C</text>
                        <text fill="red" x={426} y={515} fontSize="14px">{convertToTemperature(cFirstHeight)} °C</text>
                      
                        <line x1={60} y1={520} x2={515} y2={520} stroke="rgba(0, 0, 0, 0.4)" strokeWidth={1} />

                        </svg>
                        <svg x={830} y={0}>
                        { /* Main well 2*/}
                        <text fill="blue" x={80} y={50} fontSize="16px"> CASE B</text>
                        <text fill="blue" x={80} y={70} fontSize="16px"> Partial operation</text>

                        {/* Plot */}
                        <text fill="blue" x={60} y={100} fontSize="14px">P</text>
                        <line x1={80} x2={80} y1={90} y2={180} stroke="gray" />
                        <line x1={80} x2={220} y1={180} y2={180} stroke="gray" />
                        {secondPower.map((p, pi) => {
                            const y = (180 - (p/ITS_MAX_POWER) * 90)
                            return(
                                <circle cx={80 + pi} cy={y} r={1} stroke="green"/>
                            )
                            
                        })}
                        {matrix.map((m) => {
                            const isBetween = borderLinesSecond.includes(m)
                            return(<line x1={80} x2={220} y1={m} y2={m} stroke={isBetween ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"} />)
                        })}

                        <image 
                            href={houseFull}
                            x={35}
                            y={200}
                            width={500}
                        />  
                        <rect x={97} width={378} y={493} height={125} fill="rgba(255, 255, 255, 1)" />             

                        {/* pump */}
                        <image 
                            href={pump}
                            x={355}
                            y={175}
                        />

                        <circle cx={412} cy={183} r={4} stroke="green" fill="lightgreen">
                            <animate
                                 attributeName="fill"
                                 begin="0s"
                                 dur="1.5s"
                                 to="green"
                                 from="lightgreen"
                                 repeatCount="indefinite"
                            />
                        </circle>
                        <svg x={440} y={190}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <line x1={410} y1={200} x2={446} y2={200} stroke="blue" strokeWidth={2} />

                        {/* Radiator 1 */}
                        <image 
                            href={radiator1}
                            x={90}
                            y={550}
                            width={90}
                        />   
                        
                        <image 
                            href={radiatorsRays}
                            x={105}
                            y={535}
                            width={30}
                        >
                            <animate
                                 attributeName="x"
                                 begin="0s"
                                 dur="2s"
                                 values="125;105;125"
                                 repeatCount="indefinite"
                            />
                        </image>
                        <line x1={166} x2={190} y1={585} y2={585} stroke="blue" strokeWidth={2}/>
                        <svg x={183} y={575}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>

                        <text fill="blue" x={189} y={575} fontSize="12px">1</text>
                       
                        {/* Radiator 2 */}       
                        <image 
                            href={radiator2}
                            x={310}
                            y={570}
                            width={48}
                        />   

                        <svg x={322} y={580}>
                            <path d="M 3 0 L 0 3 L 22 25 L 25 22 L 3 0 z"  stroke="rgba(255, 0, 0, 0.75)" fill="rgba(255, 0, 0, 0.65)"/>
                            <path d="M 22 0 L 25 3 L 3 25 L 0 22 L 22 0 z"  stroke="rgba(255, 0, 0, 0.75)" fill="rgba(255, 0, 0, 0.65)"/>
                        </svg>
                        
                        <line x1={355} x2={382} y1={595} y2={595} stroke="gray" strokeWidth={2}/>
                        <svg x={370} y={585}>
                            <circle cx="10" cy="10" r="5" stroke="#595959" stroke-width="2" fill="#d9d9d9"/>
                            <line x1="6.5" y1="6.5" x2="13.5" y2="13.5" stroke="#595959" stroke-width="2"/>
                            <line x1="6.5" y1="13.5" x2="13.5" y2="6.5" stroke="#595959" stroke-width="2"/>
                        </svg>
                        <text fill="gray" x={377} y={585} fontSize="12px">2</text>
                        
                        <line x1={300} x2={300} y1={485} y2={619} stroke="#454545" strokeWidth={8} />             
                        <svg x={290} y={540}>
                            <line x1={0} y1={5} x2={20} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={20} y={0}>
                                <path d="M 0 0 L 10 5 L 0 10 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>
                       {cLossSecond && 
                       <svg x={500} y={560}>
                            <line x1={0} y1={5} x2={25 * cLossSecond } y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={25 * cLossSecond} y={0}>
                                <path d="M 0 0 L 10 5 L 0 10 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>}          

                        {cLossFirst && 
                       <svg x={20} y={560} transform="rotate(180deg)">
                            <line x1={60} y1={5} x2={60 - 50 * cLossFirst} y2={5} stroke="red" strokeWidth={3}/>
                            <svg x={50 - 50 * cLossFirst} y={0}>
                                <path d="M 10 0 L 10 10 L 0 5 z"  stroke="red" fill="red"/>
                            </svg>
                        </svg>}            

                        <line x1={97} x2={297} y1={cSecondHeight} y2={cSecondHeight} stroke="rgba(255, 0, 0, 0.35)" strokeWidth={2}/> 
                        <line x1={304} x2={476} y1={dampenTemperature(cFirstHeight)} y2={dampenTemperature(cFirstHeight)} stroke="rgba(255, 0, 0, 0.35)" strokeWidth={2}/> 
                        <text fill="red" x={100} y={515} fontSize="14px">{convertToTemperature(cSecondHeight)} °C</text>
                        <text fill="red" x={426} y={515} fontSize="14px">{convertToTemperature(dampenTemperature(cFirstHeight))} °C</text>

                        <line x1={60} y1={520} x2={515} y2={520} stroke="rgba(0, 0, 0, 0.4)" strokeWidth={1} />
                        </svg>
                    </svg>
                </div>
                
            </Space>
            </Space>
        </PagesWrapper>
    )
}