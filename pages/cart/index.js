import { showModal, showToast } from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    address: {},
    cart: [],
    allChecked: true,
    totalPrice: 0,
    totalNum: 0
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address") || {};
    this.setData({ address });

    const cart = wx.getStorageSync("cart") || [];
    this.setCart(cart);
  },

  // 获取地址
  handleChooseAddress() {
    wx.chooseAddress({
      success: (address) => {
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        wx.setStorageSync("address", address);
      },
      fail: (err) => {
        console.log(err);
      }
    });
  },

  // 重置底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = cart.length;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if(v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    this.setData({ cart, allChecked, totalPrice, totalNum })
    wx.setStorageSync("cart", cart);
  },

  // 选中商品
  handeItemChange(e) {
    const id = e.currentTarget.dataset.id;
    const { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id == id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    const id = e.currentTarget.dataset.id;
    const operation = e.currentTarget.dataset.operation;
    const { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id == id);
    if (cart[index].num == 1 && operation == -1) {
      let res = await showModal({content: "确定删除该商品吗"});
      if (res.confirm) {
        cart.splice(index, 1);
      }
    } else {
      cart[index].num += operation;
    }
    this.setCart(cart);
  },

  // 底部工具栏 全选
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  async handlePay() {
    const {address, totalNum } = this.data;
    if(totalNum == 0) {
      await showToast({title: '您还没添加商品'})
      return
    }
    if(!address.userName) {
      await showToast({title: '您还没选择收货地址'})
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }









})