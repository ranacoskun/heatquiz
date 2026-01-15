import {Alert, Button, Drawer, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, PlusOutlined} from '@ant-design/icons';

import { useQuestions } from "../../../../contexts/QuestionsContext";
import { UploadImage } from "../../../../Components/UploadImage";

import './index.css'
import { handleResponse } from "../../../../services/Auxillary";

export function AddBodyObject({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {isLoadingAddFBDQuestionOB, addFBDQuestionOB,} = useQuestions()

    const imageRef = React.createRef()

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)
    const [newParts, setNewParts] = useState([])

    const [topOffset, setTopOffset] = useState(0)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(imageRef && imageRef.current){
            const imgRef = imageRef.current
            const styles = imgRef.getBoundingClientRect()

            const {top, left} = styles

            setTopOffset(top)
        }
    }, [imageRef])



    const drawControlVolume = () => {
        const {Code, Base_ImageURL, Base_ImageURL_Width, Base_ImageURL_Height,} = question

        const backgroundImageStyle = ({
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain',
            border:'1px solid rgb(245, 245, 245)',
            cursor:'crosshair'
        })

        return(
            <div>
                <img
                style = {{
                    ...backgroundImageStyle,
                    height:Base_ImageURL_Height,
                    width:Base_ImageURL_Width,
                    cursor:'crosshair'
                }} 

                src = {Base_ImageURL}
                alt={Code}

                ref={imageRef}

                onClick={(e) => {
                    if(!(isAddingElement)) return;

                    e.persist()

                    const {pageX, pageY} = e

                    const imgRef = imageRef.current
                    const parentNode = imgRef.parentNode.parentNode
                    const styles = window.getComputedStyle(parentNode)
                    const offset = Number(styles.getPropertyValue('padding-right').replace('px', ''))

                    //setLeftOffset(offset)

                    const {top, left} = imgRef.getBoundingClientRect()
                                
                    if(!isAddingElementSecond){

                        let newPart = ({
                            x: pageX - left + offset,
                            y: pageY - top,
                            offsetX: offset,
                            width: 1,
                            height: 1,
                        })


                        setNewParts(prev => [...prev, newPart])
                        setIsAddingElementSecond(true)

                        return
                    }

                    if(isAddingElementSecond){
                        let parts = [...newParts]
                        
                        const newX = pageX - left + offset
                        const newY = pageY - top

                        let Last =  parts[parts.length-1]
                                
                        Last.width = Math.abs(Last.x - newX)
                        Last.height = Math.abs(Last.y - newY)
        
                        Last.x = Math.min(Last.x,newX)
                        Last.y = Math.min(Last.y, newY)

                        setNewParts(parts)

                        setIsAddingElement(false)
                        setIsAddingElementSecond(false)
                        return
                    }       
                }}
                />
                {newParts.map((p, pi) => {
                    const {x, y, width, height} = p

                    return( 
                        <div
                            key={pi}
                            style={{position:'absolute', left:x, top:y + topOffset, width: width, height: height}}
                            className="clickable-question-add-element"
                        >
                                  
                        </div>)
                        })}
            </div>
        )
    }

    return(
        <Drawer
        title={
        <Space size={'large'}>
            <p>Add Object Body</p>

            <Button
                size="small"
                type="primary"

                loading={isLoadingAddFBDQuestionOB}

                onClick={() => {
                    if(!newParts.length){
                        api.destroy()
                        api.warning("Please draw the control volume")

                        return
                    }

                    if(isAddingElement || isAddingElementSecond){
                        api.destroy()
                        api.warning("Please finish drawing control volume")

                        return
                    }
                    
                    const OB = newParts[0]

                    const VM = ({
                        X: Math.trunc(OB.x) ,
                        Y: Math.trunc(OB.y),

                        Width: Math.trunc(OB.width),
                        Height: Math.trunc(OB.height),
                        
                        QuestionId: question.Id
                    })

                    addFBDQuestionOB(VM).then(r => handleResponse(r, api, "Added successfully", 1, () => {
                        onClose()
                        reloadQuestion()
                    }))
                }}
            >
                Add
            </Button>
        </Space>}
        width={'70%'}
        onClose={onClose}
        open={open}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {contextHolder}
            
            <Space size={'large'}>
                <Tooltip
                    color="white"
                    title={<p>Click to draw object</p>}
                >
                    <Space
                        className="hq-element-container" 
                        onClick={() => {
                            setNewParts([])

                            if(isAddingElement || isAddingElementSecond){
                                setIsAddingElement(false)
                                setIsAddingElementSecond(false)

                                return;
                            }

                            setIsAddingElement(true)
                        }}
                    >
                        <PlusOutlined className={"hq-clickable " + (isAddingElement ? "default-title" : "default-gray")} />
                        <p className={"hq-clickable " + (isAddingElement ? "default-title" : "default-gray")}>Draw object</p>
                    </Space>
                </Tooltip>

              
            </Space>

            <br/>
            <br/>
            {drawControlVolume()}
        </Drawer>
    )
}