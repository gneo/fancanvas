
/*
创建之前 设置好小程序的 宽 高 和dpr
const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
})
<canvas type="2d" id="myCanvas"
bindtouchstart="bindtouchstart"
bindtouchmove="bindtouchmove"
bindtouchend="bindtouchend"
style="width: {{size.width}}px; height: {{size.height}}px;top:50px;"></canvas>

如果需要事件  自己传进来 ，垃圾 小程序 不支持 注册事件
**/

class Actor{
  x=0;
  y=0;
  rotate=0;
  isdestroy=false; // 是否需要 父亲删除
  constructor(x=0,y=0){
    this.x = x;
    this.y = y;
  }
  render(ctx){
    // ctx.save();
    // ctx.beginPath();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(rotate)
    // this.roundedRect(ctx,-4,-10,8,20,4);
    // ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
    // ctx.strokeStyle="#60b5b0"
    // ctx.lineWidth = 2
    // ctx.fill();//画实心圆
    // ctx.stroke();
    // ctx.closePath();
    // ctx.restore()
  }
  destroy(){
    this.isdestroy = true;
  }
  getPos(){
    return {x:this.x,y:this.y}
  }
  pos(x,y){
    this.x =x;
    this.y =y;
  }
  touch(point){
    let px = point.x;
    let py = point.y;
    if(px&&py)
    {
      let dx = px-this.x;
      let dy = py - this.y;
      if((dx*dx+dy*dy)<=(100))
      {
        return this
      }
    }
    return null
  }
}

class FanLayer extends Actor{
  actorlist=[]
  touchChildren=false; //子对象 禁止事件
  constructor(){
    super(0,0)
  }
  render(ctx){
    if(!this.isdestroy)
    {
      ctx.save()
      ctx.translate(this.x, this.y);
      this.renderChildren(ctx)
      ctx.restore()
    }
  }

  renderChildren(ctx){
    let list = [];
      for(let sub of this.actorlist)
      {
        if(!sub.isdestroy)
        {
          sub.render(ctx)
          list.push(sub)
        }
      }
      this.actorlist = list;
  }

  touch(spoint){
    let point ={x: spoint.x - this.x,y: spoint.y - this.y}
    if(this.touchChildren)
    {
      let i = this.actorlist.length-1;
      while(i>=0)
      {
        let sub = this.actorlist[i]
        if(sub&&!sub.isdestroy&&sub.touch&&sub.touch(point))
        {
          return sub
        }
        i--
      }
    }else{
      return null
    }
  }

  destroy(){
    this.isdestroy = true;
    this.actorlist =[]
  }
  addChild(actor){
    // 需要有render 方法 才可以 注册进来
    if(actor.render&&actor.destroy)
    {
      this.actorlist.push(actor)
    }else{
      console.log('你至少要有render 和destroy 方法吧 才可以加载进来哦')
    }
  }
  removeChild(actor){
    if(actor)
    {
      actor.destroy()
    }
  }
}

class FanCanvas{
  ctx=null;
  canvas=null;
  onRenderList=[];
  backgroundColor="#ffffff"
  currentActor=null; // 当前选中 的演员
  constructor(canvas,width,height){
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.ctx = canvas.getContext('2d')
    this.initEngine()
  }
  initEngine(){
    //注册事件
    const renderLoop = () => {
      if(this.canvas&&this.ctx)
      {
        try{
          this.onRenderContext(this.ctx)
        }catch(e){
          console.log('渲染挂了，你要细心检查下哦',e)
        }
        this.canvas.requestAnimationFrame(renderLoop)
      }
    }
    this.canvas.requestAnimationFrame(renderLoop)
  }
  destroy(){
    this.canvas = null;
    this.ctx = null;
  }
  onRenderContext(ctx){
    let list = [];
    ctx.beginPath()
    ctx.fillStyle= this.backgroundColor;//填充颜色,默认是黑色
    ctx.fillRect(0, 0,this.width,  this.height)
    ctx.closePath();
    
    for(let sub of this.onRenderList)
    {
      if(!sub.isdestroy)
      {
        sub.render(ctx)
        list.push(sub)
      }
    }
    this.onRenderList = list;
    
  }
  bindtouchstart(e){
    this.startPoint = e.changedTouches[0]
    // 保存 当前 选中的 对象
    let i=this.onRenderList.length-1;
    while(i>=0)
    {
      let sub = this.onRenderList[i]
      if(sub.touch)
      {
        let toucher = sub.touch(this.startPoint)
        //只能 操作一个对象 太多了 我也不知道 怎么设计了
        if(toucher)
        {
          this.currentActor = toucher;
          if(this.currentActor.bindtouchstart)
          {
            this.currentActor.bindtouchstart(this.startPoint)
          }
          break
        }
      }
      i--;
    }
   
  }
  bindtouchmove(e){
    let tpos =  e.changedTouches[0]
    if(this.currentActor&&this.currentActor.bindtouchmove){
      let dx = tpos.x-this.startPoint.x;
      let dy =tpos.y- this.startPoint.y;
      this.startPoint = tpos
      this.currentActor.bindtouchmove({x:tpos.x,y:tpos.y,dx:dx,dy:dy})
    }
  }
  bindtouchend(e){
    this.startPoint = e.changedTouches[0]
    if(this.currentActor&&this.currentActor.bindtouchend){
      this.currentActor.bindtouchend(this.startPoint)
    }
    this.currentActor = null
  }
  addChild(actor){
    // 需要有render 方法 才可以 注册进来
    if(actor.render&&actor.destroy)
    {
      this.onRenderList.push(actor)
    }else{
      console.log('大爷你至少要有render destroy 方法吧 才可以加载进来哦')
    }
  }
  removeChild(actor){
    if(actor)
    {
      actor.destroy()
    }
  }
}


class Res{
  instance=null;
  canvas=null;
  canvasWidth=0;
  canvasHeight=0;
  canvasRatio=1;
  constructor(){

  }
  init(canvas,cw,ch){
    this.canvas =canvas
    this.canvasWidth = cw;
    this.canvasHeight = ch;
    this.canvasRatio = cw/ch
  }
  static I(){
    if(!this.instance)
    {
      this.instance = new Res()
    }
    return this.instance;
  }
  destroy(){
    this.instance = null
  }

  preLoadQueue = [];
  currentLoad = null;
  imageManager={};//已经下载的图片管理器
  registerImage(key,path){
    this.preLoadQueue.push({key:key,path:path})
    this.loadImage()
  }
  registerImages(list)
  {
    // key path 模式
    this.totalImage = list.length
    this.preLoadQueue.push(...list)
    this.loadImage()
  }
  getImage(key)
  {
    return this.imageManager[key]
  }
  loadImage(){
    if(!this.currentLoad&&this.canvas)
    {
      if(this.preLoadQueue.length>0)
      {
        this.progressEvent(this.preLoadQueue.length)
        let item = this.preLoadQueue.pop()
        let img =this.canvas.createImage();//创建img对象
        img.onload = () => {
            this.imageManager[key] = img;
            this.currentLoad = null;
            this.loadImage()
        };
        img.src = item.path;
      }else{
        this.completeEvent()
      }
    }
  }
  progressEvent(residue){
    // {totalImage:this.totalImage,progress:this.totalImage-residue}
    console.log(this.totalImage-progress)
  }
  completeEvent(){
    console.log('多图片加载完成')
  }
}

module.exports = {
  Actor,
  FanLayer,
  FanCanvas,
  Res
}