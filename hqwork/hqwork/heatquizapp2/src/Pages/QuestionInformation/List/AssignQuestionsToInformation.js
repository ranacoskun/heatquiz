import { Button, Drawer, Space, message } from "antd";
import React, {useEffect, useState } from "react"
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useAssistanceObjects } from "../../../contexts/AssistanceObjectsContext";
import './index.css'
import { handleResponse } from "../../../services/Auxillary";
import { ErrorComponent } from "../../../Components/ErrorComponent";
import { SearchQuestionsList } from "../../Questions/SearchQuestionsList";

export function AssignQuestionsToInformation({open, onClose, reloadData, info}){

    if(!open) return <div/>;

    const [selectedAssignQuestions, setSelectedAssignQuestions] = useState([])

    const {
        isLoadinggQuestionsAssignedInformation, getAllQuestionsAssignedInformation, errorGetQuestionsAssignedInformation, QuestionsAssignedInformation: forbiddenQuestions,
        isLoadingAssignQuestionsInformation, assignQuestionsInformation, 
    } = useAssistanceObjects()
    
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if(open){
            getAllQuestionsAssignedInformation(info)
        }
    }, [open])

    return( 
        <div>
            {contextHolder}
            <Drawer
                title={
                    <Space size={"large"}>
                        <p className="hq-normal-font-weight">Assign questions to <strong className="default-title">{info.Code}</strong></p>
                        <Button 
                            type="primary"
                            size="small"
                            onClick={() => {
                                if(!selectedAssignQuestions.length){
                                    messageApi.destroy()
                                    messageApi.warning("Please select questions to perform this action")
        
                                    return
                                }
        
                                let data = new FormData()
        
                                data.append("Id", info.Id)
        
                                for(let q of selectedAssignQuestions){
                                    data.append("QuestionIds", q.Id)
                                }
        
                                assignQuestionsInformation(data)
                                .then(r => handleResponse(r, messageApi, 'Assigned successfully', 1, () => {
                                    onClose()
                                    reloadData()
                                }))
                            }}
                            loading = {isLoadingAssignQuestionsInformation}
                        >
                        Assign
                        </Button>     
                    </Space>
                }
                width={'100%'}
                onClose={onClose}
                open={open}
                bodyStyle={{}}
                closeIcon={<ArrowLeftOutlined />}
                maskClosable={false}
            >   
                {!(isLoadinggQuestionsAssignedInformation || errorGetQuestionsAssignedInformation)
                &&
                <SearchQuestionsList
                    selectedQuestions={selectedAssignQuestions}
                    onSelectQuestions={(d) => setSelectedAssignQuestions(d)}
                    forbiddenQuestions = {forbiddenQuestions}
                />}

                {errorGetQuestionsAssignedInformation && !isLoadinggQuestionsAssignedInformation &&
                    <ErrorComponent 
                        error={"Error loading already assigned questions - - - " + errorGetQuestionsAssignedInformation}
                        onReload={() => getAllQuestionsAssignedInformation(info)}
                    />
                }
            </Drawer>
        </div>
    )
}