# 多张图不规则四边形裁剪
```
本项目是微信小程序项目
微信小程序无法对不规则的图片进行，投影展平
该模块只进行标记作用
主要用于ocr 拍照时，手机不水平时，提供标记的作用
```
# 效果图：
![RUNOOB 图标](http://qp-tiku-test.oss-cn-beijing.aliyuncs.com/png/5fe0403e-5631-4fc3-a6db-da0702c83760.png)

## 进入页面时，预选添加图片
```
const app = getApp()
app.globalData.photographList = [图片地址]
```
## 点击确认时：
```
调用页面 该方法
confirmWxImageCamera

app.globalData.photographResultList //数据存在 给下一个页面使用
数据结构
[
  {
    "filePath":"http://tmp/Qgc9N2od0mHa56034180f0b0d05461905fbd6f6ba8ce.jpg",
    "name":"1",
    "rect":[{"x":55.05882352941177,"y":296.47058823529414},
    {"x":795.2941176470588,"y":321.88235294117646},
    {"x":744.4705882352941,"y":2011.764705882353},
    {"x":76.23529411764706,"y":2016}]
  }
]

```
### 第一次提交项目 请多多支持。
### 作者邮箱:gfc56@126.com
### 作者昵称：凡冲君