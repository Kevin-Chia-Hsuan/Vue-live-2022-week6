<template>
  <div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <!-- <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button> -->
          <button
            type="button"
            class="cross-lg"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <div class="line1"></div>
            <div class="line2"></div>
          </button>
          <button
            type="button"
            class="cross-md"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <div class="line1"></div>
            <div class="line2"></div>
          </button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{ tempProduct.title }}</strong>
          商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="$emit('del-product', tempProduct)"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

export default {
  template: '#delProductModal',
  props: ['tempProduct', 'isNew'],
  data () {
    return {
      delProductModal: ''
    }
  },
  mounted () {
    // console.log(this.$refs);
    this.delProductModal = new Modal(this.$refs.delProductModal, {
      // 點擊背景/按鍵盤，不關閉視窗
      keyboard: false,
      backdrop: 'static'
    })
  },
  methods: {
    openModal () {
      this.delProductModal.show()
    },
    hideModal () {
      this.delProductModal.hide()
    }
  }
}
</script>
