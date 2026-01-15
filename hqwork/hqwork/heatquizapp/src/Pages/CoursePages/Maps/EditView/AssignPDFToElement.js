import {Button, Drawer, Space, message} from "antd";
import React, { useState } from "react";
import {ArrowLeftOutlined} from '@ant-design/icons';
import { UploadPDF } from "../../../../Components/UploadPDF";
import { useMaps } from "../../../../contexts/MapsContext";
import { handleResponse } from "../../../../services/Auxillary";

export function AssignPDFToElement({open, onClose, element, reloadMap}){
    
    if(!open) return <div/>;

    const {loadingAssignPDFToMapElement,  assignPDFToMapElement,} = useMaps()

    const [newPDF, setNewPDF] = useState(null)
    const [newPDFURL, setNewPDFURL] = useState(null)

    const [api, contextHolder] = message.useMessage()

    return(
        <div>
            {contextHolder}
            <Drawer
            title={
            <Space>
                <p>Add pdf to element {' '}{element.Title}</p>

                <Button
                    size="small"
                    type="primary"
                    loading={loadingAssignPDFToMapElement}
                    onClick={() => {
                        const data = new FormData()

                        data.append('ElementId', element.Id)
                        data.append("PDF", newPDF)

                        assignPDFToMapElement(data)
                        .then(r => 
                            handleResponse(
                                r,
                                api,
                                'PDF assigned successfuly',
                                1,
                                () => {
                                    reloadMap()
                                    onClose()
                                }))
                    }}
                >
                    Assign
                </Button>
            </Space>}
            width={'40%'}
            onClose={onClose}
            open={open}
            bodyStyle={{
            paddingBottom: 80,
            }}
            closeIcon={<ArrowLeftOutlined />}
            maskClosable={false}
            >
            <UploadPDF 
                pdfURL={newPDFURL}

                className="map-element-upload-pdf"
                pdfClassName="map-element-upload-pdf-internal"

                onSetPDF={(url, pdf) => {
                    setNewPDFURL(url)
                    setNewPDF(pdf)
                }}
            />
            </Drawer>
        </div>
    )
}