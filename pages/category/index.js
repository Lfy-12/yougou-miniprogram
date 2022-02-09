import {request} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  Cates: [],

  onLoad: function (options) {
     /* 
      web中的本地存储 和 小程序中的本地存储的区别
          (1) 写代码的方式不一样了 
            1. web: localStorage.setItem("key","value") localStorage.getItem("key")
            2. 小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");

          (2) 存的时候 有没有做类型转换
            1. web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
            2. 小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
     */

    /*
      1 先判断一下本地存储中有没有旧的数据
        {time:Date.now(),data:[...]}
      2 没有旧数据 直接发送新请求 
      3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */

    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync("cates")
    // 2 判断
    if(!Cates) {
      // 不存在  发送请求获取数据
      this.getCates()
    } else {
      if(Date.now() - Cates.time > 1000*10 ) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

    async getCates () {
    // request({url: "/categories"})
    // .then(res => {
    //   this.Cates = res.data.message;
    //   wx.setStorageSync("cates", {time:Date.now(), data: this.Cates})
    //   let leftMenuList  = this.Cates.map(v => v.cat_name);
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    const res = await request({url: "/categories"});
    this.Cates = res
    wx.setStorageSync("cates", {time:Date.now(), data: this.Cates})

    let leftMenuList  = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children

    this.setData({
      leftMenuList,
      rightContent
    })


  },

  handleItemTap (e) {
    const {index} = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }

})