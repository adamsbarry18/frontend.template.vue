import { ElMessageBox, ElMessageBoxOptions } from 'element-plus';
import { h, Component } from 'vue';

interface AConfirmOptions extends ElMessageBoxOptions {
  component?: Component;
  props?: Record<string, any>;
}

export default async function uConfirm(
  text: string | AConfirmOptions,
  title: string = '',
  optionsParam: AConfirmOptions = {}
): Promise<any> {
  let options: AConfirmOptions = optionsParam;

  if (typeof text === 'object') {
    options = text;
    text = '';
  }

  options.customClass = 'u-msg-box';

  if (options?.component) {
    const msgOptions: ElMessageBoxOptions = {
      message: h(options.component, {
        props: options.props,
      }),
      title: options.title,
    };
    return ElMessageBox(msgOptions);
  }

  return ElMessageBox.confirm(text as string, title, options);
}
