<template>
  <div>
    <el-card>
      <el-space style="margin-bottom: 20px">
        <el-button @click="handleExport" type="success">
          <el-icon><Download /></el-icon>
          导出 Excel
        </el-button>

        <el-input
          v-model="searchQuery.operater"
          placeholder="操作人"
          clearable
          style="width: 200px"
        />

        <el-select
          v-model="searchQuery.operateType"
          placeholder="操作类型"
          clearable
          style="width: 200px"
        >
          <el-option label="添加记录" value="添加记录" />
          <el-option label="修改记录" value="修改记录" />
          <el-option label="删除记录" value="删除记录" />
          <el-option label="退宿记录" value="退宿记录" />
          <el-option label="调换记录" value="调换记录" />
        </el-select>

        <el-date-picker
          v-model="searchQuery.timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          style="width: 300px"
          clearable
        />

        <el-button @click="fetchCheckoutList" type="primary">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </el-space>

      <!-- 表格 -->
      <el-table :data="checkoutList" border style="width: 100%">
        <el-table-column prop="operator" label="登记人" width="100" />
        <el-table-column prop="room_info" label="房间信息" width="200" />
        <el-table-column prop="staff_name" label="员工姓名" width="100" />
        <el-table-column prop="passport_no" label="护照号" width="150" />
        <el-table-column prop="sex" label="性别" width="100" />
        <el-table-column prop="dept" label="部门" width="200" />
        <el-table-column prop="company" label="公司" width="200" />
        <el-table-column prop="checkin_date" label="入住日期" width="150" />
        <el-table-column prop="checkout_date" label="退宿日期" width="150" />
        <el-table-column prop="leave_date" label="出矿日期" width="150" />
        <el-table-column prop="key_flag" label="钥匙" width="100" />
        <el-table-column prop="card_flag" label="饭卡" width="100" />
        <el-table-column prop="bedding_flag" label="床上用品" width="100" />
        <el-table-column prop="pillow_flag" label="枕头" width="100" />
        <el-table-column prop="basin" label="脸盆" width="100" />
        <el-table-column prop="deposit" label="押金" width="100" />
        <el-table-column prop="leave_reason" label="退宿理由" width="200" />
        <el-table-column prop="remark" label="备注" width="200" />
        <el-table-column prop="create_by" label="创建人" width="100" />
        <el-table-column prop="create_time" label="创建时间" width="150" />
      </el-table>

      <el-pagination
        class="mt-4 flex justify-end"
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="total, prev, pager, next, jumper"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Search, Download } from "@element-plus/icons-vue";
import { getCheckoutList, selectLeaveInfoAll } from "@/api/checkout";
import * as XLSX from "xlsx-js-style";

// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const checkoutList = ref<any[]>([]);

// 搜索条件
const searchQuery = ref({
  operater: "",
  operateType: "",
  timeRange: []
});
function formatDate(date) {
  if (!date) return ""; // 如果没有日期，返回空字符串
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 获取月份并确保两位数
  const day = String(d.getDate()).padStart(2, "0"); // 获取日期并确保两位数
  return `${year}-${month}-${day}`; // 返回格式化的日期
}
// 获取日志列表
const fetchCheckoutList = async () => {
  try {
    const query = {
      operater: searchQuery.value.operater,
      operateType: searchQuery.value.operateType,
      startTime: formatDate(searchQuery.value.timeRange[0]) || "",
      endTime: formatDate(searchQuery.value.timeRange[1]) || ""
    };
    console.log(query);
    const response = await getCheckoutList({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      ...query
    });
    console.log(response);
    checkoutList.value = response.list;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("获取日志列表失败！");
  }
};

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchCheckoutList();
};

// 导出日志到 Excel
const handleExport = async () => {
  const headers = [
    { label: "登记人", key: "operator" },
    { label: "房间信息", key: "room_info" },
    { label: "员工姓名", key: "staff_name" },
    { label: "护照号", key: "passport_no" },
    { label: "性别", key: "sex" },
    { label: "部门", key: "dept" },
    { label: "公司", key: "company" },
    { label: "入住日期", key: "checkin_date" },
    { label: "退宿日期", key: "checkout_date" },
    { label: "出矿日期", key: "leave_date" },
    { label: "钥匙", key: "key_flag" },
    { label: "饭卡", key: "card_flag" },
    { label: "床上用品", key: "bedding_flag" },
    { label: "枕头", key: "pillow_flag" },
    { label: "脸盆", key: "basin" },
    { label: "押金", key: "deposit" },
    { label: "退宿理由", key: "leave_reason" },
    { label: "备注", key: "remark" },
    { label: "创建人", key: "create_by" },
    { label: "创建时间", key: "create_time" }
  ];

  try {
    const response = await selectLeaveInfoAll();
    const formattedData = response.data.map(item =>
      headers.reduce((acc, header) => {
        acc[header.label] = item[header.key];
        return acc;
      }, {})
    );

    const exportData = [
      headers.map(header => header.label),
      ...formattedData.map(Object.values)
    ];
    const ws = XLSX.utils.aoa_to_sheet(exportData);

    // 设置列宽
    ws["!cols"] = [];

    // 设置表头样式
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "808080" } },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // 设置表头单元格样式
    headers.forEach((_, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    });

    // 为每个单元格添加边框
    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } }
    };

    const rows = exportData.length;
    const cols = exportData[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        if (!ws[cellAddress]) {
          ws[cellAddress] = { v: "" }; // 如果单元格为空，先设置一个空值
        }
        if (!ws[cellAddress].s) {
          ws[cellAddress].s = {}; // 确保没有覆盖已有样式
        }
        ws[cellAddress].s.border = borderStyle; // 为每个单元格添加边框
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "日志记录");

    XLSX.writeFile(wb, "操作日志.xlsx", { compression: true });
  } catch (error) {
    ElMessage.error("导出失败！");
  }
};

onMounted(() => {
  fetchCheckoutList();
});
</script>

<style scoped>
.mt-4 {
  margin-top: 20px;
}
</style>
