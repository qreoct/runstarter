// hash user name into a profile picture hosted on storage
export const generateProfilePicture = (name: string) => {
  const num = name
    .split('')
    .map((char) => char.charCodeAt(0))
    .reduce((acc, curr) => acc + curr, 0);

  return `https://storage.googleapis.com/runsquad-images/${num % 6}.png`;
};
