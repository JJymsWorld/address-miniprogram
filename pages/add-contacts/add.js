// pages/add-contacts/add.js
import Toast from '../../dist/toast/toast';
import Page from '../../common/page';

var config = require('./config')

var app = getApp()
var bus = app.globalData.bus

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config,
    name:'',
    tel1:'',
    tel2:'',
    tel3:'',
    remarks:'',
    contact:{}
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //这里是带参数跳转，如果是已经存在的联系人点击编辑跳转这里直接填入信息

    if(options.params && options.params.length>0){
      console.log(options.params)
      let contact = JSON.parse(options.params)
      // console.log(contact)
      if(contact.name){
        this.setData({
          name:contact.name
        })
      }
      if(contact.tel1){
        this.setData({
          tel1:contact.tel1
        })
      }
      if(contact.tel2){
        this.setData({
          tel2:contact.tel2
        })
      }
      if(contact.tel3){
        this.setData({
          tel3:contact.tel3
        })
      }
      if(contact.remarks){
        this.setData({
          remarks:contact.remarks
        })
      }
      // 遍历 初始化表单值
      // for(let key in contact){
      //   console.log(key)
      //   let item = this.data.config.form[key]
        
      //   if(item){
      //     item.value = contact[key]
      //   }
      // }
      this.setData({
        config:this.data.config
      })
      //表单的值
      this.data.contact = contact 
      
    }
    console.log(this.data.contact)
  },


  

  nameChange:function(e){
    
    
    
    this.setData({
      name:e.detail
    })
    this.data.contact['name'] = e.detail
    console.log('[field change]',this.data.contact)
    
  },
  tel1Change:function(e){
    
    this.setData({
      tel1:e.detail
    })
    this.data.contact['tel1'] = e.detail
    console.log('[field change]',this.data.contact)
  },
  tel2Change:function(e){
    this.setData({
      tel2:e.detail
    })
    this.data.contact['tel2'] = e.detail
    console.log('[field change]',this.data.contact)
  },
  tel3Change:function(e){
   
    this.setData({
      tel3:e.detail
    })
    this.data.contact['tel3'] = e.detail
    console.log('[field change]',this.data.contact)
  },
  remarksChange:function(e){
    this.setData({
      remarks:e.detail
    })
    this.data.contact['remarks'] = e.detail
    console.log('[field change]',this.data.contact)
  },
  //清空输入
  clearInput:function(){
    this.setData({
      value:''
    })
  },

    //表单提交以及格式判断
  formSubmit(event){
    console.log('[field submit]',event.detail.value)
    let form = event.detail.value
    if(!form.name||form.name.length===0){
      Toast({
        message:'请输入姓名',
        type:'fail'
        
      })
      return 
    }
    form.name = form.name.trim()
    if(!form.tel1 || form.tel1.length ===0){
      Toast({
        message:'请输入手机号',
        type:'fail'
      })
      return
    }
    if (!(/\d+$/.test(form.tel1))){
      Toast({
        message:'手机号1格式不正确',
        type:'fail'
      })
      return
    }
    if (form.tel2 && !(/^1[34578]\d{9}$/.test(form.tel2))){
      Toast({
        message:'手机号2格式不正确',
        type:'fail'
      })
    }
    if (form.tel3 &&  !(/^1[34578]\d{9}$/.test(form.tel3))){
      Toast({
        message:'手机号3格式不正确',
        type:'fail'
      })
    }
    //发送提交请求，调用添加联系人的函数
    bus.emit('contactSubmit', this.data.contact).then(data=>{
      console.log('data',data)
      
      if(data){
        wx.navigateBack()
      }
      
    })
    
  },


  formReset(event){
    console.log('[field reset]',event)
  },

  //点击保存到手机功能
  clickSaveToPhone(e){
    console.log(this.data.tel1)
    wx.addPhoneContact({
      firstName: this.data.name,
      nickName:this.data.name,
      remark:this.data.remarks,
      mobilePhoneNumber:this.data.tel1
    })
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