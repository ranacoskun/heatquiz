import React from 'react';
import {Avatar, Badge, Button, Col, Divider, Drawer, Dropdown, List, Row, Select, Space, Spin, Tooltip } from 'antd';
import {UserOutlined, BellOutlined, LogoutOutlined} from '@ant-design/icons';
import { useDatapools } from '../contexts/DatapoolsContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {getShortenedName, goToQuestionViewEditSamePage, timeSince } from '../services/Auxillary';
import { useComments } from '../contexts/CommentsContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';


const UserDrawer = () => {
  const {datapools, errorGetDatapools, isLoadingDatapools, selectedDatapool, changeDatapool, registerFeedbackSeen} = useDatapools()
  const {username, userfullname, profilePicture, isStudent} = useAuth()

  const {loadingUnreadComments, getUnreadCommentsResult: undreadComments, getUnreadCommentsError, getUnreadComments, registerCommentView} = useComments()

  const [showUnseenComments, setShowUnseenComments] = useState(false)

  useEffect(() => {
    if(isStudent) return;

    getUnreadComments()
    setShowUnseenComments(false)

    //Set a 1 minute interval timer
    const timer = setInterval(() => {
      getUnreadComments()
    }, 60*1000);

    return () => clearInterval(timer)
  }, [])

  const navigate = useNavigate()

  const onChangeDataPool = (option) => {
    changeDatapool(option)
  }

  const onUserClick = () => {

  }

  const onLogout = () => {
    navigate('/login')
  }

  const userDropdownList = [
    {
      key: 'username',
      label: <span>{username}</span>,
      icon: <UserOutlined/>,
      onClick: onUserClick
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined/>,
      onClick: onLogout
    }
  ];

  const getUnseenComments = () => {
    if(loadingUnreadComments || getUnreadCommentsError) return ({CountInactive:0, Count: 0, Comments: [], StudentFeedback:[]});

    if(!undreadComments) return ({CountInactive:0, Count: 0, Comments: [], StudentFeedback:[]});

    const {CountInactive, Count, Comments, StudentFeedback} = undreadComments

    return ({CountInactive, Count, Comments, StudentFeedback});
  }

  const unseenComments = getUnseenComments()

  const renderNotificationsList = () => {
    if(isStudent) return;

    const notifications = unseenComments.Comments
    const feedback = unseenComments.StudentFeedback

    return(
      <Drawer
          title="Notifications"
          placement="right"
          onClose={() => setShowUnseenComments(false)}
          open={showUnseenComments}
        >
          {notifications.length ? 
          <div>
            <p className='default-large default-title'>User comments</p>
            <br/>
            <List 
              dataSource={notifications}
              renderItem={(n, ni) => {
                const {AddedByName, Text, CommentSection, AddedByProfilePicture, DateCreated} = n

                const {Question} = CommentSection
                const {Code, Id, Type, Base_ImageURL} = Question

                const shortenedName = getShortenedName(AddedByName)

                return(
                <Tooltip
                  color='white'
                  title={<p>Click to go to question</p>}
                  placement='left'
                  key={ni}
                >
                  <div 
                  onClick={() => {

                    goToQuestionViewEditSamePage(navigate, ({Id, Type}))
                    setShowUnseenComments(false)
                    registerCommentView(CommentSection.Id)
                  }}
                  className='hoverable hq-full-width'>
                  <Row
                    gutter={[4,4]}
                    className="hq-full-width"
                  >
                    <Col>
                      <Space
                        size={'large'}
                      >
                        <Space
                          size={'small'}
                        >
                          <Avatar 
                            className='commenter-avatar'
                            src = {AddedByProfilePicture}
                          >
                            {shortenedName}
                          </Avatar>
                          <p className='default-title'>{AddedByName}</p>
                        </Space>
                        <p className='default-gray'>{timeSince(DateCreated)}{' '}ago</p>

                      </Space>
                      <MentionsInput
                          value={Text}
                          disabled
                          style={{
                          control: {
                            backgroundColor: 'white',
                            border: '0px solid silver',
                          },
                          '&multiLine': {
                            input: {
                              padding: 1,
                              border: '0px solid silver',
                              },
                            },
                          '&singleLine': {
                            input: {
                              padding: 1,
                              border: '0px inset',
                              },
                            }}}>

                            <Mention
                              data={([])} 
                              style = {{}}
                            />
                          </MentionsInput>
                    </Col>
                    
                    <Col>
                      <Space direction='vertical' align='center'>
                        <p className="default-gray">{Code}</p>

                        <img 
                          alt={Code}
                          className='notification-question-img'
                          src={Base_ImageURL}
                        />
                      </Space>
                    </Col>                        
                  </Row>      
                  <Divider/>
                </div>
                </Tooltip>)
              }}
            />
          </div> : <div/>}
          {feedback.length ?
          <div>
            {notifications.length ? <br/> : <div/>}
            <p className='default-large default-title'>Student feedback <small className='default-gray'>{' '}(today)</small></p>
            <br/>
            <List 
            dataSource={feedback}
            renderItem={(n, ni) => {
              const {Player, Question, DateCreated, FeedbackContent, New} = n

              const {Code, Id, Type, Base_ImageURL} = Question

              const shortenedName = getShortenedName(Player)

              return(
              <Tooltip
                color='white'
                title={<p>Click to go to question</p>}
                placement='left'
                key={ni}
                onClick={() => {
                  goToQuestionViewEditSamePage(navigate, ({Id, Type}))
                  setShowUnseenComments(false)
                }}
              >
                <div className='hq-full-width hoverable'>
                  <Row 
                  gutter={[4,4]}>
                  <Col>
                    <Space
                      size={'large'}
                    >
                      <Space
                        size={'small'}
                      >
                        <Avatar 
                          className='commenter-avatar'
                        >
                          {shortenedName}
                        </Avatar>
                        <p className='default-title'>{Player}</p>
                      </Space>
                      <p className='default-gray'>{timeSince(DateCreated)}{' '}ago {New && <span className='default-large default-orange'>*</span>}</p>

                    </Space>
                    <p>{FeedbackContent}</p>
                  </Col>
                  
                  <Col>
                    <Space direction='vertical' align='center'>
                      <p className="default-gray">{Code}</p>
                      <img 
                        alt={Code}
                        className='notification-question-img'
                        src={Base_ImageURL}
                      />
                    </Space>
                  </Col>
                </Row>
                <Divider/>
              </div>
                
              </Tooltip>)
            }}
          />
          </div>
          : <div/>}
          
         
      </Drawer>
    )
  }

  return (
    <Space
      
    >
      {!isStudent && 
      <div>

        {!(isLoadingDatapools || errorGetDatapools) && 
        <Select
          onChange={(v, option) => onChangeDataPool(option)}
          defaultValue={'please select'}
          value={selectedDatapool}
          className='navigation-bar-datapools-select'
          options={(datapools || []).map((d) => ({
              value: d.Id,
              label: d.NickName
            }))}
        />}

        {isLoadingDatapools && 
        <div className='navigation-bar-datapools-select-spin'>
          <Spin />
        </div>}
      </div>}

      <Space >
        
          <Dropdown
          menu={{
            items:userDropdownList,
            title:userfullname
          }}
          > 
          <Avatar 
                className='navigation-bar-user-avatar'
                src = {profilePicture}
                >
                     {getShortenedName(userfullname)}
                </Avatar>
          </Dropdown>
           
          {!isStudent && 
          <Button
            type="light"
            onClick = {() =>{
              registerFeedbackSeen()
              setShowUnseenComments(true)
            }}
            icon = {
                <Badge
                    count={unseenComments.Count}
                >
                <Avatar 
                    className='navigation-bar-notification-avatar'
                    icon={<BellOutlined />} />
                </Badge>
            }
          />}
          
      </Space>
      
      {renderNotificationsList()}
      
    </Space>
  );
}

export default UserDrawer;