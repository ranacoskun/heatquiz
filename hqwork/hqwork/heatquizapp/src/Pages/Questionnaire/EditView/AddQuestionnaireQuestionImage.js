import React, { useEffect, useState } from "react";
import {Button, Drawer, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";
import { UploadImage } from "../../../Components/UploadImage";

export function AddQuestionnaireQuestionImage({open, onClose, question, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingEditQuestionnaireQuestionImage, editQuestionnaireQuestionImage} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState("")
    
    useEffect(() => {
        
    }, [open])

    return(
        <Drawer
            title="Add/Edit Question Image"
            width={'50%'}
            onClose={onClose}
            open={open}
            bodyStyle={{}}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
        >
            {contextHolder}

            <small className="default-gray">Image</small>
            <UploadImage 
                onSetImage={(url, img) => {
                    setImage(img)
                    setImageURL(url)
                }}

                imageURL={imageURL}

                className="add-multiple-choice-question-img-box"
                classNameImage="add-multiple-choice-question-img-box-inside-img"
            />

            <br/>
            
            <Button
                size="small"
                type="primary"

                loading={isLoadingEditQuestionnaireQuestionImage}

                onClick={() => {
                    if(!image){
                        api.destroy()
                        api.warning("Please add image")

                        return
                    }

                    const data = new FormData()

                    data.append("QuestionId", question.Id)
                    data.append("Picture", image)

                    editQuestionnaireQuestionImage(data).then(r => handleResponse(r, api, "Updated successfully", 1, () => {
                        reloadSurvey()
                        onClose()
                    }))
                }}
            >
                Update
            </Button>
        </Drawer>
    )
}
