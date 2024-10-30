import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { bodyOutline, bodySharp, ellipsisHorizontal, ellipsisVertical, libraryOutline, librarySharp, logoAppleAppstore, logoDiscord, logoGithub, logoGooglePlaystore, mailOutline, personCircle, search, } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Characters',
    url: '/characters',
    iosIcon: bodyOutline,
    mdIcon: bodySharp
  },
  {
    title: 'Library',
    url: '/library',
    iosIcon: libraryOutline,
    mdIcon: librarySharp
  }
]

const Menu: React.FC = () => {
  const location = useLocation()

  return (
    <IonMenu menuId='nav-menu' contentId='main' type='overlay'>
      <IonContent>
        <IonList>
          <IonListHeader>BardsBallad</IonListHeader>
          <IonNote>V0.8.2</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <IonCard color='light'>
          <IonCardHeader>
            <IonToolbar color='light'>
              <IonButton slot='start' color='warning'>Beta</IonButton>
            </IonToolbar>
          </IonCardHeader>

          <IonCardContent>
            We're happy you're using the BardsBallad Beta! If you run into any problems please reach out to us through one of the platforms below!
          </IonCardContent>
        </IonCard>

        <IonToolbar>
          <IonButtons>
            <IonButton target='_blank' href='https://github.com/KingCosmic/BardsBallad'>
              <IonIcon slot='icon-only' icon={logoGithub}></IonIcon>
            </IonButton>
            <IonButton target='_blank' href='https://discord.com/invite/a5qSfxv'>
              <IonIcon slot='icon-only' icon={logoDiscord}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonNote>
          support@bardsballad.com
        </IonNote>
      </IonContent>
    </IonMenu>
  )
}

export default Menu;
