import {Actor} from './core'

class FanRect extends Actor{
  constructor(x,y,width,height,color="#ffffff"){
    super(x,y);
    this.width = width;
    this.height = height
    this.color =color
  }
  render(ctx){
    // 画方向
    ctx.beginPath();
    ctx.fillStyle=this.color;//填充颜色,默认是黑色
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath()
  }
}

module.exports = {
  FanRect
}