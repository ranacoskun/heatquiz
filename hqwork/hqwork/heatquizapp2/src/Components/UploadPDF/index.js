import React, { useEffect, useState } from "react";
import {ALLOWED_PDF_EXTENSIONS, dummyRequest, getBase64 } from "../../services/Auxillary";
import { Spin, Tooltip } from "antd";
import {FilePdfOutlined} from '@ant-design/icons';
import Dragger from "antd/es/upload/Dragger";

import './index.css'

export function UploadPDF({className, pdfClassName, pdfURL, onSetPDF}){

    const [loadingPDF, setLoadingPDF] = useState(false)

    useEffect(()=> {
        setLoadingPDF(false)
    }, [])

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
          setLoadingPDF(true);
          return;
        }
    
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setLoadingPDF(false);
                //ImageURL, Image
                onSetPDF(url, info.file.originFileObj)
            });
        }
    };
    return(
    <div
        className={className}
    >
        <Tooltip
                color="white"
                placement="top"
                title={ <p>Click or drag file to this area to upload</p>}
        >
            <Dragger  
                customRequest={dummyRequest}
                accept={ALLOWED_PDF_EXTENSIONS}
                onChange={handleChange}
                showUploadList={false}
                >
                {!pdfURL && 
                <>
                <p className="ant-upload-drag-icon">
                <FilePdfOutlined />
                </p>
            
                </>}
                {loadingPDF && <Spin size="small"/>}
                {pdfURL && 
                <iframe 
                    title="uploaded-pdf"
                    className={pdfClassName}
                    src={pdfURL}>
                </iframe>}
            </Dragger>
        </Tooltip>
    </div>
    )
}