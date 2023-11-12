var Sound = require('react-native-sound');
Sound.setCategory('Playback');

const startSound = new Sound(
  'game_start.wav',
  Sound.MAIN_BUNDLE,
  (error: any) => {
    if (error) {
      console.log('failed to load start sound', error);
      return;
    }
  }
);

const pauseSound = new Sound(
  'game_pause.wav',
  Sound.MAIN_BUNDLE,
  (error: any) => {
    if (error) {
      console.log('failed to load pause sound', error);
      return;
    }
  }
);

const resumeSound = new Sound(
  'game_resume.wav',
  Sound.MAIN_BUNDLE,
  (error: any) => {
    if (error) {
      console.log('failed to load resume sound', error);
      return;
    }
  }
);

const endSound = new Sound('game_end.wav', Sound.MAIN_BUNDLE, (error: any) => {
  if (error) {
    console.log('failed to load end sound', error);
    return;
  }
});

const intervalSound = new Sound(
  'game_interval_begin.wav',
  Sound.MAIN_BUNDLE,
  (error: any) => {
    if (error) {
      console.log('failed to load interval sound', error);
      return;
    }
  }
);

const restSound = new Sound(
  'game_rest_begin.wav',
  Sound.MAIN_BUNDLE,
  (error: any) => {
    if (error) {
      console.log('failed to load rest sound', error);
      return;
    }
  }
);

export const playStartSound = () => {
  startSound.play((success: any) => {
    if (success) {
      console.log('successfully finished playing start sound');
    } else {
      console.log('start sound playback failed due to audio decoding errors');
    }
  });
};

export const playPauseSound = () => {
  pauseSound.play((success: any) => {
    if (success) {
      console.log('successfully finished playing pause sound');
    } else {
      console.log('pause sound playback failed due to audio decoding errors');
    }
  });
};

export const playResumeSound = () => {
  resumeSound.play((success: any) => {
    if (success) {
      console.log('successfully finished playing resume sound');
    } else {
      console.log('resume sound playback failed due to audio decoding errors');
    }
  });
};

export const playEndSound = () => {
  endSound.play((success: any) => {
    if (success) {
      console.log('successfully finished playing end sound');
    } else {
      console.log('end sound playback failed due to audio decoding errors');
    }
  });
};

export const playIntervalSound = () => {
  intervalSound.play((success: any) => {
    if (success) {
      console.log('successfully finished playing interval sound');
    } else {
      console.log(
        'interval sound playback failed due to audio decoding errors'
      );
    }
  });
};

export const playRestSound = () => {
  restSound.play((success: any) => {
    if (success) {
      console.log('successfully finished playing rest sound');
    } else {
      console.log('rest sound playback failed due to audio decoding errors');
    }
  });
};
