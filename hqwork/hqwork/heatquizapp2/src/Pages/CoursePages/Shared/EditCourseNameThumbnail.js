import {Button, Divider, Drawer, Form, Input, Spin, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import {ArrowLeftOutlined, InboxOutlined} from '@ant-design/icons';
import { ALLOWED_IMAGE_EXTENSIONS, MAX_ALLOWED_COURSE_CODE, MAX_ALLOWED_COURSE_NAME, dummyRequest, getBase64, handleResponse } from "../../../services/Auxillary";

import './AddNewCourse.css'
import { useCourses } from "../../../contexts/CoursesContext";
const { Dragger } = Upload;

export function EditCourseNameThumbnail({open, onClose, selectedCourse, reloadData}){  

  if(!open) return <div/>;

  const { loadingEditCourse, editCourse} = useCourses()

  const [loadingImage, setLoadingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [newImageURL, setNewImageURL] = useState(null);

  const [newName, setNewName] = useState(null)
  const [newCode, setNewCode] = useState(null)

  const [api, contextHolder] = message.useMessage()

  useEffect(() => {
    const {URL, Name, Code} = selectedCourse

    setNewImageURL(URL)
    setNewName(Name)
    setNewCode(Code)

  }, [selectedCourse])

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingImage(true);
      return;
    }

    if (info.file.status === 'done') {

      getBase64(info.file.originFileObj, (url) => {
        setLoadingImage(false);
        setNewImageURL(url);
        setNewImage(info.file.originFileObj);
      });
    }
  };

  return(
    <div>
      {contextHolder}
      <Drawer
        title={"Edit course"}
        width={'50%'}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        maskClosable={false}
        closeIcon={<ArrowLeftOutlined />}
    >
    <Divider orientation="left">Course thumbnail </Divider>
    <div
      className="thumbnail-uploader"
    >
      <Dragger  
        customRequest={dummyRequest}
        accept={ALLOWED_IMAGE_EXTENSIONS}
        onChange={handleChange}
        showUploadList={false}
      >
        {!newImageURL && <>
        <p className="ant-upload-drag-icon">
        <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </>}
        {loadingImage && <Spin size="small"/>}
        {newImageURL && 
        <img 
            src={newImageURL}
            className="new-course-photo"
            alt="course"
        />}
      </Dragger>
    </div>
    <Button 
          type="primary" 
          size="small"
          onClick={() => {
            if(!newImage){
              api.destroy()
              api.warning("Please add an image")
              return
            }

            const {Name, Code, Id} = selectedCourse

            const data = new FormData()
            data.append('Picture', newImage)
            data.append('Name', Name)
            data.append('Code',Code)
            data.append('CourseId', Id)
            data.append('SameImage',  false)

            editCourse(data)
            .then(
              (r) => {
                handleResponse(
                r,
                api,
                'Course edited successfully', 1,
                () => {
                  reloadData()
                  onClose()
                })
          })

            
          }}
          loading = {loadingEditCourse}
          >
            Edit thumbnail
    </Button>
    <Divider orientation="left">Course name/code</Divider>
    <div>
        <Form>
          <Form.Item>
            <small>Course name</small>
            <Input 
              placeholder="New course name"
              value={newName}
              onChange={(v) => setNewName(v.target.value)}
              maxLength={MAX_ALLOWED_COURSE_NAME}
              showCount 
            />
        
          </Form.Item>
          <Form.Item>
            <small>Course code</small>
            <Input 
              placeholder="New course code"
              value={newCode}
              onChange={(v) => setNewCode(v.target.value)}
              maxLength={MAX_ALLOWED_COURSE_CODE}
              showCount 
            />
          </Form.Item>
        </Form>
        <Button 
          type="primary" 
          size="small"
          onClick={() => {
            if(!newName.trim() || !newCode.trim())
            { 
              api.destroy()
              api.warning("Please add a name and code for the new course")
              return 
            }
            
            const {Id} = selectedCourse

            const data = new FormData()
            data.append('Name', newName)
            data.append('Code',newCode)
            data.append('CourseId', Id)
            data.append('SameImage',  true)

            editCourse(data)
            .then(
              (r) => {

                handleResponse(
                r,
                api,
                'Course edited successfully', 1,
                () => {
                  reloadData()
                  onClose()
                })
            })
          }}
          loading = {loadingEditCourse}
          >
            Edit name/code
        </Button>
    </div>
  </Drawer>
    </div>  
    
    )
}