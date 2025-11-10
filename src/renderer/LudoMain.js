import { Renderer } from "./rendering";

export class LudoMain {
  constructor(canvas){
    this.renderer = new Renderer(canvas);
  }

  async init(){
    await this.renderer.init()
    await this.loadGameboard()
  }

  async loadGameboard(){
    await this.renderer.initializeGameboard()
    this.renderer.createInstanceBuffer();
  }



  cleanup(){

  }
}
