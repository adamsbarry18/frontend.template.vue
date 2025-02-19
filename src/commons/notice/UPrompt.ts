import { ElMessageBox, ElMessageBoxOptions } from 'element-plus';

export default function uPrompt(
  text: string,
  title: string = '',
  optionsParam: ElMessageBoxOptions = {}
) {
  let options: ElMessageBoxOptions = { ...optionsParam };
  options.customClass = 'u-msg-box';

  return ElMessageBox.prompt(text, title, options);
}
