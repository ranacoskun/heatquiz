import {Alert, Button, Drawer, Space, message } from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';

import { useQuestions } from "../../../../contexts/QuestionsContext";
import { UploadImage } from "../../../../Components/UploadImage";
import { handleResponse } from "../../../../services/Auxillary";

export function EditClickableQuestionImage({open, onClose, question, reloadQuestion}){

    if(!open) return <div/>;

    const { isLoadingEditClickableQuestionImage, editClickableQuestionImage} = useQuestions()

    const [newImage, setNewImage] = useState(null)
    const [newImageURL, setNewImageURL] = useState(null)

    const [api, contextHolder] = message.useMessage()

    return(
        <Drawer
        title={
        <Space size={'large'}>
            <p>Edit question image</p>

            <Button
                size="small"
                type="primary"

                loading={isLoadingEditClickableQuestionImage}

                onClick={() => {
                    if(!newImage){
                        api.destroy()
                        api.warning("Please add image")
                        return
                    }

                    const data = new FormData()
                    data.append("QuestionId", question.Id)
                    data.append("Picture", newImage)

                    editClickableQuestionImage(data).then(r => handleResponse(r, api, 'Updated successfully', 1, () => {
                        reloadQuestion()
                        onClose()
                    }))
                }}
            >
                Update
            </Button>
        </Space>}
        width={'50%'}
        onClose={onClose}
        open={open}
        closeIcon={<ArrowLeftOutlined />}
        maskClosable={false}
        >
            {contextHolder}
            <div>
                <Alert 
                    message={<p>New image dimensions <u>should</u> the same and will <strong>not</strong> update to the new image!</p>}
                    type="info"
                /> 
                    
                <br/>
                <UploadImage
                    onSetImage={(url, img) => {
                        setNewImageURL(url)
                        setNewImage(img)

                    }}

                    imageURL={newImageURL}

                    className="clickable-question-add-image-container"
                    classNameImage="clickable-question-add-image-inside"
                />
            </div>
        </Drawer>
    )
}