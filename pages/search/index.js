import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    inputValue: '',
    isFocus: false,
    goods: []
  },
  timeID: null,

  handleInput(e) {
    const {value} = e.detail;
    if(!value.trim()) {
      clearTimeout(this.timeID);
      this.setData({
        isFocus: false,
        goods: []
      })
    } 
    else {
      this.setData({
        isFocus: true,
      })
      clearTimeout(this.timeID);
      this.timeID = setTimeout(async () => {
        const res = await request({url: '/goods/qsearch', data: {query: value}})
        this.setData({
          goods: res
        })
      }, 800);
    }
  },

  handleCancel() {
    this.setData({
      inputValue: '',
      isFocus: false,
      goods: []
    })
  }
})