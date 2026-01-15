import './App.css';
import React from 'react';
import { Content } from 'antd/es/layout/layout';
import { DatapoolsProvider } from './contexts/DatapoolsContext';
import { UsersProvider } from './contexts/UsersContext';
import { CoursesProvider } from './contexts/CoursesContext';
import { StudentFeedbackProvider } from './contexts/StudentFeedbackContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { TopicsProvider } from './contexts/TopicsContext';
import { ClickTreesProvider } from './contexts/ClickTreesContext';
import { InterpretedTreesProvider } from './contexts/InterpretedTreesContext';
import { LevelsOfDifficultyProvider } from './contexts/LevelOfDifficultyContext';
import { QuestionsProvider } from './contexts/QuestionsContext';
import { KeyboardProvider } from './contexts/KeyboardContext';
import { SeriesProvider } from './contexts/SeriesContext';

import { MapsProvider } from './contexts/MapsContext';
import { SelectRoutes } from './SelectRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { CommentsProvider } from './contexts/CommentsContext';
import { DefaultValuesProvider } from './contexts/DefaultValuesContext';
import { AssistanceObjectsProvider } from './contexts/AssistanceObjectsContext';

function App() {

  return (
    <div className="App">
          <Content>
            <AuthProvider>
            <DatapoolsProvider>
            <UsersProvider>
            <CoursesProvider>
            <StudentFeedbackProvider>
            <ReportsProvider>
            <TopicsProvider>
            <ClickTreesProvider>
            <InterpretedTreesProvider>
            <LevelsOfDifficultyProvider>
            <QuestionsProvider>
            <KeyboardProvider>
            <SeriesProvider>
            <MapsProvider>
            <CommentsProvider>
            <DefaultValuesProvider>
            <AssistanceObjectsProvider>
              <SelectRoutes/>
            </AssistanceObjectsProvider>
            </DefaultValuesProvider>
            </CommentsProvider>
            </MapsProvider>
            </SeriesProvider>
            </KeyboardProvider>
            </QuestionsProvider>
            </LevelsOfDifficultyProvider>
            </InterpretedTreesProvider>
            </ClickTreesProvider>
            </TopicsProvider>
            </ReportsProvider>
            </StudentFeedbackProvider>
            </CoursesProvider>
            </UsersProvider>
            </DatapoolsProvider>
            </AuthProvider>
          </Content>
     </div>
  );
}

export default App;
