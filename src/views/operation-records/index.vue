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
          <el-option label="调换记录" value="调换记录" />
          <el-option label="调换申请记录" value="调换申请记录" />
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

        <el-button @click="fetchLogList" type="primary">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </el-space>

      <el-table :data="logList" border style="width: 100%">
        <el-table-column prop="operater" label="操作人" width="150" />
        <el-table-column prop="operateType" label="操作类型" width="200" />
        <el-table-column prop="createTime" label="操作时间" width="200" />
        <el-table-column prop="remark" label="记录" />
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
import { getOperationList, getOperationAll } from "@/api/operation";
import * as XLSX from "xlsx-js-style";

// 分页相关变量
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const logList = ref<any[]>([]);

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
const fetchLogList = async () => {
  try {
    const query = {
      operater: searchQuery.value.operater,
      operateType: searchQuery.value.operateType,
      startTime: formatDate(searchQuery.value.timeRange[0]) || "",
      endTime: formatDate(searchQuery.value.timeRange[1]) || ""
    };
    console.log(query);
    const response = await getOperationList({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      ...query
    });
    // console.log(response);
    logList.value = response.list;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("获取日志列表失败！");
  }
};

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchLogList();
};

// 导出日志到 Excel
const handleExport = async () => {
  const headers = [
    { label: "操作人", key: "operater" },
    { label: "操作类型", key: "operateType" },
    { label: "操作时间", key: "createTime" },
    { label: "记录", key: "remark" }
  ];

  try {
    const response = await getOperationAll();
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
    ws["!cols"] = [
      { wch: 20 }, // 操作人列宽 20
      { wch: 20 }, // 操作类型列宽 20
      { wch: 20 }, // 操作时间列宽 20
      { wch: 100 } // 记录列宽 40
    ];

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
  fetchLogList();
});
</script>

<style scoped>
.mt-4 {
  margin-top: 20px;
}
</style>
