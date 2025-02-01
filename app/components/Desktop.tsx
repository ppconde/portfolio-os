import { AppsProvider } from '~/contexts/AppsContext';
import DesktopContent from './DesktopContent';

export default function Desktop() {
  return (
    <AppsProvider>
      <DesktopContent />
    </AppsProvider>
  );
}
