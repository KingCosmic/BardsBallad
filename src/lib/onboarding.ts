
interface OnboardingStep {
  id: string;
  selector: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  shouldClick?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'step1',
    selector: '#nav-Marketplace',
    content: 'This is the marketplace, where you can find systems to use. You can search for systems by name or filter by license type.',
    position: 'bottom',
    shouldClick: true,
  },
  {
    id: 'step2',
    selector: '#nav-Characters',
    content: 'This is the character manager, where you can create and manage your characters. You can also import characters from json files.',
    position: 'bottom',
    shouldClick: true,
  },
  {
    id: 'step3',
    selector: '#nav-Library',
    content: 'Library is where you can find all the systems you have downloaded. You can also create your own systems here.',
    position: 'bottom',
    shouldClick: true,
  },
  {
    id: 'step4',
    selector: '#nav-Settings',
    content: 'And this is the settings page, where you can change your settings and preferences. You can also manage your account here.',
    position: 'top',
    shouldClick: true,
  }
];

export default onboardingSteps