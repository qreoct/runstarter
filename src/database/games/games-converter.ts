import type { Game } from './types';

// Firestore data converter
export const gameConverter = {
  toFirestore: (game: Game) => ({
    id: game.id,
    creator: game.creator,
    players: game.players,
    player_names: game.player_names,
    invited: game.invited,
    active: game.active,
    paused: game.paused,
    pauser: game.pauser,
  }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      creator: data.creator,
      players: data.players,
      player_names: data.player_names,
      invited: data.invited,
      active: data.active,
      paused: data.paused,
      pauser: data.pauser,
    };
  },
};
