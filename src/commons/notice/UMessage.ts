import { ElMessage, MessageOptions } from 'element-plus';
import { getCssVariable } from '@/libs/utils/Style';

export default function uMessage(optionsParam: MessageOptions = {}) {
  let options: MessageOptions = { ...optionsParam };

  options.customClass = options.customClass
    ? `${options.customClass} u-message`
    : 'u-message';
  if (options.type) {
    options.customClass = `-${options.type} ${options.customClass}`;
  }

  const stonlyTopBannerHeight = parseInt(
    getCssVariable('--stonly-banner-top-sticky-margin') ||
      getCssVariable('--stonly-banner-top-margin') ||
      '0'
  );
  options.offset = (options.offset ?? 20) + stonlyTopBannerHeight;

  const defaults: MessageOptions = { duration: 5000, showClose: true };

  return ElMessage({ ...defaults, ...options });
}
