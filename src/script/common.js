import Axios from 'axios';


export default {
  install(Vue, options) {
    Vue.prototype.$axios = Axios
    Vue.prototype.$axiosPOST = function (url, params, succeed) {
      var self = this;
      // Axios.post(url,params).then(function (res) {
      Axios.post(url,params).then(function (res) {
        console.log(res)
        if (res.code === 200 || res.code === 0) {
          succeed(res)
        } else if (res.code === 10005) {
          self.$message({
            type: 'error',
            message: (res.message) + ',即将跳转登陆页',
            duration: 2000
          });
        } else {
          self.$message({
            type: 'error',
            message: res.message,
            dangerouslyUseHTMLString: true
          })
        }
      }).catch(function (err) {
        console.log(err)
      });
    };

    //get 请求
    Vue.prototype.$axiosGet = function (url, params, succeed) {
      var self = this;
      url= url;
      Axios({
        url: url,
        params:params
      }).then(function (res) {
        if (res.code == 200 || res.code==0 || res.code == 10002) {
          succeed(res)
        } else {
          self.$message({
            type:'error',
            message:res.message
          });
        }
      }).catch(function (err) {
        self.$message({
          type:'error',
          message:err
        });
      });
    };

    // 路由跳转
    Vue.prototype.$goRouter = function (path) {
      this.$router.push({
        path: path
      })
    };

    // Vue.prototype.$formatTime = function (e) {
    //     // 计算
    //     var h = 0, i = 0, s = parseInt(e);
    //     if (s > 60) {
    //         i = parseInt(s / 60);
    //         s = parseInt(s % 60);
    //         if (i > 60) {
    //             h = parseInt(i / 60);
    //             i = parseInt(i % 60);
    //         }
    //     }
    //     // 补零
    //     var zero = function (v) {
    //         return (v >> 0) < 10 ? "0" + v : v;
    //     };
    //     return [zero(i), zero(s)].join(":");
    // };
    // 时间戳格式化
    Vue.prototype.$formatDate = function (date, fmt) {
      if (/(y+)/.test(fmt) || /(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'D+': date.getDate(),
        'h+': date.getHours(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
      }
      return fmt
    }

    function padLeftZero (str) {
      return ('00' + str).substr(str.length);
    }
  }
}
