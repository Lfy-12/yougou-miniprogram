import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    goodsObj: {},
    isCollect: false
  }, 
  GoodsInfo: {},

  onLoad: function (options) {
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },

  async getGoodsDetail(goods_id) {
    const goodsObj = await request({url:"/goods/detail", data: {goods_id}});
    this.GoodsInfo = goodsObj;
    let collect = wx.getStorageSync("collect") || [];
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      isCollect,
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },

  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },

  // 添加商品加入购物车
  handleCartAdd() {
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if(index == -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户 手抖 疯狂点击按钮 
      mask: true
    });
  },

  handleCollect() {
    let isCollect = false;
    const collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex( v => v.goods_id === this.GoodsInfo.goods_id);
    if(index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    wx.setStorageSync("collect", collect);
    this.setData({isCollect})
  }

})