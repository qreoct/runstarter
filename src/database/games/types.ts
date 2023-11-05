export type Game = {
  id: string;
  creator: string;
  players: string[];
  player_names: string[];
  invited: string[];
  active: boolean;
  paused: boolean;
  pauser: string;
};
