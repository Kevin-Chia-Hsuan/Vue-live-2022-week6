<template>
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mt-3 mb-3 font-weight-normal">
        請先登入
      </h1>
      <div class="col-8">
        <form id="form" class="form-signin" @submit.prevent="login">
          <div class="form-floating mb-3">
            <input
              type="email"
              v-model="user.username"
              class="form-control"
              id="username"
              placeholder="name@example.com"
              required
              autofocus
            />
            <label for="username">使用者名稱</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              v-model="user.password"
              class="form-control"
              id="password"
              placeholder="Password"
              required
            />
            <label for="password">使用者密碼</label>
          </div>
          <button
            class="btn btn-lg btn-primary w-100 mt-3"
            id="login"
            type="submit"
          >
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted">
      &copy; 2021~∞ - 六角學院
    </p>
  </div>
</template>

<script>
// 載入 SweetAlert 彈跳視窗效果套件
import swal from 'sweetalert'

export default {
  data () {
    return {
      // 一律使用 function return
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 函式的集合
    login () {
      const api = `${process.env.VUE_APP_API}/admin/signin`
      this.$http
        .post(api, this.user)
        .then(res => {
          // console.log(res);
          if (res.data.success) {
            // const token = res.data.token;
            // const expired = res.data.expired;

            // 使用解構手法，因為res.data裡有token及expired
            const { token, expired } = res.data
            // console.log(token, expired)
            // 增加cookie
            document.cookie = `hexToken=${token};expired=${new Date(
              expired
            )}; path=/`
            // window.location = 'index.html'
            this.$router.push('/admin/products')
          } else {
            swal('出錯了!', '登入失敗，請檢查帳號、密碼', 'error')
            this.user.password = ''
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created () {
    // 元件生成，必定會執行的項目
  }
}
</script>
