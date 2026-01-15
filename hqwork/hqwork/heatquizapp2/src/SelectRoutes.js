import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { Route, Routes } from "react-router-dom";
import { MapPlay } from "./Pages/CoursePages/Maps/Play";
import { Login } from "./Pages/Login";
import { Dashboard } from "./Pages/Dashboard";
import { Settings } from "./Pages/Settings";
import { ProfilePage } from "./Pages/ProfilePage";
import { Courses } from "./Pages/CoursePages/Courses";
import { CourseView } from "./Pages/CoursePages/CourseView";
import { StudentFeedback } from "./Pages/StudentFeedback";
import { Reports } from "./Pages/Reports";
import { Topics } from "./Pages/Topics";
import { ClickTrees } from "./Pages/ClickTrees";
import { InterpretedTrees } from "./Pages/InterpretedTrees";
import { QuestionList } from "./Pages/Questions/List";
import { SeriesList } from "./Pages/Series/List";
import { PlaySeriesPage } from "./Pages/Series/Play";
import { SeriesEditViewPage } from "./Pages/Series/EditView";
import { NotFoundPage } from "./Pages/StatusPages/NotFoundPage";
import { LevelOfDifficulty } from "./Pages/LevelOfDifficulty";
import { Datapools } from "./Pages/Datapools";
import { QuestionEditView} from "./Pages/Questions/Shared/QuestionEditView";
import { AddMutlipleChoiceQuestion } from "./Pages/Questions/MultipleChoiceQuestion/Add";
import { AddKeyboardQuestion } from "./Pages/Questions/KeyboardQuestion/Add";
import { AddSeries } from "./Pages/Series/Add";
import { AddMap } from "./Pages/CoursePages/Maps/Add";
import { MapEditView } from "./Pages/CoursePages/Maps/EditView";
import { KeyboardsList } from "./Pages/Keyboards/List";
import { AddKeyboard } from "./Pages/Keyboards/Add";
import { KeysListsList } from "./Pages/Keyboards/KeysList/List";
import { AddNewKey } from "./Pages/Keyboards/Keys/Add";
import { KeysList } from "./Pages/Keyboards/Keys/List";
import { KeyboardEditView } from "./Pages/Keyboards/EditView";
import { MapClickImagesList } from "./Pages/MapClickImages/List";
import { QuestionInformationList } from "./Pages/QuestionInformation/List";
import { DefaultImagesList } from "./Pages/DefaultImages/List";
import { BackgroundImagesList } from "./Pages/BackgroundImages/List";
import { NotificationsList } from "./Pages/Notifications";
import { UsersList } from "./Pages/Users";
import { AddClickableQuestion } from "./Pages/Questions/ClickableQuestion/Add";
import { AddEnergyBalanceQuestion } from "./Pages/Questions/EnergyBalanceQuestion/Add/AddEnergyBalanceQuestion";
import { AddFBDQuestion } from "./Pages/Questions/FBDQuestion/Add";
import { AddDiagramQuestion } from "./Pages/Questions/DiagramQuestion/Add";
import { AddPVDiagramQiestion } from "./Pages/Questions/PVDiagramQuestion/Add";

export function SelectRoutes(){
    const {roles, isStudent,} = useAuth()

    console.log(roles)

    const isAdmin = roles.includes('admin')
    const isNormalUser = roles.includes('course_editor')

    if(isStudent) 
    {
        return(
            <Routes>
                <Route path="/Login" exact element={<Login />}/>
                <Route path="/" exact element={<Dashboard />}/>
                <Route path="/playcoursemap/:id" element={<MapPlay />}/>
                <Route path="*" exact element={<NotFoundPage />}/>
            </Routes>
        )
    }
    else if(isAdmin){
        return(
            <Routes>
                <Route path="/Login" exact element={<Login />}/>
                <Route path="/" exact element={<Dashboard />}/>
                <Route path="/level_of_difficulty" exact element={<LevelOfDifficulty />}/>
                <Route path="/datapools" exact element={<Datapools />}/>
                <Route path="/users_list" element={<UsersList/>}/>

                <Route path="*" exact element={<NotFoundPage />}/>
            </Routes>
        )
    }
    else if (isNormalUser)
    {
        return(
            <Routes>
                <Route path="/Login" exact element={<Login />}/>
                <Route path="/" exact element={<Dashboard />}/>

                <Route path="/settings" element={<Settings />}/>
                
                <Route path="/profile" element={<ProfilePage />}/>

                <Route path="/courses" element={<Courses />}/>
                <Route path="/viewcourse/:id" exact element={<CourseView />}/>
                <Route path="/playcoursemap/:id" element={<MapPlay />}/>
                <Route path="/add_map" element={<AddMap />}/>
                <Route path="/edit_view_map/:id" element={<MapEditView />}/>

                <Route path="/feedback" element={<StudentFeedback />}/>

                <Route path="/reports" element={<Reports />}/>

                <Route path="/topics" element={<Topics />}/>

                <Route path="/click_trees" element={<ClickTrees />}/>
                <Route path="/interpreted_trees" element={<InterpretedTrees />}/>

                <Route path="/questions_list" element={<QuestionList />}/>
                <Route path="/question_view_edit/:id/:type" element={<QuestionEditView />}/>

                <Route path="/add_series" element={<AddSeries />}/>
                <Route path="/series_list" element={<SeriesList />}/>
                <Route path="/series_play/:id" element={<PlaySeriesPage />}/>
                <Route path="/series_edit_view/:code" element={<SeriesEditViewPage />}/>
                
                <Route path="/add_mc_q" element={<AddMutlipleChoiceQuestion />}/>
                <Route path="/add_k_q" element={<AddKeyboardQuestion />}/>
                <Route path="/add_c_q" element={<AddClickableQuestion />}/>
                <Route path="/add_eb_q" element={<AddEnergyBalanceQuestion />}/>
                <Route path="/add_fbd_q" element={<AddFBDQuestion />}/>
                <Route path="/add_d_q" element={<AddDiagramQuestion />}/>
                <Route path="/add_pvd_q" element={<AddPVDiagramQiestion />}/>

                <Route path="/keyboards_list" element={<KeyboardsList/>}/>
                <Route path="/add_keyboard" element={<AddKeyboard/>}/>
                <Route path="/keyboard_edit_view/:id" element={<KeyboardEditView/>}/>

                <Route path="/key_list_list" element={<KeysListsList/>}/>

                <Route path="/add_key" element={<AddNewKey/>}/>
                <Route path="/keys_list" element={<KeysList/>}/>

                <Route path="/map_click_images_list" element={<MapClickImagesList/>}/>

                <Route path="/information_list" element={<QuestionInformationList/>}/>

                <Route path="/default_images_list" element={<DefaultImagesList/>}/>

                <Route path="/background_images_list" element={<BackgroundImagesList/>}/>

                <Route path="/user_comments" element={<NotificationsList/>}/>

                
                
                <Route path="*" exact element={<NotFoundPage />}/>
            </Routes>
        )
    }

    return(
        <Routes>
            <Route path="/Login" exact element={<Login />}/>
            <Route path="*" exact element={<NotFoundPage />}/>
        </Routes>
    )
}