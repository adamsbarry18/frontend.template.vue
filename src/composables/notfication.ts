import uConfirm from '@/modules/common/notice/UConfirm';
import uMessage from '@/modules/common/notice/UMessage';
import uMessageBox from '@/modules/common/notice/UMessageBox';
import uPrompt from '@/modules/common/notice/UPrompt';
import RootNotification from '@/libs/utils/Notification';

export function useNotification() {
  const $confirm = uConfirm;
  const $message = uMessage;
  const $prompt = uPrompt;
  const $msgbox = uMessageBox;
  const $notification = RootNotification;

  const $errorMsg = (msg: string) => {
    uMessage({
      type: 'error',
      message: msg,
    });
  };

  const $successMsg = (msg: string) => {
    uMessage({
      type: 'success',
      message: msg,
    });
  };

  return {
    $confirm,
    $message,
    $prompt,
    $msgbox,
    $errorMsg,
    $successMsg,
    $notification,
  };
}
