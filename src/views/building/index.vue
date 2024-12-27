<template>
  <div>
    <el-card>
      <el-space style="margin-bottom: 20px">
        <el-button type="primary" @click="openDialog(null)">
          <el-icon><Plus /></el-icon>
          {{ transformI18n($t("building.addRoom")) }}
        </el-button>

        <!-- 导出和导入按钮 -->
        <el-button @click="handleExport" type="success">
          <el-icon><Download /></el-icon>
          {{ transformI18n($t("building.exportExcel")) }}
        </el-button>
        <el-button @click="handleImport" type="primary">
          <el-icon><Upload /></el-icon>
          {{ transformI18n($t("building.importExcel")) }}
        </el-button>

        <el-input
          v-model="searchQuery"
          :placeholder="transformI18n($t('building.searchRoom'))"
          @keyup.enter="fetchBuildingList"
          clearable
          style="width: 300px"
        />
        <el-button @click="fetchBuildingList" type="primary">
          <el-icon><Search /></el-icon>
          {{ transformI18n($t("permission.search")) }}
        </el-button>
        <el-dialog
          :title="transformI18n($t('building.importExcel'))"
          v-model="importDialogVisible"
          width="400px"
        >
          <UploadComponent @dataParsed="handleParsedData" />
          <div slot="footer" class="dialog-footer flex justify-end">
            <el-button type="primary" @click="importExcel">
              {{ transformI18n($t("permission.sure")) }}
            </el-button>
            <el-button @click="importDialogVisible = false">
              {{ transformI18n($t("permission.cancel")) }}
            </el-button>
          </div>
        </el-dialog>
      </el-space>

      <el-table :data="buildingList" border style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <el-space m="4" style="margin-left: 50px">
              <span m="t-0 b-2" style="margin-right: 10px">
                <span style="font-weight: bold">{{ transformI18n($t("building.createTime")) }}：</span>{{ props.row.createTime }}</span
              >
              <span m="t-0 b-2" style="margin-right: 10px">
                <span style="font-weight: bold">{{ transformI18n($t("building.updateBy")) }}：</span>{{ props.row.updateBy }}</span
              >
              <span m="t-0 b-2" style="margin-right: 10px">
                <span style="font-weight: bold">{{ transformI18n($t("building.updateTime")) }}：</span>{{ props.row.updateTime }}</span
              >
            </el-space>
          </template>
        </el-table-column>
        <el-table-column prop="buildingNum" :label="transformI18n($t('building.buildingNum'))" width="200" />
        <el-table-column prop="floor" :label="transformI18n($t('building.floor'))" width="100" />
        <el-table-column prop="roomNum" :label="transformI18n($t('building.roomNum'))" width="100" />
        <el-table-column prop="capacity" :label="transformI18n($t('building.capacity'))" width="100" />
        <el-table-column prop="capacityNum" :label="transformI18n($t('building.capacityNum'))" width="100" />
        <el-table-column prop="roomStandard" :label="transformI18n($t('building.roomStandard'))" width="150" />
        <el-table-column prop="roomType" :label="transformI18n($t('building.roomType'))" width="150" />
        <el-table-column prop="remark" :label="transformI18n($t('building.remark'))" />
        <el-table-column :label="transformI18n($t('building.operation'))" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openDialog(row)">
              <el-icon><Edit /></el-icon>
              {{ transformI18n($t("building.edit")) }}
            </el-button>
            <el-button type="danger" size="small" @click="confirmDelete(row)">
              <el-icon><Delete /></el-icon>
              {{ transformI18n($t("building.delete")) }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
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

    <!-- Confirm Delete Dialog -->
    <el-dialog :title="transformI18n($t('title.confirmDelete'))" v-model="deleteDialogVisible" width="400px">
      <span
        >您确定要删除"{{
          deleteBuilding
            ? deleteBuilding.buildingNum +
              deleteBuilding.floor +
              deleteBuilding.roomNum
            : "该楼栋"
        }}"吗？</span
      >
      <div slot="footer" class="dialog-footer flex justify-end">
        <el-button type="primary" @click="deleteRaw">{{ transformI18n($t("permission.sure")) }}</el-button>
        <el-button @click="deleteDialogVisible = false">{{ transformI18n($t("permission.cancel")) }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogVisible" :title="transformI18n($t('title.buildingInfo'))" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item :label="transformI18n($t('building.buildingNum'))" prop="buildingNum">
          <el-input v-model="form.buildingNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.floor'))" prop="floor">
          <el-select v-model="form.floor">
            <el-option value="1楼" label="1楼" />
            <el-option value="2楼" label="2楼" />
            <el-option value="3楼" label="3楼" />
            <el-option value="4楼" label="4楼" />
            <el-option value="5楼" label="5楼" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomNum'))" prop="roomNum">
          <el-input v-model="form.roomNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.capacity'))" prop="capacity">
          <el-input v-model="form.capacity" type="number" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.capacityNum'))" prop="capacityNum">
          <el-input v-model="form.capacityNum" type="number" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomStandard'))" prop="roomStandard">
          <el-input v-model="form.roomStandard" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomType'))" prop="roomType">
          <el-select v-model="form.roomType">
            <el-option value="普通级" label="普通级" />
            <el-option value="班长级" label="班长级" />
            <el-option value="主任级" label="主任级" />
            <el-option value="经理级" label="经理级" />
            <el-option value="领导级" label="领导级" />
            <el-option value="公费夫妻房" label="公费夫妻房" />
            <el-option value="自费夫妻房" label="自费夫妻房" />
            <el-option value="客房" label="客房" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.remark'))" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveBuilding">{{ transformI18n($t("permission.submit")) }}</el-button>
        <el-button @click="dialogVisible = false">{{ transformI18n($t("permission.cancel")) }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import {
  Plus,
  Search,
  Download,
  Upload,
  Edit,
  Delete
} from "@element-plus/icons-vue";
import {
  getBuildingList,
  saveBuildingInfo,
  deleteBuildingInfo,
  getBuildingAll,
  saveBatchBuildingInfo
} from "@/api/building";
import * as XLSX from "xlsx-js-style";
import UploadComponent from "@/components/Upload.vue";
import { useI18n } from "vue-i18n";
import { $t, transformI18n } from "@/plugins/i18n";

const { t } = useI18n();
// Pagination variables
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0); // Total count
const buildingList = ref<any[]>([]); // Current page data
const searchQuery = ref(""); // Search query

// Delete confirmation dialog state
const deleteDialogVisible = ref(false);
const deleteBuilding = ref<any>(null);

const importDialogVisible = ref(false);
// 存储解析数据
const parsedData = ref<any[]>([]);

// Fetch building list with pagination
const fetchBuildingList = async () => {
  try {
    const response = await getBuildingList({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      query: searchQuery.value
    });
    // console.log(response);
    buildingList.value = response.list;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("获取楼栋列表失败！");
  }
};

// Handle page change
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchBuildingList();
};

// Dialog form
const dialogVisible = ref(false);
const form = ref({
  id: null,
  buildingNum: "",
  floor: "",
  roomNum: "",
  capacity: "",
  capacityNum: "",
  roomStandard: "",
  roomType: "",
  remark: ""
});
const rules = {
  buildingNum: [{ required: true, message: "楼栋不能为空", trigger: "blur" }],
  floor: [{ required: true, message: "楼层不能为空", trigger: "blur" }],
  roomNum: [{ required: true, message: "房间号不能为空", trigger: "blur" }]
};
const formRef = ref();

// Open dialog
const openDialog = (row: any) => {
  if (row) {
    form.value = { ...row };
  } else {
    form.value = {
      id: null,
      buildingNum: "",
      floor: "",
      roomNum: "",
      capacity: "",
      capacityNum: "",
      roomStandard: "",
      roomType: "",
      remark: ""
    };
  }
  dialogVisible.value = true;
};

// Save building
const saveBuilding = async () => {
  try {
    await formRef.value.validate();
    await saveBuildingInfo(form.value);
    ElMessage.success("保存成功！");
    dialogVisible.value = false;
    fetchBuildingList();
  } catch (error) {
    ElMessage.error("保存失败！");
  }
};

// Confirm delete
const confirmDelete = (row: any) => {
  deleteBuilding.value = row;
  console.log(deleteBuilding.value);
  deleteDialogVisible.value = true;
};

// Delete building
const deleteRaw = async () => {
  try {
    if (deleteBuilding.value.id !== null) {
      await deleteBuildingInfo(deleteBuilding.value.id);
      ElMessage.success("删除成功！");
      fetchBuildingList();
    }
  } catch (error) {
    ElMessage.error("删除失败！");
  } finally {
    deleteDialogVisible.value = false;
    deleteBuilding.value = null;
  }
};

// Export Excel file
const handleExport = async () => {
  // Define headers based on table column labels
  const headers = [
    { label: "楼栋", key: "buildingNum" },
    { label: "楼层", key: "floor" },
    { label: "房间号", key: "roomNum" },
    { label: "可住人数", key: "capacity" },
    { label: "已住人数", key: "capacityNum" },
    { label: "房间标准", key: "roomStandard" },
    { label: "房间属性", key: "roomType" },
    { label: "备注", key: "remark" }
  ];

  const response = await getBuildingAll();
  // Convert data with headers
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

  // 遍历每个单元格并添加边框
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
  XLSX.utils.book_append_sheet(wb, ws, "Building Data");

  XLSX.writeFile(wb, "楼栋信息表.xlsx", { compression: true });
};

const handleImport = () => {
  importDialogVisible.value = true;
};

const handleParsedData = (data: any) => {
  parsedData.value = data;
};
// 分批传输函数
const saveDataInChunks = async (data: any[], chunkSize: number) => {
  ElMessage.warning("批量导入数据中！");
  let intervalId = setInterval(() => {
    ElMessage.warning("批量导入数据中！");
  }, 3000);
  importDialogVisible.value = false;
  // for (let i = 0; i < data.length; i += chunkSize) {
  //   const chunk = data.slice(i, i + chunkSize); // 分割当前批次的数据
  //   try{
  //       await saveBatchBuildingInfo(chunk);
  //     }catch(error){
  //       ElMessage.error("导入失败！");
  //       clearInterval(intervalId);
  //       return;
  //     }
  // }
  await saveBatchBuildingInfo(data);
  clearInterval(intervalId);
  ElMessage.success("导入成功！");
  fetchBuildingList();
};

// 导入 Excel 的主函数
const importExcel = () => {
  saveDataInChunks(parsedData.value, 1000);
};

onMounted(() => {
  fetchBuildingList();
});
</script>

<style scoped>
.mt-4 {
  margin-top: 20px;
}
</style>
