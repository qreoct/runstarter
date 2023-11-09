export type User = {
  id: string;
  photoURL: string;
  name: string;
  age: number;
  gender: string;
  runningGoal: string;
  runningHabit: string;
  friends: string[];
  friendRequests: {
    pending: string[];
    received: string[];
  };
  invitedGames: string[];
};
