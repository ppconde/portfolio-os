import DesktopContent from './DesktopContent';
import { usePlaySound } from '~/hooks/use-play-sounds';

export default function Desktop() {
  usePlaySound('/audio/windows98-click.mp3', 'click');

  return <DesktopContent />;
}
