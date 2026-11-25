// A derived constructor can call an ordinary function before super() as long as it does not use this.
export class Bird {
  constructor(announce = console.log) {
    announce("I'm a bird. 🦢");
  }
}

export class Flamingo extends Bird {
  constructor(announce = console.log) {
    announce("I'm pink. 🌸");
    super(announce);
  }
}

if (import.meta.main) new Flamingo();
