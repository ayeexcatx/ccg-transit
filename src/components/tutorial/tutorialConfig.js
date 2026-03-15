import { createPageUrl } from '@/utils';

export const COMPANY_OWNER_TUTORIAL_ID = 'companyOwnerMainPortal';
export const COMPANY_OWNER_TUTORIAL_DISMISSED_KEY = 'companyOwnerTutorialDismissed';
export const COMPANY_OWNER_TUTORIAL_COMPLETED_KEY = 'companyOwnerTutorialCompleted';

export const companyOwnerTutorialSteps = [
  {
    id: 'home-screen',
    page: createPageUrl('Home'),
    target: '[data-tour="home-overview"]',
    title: 'Home Screen',
    description:
      'This is the home screen, which gives you a quick snapshot of pending actions and dispatches.',
  },
  {
    id: 'announcement-center',
    page: createPageUrl('Home'),
    target: '[data-tour="announcement-center"]',
    title: 'Announcement Center',
    description:
      'This is where you will receive general communications and advisories from CCG Transit.',
  },
  {
    id: 'action-needed',
    page: createPageUrl('Home'),
    target: '[data-tour="action-needed"]',
    title: 'Action Needed',
    description:
      'This area will show you any dispatches that require your urgent attention, such as waiting for your confirmation of receipt.',
  },
  {
    id: 'dispatch-preview',
    page: createPageUrl('Home'),
    target: '[data-tour="dispatch-preview"]',
    title: 'Dispatch Preview',
    description: 'This is a quick view of the next few dispatches assigned to you.',
  },
  {
    id: 'dispatches-page',
    page: createPageUrl('Home'),
    target: '[data-tour="dispatches-nav"]',
    title: 'Dispatches',
    description: 'This is where you can see your entire dispatch history and upcoming dispatches.',
  },
  {
    id: 'availability-page',
    page: createPageUrl('Home'),
    target: '[data-tour="availability-nav"]',
    title: 'Availability',
    description:
      'This is where you will let us know if you are available for a certain shift and how many trucks you have available.',
  },
  {
    id: 'recurring-weekly-defaults',
    page: createPageUrl('Availability'),
    target: '[data-tour="recurring-weekly-defaults"]',
    title: 'Recurring Weekly Defaults',
    description:
      'This is where you can set your default availability that will automatically apply each week.',
  },
  {
    id: 'availability-controls',
    page: createPageUrl('Availability'),
    target: '[data-tour="availability-controls"]',
    title: 'Availability Controls',
    description:
      'This is where you can actively choose the number of trucks you have available for each shift.',
  },
  {
    id: 'drivers-page',
    page: createPageUrl('Home'),
    target: '[data-tour="drivers-nav"]',
    title: 'Drivers',
    description:
      'This is where you can add drivers by clicking Add Driver and entering their information. Please read the instructions about the driver portal at the bottom of the page in full. Once you add a driver, you will need to request a password for them.',
  },
  {
    id: 'incidents-page',
    page: createPageUrl('Home'),
    target: '[data-tour="incidents-nav"]',
    title: 'Incidents',
    description: 'This is where you can view your incident history or create a new incident report.',
  },
];

