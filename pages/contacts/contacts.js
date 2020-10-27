// pages/contacts/contacts.js
var utils=require('../utils/utils.js');

var app=getApp()

var bus = app.globalData.bus

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前选择导航的字母
    selected:0,
    //选择字母视图滚动的位置id
    scrollIntoView:'A',
    //导航字母
    letters:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z'],
    groups:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    bus.on('contactsPassiveUpdateContacts',(contacts)=>{
      if(contacts){
        let groups = utils.contactsToGroups(contacts)
        this.setData({ConstGroups:groups})
        this.setData({groups:groups})
      }
    })
    const res = wx.getSystemInfoSync(),
    letters = this.data.letters;

    this.setData({ConstGroups:this.data.groups})
    this.setData({
      windowHeight:res.windowHeight,
      windowWidth:res.windowWidth,
      pixelRatio:res.pixelRatio
    })

    const navHeight = this.data.windowHeight * 0.94,
          eachLetterHeight = navHeight /26,
          comTop = (this.data.windowHeight - navHeight)/2,
          temp=[];

    this.setData({
      eachLetterHeight:eachLetterHeight
    })

    for(let i=0,len=letters.length;i<len;i++){
      const x=this.data.windowWidth - (10 + 50) / this.data.pixelRatio,
            y=comTop + (i * eachLetterHeight);
      temp.push([x,y]);
    }

    this.setData({
      lettersPosition:temp
    })

  },

  tabLetter(e){
    console.log(e)
    const index = e.currentTarget.dataset.index;
    this.setData({
      selected:index,
      scrollIntoView:index
    })
    this.cleanAcitvedStatus();
  },

  cleanAcitvedStatus(){
    setTimeout(()=>{
      this.setData({
        selected:0
      })
    },500)
  },

  touchmove(e){
    const x = e.touches[0].clientX,
          y = e.touches[0].clientY,
          lettersPosition = this.data.lettersPosition,
          eachLetterHeight = this.data.eachLetterHeight,
          letters = this.data.letters;
    console.log(y);
    if(x >= lettersPosition[0][0]){
      for(let i=0,len = lettersPosition.length;i<len;i++){
        const _y = lettersPosition[i][1],
              __y = _y + eachLetterHeight;
        if (y>=_y && y<=__y){
          this.setData({
            selected:letters[i],
            scrollIntoView:letters[i]
          })
          break
        }
      }
    }
  },

  touchend(e){
    this.cleanAcitvedStatus();
  },

  search(){
    this.data.groups = utils.localSearch(this.data.ConstGroups,{
      name:this.data.searchText
    })
    this.setData({
      groups:this.data.groups
    })
  },

  wxSearchFn(e){
    this.search()
  },

  wxSearchInput(e){
    let value = e.detail.value;
    this.setData({
      searchText:value
    })
    this.search()
  },

  clickAddUser(e){
    wx.navigateTo({
      url: '../add-contacts/add',
    })
  },

  clickUser(e){
    let user = e.currentTarget.dataset.user
    bus.emit('contactsClickContact',user)
  },

  longUserTap(e){
    let user = e.currentTarget.dataset.user
    console.log(user)
    wx.showActionSheet({
      itemList: ['编辑','添加到手机通讯录','删除'],
      success:function(res){
        if(res.tapIndex==0){
          wx.navigateTo({
            url: '/pages/add-contacts/add?params='+JSON.stringify(user),
          })
        }else if(res.tapIndex==1){
          wx.addPhoneContact({
            nickName:user.name,
            firstName: user.name,
            remark:user.remarks,
            mobilePhoneNumber:user.tel1
          })
        }
        else if(res.tapIndex==2){
          bus.emit('contactsRemoveContact',user)
        }
      }
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
    bus.emit('contactsUpdateGroups').then(groups =>{
      if(groups){
        this.setData({ConstGroups:groups})
        this.setData({groups:groups})
      }
    })

    bus.emit('contactsUpdateContacts').then(contacts =>{
      if(contacts){
        let groups = utils.contactsToGroups(contacts)
        this.setData({ConstGroups:groups})
        this.setData({groups:groups})
      }
    })
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