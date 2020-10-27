var eventBus = require('utils/eventBus.js')
var Pinyin = require('utils/pinyin.js')
var bus = eventBus.eventBus
var contactList = []




bus.on('contactsUpdateContacts', () => {
  console.log('更新联系人列表')
  return new Promise((resolve, reject) => {
    let clist = wx.getStorageSync('contactList')
    //不是数组初始化为数组
    if (Object.prototype.toString.call(clist) != '[object Array]') {
      contactList = []
      wx.setStorageSync('contactList', contactList)
    } else {
      contactList = clist
    }

    resolve(contactList)
  })
})

//点击联系人
bus.on('contactsClickContact', (contact) => {
  console.log('点击联系人', contact)
  var itemList = []
  if (contact.tel1) {
    itemList.push(contact.tel1)
  }
  if (contact.tel2) {
    itemList.push(contact.tel2)
    if (contact.tel3) {
      itemList.push(contact.tel3)
    }
  }

  wx.showActionSheet({
    itemList: itemList,
    success: function (res) {
      var phone = itemList[res.tapIndex]
      //呼叫号码
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  })
})

//保存联系人
bus.on('contactSubmit', (contact) => {
  console.log('保存联系人', contact)
  //增加拼音索引
  let pinyins = Pinyin.parse(contact.name)
  let pyFirst = "" //第一个字符的首字母
  let pyFirstLetter = "" //首字母
  let pinyin = "" //全拼
  for (let i in pinyins) {

    let py = pinyins[i]
    console.log(i, py)
    if (i == 0) {
      //第一个字符
      if (py.type != 2 && py.type != 1) {
        //不为中文
        pyFirst = '#'

      } else {
        pyFirst = py.target.substr(0, 1).toUpperCase()
        pinyin += py.target
        pyFirstLetter += py.target.substr(0, 1).toUpperCase()
      }
    } else {
      if (py.type == 2 || py.type == 1) {
        pinyin += py.target
        pyFirstLetter += py.target.substr(0, 1).toUpperCase()
      }
    }
  }
  contact.pyFirst = pyFirst
  contact.pyFirstLetter = pyFirstLetter
  contact.pinyin = pinyin

  //id存在更新值
  if (contact.id) {
    let index = getObjIndexByArrayOfKV(contactList, "id", contact.id)
    contactList[index] = contact

  } else {
    //新增
    if (contactList.length == 0) {
      contact.id = 1
    } else {
      contact.id = contactList[contactList.length - 1].id + 1
    }

    contactList.push(contact)
  }
  wx.setStorageSync('contactList', contactList)
  
  return new Promise((resolve, reject) => {
    resolve(contact)
  })
})


//删除联系人
bus.on('contactsRemoveContact', (contact) => {
  console.log('删除联系人', contact)

  let index = getObjIndexByArrayOfKV(contactList, "id", contact.id)
  console.log(index)
  contactList.splice(index, 1)
  wx.setStorageSync('contactList', contactList)
  
  bus.emit('contactsPassiveUpdateContacts', contactList)
})
//对象数组，通过对象中的k-v值来返回匹配的第一个对象
function getObjIndexByArrayOfKV(array, key, value) {
  let obj = null
  let i = 0
  if ("object" === typeof (array)) {

    array.every(item => {

      if ("object" === typeof item) {
        if ("undefined" !== typeof item[key]) {
          console.log(item[key], value)
          if (item[key] == value) {
            obj = item
            return false
          }
        }
      }
      i++
      return true
    })
  }
  return i
}


// bus.on('contactsUpdateContacts',()=>{
//   console.log('更新联系人列表')
//   return new Promise((resolve,reject)=>{
//     let clist = wx.getStorageSync('contactList')
//     if(Object.prototype.toString.call(clist) != '[object Array]'){
//       contactList=[]
//       wx.setStorageSync('contactList', contactList)
//     }else{
//       contactList = clist
//     }
//     resolve(contactList)
//   })
// })

// bus.on('contactsClickContact',(contact) =>{
//   console.log('点击联系人',contact)
//   var itemList = []
//   if(contact.tel1){
//     itemList.push(contact.tel1)
//   }
//   if(contact.tel2){
//     itemList.push(contact.tel2)
//   }
//   if(contact.tel3){
//     itemList.push(contact.tel3)
//   }

//   wx.showActionSheet({
//     itemList: itemList,
//     success:function(res){
//       var phone = itemList[res.tapIndex]
//       bus.emit('keypadCallPhone',phone)
//     }
//   })
// })

// bus.on('contactSubmit',(contact)=>{
//   console.log('保存联系人',contact)
//   let pinyins = Pinyin.parse(contact.name)
//   let pyFirst = ""
//   let pyFirstLetter = ""
//   let pinyin = ""
//   for(let i in pinyins){
//     let py = pinyins[i]
//     console.log(i,py)
//     if(i==0){
//       if(py.type !=2 && py.type!=1){
//         pyFirst = '#'
//       }else{
//         pyFirst = py.target.substr(0,1).toUpperCase()
//         pinyin += py.target
//         pyFirstLetter += py.target.substr(0,1).toUpperCase()
//       }
//     }else{
//       if(py.type == 2 || py.type == 1){
//         pinyin += py.target
//         pyFirstLetter += py.target.substr(0,1).toUpperCase()
//       }
//     }
//   }
//   contact.pyFirst = pyFirst
//   contact.pyFirstLetter = pyFirstLetter
//   contact.pinyin = pinyin
//   if(contact.id){
//     let index = getObjectByArrayOfKV(contactList,"id",contact.id)
//     contactList[index] = contact
//   }else{
//     if(contactList.length==0){
//       contact.id==1
//     }else{
//       contact.id = contactList[contactList.length-1].id+1
//     }

//     contactList.push(contact)
//   }
//   wx.setStorageSync('contactList', contactList)
//   return new Promise((resolve,reject) =>{
//     resolve(contact)
//   })
// })

// bus.on('contactRemoveContact',(contact)=>{
//   console.log('删除联系人',contact)
//   let index = getObjectByArrayOfKV(contactList,"id",contact.id)
//   console.log(index)
//   contactList.splice(index,1)
//   wx.setStorageSync('contactList', contactList)
//   bus.emit('contactPassiveUpdateContacts',contactList)
// })

// function getObjectByArrayOfKV(array,key,value){
//   let obj=null
//   let i=0
//   if("object" === typeof(array)){
//     array.every(item=>{
//       if("object" === typeof item){
//         if("undefined" !==typeof item[key]){
//           console.log(item[key],value)
//           if(item[key] == value){
//             obj == item
//             return false
//           }
//         }
//       }
//       i++
//       return true
//     })
//   }
//   return i
// }