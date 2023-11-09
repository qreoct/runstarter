import type { AxiosError } from 'axios';
import { showMessage } from 'react-native-flash-message';

// for onError react queries and mutations
export const showError = (error: AxiosError) => {
  console.log(JSON.stringify(error?.response?.data));
  const description = extractError(error?.response?.data).trimEnd();

  showMessage({
    message: 'Error',
    description,
    type: 'danger',
    duration: 4000,
    icon: 'danger',
  });
};

export const showErrorMessage = (message: string = 'Something went wrong ') => {
  showMessage({
    message,
    type: 'danger',
    duration: 4000,
  });
};

export const extractError = (data: unknown): string => {
  if (typeof data === 'string') {
    return data;
  }
  if (Array.isArray(data)) {
    const messages = data.map((item) => {
      return `  ${extractError(item)}`;
    });

    return `${messages.join('')}`;
  }

  if (typeof data === 'object' && data !== null) {
    const messages = Object.entries(data).map((item) => {
      const [key, value] = item;
      const separator = Array.isArray(value) ? ':\n ' : ': ';

      return `- ${key}${separator}${extractError(value)} \n `;
    });
    return `${messages.join('')} `;
  }
  return 'Something went wrong ';
};

// Turns a unix epoch timestamp into relative time string
export function timeSince(timeStamp: number) {
  var now = new Date(),
    secondsPast = Math.round((now.getTime() - timeStamp) / 1000);
  if (secondsPast < 60) {
    return secondsPast + 's';
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} min`;
  }
  if (secondsPast <= 86400) {
    return `${Math.floor(secondsPast / 3600)} h`;
  }
  if (secondsPast <= 2628000) {
    return `${Math.floor(secondsPast / 86400)} day`;
  }
  if (secondsPast <= 31536000) {
    return `${Math.floor(secondsPast / 2628000)} mo`;
  }
  if (secondsPast > 31536000) {
    return `${Math.floor(secondsPast / 31536000)} y`;
  }
}

export const generateProfilePicture = (name: string) => {
  // generate integer from 0-6 based on name
  const num = name
    .split('')
    .map((char) => char.charCodeAt(0))
    .reduce((acc, curr) => acc + curr, 0);

  return `https://storage.googleapis.com/runsquad-images/${num % 6}.png`;
};
