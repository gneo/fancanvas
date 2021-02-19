const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function checkPhoneNum(phoneNumber) {
  let str = /^1\d{10}$/
  if (str.test(phoneNumber)) {
    return true
  } else {
    // wx.showToast({
    //   title: '手机号不正确',
    //   icon: 'error'
    // })
    return false
  }
}

// 邮箱验证部分
function inputemail(e) {
  let email = e.detail.value
  let checkedNum = checkEmail(email)
  return checkedNum
}

function checkEmail(email) {
  let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (str.test(email)) {
    return true
  } else {
    wx.showToast({
      title: '请填写正确的邮箱号',
      icon: 'error'
    })
    return false
  }
}

 function dict2Indexes(list, key) {
  // list.children 通过数据字典 构建起索引
  let arr = [...list]
  let dict = {}
  let sub
  while (arr.length > 0) {
    sub = arr.pop()
    if (sub.children && sub.children.length > 0) {
      arr.push(...sub.children)
    } else {
      sub.children = null
    }

    dict[sub.code] = sub
  }
  return dict
}
function matchFileSuffixType (fileName) {
    // 后缀获取
    var suffix = ''
    // 获取类型结果
    var result = ''
    try {
      var flieArr = fileName.split('.')
      suffix = flieArr[flieArr.length - 1]
    } catch (err) {
      suffix = ''
    }
    // fileName无后缀返回 false
    if (!suffix) {
      result = false
      return result
    }
    // 图片格式
    var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
    // 进行图片匹配
    result = imglist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'image'
      return result
    }
    // 匹配txt
    var txtlist = ['txt']
    result = txtlist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'txt'
      return result
    }
    // 匹配 excel
    var excelist = ['xls', 'xlsx']
    result = excelist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'excel'
      return result
    }
    // 匹配 word
    var wordlist = ['doc', 'docx']
    result = wordlist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'word'
      return result
    }
    // 匹配 pdf
    var pdflist = ['pdf']
    result = pdflist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'pdf'
      return result
    }
    // 匹配 ppt
    var pptlist = ['ppt']
    result = pptlist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'ppt'
      return result
    }
    // 匹配 视频
    var videolist = ['mp4', 'm2v', 'mkv']
    result = videolist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'video'
      return result
    }
    // 匹配 音频
    var radiolist = ['mp3', 'wav', 'wmv']
    result = radiolist.some(function (item) {
      return item == suffix
    })
    if (result) {
      result = 'radio'
      return result
    }
    // 其他 文件类型
    result = 'other'
    return result
  }

  

//  压缩 

function logFileSize(tempFilePath){
  wx.getFileInfo({
    filePath: tempFilePath,  
    success: (res)=>{
      console.log(res)
    }
  })

}

function compressImage(tempFilePath){
  let that= this
  let promise = new Promise(function (resolve, reject) {
    wx.getFileInfo({
      filePath: tempFilePath,  
      success: (res)=>{
        if(res.size>=4194304)
        {
          console.log(res)
          wx.compressImage({
            src: tempFilePath, // 图片路径
            success:res1=>{
              console.log(res1)
              resolve(res1)
            },
            fail:err=>{
              reject(err)
            }
          })
        }else{
          resolve({tempFilePath:tempFilePath})
        }
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
  return promise
}

module.exports = {
  formatTime,
  checkPhoneNum,
  dict2Indexes,
  matchFileSuffixType,
  compressImage
}