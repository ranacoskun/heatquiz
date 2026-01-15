import React, { useEffect, useState } from "react";
import {Button, Drawer, message } from "antd";
import {ArrowLeftOutlined } from '@ant-design/icons';
import { useQuestionnaires } from "../../../contexts/QuestionnaireContext";
import {handleResponse} from "../../../services/Auxillary";
import { UploadImage } from "../../../Components/UploadImage";

export function EditQuestionnaireImage({open, onClose, survey, reloadSurvey}){
    if(!open) return <div/>;

    const {isLoadingEditQuestionnaireImage, editQuestionnaireImage} = useQuestionnaires()

    const [api, contextHolder] = message.useMessage()

    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState("")
    
    useEffect(() => {
        
    }, [open])

    return(
        <Drawer
            title="Add/Edit Survey Image"
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

                loading={isLoadingEditQuestionnaireImage}

                onClick={() => {
                    if(!image){
                        api.destroy()
                        api.warning("Please add image")

                        return
                    }

                    const data = new FormData()

                    data.append("SurveyId", survey.Id)
                    data.append("Picture", image)

                    editQuestionnaireImage(data).then(r => handleResponse(r, api, "Updated successfully", 1, () => {
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
