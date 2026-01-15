import { Button, Col, Input, Row, Slider, Space, Spin, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../../PagesWrapper";
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import {ArrowRightOutlined, CheckCircleFilled, EditOutlined, CloseOutlined, SmileTwoTone  } from '@ant-design/icons';

import "../Play/index.css"
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { useAuth } from "../../../contexts/AuthContext";
import { handleResponse } from "../../../services/Auxillary";
import { QUESTIONNAIRE_QUESTION_MC_TYPE } from "../Shared/Constants";
import TextArea from "antd/es/input/TextArea";

export function PlayQuestionnaireInSeries({id, Key, Series,mapElement, onFinish}){
    const [api, contextHolder] = message.useMessage();
    
    const {survey, errorGetSurvey, isLoadingSurvey, getSurvey, 
        isLoadingAddSurveyStatistic, addSurveyStatistic} = useQuestionnaires()

    const {currentPlayerKey} = useAuth()

    const [startPlaying, setStartPlaying] = useState(false)
    const [firstTime, setFirstTime] = useState(0)
    const [currentQuestionsTab, setCurrentQuestionsTab] = useState(0)

    const [questionTabInteractions, setQuestionTabInteractions] = useState([0])

    const [questionAnswers, setQuestionAnswers] = useState([])
    const [questionTextAnswers, setQuestionTextAnswers] = useState([])
    const [questionRangeAnswers, setQuestionRangeAnswers] = useState([])

    const [isFinished, setIsFinished] = useState(false)

    useEffect(() => {
        getSurvey(id)

        setCurrentQuestionsTab(0)
        setQuestionAnswers([])
        setIsFinished(false)
        setQuestionTabInteractions([0])
    }, [])

    useEffect(() => {
        if(survey){
            const {Questions} = survey

            setQuestionAnswers(Questions.map((q) => []))

            setQuestionTextAnswers(Questions.map((q) => {
                const {Choices} = q
                let _txtChoices = Choices.filter(c => Object.is(c.Type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT))

                let answers = {}

                for(const c of _txtChoices){
                    answers[c.Id] = ""
                }

                return answers
            }))

            setQuestionRangeAnswers(Questions.map((q) => {
                const {Choices} = q
                let _rangeChoices = Choices.filter(c => Object.is(c.Type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE))

                let answers = {}

                for(const c of _rangeChoices){
                    const {Start} = c
                    answers[c.Id] = Start 
                }

                return answers
            }))

            setFirstTime(Date.now())
        }
    }, [survey])

    const clickChoice = (qi, q, c) => {
        const {IsSingleChoice} = q

        let _answers = [...questionAnswers]
        let current = [..._answers[qi]]
        const isSelected = current.includes(c.Id)

        if(isSelected){
            current = current.filter(a => a !== c.Id)
        }
        else{
            if(IsSingleChoice){
                current = [c.Id]
            }
            else{
                current.push(c.Id)
            }
        }

        _answers[qi] = current

        setQuestionAnswers(_answers)
    }

    const renderQuestionInList = (q, qi) => {
        const {Title, Body, ImageURL, Choices, IsSingleChoice} = q
       
        return(
            <div>
                <Row>
                    
                    <Col>
                        <Space direction="vertical" align="end">
                            <Space className="QuestionnaireQuestionInfo">
                                {ImageURL &&<img 
                                    alt={Title}
                                    className="QuestionnaireQuestionImage"

                                    src={ImageURL}

                                    onClick={() => {
                                        api.destroy()

                                        api.info(
                                            <Space align="start">
                                                <img 
                                                    alt={Title}
                                                    className="QuestionnaireQuestionImageZoom"

                                                    src={ImageURL}

                                                    
                                                />
                                                <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                            </Space>
                                        , 0)
                                    }}
                                />}

                                <LatexRenderer className="QuestionnaireQuestionBody" latex={Body || ""}/>
                            </Space>
                            <small className="default-title">{IsSingleChoice && "Only a single choice is possible."}</small>
                        </Space>
                    </Col>

                   
                    <Col xs={1}/>
                       
                        
                    <Col>
                    {Choices.sort((a,b) => b.Order - a.Order).map((c, ci) => {
                            const {Id, LaTex, ImageURL, Type, MaxCharacterCount, Start, End, Step} = c
                            const isSelected = questionAnswers[qi].includes(c.Id)
                            
                            if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL)){
                                return(
                                    <div 
                                    onClick={() => clickChoice(qi, q, c)}
                                    key={Id} className={isSelected ? "QuestionnaireQuestionChoiceLineSelected": "QuestionnaireQuestionChoiceLine"}>
                                        <Space 
                                        
                                        align="start" className="QuestionnaireQuestionChoiceLineInner" size="large">
                                            <div>
                                                {LaTex && <LatexRenderer latex={LaTex || ""} />}
                                            </div>
                                            <div>
                                                {ImageURL && 
                                                    <img 
                                                        alt={Title}
                                                        className="QuestionnaireQuestionChoiceImage"
    
                                                        src={ImageURL}
    
                                                        onClick={() => {
                                                            api.destroy()
                                                            
                                                            api.info(
                                                                <Space align="start">
                                                                    <img 
                                                                        alt={Title}
                                                                        className="QuestionnaireQuestionImageZoom"
                    
                                                                        src={ImageURL}
                    
                                                                        
                                                                    />
                                                                    <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                                </Space>
                                                            , 0)
                                                        }}
                                                    />}
                                            </div>
                                        </Space>
                                        
                                    </div>
                                )
                            }
                            else if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.TXT)){
                                const answer = questionTextAnswers[qi][c.Id]

                                return(
                                    <div 
                                    key={Id} className="QuestionnaireQuestionChoiceLineTextRangeInput">
                                        <Space 
                                        
                                        align="start" className="QuestionnaireQuestionChoiceLineInner" size="large">
                                            <div>
                                                {LaTex && <LatexRenderer latex={LaTex || ""} />}
                                            </div>
                                            <div>
                                                {ImageURL && 
                                                    <img 
                                                        alt={Title}
                                                        className="QuestionnaireQuestionChoiceImage"
    
                                                        src={ImageURL}
    
                                                        onClick={() => {
                                                            api.destroy()
                                                            
                                                            api.info(
                                                                <Space align="start">
                                                                    <img 
                                                                        alt={Title}
                                                                        className="QuestionnaireQuestionImageZoom"
                    
                                                                        src={ImageURL}
                    
                                                                        
                                                                    />
                                                                    <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                                </Space>
                                                            , 0)
                                                        }}
                                                    />}
                                            </div>
                                        </Space>
                                        <TextArea 
                                            value={answer}
                                            className="hq-full-width QuestionnaireQuestionChoiceLineTextInput"
                                            maxLength={MaxCharacterCount}
                                            showCount
                                            onChange={(v) => {
                                                const value = v.target.value

                                                let _answers = [...questionTextAnswers]
                                                
                                                _answers[qi][c.Id] = value

                                                setQuestionTextAnswers(_answers)
                                            }}
                                        />
                                        <br/>
                                        <br/>
                                    </div>
                                )
                            }
                            else if(Object.is(Type, QUESTIONNAIRE_QUESTION_MC_TYPE.RANGE)){
                                const answer = questionRangeAnswers[qi][c.Id]
                                const marks = {
                                    [Start]: Start,
                                    [End]: End,
                                    [answer]: {
                                      style: {
                                        color: 'gray',
                                      },
                                      label:answer,
                                    },
                                  };
                                return(
                                    <div 
                                    key={Id} className="QuestionnaireQuestionChoiceLineTextRangeInput">
                                        <Space 
                                        
                                        align="start" className="QuestionnaireQuestionChoiceLineInner" size="large">
                                            <div>
                                                {LaTex && <LatexRenderer latex={LaTex || ""} />}
                                            </div>
                                            <div>
                                                {ImageURL && 
                                                    <img 
                                                        alt={Title}
                                                        className="QuestionnaireQuestionChoiceImage"
    
                                                        src={ImageURL}
    
                                                        onClick={() => {
                                                            api.destroy()
                                                            
                                                            api.info(
                                                                <Space align="start">
                                                                    <img 
                                                                        alt={Title}
                                                                        className="QuestionnaireQuestionImageZoom"
                    
                                                                        src={ImageURL}
                    
                                                                        
                                                                    />
                                                                    <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                                                </Space>
                                                            , 0)
                                                        }}
                                                    />}
                                            </div>
                                        </Space>
                                        <Slider 
                                            min={Start}
                                            max={End}
                                            step={Step}
                                            className="hq-full-width QuestionnaireQuestionChoiceLineRangeInput"
                                            value={answer}
                                            marks={marks}
                                            onChange={(value) => {
                                                let _answers = [...questionRangeAnswers]
                                                
                                                _answers[qi][c.Id] = value

                                                setQuestionRangeAnswers(_answers)
                                            }}
                                        />
                                    </div>
                                )
                            }

                        })}
                    </Col>
                </Row>
            </div>
        )
    }

    const getNextQuestion = () => {
        const {Questions} = survey

        const nonAnsweredQuestion = 
        Questions.sort((a,b) => a.Order - b.Order)
        .map((q, qi) => ({...q, index: qi}))
        .filter((q, qi) => !isQuestionAnswered(q, qi))
        .sort((a,b)=> a.index - b.index)[0]

        if(nonAnsweredQuestion) return (nonAnsweredQuestion.index);

        return null;
    }

    const isQuestionAnswered = (q, qi) => {
        const {Choices} = q
        const normalChoices = Choices.filter(c => Object.is(c.Type, QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL))
        const answers = questionAnswers[qi]

        const isInteracted = questionTabInteractions.includes(qi)
        if(normalChoices.length && answers && !answers.length) return false;

        return isInteracted;
    }

    const isAllAnswered = () => {
        const {Questions} = survey

        const allAnswered = !Questions.sort((a,b) => a.Order - b.Order).filter((q, qi) => !isQuestionAnswered(q, qi)).length

        return allAnswered;
    }

    const allAnswered = survey && isAllAnswered()

    const controlTabClick = () => {
        if(!allAnswered){
            const nextQuesitonIndex = getNextQuestion()

            if(!Object.is(nextQuesitonIndex, null)){
                setCurrentQuestionsTab(nextQuesitonIndex)

                let _questionInteractions = [...questionTabInteractions]
                if(!_questionInteractions.includes(nextQuesitonIndex)) _questionInteractions.push(nextQuesitonIndex)

                setQuestionTabInteractions(_questionInteractions)
            }

            return;
        }

        setIsFinished(true)
        setCurrentQuestionsTab('final')

        const data = new FormData()

        data.append("Key", Key || "")
        data.append("PlayerKey", currentPlayerKey)
        data.append("SurveyId", survey.Id)
        if(Series){
            data.append("SeriesId", Series.Id)
        }
        if(mapElement){
            data.append("MapElementId", mapElement.Id)
        }
        data.append("TotalTime", parseInt((Date.now() - firstTime) * 0.001))

        for(const choices of questionAnswers){
            for(const c of choices){

                data.append("SelectedChoiceIds", c)
            }
        }

        let txtChoices = []

        for(const choices of questionTextAnswers){
            console.log(choices)


            for(const c of Object.keys(choices)){
                const value = choices[c]

                if(value && !Object.is(value.trim(), '')){
                    txtChoices.push(({
                        Id: c,
                        Text:value.trim(),
                        Value:0
                    }))
                }
            }
        }

        data.append("TextInputChoices", JSON.stringify(txtChoices))

        let rangeChoices = []
        for(const choices of questionRangeAnswers){

            for(const c of Object.keys(choices)){
                const value = choices[c]
                rangeChoices.push({
                    Id: c,
                    Value:value,
                    Text:""
                })
            }
        }

        data.append("RangeInputChoices", JSON.stringify(rangeChoices))
        
        addSurveyStatistic(data).then(r => handleResponse(r, api, "Submitted", 2, () => {
            if(onFinish) onFinish();
        }))
    }

    const renderDoingSurvey = () => {
        const {Questions, FinalText} = survey

        const tabs = Questions.map((q, qi) => {
            const {Title} = q

            const isAnswered = isQuestionAnswered(q, qi)

            return ({
                key: qi,
                label: 
                <Space size="middle">
                    <p className="default-gray">{(qi + 1)}</p>
                    {(qi === currentQuestionsTab) && <p className="default-title">{' '}{Title}</p>}

                    {isAnswered ? <CheckCircleFilled className="QuestionnaireQuestionAnswered" title="Complete"/> : <EditOutlined  title = "In progress" className="default-gray" />}
                </Space> ,
                children:<div>{renderQuestionInList(q, qi)} </div>
            })
        })


        return(
            <div>
                <Tabs
                    defaultActiveKey={0}
                    items={[...tabs, {
                        key:'final',
                        label:
                        <Space>
                            <p className={"QuestionnaireControlButton " + ((isFinished || isLoadingAddSurveyStatistic) ? "default-gray" : "")}>{allAnswered ? "Submit" : "Next"}</p>
                        </Space>,
                        children:
                        <div>
                        {isLoadingAddSurveyStatistic ? 
                        <Space>
                            <Spin />
                            <p className="default-title">Submitting</p>
                        </Space>
                        :
                        <Space>
                            <SmileTwoTone className="default-x-larger"/> 
                            <p className="default-gray">{FinalText ||"Thanks for participation."}</p>
                        </Space>
                        }

                       </div>
                    }]}
                    onChange={(t) => {
                        if(isFinished) return;

                        if(t === 'final'){
                            controlTabClick()
                            return
                        }

                        setCurrentQuestionsTab(t)

                        let _questionInteractions = [...questionTabInteractions]
                        if(!_questionInteractions.includes(t)) _questionInteractions.push(t)

                        setQuestionTabInteractions(_questionInteractions)
                    }}
                    activeKey={currentQuestionsTab}
                    className="QuestionnaireTab"
                />
            </div>
        )
    }

    const goToSurvey = () => {
        setStartPlaying(true)
    }

    const renderSurvey = () => {

        if(startPlaying) {
            return(
                <div>
                    {renderDoingSurvey()}
                </div>
            )
        }

        const {Explanation, ImageURL, Code} = survey

        return(
            <div className="QuestionnaireStartBox">
                <Space className="QuestionnaireStartBoxInner" direction="vertical">
                    <p>Start Survey</p>
                    <Space className="hq-full-width hq-opposite-arrangement" align="start">
                        {Explanation && 
                        <LatexRenderer latex={Explanation || ""} />}
                        {ImageURL &&  
                        <img 
                            src={ImageURL}
                            alt={Code}
                            className="QuestionnaireImage"

                            onClick={() => {
                                api.destroy()

                                        api.info(
                                            <Space align="start">
                                                <img 
                                                    alt={Code}
                                                    className="QuestionnaireQuestionImageZoom"

                                                    src={ImageURL}

                                                    
                                                />
                                                <CloseOutlined className="hq-clickable default-gray" onClick={() => api.destroy()}/>
                                            </Space>
                                        , 0)
                            }}
                        />}                    
                    </Space>
                    <Space align="end" size={"small"}>
                        <Button 
                            icon={<ArrowRightOutlined className="default-green"/>}

                            onClick={() => goToSurvey()}
                        >
                        Enter
                        </Button>
                    </Space>
                </Space>      
            </div>
        )
    }

    return(
        <div>
            {contextHolder}

            {isLoadingSurvey && <Spin/>}

            {errorGetSurvey && 
                <ErrorComponent 
                    error={errorGetSurvey}
                    onReload={() => getSurvey(id)}
                />
            }

            {!(isLoadingSurvey || errorGetSurvey) && survey && renderSurvey()}
        </div>
    )
}