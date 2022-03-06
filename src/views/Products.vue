<template>
  <div class="container">
    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td style="width: 200px">
            <div
              style="height: 200px; background-size: cover; background-position: center"
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
            ></div>
          </td>
          <td class="fw-bolder">
            {{ item.title }}
          </td>
          <td>
            <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
            <del class="h6 text-secondary" v-if="item.price"
              >原價 {{ item.origin_price }} 元</del
            >
            <div class="h5 text-danger fw-bolder" v-if="item.price">
              現在只要 {{ item.price }} 元
            </div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="getProduct(item)"
              >
                查看更多
              </button>
              <button
                type="button"
                class="btn btn-outline-success"
                @click="addToCart(item.id)"
                :disabled="
                  loadingStatus.loadingItem === item.id || !item.is_enabled
                "
              >
                <div
                  class="spinner-border spinner-border-sm"
                  role="status"
                  v-if="loadingStatus.loadingItem === item.id"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="d-flex justify-content-center mt-5">
    <pagination :page="pagination" @get-product="getProducts"></pagination>
  </div>
</template>

<script>
// 載入 分頁頁碼 元件
import pagination from '@/components/Pagination.vue'
// 載入 SweetAlert 彈跳視窗效果套件
import swal from 'sweetalert'

// scrollTop 需要的 DOM
const tBody = document.querySelector('html,body')

export default {
  data () {
    return {
      // 讀取效果
      loadingStatus: {
        loadingItem: ''
      },
      products: [],
      pagination: {},
      page: ''
    }
  },
  components: {
    pagination
  },
  mounted () {
    // 取得資料、DOM元素
    this.getProducts()
  },
  methods: {
    // 取得產品列表方法
    getProducts (page = 1) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/products?page=${page}`
      this.$http
        .get(url)
        .then(response => {
          if (response.data.success) {
            // console.log(response.data.products)
            this.products = response.data.products
            this.pagination = response.data.pagination
            // console.log(this.pagination)
            // // console.log(tBody);
            tBody.scrollTop = 0
          } else {
            alert(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 加入購物車方法
    addToCart (id, qty = 1) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`
      this.loadingStatus.loadingItem = id
      const cart = {
        product_id: id,
        qty
      }
      this.$http
        .post(url, { data: cart })
        .then(response => {
          if (response.data.success) {
            // alert(response.data.message);
            swal('成功!', '加入購物車成功', 'success')
            // 成功加入購物車後，清空id，否則按鈕還會是disabled狀態
            this.loadingStatus.loadingItem = ''
          } else {
            alert(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 取得單一產品方法，並跳往該產品頁面
    getProduct (item) {
      this.$router.push(`/product/${item.id}`)
    }
  },
  created () {
    // 元件生成，必定會執行的項目
  }
}
</script>
