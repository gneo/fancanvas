import Fan from '../../../components/FanCanvas/FanCanvasEdit/index'
import {IsPointInRect,getAngle} from '../../../components/FanCanvas/FanCanvasEdit/util/index'

const plistconfig = [{k:4,s:0,e:1},{k:5,s:1,e:2},{k:6,s:2,e:3},{k:7,s:3,e:0}]
const angleslistconfig = [[4,7],[4,5],[5,6],[6,7]]

class TopPoint extends Fan.Actor{
  constructor(){
    super(10,10)
  }
  render(ctx){
    ctx.beginPath();
    ctx.strokeStyle="#60b5b0"
    ctx.lineWidth = 2
    ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
    ctx.arc(this.x,this.y,6,0,360,false);
    ctx.fill();//画实心圆
    ctx.stroke();
    ctx.closePath();
  }
  bindtouchmove(point){
    this.pos(this.x+point.dx,this.y+point.dy)
  }
}

class BgImage extends Fan.FanImage{
  layerWidth;
  layerHeight;
  loadHandle=null
  constructor(src,layerWidth,layerHeight,x=0,y=0,loadHandle)
  {
    super(src,x,y)
    this.loadHandle = loadHandle
    this.layerWidth = layerWidth
    this.layerHeight = layerHeight
  }
  destroy(){
    super.destroy()
    this.loadHandle = null
  }
  loadComplete()
  {
    //  根据 如果 高超出 以高为准  如果宽超出 以宽为准
    let layerRatio = this.layerWidth/this.layerHeight
    let imageRatio = this.cimage.width/this.cimage.height
    if(imageRatio>layerRatio)
    {
      //  以宽为准
      let imageWidth = this.layerWidth
      this.scale = imageWidth/this.cimage.width
      this.width = imageWidth
      this.height =this.cimage.height*this.scale

    }else{
      // 超高 以高为准
      let imageHeight = this.layerHeight;

      this.scale = imageHeight/this.cimage.height
      this.height = imageHeight
      this.width =this.cimage.width*this.scale
    }
 
    if(this.loadHandle)
    {
      this.loadHandle(this.width,this.height)
    }
  }
  bindtouchmove(point){
    this.pos(this.x+point.dx,this.y+point.dy)
  }

  getRect(){
    return {x:this.x,y:this.y,width:this.width,height:this.height}
  }
}
class CanvasDotSprint extends Fan.Actor{
  x=0;
  y=0;
  r=15;
  type=0; //0  四角 1 四边
  constructor(id,type=0)
  {
    super()
    this.id = id
    this.type = type
  }

  render(ctx){
    if(this.type==0)
    {
      ctx.beginPath();
      ctx.arc(this.x,this.y,6,0,360,false);
      ctx.strokeStyle="#60b5b0"
      ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
      ctx.lineWidth = 2
      ctx.fill();//画实心圆
      ctx.stroke();
      ctx.closePath();
    }else{
      // ctx.rotate(Math.PI*2/(2*6));
      ctx.save();
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(getAngle(this.spos.x,this.spos.y,this.epos.x,this.epos.y))
      this.roundedRect(ctx,-4,-10,8,20,4);
      ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
      ctx.strokeStyle="#60b5b0"
      ctx.lineWidth = 2
      ctx.fill();//画实心圆
      ctx.stroke();
      ctx.closePath();
      ctx.restore()
    }
  }

  roundedRect(ctx, x, y, width, height, radius){
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.stroke();
  }
  setAdjoin(spos,epos)
  {
    this.spos = spos;
    this.epos = epos;
  }
  moveDx(dx){
    console.log(dx)
  }
  moveDy(dy){
    console.log(dy)
  }
  touch(point){
    let px = point.x;
    let py = point.y;
    if(px&&py)
    {
      let dx = px-this.x;
      let dy = py - this.y;
      if((dx*dx+dy*dy)<=(this.r*this.r))
      {
        return true
      }
    }
    return false
  }
  pos(x,y){
    this.x = x;
    this.y = y;
  }
  getPos(){
    return {x:this.x,y:this.y}
  }
}
class CanvasLineSprint extends Fan.Actor{
  pointList=[];
  constructor(){
    super()
  }
  render(ctx){
    if(this.pointList&&this.pointList.length>=4)
    {
      let p0=this.pointList[0]
      ctx.beginPath()
      ctx.strokeStyle="#60b5b0"
      ctx.lineWidth = 2
      ctx.moveTo(p0.x, p0.y)
      for(let i=1;i<4;i++)
      {
        let sub = this.pointList[i]
        ctx.lineTo(sub.x, sub.y);
      }
      ctx.lineTo(p0.x, p0.y)
      ctx.stroke()
      ctx.closePath();
    }
  }
  setPointList(list){
    this.pointList = list
  }
}

// 不规则矩形 点quadrilateral
class QuadrilateralLayer extends Fan.FanLayer{
    imageUrl="";
    image = null
    imageW;
    imageH;
    pointList= [];
    canvasList=[];
    plist=[{x:0,y:0},{x:200,y:0},{x:200,y:200},{x:0,y:200},
      {x:0,y:0},{x:100,y:0},{x:100,y:100},{x:10,y:100}]
    linePlistPoint=null;
    //  可点击  
    // image 图片
    // 点list 
    constructor(imageUrl,pointList,x,y,layerWidth,layerHeight){
      // 点没有的情况
      super()
      this.imageUrl = imageUrl;
      this.pointList = pointList;
      this.x = x;
      this.y = y;
      this.layerWidth = layerWidth;
      this.layerHeight = layerHeight;
      this.initLayer();
    }
    initLayer(){
      this.touchChildren = true
      this.image = new BgImage(this.imageUrl,this.layerWidth,this.layerHeight,0,0,this.initPlist.bind(this))
      this.addChild(this.image)
    }
    //  获取 数据
    getResultData(){
      // [{"filePath":"","rect":[{"x":1,"y":2},{"x":1,"y":2},{"x":1,"y":2},{"x":1,"y":2}],"name":""},{"filePath":"","rect":[{"x":1,"y":2},{"x":1,"y":2},{"x":1,"y":2},{"x":1,"y":2}],"name":""}]
      let data ={}
      data.filePath = this.imageUrl;
      data.rect = this.getResultRect()
      data.name = '1'
      return data
    }
    getResultRect(){
      let list = []
      let imageScale = this.image.scale
      for(let i=0;i<4;i++)
      {
        let dot = this.canvasList[i]
        list.push({x:dot.x/imageScale,y:dot.y/imageScale})
      }
      return list;
    }
    loadImage(imageUrl,pointList=null){
      this.imageUrl = imageUrl;
      this.pointList = pointList
      if(this.image)
      {
        this.actorlist = []
        this.addChild(this.image)
        this.image.loadImage(imageUrl)
      }
    }
    resetImagePlist(pointList){
      this.pointList = pointList
      console.log(pointList)
      if(this.image)
      {
        this.actorlist = []
        this.addChild(this.image)
        this.initPlist(this.imageW,this.imageH)
      }

    }
    // 重新 加载图片 路径 和 可编辑 坐标
    initPlist(imageW,imageH){
      let plist = []
      this.imageW = imageW;
      this.imageH = imageH;
      if(this.pointList&&this.pointList.length>=4)
      {
        
        let imageScale = this.image.scale
        for(let sub of this.pointList)
        {
          plist.push({x:sub[0]*imageScale,y:sub[1]*imageScale})
        }
        console.log(imageW,imageH,imageScale,plist)

      }else{
        plist.push({x:0,y:0},{x:imageW,y:0},{x:imageW,y:imageH},{x:0,y:imageH})
      }
      

      for(let i=0;i<4;i++)
      {
        let cfg = plistconfig[i]
        plist[cfg.k] = this.getCenterPlist(cfg,plist)
      }
      this.plist = plist

      this.linePlistPoint = new CanvasLineSprint()
      this.addChild(this.linePlistPoint)

      this.canvasList = []
      let len = plist.length
      for(let i=0;i<len;i++ )
      {
        let cell = new CanvasDotSprint(i,i>=4?1:0)
        let sub = plist[i]
        cell.pos(sub.x,sub.y)
        this.canvasList.push(cell)
        this.addChild(cell)
      }

      this.onRenderPlist()
    }
    checkRangeX(x,r=0){
   
      if((x+r)<=this.imageW&&(x-r)>=0)
      {
        return true
      }else{
        return false
      }
    }
    checkRangeY(y,r=0){
      if((y+r)<=this.imageH&&(y-r)>=0)
      {
        return true
      }else{
        return false
      }
    }

    bindtouchmove(spoint)
    {
      if(this.currentSprint)
      {
        let plist = this.plist;
        if(this.currentSprint.type===0)
        {
          // 设置 dx dy
          let dx = spoint.dx;
          let dy = spoint.dy;
          if(!this.checkRangeX(this.currentSprint.x + spoint.dx))
          {
            dx = 0
          }
          if(!this.checkRangeY(this.currentSprint.y + spoint.dy))
          {
            dy = 0
          }
          
          this.currentSprint.pos(this.currentSprint.x +dx,this.currentSprint.y + dy)
          this.onRenderPlist()
        }else if(this.currentSprint.type===1)
        {
          this.onRenderBorderList(spoint)
        }
      }
    }
    // 检查 更新边的时候
    onRenderBorderList(spoint){
      let dx = spoint.dx;
      let dy = spoint.dy;
      let cx = this.currentSprint.x
      let cy = this.currentSprint.y
      let cfg = plistconfig[this.currentSprint.id-4]
      let startitem = this.canvasList[cfg.s]
      let enditem = this.canvasList[cfg.e]
      let spos = startitem.getPos()
      let epos = enditem.getPos()
      if(this.checkRangeX(spos.x+dx)&&this.checkRangeX(epos.x+dx)){
      }else{
        dx =0
      }
      if(this.checkRangeY(spos.y+dy)&&this.checkRangeY(epos.y+dy)){
      }else{
        dy = 0
      }
      this.currentSprint.pos(cx+dx,cy+dy)

      startitem.pos(spos.x+dx,spos.y+dy)
      enditem.pos(epos.x+dx,epos.y+dy)
      this.onRenderPlist()
    }

    onRenderPlist(){
      // 重绘  四边
      let linePoint = []
      for(let i=0;i<4;i++)
      {
        let cfg = plistconfig[i]
        let start = this.canvasList[cfg.s]
        let end = this.canvasList[cfg.e]
        let point= {x:(start.x+end.x)/2,y:(start.y+end.y)/2}
        this.canvasList[cfg.k].pos(point.x,point.y)
        this.canvasList[cfg.k].setAdjoin(start.getPos(),end.getPos())
        let linepoint = this.canvasList[i]
        linePoint.push(linepoint.getPos())
      }
      if(this.linePlistPoint)
      {
        this.linePlistPoint.setPointList(linePoint)
      }
    }

    getCenterPlist(cfg,plist){
      let start = plist[cfg.s]
      let end = plist[cfg.e]
      return {x:(start.x+end.x)/2,y:(start.y+end.y)/2}
    }
    // 是否需要渲染 根据 x判断
    isRenderRect(sx){
      //  只需要 渲染 前后 两个模块
      let canvasWidth =Fan.Res.I().canvasWidth
      sx = Math.abs(sx)
      if(sx<(this.x + canvasWidth)&&sx>(this.x-canvasWidth))
      {
        return true
      }else{
        return false
      }
    }
    destroy(){
      super.destroy()
      this.canvasList = []
      this.linePlistPoint = null

    }
    touch(point)
    {
      let item = super.touch(point)
      if(item)
      {
        this.currentSprint = item
        return this
      }
      // 自己不能被选中
      return null
    }
}

class ScrollPanel extends Fan.FanLayer{
  width=100;
  height=100;
  sceneWidth=100;
  scrollx = 0;
  pageWidth=100;
  pageCount=1;
  targetX =0;
  isTween=false;
  moveStep = 10;
  step=1;
  fanCanvas;
  constructor(fanCanvas){
      super()
      this.fanCanvas = fanCanvas
  }
  destroy(){
    super.destroy()
    this.fanCanvas =null
  }
  setPanelInfo(pageWidth,height,sceneWidth,pageCount=1)
  {
    this.width = pageWidth*pageCount;
    this.height = height;
    this.sceneWidth = sceneWidth;
    this.pageCount = pageCount
    this.pageWidth = pageWidth
    this.scrollx = sceneWidth-this.width
  }

  setEndPage(){
    this.isTween = false;
    this.x = -(this.pageCount-1) * this.pageWidth
    this.fanCanvas.changePage(this.pageCount-1)
  }
  // isRenderRect
  renderChildren(ctx){
    let list = [];
    // 画背景
    ctx.beginPath();
    ctx.fillStyle="#000000";//填充颜色,默认是黑色
    ctx.fillRect(0, 0, this.width||this.pageWidth, this.height);
    ctx.closePath()
    for(let sub of this.actorlist)
    {
      if(!sub.isdestroy)
      {
        if(sub.isRenderRect&&sub.isRenderRect(this.x))
        {
          sub.render(ctx)
        }
        list.push(sub)
      }
    }
    this.actorlist = list;
  }
  getRect(){

    // 一屏 一个 栏目 ，过30%分
    return {x:this.x,y:this.y,width:this.width,height:this.height}
  }
  bindtouchstart(point)
  {
    // 停在 缓动
    this.startPoint = {x:this.x,y:this.y};
    this.isTween = false;
  }
  bindtouchend(point)
  {
    // 当前 也 过了 20% 就切换
    if(Math.abs(this.startPoint.x-this.x)>=(this.pageWidth*0.2))
    {
      let currentPage = Math.round(this.startPoint.x /this.pageWidth)
      // 切换
      if(this.x>this.startPoint.x)
      {
        if(Math.abs(currentPage)>=1)
        {
          this.targetX=(currentPage+1)*this.pageWidth;
        }else{
          this.targetX=currentPage*this.pageWidth;
        }
      }else{
        if(Math.abs(currentPage)<this.pageCount)
        {
          this.targetX=(currentPage-1)*this.pageWidth;
        }else{
          this.targetX=currentPage*this.pageWidth;
        }
      }
      this.isTween = true;
    }else{
      let currentPage = Math.round(this.startPoint.x /this.pageWidth)
      this.targetX=currentPage*this.pageWidth;
      this.isTween = true;
    }
    
  }
  Itick(){
    if(this.isTween)
    {
      let dx = this.targetX-this.x
      if(Math.abs(dx)>20)
      {
        let maxx = 0
        if(dx>0)
        {
          maxx = Math.max(dx*0.4,20)
        }else{
          maxx = Math.min(dx*0.4,-20)
        }
        this.x = maxx + this.x
      }else{
        this.isTween = false;
        this.x = this.targetX
        let currentPage =Math.abs(Math.round(this.x /this.pageWidth)) 
        this.fanCanvas.changePage(currentPage)
      }
    }
  }
  bindtouchmove(point){
    // 只能横向移动
    let tempx = this.x+point.dx
    if(tempx>0)
    {
      this.x = 0
    }else if(tempx<=this.scrollx){
      this.x = this.scrollx
    }else{
      this.x = tempx
    }
  }

  touch(point)
  {
    let item = super.touch(point)
    if(item)
    {
      return item
    }else{
       // 判断自己有没有选中
      if(IsPointInRect(this.getRect(),point))
      {
        return this;
      }else{
        return null
      }
    }
    return null
  }
}


class EditCanvas extends Fan.FanCanvas{
  ItickList=[]
  intervalVal ;
  photographList = []
  changePageEvent;
  constructor(canvas,width,height,changePageEvent){
    super(canvas,width,height)
    Fan.Res.I().init(canvas,width,height)
    this.changePageEvent = changePageEvent
    this.initEvent()
  }
  initEvent(){
    this.intervalVal = setInterval(this.ItickExecute.bind(this),30)
  }
  changePage(page){
    if(this.changePageEvent)
    {
      this.changePageEvent(page)
    }
  }
  destroy(){
    super.destroy()
    this.changePageEvent = null
    clearInterval(this.intervalVal)
  }
  ItickExecute(){
    for(let sub of this.ItickList)
    {
      if(sub.Itick)
      {
        sub.Itick()
      }
    }
  }

  // 获取 当前图片 
  getPhotoList(){
    let list = []
    for(let sub of this.ScrollLayer.actorlist)
    {
      if(sub.imageUrl)
      {
        list.push(sub.getResultData())
      }
    }
    return list
  }
  //  获取 图片数量
  getPhotoNum(){
    if(this.ScrollLayer&&this.ScrollLayer.actorlist)
    {
      return this.ScrollLayer.actorlist.length
    }else{
      return 0
    }
    
  }

  editCanvasImage(imageUrl,index,plist=null)
  {
    // 重新上传 image
    let quadLayer = this.ScrollLayer.actorlist[index]
    if(quadLayer&&quadLayer.image)
    {
      quadLayer.loadImage(imageUrl,plist)
    }

  }
  resetCanvasImage(index,plist){
    // 重新上传 image
    let quadLayer = this.ScrollLayer.actorlist[index]
    if(quadLayer&&quadLayer.image)
    {
      quadLayer.resetImagePlist(plist)
    }
  }

  addCanvasImage(imageUrl,plist=null)
  {
    // 清理 渲染 list  和 tick list
    this.photographList.push(imageUrl)
    let len = this.photographList.length
    // this.ScrollLayer.width = this.width*len;
    // this.ScrollLayer.height = this.height;
    this.ScrollLayer.setPanelInfo(this.width,this.height,this.width,len)
    let quadLayer = new QuadrilateralLayer(imageUrl,plist,this.width*(len-1)+50,30,this.width-100,this.height-60)
    this.ScrollLayer.addChild(quadLayer)
    this.ScrollLayer.setEndPage()
  }
  
  startCanvas(list){
    this.photographList = list
    let layer1 = new ScrollPanel(this)
    layer1.width = this.width*2;
    layer1.height = this.height;
    layer1.setPanelInfo(this.width,this.height,this.width,list.length)
    for(let i=0,len=list.length;i<len;i++)
    {
      let sub = list[i]
      let quadLayer = new QuadrilateralLayer(sub,null,this.width*i+50,30,this.width-100,this.height-60)
      layer1.addChild(quadLayer)
    }
    this.addChild(layer1)
    layer1.touchChildren = true
    this.ItickList.push(layer1)
    this.ScrollLayer = layer1
  }
}

module.exports = {
  EditCanvas
}

