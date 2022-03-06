<template>
  <div class="container">
    <div class="row">
      <div class="text-end mt-3 mb-3">
        <button
          class="btn btn-outline-danger"
          type="button"
          @click="deleteAllCarts"
        >
          清空購物車
        </button>
      </div>
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style="width: 150px">數量/單位</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="cart.carts">
            <!-- ↑判斷購物車內是否有資料 -->
            <tr v-for="item in cart.carts" :key="item.id">
              <td>
                <button
                  type="button"
                  class="cross-md"
                  @click="removeCartItem(item.id)"
                  :disabled="loadingStatus.loadingItem === item.id"
                >
                  <div
                    class="del"
                    v-if="loadingStatus.loadingItem === item.id"
                  ></div>
                  <div class="line1"></div>
                  <div class="line2"></div>
                </button>
                <button
                  type="button"
                  class="cross-lg"
                  @click="removeCartItem(item.id)"
                  :disabled="loadingStatus.loadingItem === item.id"
                >
                  <div
                    class="del"
                    v-if="loadingStatus.loadingItem === item.id"
                  ></div>
                  <div class="line1"></div>
                  <div class="line2"></div>
                </button>
              </td>
              <td>
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group mb-3 mt-3">
                    <input
                      v-model.number="item.qty"
                      @change="updateCart(item)"
                      :disabled="loadingStatus.loadingItem === item.id"
                      min="1"
                      type="number"
                      class="form-control"
                    />
                    <span class="input-group-text" id="basic-addon2">{{
                      item.product.unit
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="text-end">
                <small
                  v-if="cart.final_total !== cart.total"
                  class="text-success"
                  >折扣價：</small
                >
                {{ item.final_total }}
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end">總計</td>
            <td class="text-end">{{ cart.total }}</td>
          </tr>
          <tr v-if="cart.final_total !== cart.total">
            <td colspan="3" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">{{ cart.final_total }}</td>
          </tr>
        </tfoot>
      </table>
      <div class="my-5 row justify-content-center text-start">
        <Form
          ref="form"
          class="col-md-6"
          v-slot="{ errors }"
          @submit="createOrder"
        >
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field
              id="email"
              name="信箱"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors['信箱'] }"
              placeholder="請輸入 Email"
              rules="email|required"
              v-model="form.user.email"
            ></Field>
            <ErrorMessage name="信箱" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <Field
              id="name"
              name="姓名"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['姓名'] }"
              placeholder="請輸入姓名"
              rules="required"
              v-model="form.user.name"
            ></Field>
            <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <Field
              id="tel"
              name="電話"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['電話'] }"
              placeholder="請輸入電話"
              rules="required|min:8|max:10"
              v-model="form.user.tel"
            ></Field>
            <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <Field
              id="address"
              name="地址"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入地址"
              rules="required"
              v-model="form.user.address"
            ></Field>
            <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea
              name=""
              id="message"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-end">
            <button type="submit" class="btn btn-danger">送出訂單</button>
          </div>
        </Form>
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
      // 表單結構
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      cart: {}
    }
  },
  mounted () {
    this.getCart()
  },
  methods: {
    // 取得購物車方法
    getCart () {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`
      this.$http
        .get(url)
        .then(response => {
          // console.log(response.data.data)
          if (response.data.success) {
            this.cart = response.data.data
          } else {
            alert(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 更新購物方法
    updateCart (data) {
      this.loadingStatus.loadingItem = data.id
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${data.id}`
      const cart = {
        product_id: data.product_id,
        qty: data.qty
      }
      if (cart.qty < 1) {
        swal('出錯了!', '數量必須大於0', 'error')
        this.loadingStatus.loadingItem = ''
        this.getCart()
      } else {
        this.$http
          .put(url, { data: cart })
          .then(response => {
            if (response.data.success) {
              // alert(response.data.message);
              swal('成功!', '更新購物車成功', 'success')
              // 成功加入購物車後，清空id，否則按鈕還會是disabled狀態
              this.loadingStatus.loadingItem = ''
              this.getCart()
            } else {
              alert(response.data.message)
              this.loadingStatus.loadingItem = ''
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 清空購物車方法
    deleteAllCarts () {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/carts`
      this.$http
        .delete(url)
        .then(response => {
          if (response.data.success) {
            // alert(response.data.message);
            swal('成功!', '刪除全部購物車成功', 'success')
            this.getCart()
          } else {
            alert(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 刪除單一購物車產品方法
    removeCartItem (id) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`
      this.loadingStatus.loadingItem = id
      this.$http
        .delete(url)
        .then(response => {
          if (response.data.success) {
            // alert(response.data.message);
            swal('成功!', '刪除單筆購物車成功', 'success')
            // 成功刪除後，清空id，否則按鈕還會是disabled狀態
            this.loadingStatus.loadingItem = ''
            this.getCart()
          } else {
            alert(response.data.message)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 建立訂單方法
    createOrder () {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`
      const order = this.form
      this.$http
        .post(url, { data: order })
        .then(response => {
          if (response.data.success) {
            // alert(response.data.message);
            swal('成功!', '訂單送出成功', 'success')
            this.$refs.form.resetForm()
            this.getCart()
          } else {
            alert(response.data.message)
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
