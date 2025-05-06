import { ElMessageBox, ElMessageBoxOptions, MessageBoxData } from 'element-plus';

async function uMessageBox(optionsParam: ElMessageBoxOptions = {}): Promise<MessageBoxData> {
  const options: ElMessageBoxOptions = { ...optionsParam };

  if (!options.customClass) {
    options.customClass = 'u-msg-box';
  } else {
    options.customClass += 'u-msg-box';
  }

  return ElMessageBox(options);
}

export default uMessageBox;
