const yd = getApp().globalData
function getCurrentPageUrl(options, absolute = true) {
	var pages = getCurrentPages()    //获取加载的页面
	var currentPage = pages[pages.length - 1]    //获取当前页面的对象
	var url = currentPage.route    //当前页面url
	var path = url
	if (absolute) {
		path = absolute && url.substr(0, 1) != '/' ? '/' + url : url
	}
	if (options && currentPage.options) {
		var param = ''
		for (var i in currentPage.options) {
			param += (param ? '&' : '') + i + '=' + encodeURIComponent(currentPage.options[i])
		}
		path += param ? '?' + param : ''
	}
	return path
}

Component({
  /**
   * 页面的初始数据
   */
  data: {
    formid: undefined
  },
	properties: {
		upload: {
			type: Boolean,
			value: true
		}
	},
	methods: {
		collectFromid(e) {
      let that = this
			const formid = e.detail.formId
			const path = getCurrentPageUrl(true, false)
      that.data.formid = e.detail.formId
			this.triggerEvent('collect', {
				formid,
				path
			})

			if (
				this.data.upload === false ||
				formid == undefined ||
				formid == 'the formId is a mock one'
			) {
				return
			}
			let data = {
				formid,
				path
			}
      if (!wx.getStorageSync('token')){
        return
      }
      yd.ajax({
        method: 'POST',
        url: yd.api.getUrl(`/user/obtainFormId/${that.data.formid}`,'app'),
        header: {
          'token': wx.getStorageSync('token')
        }
      })

		}
	}
})