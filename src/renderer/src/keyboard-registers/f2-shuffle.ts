import { Keyboard } from '../lib/Keyboard';



Keyboard.register({
  key: "F2",
  onPress: async () => {
    await window.api.request("queue.shuffle");

    //todo notify: 'Shuffled'
  }
});