import {Alert, Button, Drawer, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, PlusOutlined} from '@ant-design/icons';

import { useQuestions } from "../../../../contexts/QuestionsContext";
import { UploadImage } from "../../../../Components/UploadImage";

import './index.css'
import { handleResponse } from "../../../../services/Auxillary";

export function AddControlVolume({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const {addEnergyBalanceControlVolume, isLoadingAddEnergyBalanceControlVolume,} = useQuestions()

    const imageRef = React.createRef()

    const [isAddingElement, setIsAddingElement] = useState(false)
    const [isAddingElementSecond, setIsAddingElementSecond] = useState(false)
    const [newParts, setNewParts] = useState([])

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [useOriginalImage, setUseOriginalImage] = useState(true)
    const [topOffset, setTopOffset] = useState(0)

    const [api, contextHolder] = message.useMessage()

    useEffect(() => {
        if(imageRef && imageRef.current){
            const imgRef = imageRef.current
            const styles = imgRef.getBoundingClientRect()

            const {top, left} = styles

            setTopOffset(top)
        }
    }, [imageRef, useOriginalImage])

    const placeAnImage = () => {
        return(
            <div>
                <Alert 
                    message={<p>Control volume's image dimensions <u>should</u> the same as the dimensions of the main question image</p>}
                    type="info"
                /> 
                    
                <br/>
                <UploadImage
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                        setIsAddingElement(false)
                        setIsAddingElementSecond(false)
                        setNewParts([])

                    }}

                    imageURL={newImageURL}

                    className="eb-question-add-image-container"
                    classNameImage="eb-question-add-image-inside"
                />
            </div>
        )
    }

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

                src = {useOriginalImage ? Base_ImageURL : newImageURL}
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
            <p>Add control volume</p>

            <Button
                size="small"
                type="primary"

                loading={isLoadingAddEnergyBalanceControlVolume}

                onClick={() => {
                    if(!useOriginalImage && !newImage){
                        api.destroy()
                        api.warning("Please add image")

                        return
                    }

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
                    
                    const CV = newParts[0]

                    const data = new FormData()

                    data.append("QuestionId", question.Id)

                    data.append("X", Math.trunc(CV.x))
                    data.append("Y", Math.trunc(CV.y))

                    data.append("Width", Math.trunc(CV.width))
                    data.append("Height", Math.trunc(CV.height))

                    if(!useOriginalImage){
                        data.append("UseNewImage", true)
                        data.append("Picture", newImage)
                    }

                    addEnergyBalanceControlVolume(data).then(r => handleResponse(r, api, "Added successfully", 1, () => {
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
                    title={<p>Click to draw control volume</p>}
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
                        <p className={"hq-clickable " + (isAddingElement ? "default-title" : "default-gray")}>Draw control volume</p>
                    </Space>
                </Tooltip>

                <p 
                onClick={() => {
                    setIsAddingElement(false)
                    setIsAddingElementSecond(false)
                    setNewParts([])

                    setUseOriginalImage(!useOriginalImage)
                }}
                className={"hq-element-container hq-clickable " + (useOriginalImage ? "default-gray" : "default-title")}>Use different image</p>
            </Space>

            <br/>
            <br/>

            {!useOriginalImage && placeAnImage()}

            {!useOriginalImage && 
            <div>
                <br/>
                <br/>
            </div>}
            
            {drawControlVolume()}
        </Drawer>
    )
}