<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          width="220px"
          prop="order_number"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status == 1" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox(scope.row.order_id)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改信息对话框 -->
    <el-dialog
      title="修改订单信息"
      :visible.sync="orderDialogVisible"
      width="50%"
      @close="orderDialogVisibleClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="110px"
      >
        <el-form-item label="省市区县">
          <el-cascader
            :options="cityData"
            expand-trigger="hover"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流信息对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "@/components/order/city_data2017_element.js";
import http from "@/http/index.js";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      orderDialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请输入省市区县名称", tigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", tigger: "blur" },
        ],
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: [],
    };
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      http({
        url: "/orders",
        method: "get",
        params: this.queryInfo,
      }).then((res) => {
        this.orderList = res.data.goods;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    showBox(id) {
      this.orderDialogVisible = true;
    },
    orderDialogVisibleClose() {
      this.$refs.addressFormRef.resetFields();
    },
    showProgressBox(id) {
      this.progressDialogVisible = true;
      http({
        url: "/kuaidi/1106975712662",
        method: "get",
      }).then((res) => {
        this.progressInfo = res.data;
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>
