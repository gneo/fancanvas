// pages/fancanvas/index.js
import {EditCanvas} from './edit'
import {compressImage} from '../../../utils/util.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    size:{
      width:375,
      height:500
    },
    currentPage:1,
    totalPage:1,
    photolist:[],

  },
  confirmWxImageCamera(){
    let list = this.EditCanvas.getPhotoList()
    app.globalData.photographList = []
    app.globalData.photographResultList = list

    console.log('提交数据：',JSON.stringify(list))
 
  },
  resetWxImageCamera(){
    this.chooseWxImageExecute(this.data.currentPage-1)
  },
  chooseWxImageCamera(){
    this.chooseWxImageExecute(-1)
  },
  chooseWxImageExecute(index=-1){
    
    
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['camera'],
      success: function(res) {
        if(res.errMsg==='chooseImage:ok')
        {
          compressImage(res.tempFilePaths[0]).then(res1=>{
            that.addCanvasImage(res1.tempFilePath,index)
          },err=>{
            wx.showToast({
              title: '压缩失败',
              icon:'error'
            })
          })
        }
      }
    })
  },
  addCanvasImage(imageUrl,index,plist=null){
    if(index==-1)
    {
      if(this.data.currentPage===0)
      {
        this.setData({
          totalPage:this.data.totalPage+1,
          currentPage:1
        })
      }else{
        this.setData({
          totalPage:this.data.totalPage+1
        })
      }
      
      this.EditCanvas.addCanvasImage(imageUrl,plist)
    }else{
      this.EditCanvas.editCanvasImage(imageUrl,index,plist)
    }
  },
  resetCanvasImage(index,plist){
    console.log(index,plist)
    this.EditCanvas.resetCanvasImage(index.plist)
  },
  editCanvasImage(imageUrl,index)
  {
    this.EditCanvas.editCanvasImage(imageUrl,index)
  },
  handlerGohomeClick:function(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  bindtouchstart(e){
    if(this.EditCanvas)
    {
      this.EditCanvas.bindtouchstart(e)
    }
  },

  bindtouchmove(e){
    if(this.EditCanvas)
    {
      this.EditCanvas.bindtouchmove(e)
    }
  },
  bindtouchend(e){
    if(this.EditCanvas)
    {
      this.EditCanvas.bindtouchend(e)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let canvasHeight = 500
    wx.getSystemInfo({
      success:function(res){
        const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
        // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
        let navBarHeight = (menuButtonInfo.top - res.statusBarHeight) * 2 + menuButtonInfo.height + res.statusBarHeight;
        if(res.system.indexOf('iOS') !== -1){
          navBarHeight = navBarHeight + 4
        }
        let reverseRatio =  res.windowWidth/750 
        canvasHeight = res.windowHeight-navBarHeight-240*reverseRatio

        that.initCanvasData(canvasHeight)
      }
    })

  },

  initCanvasData(canvasHeight){
    

    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio

        canvas.width = (res[0].width) *dpr
        canvas.height = (canvasHeight) * dpr
        ctx.scale(dpr, dpr)

        let size = {
          width: res[0].width,
          height:canvasHeight,
        }
        this.initEditCanvas(canvas,size)
      })
  },

  initEditCanvas(canvas,size){
    this.EditCanvas = new EditCanvas(canvas,size.width,size.height,(page)=>{
      this.setData({
        currentPage:page+1
      })
    })
    let totalPage = 0;
    let currentPage = 0
    if(app.globalData.photographList&&app.globalData.photographList.length)
    {
      totalPage = app.globalData.photographList.length
    }
    if(totalPage>0)
    {
      currentPage=1
    }else{
      currentPage =0
    }
    this.setData({
      size:size,
      totalPage:totalPage,
      currentPage:currentPage
    })
    this.EditCanvas.startCanvas(app.globalData.photographList)

    // 上传数据 获取节点
    if(app.globalData.photographList&&app.globalData.photographList.length>0){
      this.uploadImageAndrect(app.globalData.photographList[0],0)
    }
  },
  // 上传数据 获取描边 数据
  uploadImageAndrect(filePath,index){
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let customData = app.globalData.customCameraData
    
    if(customData.type==2)
    {
      // 修改
      this.addCanvasImage(customData.tempImagePath,this.data.currentPage-1)
      this.uploadImageAndrect(customData.tempImagePath,this.data.currentPage-1)
    }else if(customData.type==0)
    {
      let totalPage = this.data.totalPage
      // 添加 
      this.addCanvasImage(customData.tempImagePath,-1)
      this.uploadImageAndrect(customData.tempImagePath,totalPage)
    }
    app.globalData.customCameraData={}
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.EditCanvas.destroy()
    this.EditCanvas = null
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})