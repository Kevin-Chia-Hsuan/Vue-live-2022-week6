<template>
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openModal('new')">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            圖片
          </th>
          <th width="120">
            分類
          </th>
          <th>產品名稱</th>
          <th width="120">
            原價
          </th>
          <th width="120" class="price">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td><img :src="item.imageUrl" class="img-fluid" /></td>
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">
            {{ item.origin_price }}
          </td>
          <td class="text-end">
            {{ item.price }}
          </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', item)"
              >
                刪除
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
  <user-product-modal
    :product="tempProduct"
    @update-product="updateProduct"
    ref="userProductModal"
  >
  </user-product-modal>
  <del-product-modal
    :temp-product="tempProduct"
    @del-product="delProduct"
    ref="delProductModal"
  >
  </del-product-modal>
</template>

<script>
// 區域註冊: 載入新增、編輯產品 Modle 元件
import userProductModal from '@/components/UserProductModal.vue'
// 區域註冊: 載入刪除產品 Modle 元件
import delProductModal from '@/components/DelProductModal.vue'
// 載入 分頁頁碼 元件
import pagination from '@/components/Pagination.vue'
// 載入 SweetAlert 彈跳視窗效果套件
import swal from 'sweetalert'

export default {
  data () {
    return {
      // 一律使用 function return
      products: [],
      isNew: false, // 判斷點擊的是新增按鈕方法還是編輯按鈕方法
      tempProduct: {
        // 預計調整資料使用結構，如:新增產品時的暫時資料儲存
        imagesUrl: [] // 第二層結構
      },
      pagination: {},
      page: '',
      userProductModal: {}
    }
  },
  components: {
    userProductModal,
    pagination,
    delProductModal
  },
  mounted () {
    // 取得資料、DOM元素
    this.getProducts()
  },
  methods: {
    getProducts (page = 1) {
      // 取得後台產品列表
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`
      this.$http
        .get(url)
        .then(response => {
          if (response.data.success) {
            this.products = response.data.products
            this.pagination = response.data.pagination
            // console.log(this.products)
          } else {
            console.log(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 開啟建立新產品、編輯、刪除方法
    openModal (isNew, item) {
      if (isNew === 'new') {
        // 傳入new，等於新增產品
        // 把暫存資料清空
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew = true
        this.$refs.userProductModal.openModal()
      } else if (isNew === 'edit') {
        // 傳入edit，等於編輯產品
        this.tempProduct = { ...item }
        this.isNew = false
        this.$refs.userProductModal.openModal()
      } else if (isNew === 'delete') {
        // 傳入delete，等於刪除產品
        this.tempProduct = { ...item }
        this.$refs.delProductModal.openModal()
      }
    },
    // 圖片新增
    createImages () {
      this.tempProduct.imagesUrl = []
      this.tempProduct.imagesUrl.push('')
    },
    // 編輯訂單內容
    updateProduct (tempProduct) {
      let url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`
      let method = 'post' // post 新增產品
      if (!this.isNew) {
        url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${tempProduct.id}`
        method = 'put' // put 編輯產品
      }
      this.$http[method](url, { data: tempProduct })
        .then(response => {
          if (response.data.success) {
            swal('成功!', '產品新增、編輯成功', 'success')
            this.$refs.userProductModal.hideModal()
            this.getProducts()
          } else {
            // alert(response.data.message);
            const errorMsg = response.data.message
            swal('出錯了!', `${errorMsg}`, 'error')
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 刪除產品方法
    delProduct (tempProduct) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${tempProduct.id}`
      this.$http
        .delete(url)
        .then(response => {
          if (response.data.success) {
            swal('成功!', '產品刪除成功', 'success')
            this.$refs.delProductModal.hideModal()
            this.getProducts()
          } else {
            console.log(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
