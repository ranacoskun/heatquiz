import React from "react";
import { getItemPositionStyle } from "../../Pages/Questions/ClickableQuestion/Functions";
import { FixURL } from "../../services/Auxillary";
import { useState } from "react";
import { useEffect } from "react";

export function DisplayClickableQuestionAnswers({Question, Answers}){
    const imgRef = React.createRef()

    const [topOffset, setTopOffset] = useState(0)

    useEffect(() => {

        const imgElement = imgRef.current

        if(imgElement){
            const imgPosition = imgElement.getBoundingClientRect().top


            const topParent = imgElement.parentNode.parentNode
            const topPosition = topParent.getBoundingClientRect().top
            const topPadding = Number(window.getComputedStyle(topParent).getPropertyValue('padding-top').replace('px', ''))
            
            setTopOffset(topPadding + imgPosition - topPosition)
        }

    }, [imgRef])

    const backgroundImageStyle = ({
        backgroundPosition:'center',
        backgroundRepeat:'no-repeat',
        backgroundSize:'contain',
    })

    const itemStyle = ({
        alignItems:'center',
        justifyContent:'center',
        display:'flex',
        position: 'absolute',
       
    })

    const {Code, BackgroundImageURL, BackgroundImageHeight, BackgroundImageWidth, ClickImages, ClickCharts} = Question

    const imageWidth = window.innerWidth*0.20
    const imageHeight = (BackgroundImageHeight/BackgroundImageWidth) * imageWidth

    return(
        <div>
            <img    
                ref={imgRef}
                style = {{
                    ...backgroundImageStyle,
                    height:imageHeight,
                    width:imageWidth,
                }} 

                src = {BackgroundImageURL}
                alt={Code}
            />

            {ClickImages.map((p, pi) => {
                        let answer = null

                        if(Answers){
                            answer = Answers[pi]
                        }
                        else{
                            const {Answer} = p
                            answer = Answer
                        }

                        const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p, 0, topOffset)

                        return (
                            <span 
                            key={p.Id}
                            style = {{
                                ...backgroundImageStyle,
                                ...itemStyle,
                            
                                ...itemPositionStyle,

                                [p.Background_ImageId ? "backgroundImage" : ""]:
                                p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                            }}
                                                    >
                                
                                <img 
                                    style={itemPositionStyle}
                                    src={answer.URL}
                                    alt="answer"
                                />
                            </span>
                        )
                    })}

                    {ClickCharts.map((p, pi) => {
                        let answer = null

                        if(Answers){
                            answer = Answers[pi + ClickImages.length]
                        }
                        else{
                            const {Answer} = p
                            answer = Answer
                        }

                        const itemPositionStyle = getItemPositionStyle(imageWidth, BackgroundImageWidth, p, 0, topOffset)

                        return (
                            <span 
                            className="clickable-question-play-clickable-item"
                            key={p.Id}
                            style = {{
                                ...backgroundImageStyle,
                                ...itemStyle,
                                
                                ...itemPositionStyle,
    
                                [p.Background_ImageId ? "backgroundImage" : ""]:
                                p.Background_ImageId ? "url(" + FixURL(p.Background_Image.URL) + ")" : "",
                            }}
    
                            >
                                
                                <img 
                                    style={itemPositionStyle}
                                    src={answer.URL}
                                    alt="answer"
                                />
                            </span>
                        )
                    })}
        </div>
    )
}