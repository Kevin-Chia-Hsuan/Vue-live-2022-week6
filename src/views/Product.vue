<template>
  <!-- 單一頁面 -->
  <!-- {{ id }} -->
  <div class="container">
    <div class="row mt-5">
      <div class="col-sm-6">
        <img class="img-fluid" :src="product.imageUrl" alt="" />
      </div>
      <div class="col-sm-6 d-flex flex-column justify-content-between">
        <h2>
          <div class="badge bg-primary rounded-pill">{{ product.title }}</div>
        </h2>
        <h3 class="">商品描述：{{ product.description }}</h3>
        <h3 class="">商品內容：{{ product.content }}</h3>
        <h4 class="text-secondary">
          <del>原價 {{ product.origin_price }} 元</del>
        </h4>
        <div class="h3 text-danger fw-bolder">
          現在只要 {{ product.price }} 元
        </div>

        <div class="input-group">
          <input
            type="number"
            class="form-control"
            v-model.number="qty"
            min="1"
          />
          <button
            type="button"
            class="btn btn-primary"
            @click="addToCart(product.id, qty)"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 載入 SweetAlert 彈跳視窗效果套件
import swal from 'sweetalert'

export default {
  data () {
    return {
      // 讀取效果
      loadingStatus: {
        loadingItem: ''
      },
      id: '',
      product: {},
      status: {},
      modal: '',
      qty: 1
    }
  },
  methods: {
    // 加入購物車方法
    addToCart (id, qty = 1) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`
      this.loadingStatus.loadingItem = id
      const cart = {
        product_id: id,
        qty
      }
      if (cart.qty < 1) {
        swal('出錯了!', '數量必須大於0', 'error')
        this.loadingStatus.loadingItem = ''
      } else {
        this.$http
          .post(url, { data: cart })
          .then(response => {
            if (response.data.success) {
              // alert(response.data.message);
              this.loadingStatus.loadingItem = ''
              swal('成功!', '加入購物車成功', 'success').then(() => {
                // 成功加入購物車後，返回產品列表頁面
                this.$router.push('/products')
              })
              // 成功加入購物車後，清空id，否則按鈕還會是disabled狀態
            } else {
              alert(response.data.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  },
  created () {
    const { id } = this.$route.params
    // console.log(id)
    this.id = id
    const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`
    this.$http.get(url).then(response => {
      // console.log(response.data)
      if (response.data.success) {
        this.product = response.data.product
        // console.log(this.product)
      } else {
        alert(response.data.message)
      }
    })
  }
}
</script>
