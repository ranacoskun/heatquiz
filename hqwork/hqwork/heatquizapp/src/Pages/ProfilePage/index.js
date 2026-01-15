import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { useUsers } from "../../contexts/UsersContext";
import { Alert, Avatar, Divider, Dropdown, Input, Space, Table, Tag, message } from "antd";
import {EditOutlined, PartitionOutlined, SettingOutlined, PictureOutlined, CloseOutlined} from '@ant-design/icons';

import './ProfilePage.css'
import { useAuth } from "../../contexts/AuthContext";
import { EditUserNameEmail } from "./EditUserNameEmail";
import { EditProfilePicture } from "./EditProfilePicture";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { handleResponse } from "../../services/Auxillary";

export function ProfilePage(){
    const {users, loadingUsers, getUserError,  getUsers,
        loadingRemoveProfilePicture,
        deleteUserProfilePicture
        
    } = useUsers()

    const [api, contextHolder] = message.useMessage()
    
    const {username, currentPlayerKey} = useAuth()
    
    const [searchCode, setSearchCode] = useState('')
    const [currentUser, setCurrentUser] = useState('')

    const [userData, setUserData] = useState({
        Name:'Loading ....',
        ProfilePicture:'',
        Email:''    
    })

    //Modals
    const [showEditNameEmailModal, setShowEditNameEmailModal] = useState(false)
    const [showEditProfilePictureModal, setShowEditProfilePictureModal] = useState(false)
    const [showLinkedKeys, setShowLinkedKeys] = useState(false)

    const closeLinkedKeys = () => setShowLinkedKeys(false)
    const switchKey = () => {}

    useEffect(() => {
        if(users && users.length){
            const currentUser = users.filter((u) => u.Username === username)[0]

            if(currentUser){
                const {Name, Email, ProfilePicture} = currentUser

                setCurrentUser(currentUser)
                setUserData({
                    ...userData,
                    Name,
                    Email,
                    ProfilePicture
                })
            }
        }
        
    }, [users]) 

    return(
        <PagesWrapper>
            {contextHolder}
            <div>
                <Divider orientation="left">User profile</Divider>
                {userProfile()}
                {linkedKeys()}
                <Divider orientation="left">Colleagues</Divider>
                {usersList()}

                <EditUserNameEmail 
                    open={showEditNameEmailModal}
                    user={{...currentUser, ...userData}}
                    onClose={() => setShowEditNameEmailModal(false)}
                    reloadData={() => getUsers()}
                />
                <EditProfilePicture 
                    open={showEditProfilePictureModal}
                    onClose={() => setShowEditProfilePictureModal(false)}
                    username={currentUser.Username}
                    reloadData={() => getUsers()}
                />

            </div>
        </PagesWrapper>
    )

    function linkedKeys(){
        return(
            <div className="linked-keys-container">
                <br/>
                {showLinkedKeys &&
                <Alert
                    message="Linked keys"
                    closable 
                    afterClose={closeLinkedKeys} 
                    description = {
                        <div>
                            {currentUser.PlayerKeys.map((k) => 
                            <Space className="key-display-row">
                                <p>{k}</p> 
                                {k === currentPlayerKey && <Tag color="default">current key</Tag>}
                                {k !== currentPlayerKey && 
                                <Tag 
                                    color="processing" 
                                    className="switch-to-key-button"
                                    onClick={switchKey}
                                    >
                                    switch to this key
                                </Tag>}
                            </Space>)}
                        </div>
                    }
                    />}
            </div>
        )
    }

    function userProfile(){
        const actionsDropdownList = [
            {
              key: 'edit_name_email',
              label: 'Edit name / email',
              icon: <EditOutlined/>,
              onClick: () => {

                if(loadingUsers) return;

                setShowEditNameEmailModal(true)
              }
            },
            {
                key: 'edit_picture',
                label: 'Edit picture',
                icon: <PictureOutlined />,
                onClick: () => {
                    if(loadingUsers) return;

                    setShowEditProfilePictureModal(true)
                }
            },
            ...(userData.ProfilePicture ? [
                {
                  key: 'remove_picture',
                  label: loadingRemoveProfilePicture ? 'Removing ... ':'Remove picture',
                  icon: <CloseOutlined />,
                  onClick: () => {
                    if(loadingUsers) return;

                    if(loadingRemoveProfilePicture) return;
  
                    const data = new FormData()
                    data.append('Username', currentUser.Username)
                      
                    deleteUserProfilePicture(data).then((r) => handleResponse(r, api, 'Picture removed successfully', 1, () => getUsers()))
                     
                  }
                }] : []),
            {
              key: 'linked_keys',
              label: 'Linked keys',
              icon: <PartitionOutlined />,
              onClick: () => setShowLinkedKeys(true)
            }
            
        ];

        return(
            <div>
                <Space className="hq-full-width">
                <Avatar 
                    src={userData.ProfilePicture || 'https://img.freepik.com/free-icon/user_318-159711.jpg'} 
                    className="user-profile-picture"
                />
                <div className="user-profile-card">
                    <Space>
                        <p className="user-profile-name">{userData.Name}</p>
                        {!loadingUsers && 
                        <Dropdown
                            className="hoverable"
                            menu={{
                                items:actionsDropdownList,
                                title:'Actions'
                            }}
                        > 
                           <div className="settings-icon">
                                <SettingOutlined />
                           </div>
                        </Dropdown>}
                    </Space>
                    <p>{userData.Email}</p>
                </div>
            </Space>
            
            </div>
        )
    }

    function searchUsersLine(){
        return (
            <Input
            placeholder="Search name or email"
            value={searchCode}
            onChange = {(v) => setSearchCode(v.target.value)}
            />
        )
    }

    function usersList(){

        const columns = [
            {
              title: searchUsersLine,
              dataIndex: 'Name',
              width: '25%',
            },
            {
              dataIndex: 'Email',
              
              width: '25%',
            },
            {
              width: '12.5%',

              render: (u) => u.ProfilePicture ? 
              <img 
                src={u.ProfilePicture}
                alt="user"
                className="user-list-profile-picture"
              /> : <div/>
            },
          ];
          
        return(
            !getUserError ? 
            <Table
            className="hq-full-width"
            columns={columns}
            dataSource={users ? users.filter((u) => {
                if(u.Username === username) return false

                if(!searchCode.trim()) return true

                if(u.Username.includes(searchCode.trim()) || u.Email.includes(searchCode.trim())) return true

                return false

            }) : []}
            rowKey={(record) => record.username}
            loading={loadingUsers}
            pagination={{position:['topLeft']}}
            /> : 
            <ErrorComponent 
                error={getUserError}
                onReload={() => getUsers()}
            />
            )
    }

    
}

