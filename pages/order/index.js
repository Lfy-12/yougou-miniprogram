import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    orders: [],
    tabs: [
      {id:1, value:"全部", isActive:true},
      {id:2, value:"待付款", isActive:false},
      {id:3, value:"待发货", isActive:false},
      {id:4, value:"退款/退货", isActive:false}
    ]
  },

  onShow() {
    const token = wx.getStorageSync("token");
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
    }
    // 【获取参数】
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面 
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const {type} = currentPage.options;
    // 4 激活选中页面标题 当 type=1 index=0 
    this.changeTitleByIndex(type-1);
    // 5 获取订单列表
    this.getOrders(type);
  },

  changeTitleByIndex(index) {
    let {tabs} = this.data;
    tabs.forEach( (v,i) => i===index ? v.isActive=true : v.isActive=false )
    this.setData({ tabs })
  },

  async getOrders(type) {
    // const res = await request({ url:"/my/orders/all", data: { type }})
    // this.setData({
    //   orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    // })
  },

  handleTabsItemChange (e) {
    // 1 获取被点击的标题索引
    const index = e.detail;
    this.changeTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index+1);
  }

})