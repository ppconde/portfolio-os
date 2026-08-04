import { usePlaySound } from '~/hooks/use-play-sounds';
import DesktopContent from './DesktopContent';

export default function Desktop() {
  usePlaySound('/audio/windows98-click.mp3', 'click');

  return <DesktopContent />;
}
