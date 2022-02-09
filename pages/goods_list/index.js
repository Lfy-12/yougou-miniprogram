import {request} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
      // tabs栏数据
      tabs: [
        {
          id: 0,
          value: '综合',
          isActive: true
        },
        {
          id: 1,
          value: "销量",
          isActive: false
        },
        {
          id: 2,
          value: "价格",
          isActive: false
        }
      ],
      // 列表数据
      goodsList:[]
  },

  // 列表请求参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 列表总页数
  totalPages: 1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange (e) {
    const index = e.detail
    const {tabs} = this.data
    tabs.map((v,i) => i==index ? v.isActive=true : v.isActive=false)
    this.setData({
      tabs
    })
  },

  // 获取商品列表数据
  async getGoodsList () {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    this.totalPages = Math.ceil(res.total / this.QueryParams.pagesize)
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 数据返回时，关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },

  // 触底事件
  onReachBottom () {
    // 判断还有没有下一页数据
    if(this.totalPages <= this.QueryParams.pagenum) {
      wx.showToast({title: "没有下一页数据"})
    } else {
      this.QueryParams.pagenum += 1;
      this.getGoodsList();
    }
  },

  // 下拉刷新
  onPullDownRefresh () {
    this.setData({
      goodsList: []
    })
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  }



})