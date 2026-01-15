import { Drawer } from "antd";
import React from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { CLICKABLE_QUESTION_PARAMETER, DIAGRAM_QUESTION_PARAMETER, ENERGY_BALANCE_QUESTION_PARAMETER, FBD_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER, PV_DIAGRAM_QUESTION_PARAMETER } from "../List/constants";
import { ClickableQuestionPlay } from "../ClickableQuestion/Play";
import { MultipleChoiceQuestion } from "../MultipleChoiceQuestion/Play";
import { KeyboardQuestionPlay } from "../KeyboardQuestion/Play";
import { EnergyBalanceQuestionPlay } from "../EnergyBalanceQuestion/Play";
import { FBDQuestionPlay } from "../FBDQuestion/Play";
import { DiagramQuestionPlay } from "../DiagramQuestion/Play";
import { CurrentQuestionTypeNotSupported } from "../../../Components/SeriesPlay/CurrentQuestionTypeNotSupported";
import { PVDiagramQuestionPlay } from "../PVDiagramQuestion/Play";

export function QuestionPlayPocket({open, onClose, Id, Type, deadLoad}){

    if(!open) return <div/>;

    const selectedPlayQuestion = (Id, Type) => {
        const selectionList = {
            [CLICKABLE_QUESTION_PARAMETER]: () => <ClickableQuestionPlay Id={Id} showSolution = {true} deadLoad={deadLoad} />,
            [KEYBOARD_QUESTION_PARAMETER]: () => <KeyboardQuestionPlay Id={Id} showSolution = {true} deadLoad={deadLoad}/>,
            [MULTIPLE_CHOICE_QUESTION_PARAMETER]: () => <MultipleChoiceQuestion Id={Id} showSolution={true} deadLoad={deadLoad}/>,
            [ENERGY_BALANCE_QUESTION_PARAMETER]: () => <EnergyBalanceQuestionPlay Id={Id} showSolution={true} deadLoad={deadLoad}/>,
            [FBD_QUESTION_PARAMETER]: () => <FBDQuestionPlay Id={Id} showSolution={true} deadLoad={deadLoad}/>,
            [DIAGRAM_QUESTION_PARAMETER]: () => <DiagramQuestionPlay Id={Id} showSolution={true} deadLoad={deadLoad}/>,
            [PV_DIAGRAM_QUESTION_PARAMETER]: () => <PVDiagramQuestionPlay Id={Id} showSolution={true} deadLoad={deadLoad}/>,
        }

        const comp = selectionList[Type]

        if(comp) return comp()
        else return <CurrentQuestionTypeNotSupported />
        
    }

    const selectMagnificationValue = (Type) => {
        const selectionList = {
            [CLICKABLE_QUESTION_PARAMETER]: '100%',
            [KEYBOARD_QUESTION_PARAMETER]: '70%',
            [MULTIPLE_CHOICE_QUESTION_PARAMETER]: '70%',
            [ENERGY_BALANCE_QUESTION_PARAMETER]: '100%',
            [FBD_QUESTION_PARAMETER]: '100%',
            [DIAGRAM_QUESTION_PARAMETER]: '100%',
            [PV_DIAGRAM_QUESTION_PARAMETER]: '100%',
        }
        
        return (selectionList[Type]  || "100%")
    }

    const maginificationValue = selectMagnificationValue(Type)

    return(
        <Drawer
        title="Play question"
        width={maginificationValue}
        onClose={onClose}
        open={open}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {selectedPlayQuestion(Id, Type)}
        </Drawer>
    )
}