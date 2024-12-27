<template>
  <div>
    <el-card>
      <el-space style="margin-bottom: 20px">
        <el-button @click="handleExport" type="success">
          <el-icon><Download /></el-icon>
          {{ transformI18n($t('building.exportExcel')) }}
        </el-button>

        <el-input
          v-model="searchQuery.operator"
          :placeholder="transformI18n($t('checkOut.operator'))"
          clearable
          style="width: 100px"
        />
        <el-input
          v-model="searchQuery.staffName"
          :placeholder="transformI18n($t('checkIn.staffName'))"
          clearable
          style="width: 100px"
        />
        <el-input
          v-model="searchQuery.staffNum"
          :placeholder="transformI18n($t('checkIn.staffNum'))"
          clearable
          style="width: 200px"
        />
        <el-input
          v-model="searchQuery.passportNo"
          :placeholder="transformI18n($t('checkIn.passportNo'))"
          clearable
          style="width: 200px"
        />

        <el-date-picker
          v-model="searchQuery.timeRange"
          type="daterange"
          range-separator="至"
          :start-placeholder="transformI18n($t('checkOut.startTime'))"
          :end-placeholder="transformI18n($t('checkOut.endTime'))"
          format="YYYY-MM-DD"
          style="width: 300px"
          clearable
        />

        <el-button @click="fetchCheckOutList" type="primary">
          <el-icon><Search /></el-icon>
          {{ transformI18n($t('permission.search')) }}
        </el-button>
      </el-space>

      <!-- 表格 -->
      <el-table :data="checkoutList" border style="width: 100%">
        <el-table-column prop="operator" :label="transformI18n($t('checkOut.operator'))" width="100" />
        <el-table-column prop="roomInfo" :label="transformI18n($t('title.roomInfo'))" width="200" />
        <el-table-column prop="staffName" :label="transformI18n($t('checkIn.staffName'))" width="100" />
        <el-table-column prop="staffNum" :label="transformI18n($t('checkIn.staffNum'))" width="100" />
        <el-table-column prop="passportNo" :label="transformI18n($t('checkIn.passportNo'))" width="150" />
        <el-table-column prop="sex" :label="transformI18n($t('checkIn.sex'))" width="100" />
        <el-table-column prop="dept" :label="transformI18n($t('checkIn.dept'))" width="200" />
        <el-table-column prop="company" :label="transformI18n($t('checkIn.company'))" width="200" />
        <el-table-column prop="checkinDate" :label="transformI18n($t('checkIn.checkinDate'))" width="150" />
        <el-table-column prop="checkoutDate" :label="transformI18n($t('checkIn.checkOutDate'))" width="150" />
        <el-table-column prop="leaveDate" :label="transformI18n($t('checkIn.leaveDate'))" width="150" />
        <el-table-column prop="keyFlag" :label="transformI18n($t('checkIn.keyFlag'))" width="100" />
        <el-table-column prop="cardFlag" :label="transformI18n($t('checkOut.cardFlag'))" width="100" />
        <el-table-column prop="beddingFlag" :label="transformI18n($t('checkIn.beddingFlag'))" width="100" />
        <el-table-column prop="pillowFlag" :label="transformI18n($t('checkIn.pillowFlag'))" width="100" />
        <el-table-column prop="basin" :label="transformI18n($t('checkIn.basin'))" width="100" />
        <el-table-column prop="deposit" :label="transformI18n($t('checkIn.deposit'))" width="100" />
        <el-table-column prop="leaveReason" :label="transformI18n($t('checkIn.leaveReason'))" width="200" />
        <el-table-column prop="remark" :label="transformI18n($t('checkIn.remark'))" width="200" />
        <el-table-column prop="createBy" :label="transformI18n($t('checkOut.createBy'))" width="100" />
        <el-table-column prop="createTime" :label="transformI18n($t('building.createTime'))" width="150" />
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
import { getCheckOutList, selectLeaveInfoAll } from "@/api/checkout";
import * as XLSX from "xlsx-js-style";
import { transformI18n,$t } from "@/plugins/i18n";
import { useI18n } from "vue-i18n";

const { t } = useI18n();


// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const checkoutList = ref<any[]>([]);

// 搜索条件
const searchQuery = ref({
  operator: "",
  staffName: "",
  passportNo: "",
  staffNum: "",
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
const fetchCheckOutList = async () => {
  try {
    const query = {
      operator: searchQuery.value.operator,
      staffName: searchQuery.value.staffName,
      passportNo: searchQuery.value.passportNo,
      staffNum: searchQuery.value.staffNum,
      startTime: formatDate(searchQuery.value.timeRange[0]) || "",
      endTime: formatDate(searchQuery.value.timeRange[1]) || ""
    };
    console.log(query);
    const response = await getCheckOutList({
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
  fetchCheckOutList();
};

// 导出日志到 Excel
const handleExport = async () => {
  const headers = [
    { label: "登记人", key: "operator" },
    { label: "房间信息", key: "roomInfo" },
    { label: "员工姓名", key: "staffName" },
    { label: "工号", key: "staffNum" },
    { label: "护照号", key: "passportNo" },
    { label: "性别", key: "sex" },
    { label: "部门", key: "dept" },
    { label: "公司", key: "company" },
    { label: "入住日期", key: "checkinDate" },
    { label: "退宿日期", key: "checkoutDate" },
    { label: "出矿日期", key: "leaveDate" },
    { label: "钥匙", key: "keyFlag" },
    { label: "饭卡", key: "cardFlag" },
    { label: "床上用品", key: "beddingFlag" },
    { label: "枕头", key: "pillowFlag" },
    { label: "脸盆", key: "basin" },
    { label: "押金", key: "deposit" },
    { label: "退宿理由", key: "leaveReason" },
    { label: "备注", key: "remark" },
    { label: "创建人", key: "createBy" },
    { label: "创建时间", key: "createTime" }
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
    ws["!cols"] = headers.map(() => ({ wch: 20 }));
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
    XLSX.utils.book_append_sheet(wb, ws, "退宿记录");

    XLSX.writeFile(wb, "退宿记录.xlsx", { compression: true });
  } catch (error) {
    ElMessage.error("导出失败！");
  }
};

onMounted(() => {
  fetchCheckOutList();
});
</script>

<style scoped>
.mt-4 {
  margin-top: 20px;
}
</style>
