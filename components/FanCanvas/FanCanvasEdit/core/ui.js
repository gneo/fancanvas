import {Actor,Res} from './core'
class FanImage extends Actor{
  src=''
  cimage=null
  width=0;
  height=0;
  scale = 1;
  rotate= 0;
  constructor(src,x=0,y=0){
    super(x,y)
    this.src=src;
    if(this.src)
    {
      this.loadImage(this.src)
    }
  }
  loadImage(src){
    let img =Res.I().canvas.createImage();//创建img对象
    img.onload = () => {
          //img.complete表示图片是否加载完成，结果返回true和false;
          if(!this.width)this.width = img.width;
          if(!this.height)this.height = img.height;
          this.cimage = img
          this.loadComplete()
    };
    img.src = src;
  }
  loadComplete(){

  }
  render(ctx){
    // context.drawImage(image, dx, dy)
    // context.drawImage(image, dx, dy, dw, dh)
    // context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    if(this.cimage)
    {
      ctx.save()
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotate)
      ctx.drawImage(this.cimage,0,0,this.cimage.width*this.scale,this.cimage.height*this.scale)
      ctx.restore()
    }
  }
}

module.exports = {
  FanImage
}