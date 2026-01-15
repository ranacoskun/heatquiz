import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, InfoCircleTwoTone, VerticalAlignBottomOutlined} from '@ant-design/icons';
import {Button, Drawer, Progress, Space, Tooltip } from "antd";
import { LatexRenderer } from "../../../Components/LatexRenderer";
import { QUESTIONNAIRE_QUESTION_MC_TYPE } from "../Shared/Constants";
import { downloadFile } from "../../../services/Auxillary";

export function CombinationList({open, onClose, survey , data}){
    if(!open) return <div/>

    const [selectedChoices, setSelectedChoices] = useState([])

    useEffect(() => {
        setSelectedChoices([])
    }, [open])

    const downloadCombinations = () => {
        const {TotalPlay, Combinations} = data
        const {question} = data
        const {Choices} = question

        let text = ""
        for(const d of Combinations){
            const {Count, Choices: combination} = d
            const perc = parseFloat((100 * (Count / TotalPlay)).toFixed(1)) + "%"

            let _choices = []

            for(let id of combination){
                const c = Choices.filter(c =>Object.is(id, c.Id))[0]
                if(c) _choices.push(c)
            }

            for(let [ci, c] of _choices.sort((b,a) => b.Order - a.Order).entries()){
                const {LaTex} = c
                text += (ci+1) + ", " + (LaTex || "image") + "\n";
            }
             
            text += perc + "\n";
            text += "\n";
        }

        downloadFile(text, "combinationList.txt", "txt")
    }

    const clickChoice = (c) => {
        const {IsSingleChoice} = survey

        let _answers = [...selectedChoices]
        const isSelected = _answers.includes(c.Id)

        if(isSelected){
            _answers = _answers.filter(a => a !== c.Id)
        }
        else{
            if(IsSingleChoice){
                _answers = [c.Id]
            }
            else{
                _answers.push(c.Id)
            }
        }

        setSelectedChoices(_answers)
    }

    const renderPropability = () => {
        const {TotalPlay, Combinations} = data

        const p = 
        selectedChoices.length
        &&
        Combinations.filter(d => d.Choices.every(id => selectedChoices.includes(id)) && selectedChoices.every(id => d.Choices.includes(id)))[0]

        let perc = 0

        if(p){
            const {Count} = p

            perc = parseFloat((100 * (Count / TotalPlay)).toFixed(1))
        }

        return(
            <div>
                <p className="default-title default-larger">Combination frequency</p>
                <Progress percent={perc} className="questionnaire-view-edit-frequency-bar"/>
            </div>
            
        )
    }

    const {question} = data
    const {Choices} = question

    return(
        <Drawer
        title={
            <Space>
                Choice Combination Frequency Distribution
                <Tooltip
                        color="white"
                        title={<p>Download combination data</p>}
                >
                    <Button
                        icon={<VerticalAlignBottomOutlined className="default-green"/>}
                            type="default"
                            size="small"
                            onClick={() => {
                                downloadCombinations()
                        }}
                    />
                </Tooltip>
            </Space>
        }
        width={'65%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        closeIcon={<ArrowLeftOutlined />}
        closable={true}
        >
            <Space>
                <InfoCircleTwoTone className="default-larger"/>
                <p className="default-dark">Select choice combinations to see the combination frequency below.</p>
            </Space>
            <br/>
            <br/>
            <div style={{width:'95%'}}>
            {Choices.filter(c => Object.is(c.Type, QUESTIONNAIRE_QUESTION_MC_TYPE.NORMAL)).map((c, ci) => {
                    const {Id, LaTex, ImageURL,} = c
                    const isSelected = selectedChoices.includes(c.Id)
                    return(
                                <div 
                                onClick={() => clickChoice(c)}
                                key={Id} className={isSelected ? "QuestionnaireQuestionChoiceLineSelected": "QuestionnaireQuestionChoiceLine"}>
                                    <Space   align="start" className="QuestionnaireQuestionChoiceLineInner" size="large">
                                        <div>
                                            {LaTex && <LatexRenderer latex={LaTex || ""} />}
                                        </div>
                                        <div>
                                            {ImageURL && 
                                                <img 
                                                    alt={"img"}
                                                    className="QuestionnaireQuestionChoiceImage"

                                                    src={ImageURL}
                                                />}
                                        </div>
                                    </Space>
                                    
                                </div>
                            )
                })}
            </div>

            <br/>
            {renderPropability()}
        </Drawer>
    )
}