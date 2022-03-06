<template>
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">導覽列</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/index">回前台列表</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products"
              >管理產品列表</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/orders"
              >訂單列表</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view v-if="check"></router-view>
</template>

<script>
// 載入 SweetAlert 彈跳視窗效果套件
import swal from 'sweetalert'

export default {
  data () {
    return {
      check: true
    }
  },
  created () {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    if (token === '') {
      // promise 先跳出提示視窗，按確定後才跳轉回登入頁
      swal('出錯了!', '您尚未登入請重新登入。', 'error')
        .then(() => {
          this.check = false
          this.$router.push('/login')
        })
        .catch(error => {
          console.log(error)
        })
    }
    this.$http.defaults.headers.common.Authorization = token
  }
}
</script>
