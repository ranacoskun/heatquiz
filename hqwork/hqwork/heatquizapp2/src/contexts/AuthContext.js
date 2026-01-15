import React, { useContext, useEffect, useState } from "react"
import { checkAuthData, getAuthData, getIsStudent_LS, getUserRoles_LS, setIsStudent_LS, setUserFullname_LS, setUserRoles_LS, setUsername_LS } from "../services/Auth"
import { useNavigate } from "react-router-dom"
import { useAsyncFn } from "../hooks/useAsync"

const Context = React.createContext()

export function useAuth(){
    return useContext(Context)
}

export function AuthProvider ({children}){
    const [currentPlayerKey, setCurrentPlayerKey] = useState('')

    const [username, setUsername] = useState('')
    const [userfullname, setUserfullname] = useState('')
    const [roles, setRoles] = useState(getUserRoles_LS())
    const [profilePicture, setProfilePicture] = useState(null)
    
    const [isStudent, setIsStudent] = useState(false)    

    const {execute: authenticateToken} = useAsyncFn(() => checkAuthData(), [])

    const navigate = useNavigate()

    useEffect(() => {        
        const isStudent = getIsStudent_LS()
        const {playerKey, username, user} = getAuthData()

        if(!isStudent){
            authenticateToken().then((res) => {                
                const {data} = res
                if(!data) navigate('/login')
                else {
                    const {name, username, userProfile, roles} = data
                    
                    setProfilePicture(userProfile)
                    setUsername_LS(username)
                    setUserFullname_LS(name)
    
                    setRoles(roles)
                    setUserRoles_LS(roles)
                }
            })
    
            setUsername(user)
            setUserfullname(username)
            setCurrentPlayerKey(playerKey)

            return
        }
        else{
            setIsStudent(true)
            setUsername('student')
            setUserfullname('student')
            setProfilePicture(null)
            setCurrentPlayerKey(playerKey)
            return
        }
    }, [])



    function playAsStudent(){
        setIsStudent_LS(true)

        setIsStudent(true)
        setUsername('student')
        setUserfullname('student')
        setProfilePicture(null)

        navigate('/')

    }

    return(
        <Context.Provider value = {{
            currentPlayerKey,

            username,
            userfullname,
            profilePicture,
            roles, 

            isStudent,
            
            setIsStudent,
            setUsername,
            setUserfullname,
            setProfilePicture,
            setRoles,

            playAsStudent
        }}>
            {children}
        </Context.Provider>
    )
}