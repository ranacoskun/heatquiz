import { Drawer, Dropdown, List, Skeleton, Space } from "antd";
import React from "react";
import {ArrowLeftOutlined, EditOutlined, TrophyOutlined} from '@ant-design/icons';
import { useEffect } from "react";

import { useKeyboard } from "../../../contexts/KeyboardContext";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { QuestionPlayPocket } from "../../Questions/QuestionPlayPocket/QuestionPlayPocket";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NUMERIC_KEY } from "../../../Components/Keyboard/constants";
import { LatexRenderer } from "../../../Components/LatexRenderer";

export function ViewKeyConnectedQuestions({open, onClose, selectedKey}){

    if(!open) return <div/>;

    const {isLoadingKeyConnectedQuestions, getKeyConnectedQuestionsResult: questions, errorGetKeyConnectedQuestions, getKeyConnectedQuestions} = useKeyboard()

    const [selectedQuestion, setSelectedQuestion] = useState({})
    const [showPlayQuestionModal, setShowPlayQuestionModal] = useState(false)

    const navigate = useNavigate()

    const loadData = () => {
        const {KeyboardId, Type, Id} = selectedKey

        const VM = ({
            KeyboardId: KeyboardId,
            IsNumericKey: Type === NUMERIC_KEY,
            KeyRelationId: Id,
        })

        getKeyConnectedQuestions(VM)
    }

    useEffect(() => {
        if(open){
            loadData()
        }
    }, [open])


    const questionActionsList = (q) => [{
        key: 'view_edit_question',
        label: 'View edit question',
        icon: <EditOutlined/>,
        onClick: () => navigate('/question_view_edit/'+q.Id+'/'+q.Type)
    },
    {
        key: 'play_question',
        label: 'Play question',
        icon: <TrophyOutlined style={{color:'green'}}/> ,
        onClick: () => {
            setSelectedQuestion(q)
            setShowPlayQuestionModal(true)
        }
    }]

    const numberOfQuestions = () => {
        if(questions){
            const {KeyboardQuestions: KQs} = questions

            return (KQs.length + " ")
        }

        return ''
    }

    const renderQuestions = () => {
        const {KeyboardQuestions: KQs} = questions

        return(
            <Space direction="vertical" size={'large'}>
                
                <List 
                    dataSource={KQs}
                    renderItem={(q, qi) => {
                        const {Id, Code, Base_ImageURL} = q

                        return(
                            <div 
                                key={Id}
                                className="hq-full-width hq-element-container"
                            >
                                <Space direction="vertical" align="start">
                                    <Space>
                                        <p className="default-gray">{qi+1}</p>

                                        <Dropdown
                                            menu={{
                                                title:'Actions',
                                                items:questionActionsList(q)
                                            }}
                                        >
                                            <p className="hoverable-plus">{Code}</p>
                                        </Dropdown>
                                    </Space>
                                    
                                    <Space direction="vertical" align="center" className="hq-full-width">
                                        <img
                                            alt={Code}
                                            src={Base_ImageURL}
                                            className="hq-img-size-1"
                                        />
                                    </Space>
                                </Space>
                            </div>
                            )
                    }}
                />
            </Space>
        )
    }


    const nQuestions = numberOfQuestions()

    return(
        <div>
            <Drawer
                title={"Questions list"}
                width={'40%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}

                footer={
                    <Space size={"large"}>
                        <small className="default-gray"><strong>{nQuestions}</strong> Questions connected to key</small>

                        <LatexRenderer 
                            latex={"$$" + selectedKey.TextPresentation + "$$"}
                        />
                    </Space>
                }
            >
                {isLoadingKeyConnectedQuestions && <Skeleton />}
                {errorGetKeyConnectedQuestions && !isLoadingKeyConnectedQuestions && 
                    <ErrorComponent 
                        error={errorGetKeyConnectedQuestions}
                        onReload={() => loadData()}
                    />
                }

                {!(isLoadingKeyConnectedQuestions || errorGetKeyConnectedQuestions) && questions && renderQuestions()}

            </Drawer>
            <QuestionPlayPocket 
                open={showPlayQuestionModal}
                onClose={() => setShowPlayQuestionModal(false)}

                Id={selectedQuestion.Id}
                Type={selectedQuestion.Type}
            />
        </div>
    )
}




