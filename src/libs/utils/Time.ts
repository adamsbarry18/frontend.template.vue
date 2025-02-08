/**
 * Waits for a given duration before resolution
 * @param {number} duration execution duration in milliseconds
 * @returns Promise<void>
 */
export const waitForMilliseconds = async (duration: number): Promise<void> =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
