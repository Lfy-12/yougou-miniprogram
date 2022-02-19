import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  /* 页面的初始数据 */
  data: {
    swiperList: [],
    catesList: [],
    floorList: []
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },

  // 轮播图数据
  getSwiperList () {
    request({url: "/home/swiperdata"})
    .then(res => {
      for(let i=0;i<res.length;i++) {
        res[i].navigator_url = res[i].navigator_url.replace(/main/,'index')
      }
      this.setData({
        swiperList: res
      })
    })
  },

  //导航数据
  getCatesList () {
    request({url: "/home/catitems"})
    .then(res => {
      this.setData({
        catesList: res
      })
    })
  },

  // 楼层数据
  getFloorList () {
    request({url: "/home/floordata"})
    .then(res => {
      for(let i=0;i<res.length;i++) {
        for(let j=0;j<res[i].product_list.length;j++) {
          res[i].product_list[j].navigator_url = res[i].product_list[j].navigator_url.replace(/goods_list/,'goods_list/index')
        }
      }
      this.setData({
        floorList: res
      })
    })
  }

})