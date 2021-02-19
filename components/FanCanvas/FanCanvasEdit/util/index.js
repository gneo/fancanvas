
// 通过 两个点 获取 角度
const getAngle=function (px,py,mx,my){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
  var x = Math.abs(px-mx);
  var y = Math.abs(py-my);
  var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
  var cos = y/z;
  var radina = Math.acos(cos);//用反三角函数求弧度
  var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

  if(mx>px&&my>py){//鼠标在第四象限
      angle = 180 - angle;
  }
  if(mx==px&&my>py){//鼠标在y轴负方向上
      angle = 180;
  }
  if(mx>px&&my==py){//鼠标在x轴正方向上
      angle = 90;
  }
  if(mx<px&&my>py){//鼠标在第三象限
      angle = 180+angle;
  }
  if(mx<px&&my==py){//鼠标在x轴负方向
      angle = 270;
  }
  if(mx<px&&my<py){//鼠标在第二象限
      angle = 360 - angle;
  }
  return angle*Math.PI/180;
}

// 点是否再矩形内
// 计算 |p1 p2| X |p1 p|
function GetCross(p1, p2, p) {
  return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
}
//判断点p是否在p1p2p3p4的正方形内
const IsPointInMatrix = function(p1, p2, p3, p4, p) {
  let isPointIn = GetCross(p1, p2, p) * GetCross(p3, p4, p) >= 0 && GetCross(p2, p3, p) * GetCross(p4, p1, p) >= 0;
  return isPointIn;
}

const IsPointInRect = function(rect,p)
{
  if(p.x>=rect.x&&p.x<=(rect.x+rect.width)&&p.y>rect.y&&p.y<=(rect.y+rect.height))
  {
      return true;
  }
  else
  {
      return false;
  }
} 
module.exports ={
  getAngle,
  IsPointInMatrix,
  IsPointInRect
}