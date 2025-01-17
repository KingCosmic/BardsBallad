import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Redirect, Route } from 'react-router-dom'
import Menu from './components/Menu'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css'

import './App.css'

/* Theme variables */
import './theme/variables.css'
import Character from './pages/Character'
import Characters from './pages/Characters'
import Library from './pages/Library'
import CharacterMenu from './components/CharacterMenu'
import System from './pages/System'
import ModalManager from './components/ModalManager'
import SystemMenu from './components/SystemMenu'

import { Editor } from '@craftjs/core'
import Text from './designer/components/Text'
import Searchbar from './designer/Searchbar'
import FAB from './designer/FloatingActionButton'
import { updatePageLexical } from './state/system'
import DesignerDivider from './designer/components/Divider'
import Container from './designer/components/Container'
// import { RenderNode } from './designer/RenderNode'

setupIonicReact()

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Editor resolver={{ Container, Text, FAB, Searchbar, DesignerDivider }} onNodesChange={(query) => updatePageLexical(query.serialize())}>
          <IonSplitPane contentId='main'>
            <Menu />
            <IonRouterOutlet id='main'>
              <Route path='/' exact={true}>
                <Redirect to='/characters' />
              </Route>
              <Route path='/character/:name'>
                <Character />
              </Route>
              <Route path='/characters' exact={true}>
                <Characters />
              </Route>

              <Route path='/library' exact={true}>
                <Library />
              </Route>
              <Route path='/systems/:name'>
                <System />
              </Route>
            </IonRouterOutlet>

            <CharacterMenu />
            <SystemMenu />
          </IonSplitPane>
          <ModalManager />
        </Editor>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
