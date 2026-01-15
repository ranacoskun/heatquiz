import React, { useContext, useEffect } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import { addCourseRequest, editCourseRequest, getAllCourses, getCourse, getMyCourses } from "../services/Courses"
import { useDatapools } from "./DatapoolsContext"
import { useAuth } from "./AuthContext"

const Context = React.createContext()

export function useCourses(){
    return useContext(Context)
}

export function CoursesProvider ({children}){
    const {isStudent} = useAuth()

    //Fetch courses from API
    const {loading: loadingCourses, value: courses, error: getCoursesError, execute: getCourses} = useAsyncFn(() => getAllCourses())
    const {loading: loadingMyCourses, value: myCourses, error: getMyCoursesError, execute: getOwnedCourses} = useAsyncFn(() => getMyCourses())
    const {loading: loadingCourse, value: Course, error: getCourseError, execute: getCourseView} = useAsyncFn((Id) => getCourse(Id))
    const {loading: loadingAddCourse, value: addCourseResult, error: getAddCourseError, execute: addCourse} = useAsyncFn((b) => addCourseRequest(b))
    const {loading: loadingEditCourse, value: editCourseResult, error: getEditCourseError, execute: editCourse} = useAsyncFn((b) => editCourseRequest(b))

    const {selectedDatapool} = useDatapools()

    

    useEffect(() => {
        if(!isStudent){
            getCourses()
        }
    }, [selectedDatapool])

    return(
        <Context.Provider value = {{
            loadingCourses,
            courses,
            getCoursesError,
            getCourses, 

            loadingMyCourses,
            myCourses,
            getMyCoursesError,
            getOwnedCourses,

            loadingCourse,
            getCourseError,
            Course,
            getCourseView,

            addCourseResult,
            loadingAddCourse,
            getAddCourseError,
            addCourse,

            editCourseResult,
            loadingEditCourse,
            getEditCourseError,
            editCourse
        }}>
            {children}
        </Context.Provider>
    )
}