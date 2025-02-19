import {
  ElMessageBox,
  ElMessageBoxOptions,
  MessageBoxData,
} from 'element-plus';
import {
  pauseShortcutManager,
  restartShortcutManager,
} from '@/plugins/shortcutManager';

async function uMessageBox(
  optionsParam: ElMessageBoxOptions = {}
): Promise<MessageBoxData> {
  pauseShortcutManager();
  let options: ElMessageBoxOptions = { ...optionsParam };

  if (!options.customClass) {
    options.customClass = 'u-msg-box';
  } else {
    options.customClass += 'u-msg-box';
  }

  return ElMessageBox(options).finally(() => {
    restartShortcutManager();
  });
}

export default uMessageBox;
