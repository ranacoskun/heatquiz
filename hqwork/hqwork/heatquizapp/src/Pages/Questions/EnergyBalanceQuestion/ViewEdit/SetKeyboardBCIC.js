import {Button, Drawer, Space, message} from "antd";
import React, {useState } from "react";
import {ArrowLeftOutlined, InsertRowAboveOutlined } from '@ant-design/icons';
import { SelectKeyboardList } from "../../../Keyboards/Shared/SelectKeyboardList";
import { useQuestions } from "../../../../contexts/QuestionsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function SetKeyboardBCIC({open, onClose, question, reloadQuestion, IsBC}){

    if(!open) return <div/>;

    const {
        isLoadingEditEnergyBalanceBCKeyboard, editEnergyBalanceBCKeyboard,
        isLoadingEditEnergyBalanceICKeyboard,editEnergyBalanceICKeyboard,} = useQuestions()

    const [selectedKeyboard, setSelectedKeyboard] = useState(null)

    const [messageApi, contextHolder] = message.useMessage()
    

    return(
        <Drawer
        title={
            <Space size={'large'} align="start">
                <div>
                <p>Set keyboard for {IsBC ? "Boundary conditions" : "Initial conditions"}</p>
                <small className="default-gray">Updating the keyboard will lead to existing conditions getting deleted.</small>
                </div>

                <Button
                    size="small"
                    type="primary"

                    loading = {isLoadingEditEnergyBalanceBCKeyboard || isLoadingEditEnergyBalanceICKeyboard}

                    onClick={() => {
                        if(!selectedKeyboard) 
                        {
                            messageApi.destroy()
                            messageApi.warning("Please select a keyboard")
                            return
                        }

                        const data = new FormData()

                        data.append('QuestionId', question.Id)
                        data.append('KeyboardId', selectedKeyboard.Id)

                        if(IsBC){
                            editEnergyBalanceBCKeyboard(data).then(r => handleResponse(r, messageApi, 'Updated', 1, () => {
                                onClose()
                                reloadQuestion()
                            }))
                        }
                        else{
                            editEnergyBalanceICKeyboard(data).then(r => handleResponse(r, messageApi, 'Updated', 1, () => {
                                onClose()
                                reloadQuestion()
                            }))
                        }
                    }}

                >
                    Update
                </Button>
            </Space>
        }
        width={'70%'}
        onClose={onClose}
        open={open}
        bodyStyle={{}}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        footer={
        <div>
            {selectedKeyboard && 
            <Space>
                <InsertRowAboveOutlined className="default-title default-larger"/>
                <p className="default-title default-larger"> {selectedKeyboard.Name} </p>
            </Space>}
        </div>}
    >   
        {contextHolder}
        <SelectKeyboardList 
            onSelect={(k) => setSelectedKeyboard(k)}
        />

        
    </Drawer>
    )
}