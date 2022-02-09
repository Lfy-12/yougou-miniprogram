import {
  showModal,
  showToast
} from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address") || {};
    this.setData({
      address
    });

    const cart = wx.getStorageSync("cart").filter(v => v.checked == true) || [];

    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
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

  async handleOrderPay() {
    try {
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      }

      // 3 创建订单
      // 3.1 准备 请求头参数
      // // const header = { Authorization: token };
      // 3.2 准备 请求体参数
      // const order_price = this.data.totalPrice;
      // const consignee_addr = this.data.address.all;
      // const cart = this.data.cart;
      // let goods = [];
      // cart.forEach(v => goods.push({
      //   goods_id: v.goods_id,
      //   goods_number: v.num,
      //   goods_price: v.goods_price
      // }))
      // const orderParams = { order_price, consignee_addr, goods };
      // // 4 准备发送请求 创建订单 获取订单编号
      // const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // // 5 发起 预支付接口
      // const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // // 6 发起微信支付 
      // await requestPayment(pay);
      // // 7 查询后台 订单状态
      // const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      await showToast({ title: "支付成功" });

      // 8 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);
      // 8 支付成功了 跳转到订单页面
      // wx.navigateTo({
      //   url: '/pages/order/index'
      // });
      wx.switchTab({
        url: '/pages/cart/index'
      })
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        mask: true,
        duration: 500
      })
    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }

  }




})