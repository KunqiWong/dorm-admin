<template>
  <div>
    <el-card>
      <el-space style="margin-bottom: 20px">
        <el-button type="primary" @click="openDialog(null)">
          <el-icon><Plus /></el-icon>
          新增员工
        </el-button>

        <!-- 导出和导入按钮 -->
        <el-button @click="handleExport" type="success">
          <el-icon><Download /></el-icon>
          导出 Excel
        </el-button>
        <el-button @click="handleImport" type="primary">
          <el-icon><Upload /></el-icon>
          导入 Excel
        </el-button>

        <el-input
          v-model="searchQuery"
          placeholder="搜索员工信息"
          @keyup.enter="fetchEmployeeList"
          clearable
          style="width: 300px"
        />
        <el-button @click="fetchEmployeeList">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-dialog
          title="导入Excel"
          v-model="importDialogVisible"
          width="400px"
        >
          <UploadComponent @dataParsed="handleParsedData" />
          <div slot="footer" class="dialog-footer flex justify-end">
            <el-button type="primary" @click="importExcel">确认</el-button>
            <el-button @click="importDialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </el-space>

      <el-table :data="employeeList" border style="width: 100%">
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openDialog(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="confirmDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="buildingNum" label="楼栋" width="150" />
        <el-table-column prop="floor" label="楼层" width="100" />
        <el-table-column prop="roomNum" label="房间号" width="100" />
        <el-table-column prop="roomStandard" label="房间标准" width="100" />
        <el-table-column prop="staffNum" label="工号" width="120" />
        <el-table-column prop="staffName" label="姓名" width="100" />
        <el-table-column prop="sex" label="性别" width="100" />
        <el-table-column prop="contry" label="国籍" width="100" />
        <el-table-column prop="company" label="公司" width="150" />
        <el-table-column prop="dept" label="部门" width="150" />
        <el-table-column prop="post" label="职务" width="100" />
        <el-table-column prop="phone" label="电话" width="100" />
        <el-table-column prop="visaType" label="签证类型" width="100" />
        <el-table-column prop="passportNo" label="护照号" width="120" />
        <el-table-column prop="bedNum" label="床位" width="100" />
        <el-table-column prop="keyFlag" label="钥匙" width="100" />
        <el-table-column prop="checkinDate" label="入住时间" width="100" />
        <el-table-column prop="deposit" label="入住押金" width="100" />
        <el-table-column prop="remark" label="备注" width="300" />
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
    <el-dialog title="确认删除" v-model="deleteDialogVisible" width="400px">
      <span>您确定要删除"{{ deleteEmployee?.staffName || "该员工" }}"吗？</span>
      <div slot="footer" class="dialog-footer flex justify-end">
        <el-button type="primary" @click="deleteRaw">确认</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogVisible" title="员工信息" width="800px">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        class="flex flex-wrap"
      >
        <el-form-item label="楼栋" prop="buildingNum">
          <el-input v-model="form.buildingNum" />
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input v-model="form.floor" />
        </el-form-item>
        <el-form-item label="房间号" prop="roomNum">
          <el-input v-model="form.roomNum" />
        </el-form-item>
        <el-form-item label="房间类型" prop="roomStandard">
          <el-input v-model="form.roomStandard" />
        </el-form-item>
        <el-form-item label="工号" prop="staffNum">
          <el-input v-model="form.staffNum" />
        </el-form-item>
        <el-form-item label="姓名" prop="staffName">
          <el-input v-model="form.staffName" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="form.sex" />
        </el-form-item>
        <el-form-item label="国籍" prop="contry">
          <el-input v-model="form.contry" />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="form.company" />
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <el-input v-model="form.dept" />
        </el-form-item>
        <el-form-item label="职务" prop="post">
          <el-input v-model="form.post" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="签证类型" prop="visaType">
          <el-input v-model="form.visaType" />
        </el-form-item>
        <el-form-item label="护照号" prop="passportNo">
          <el-input v-model="form.passportNo" />
        </el-form-item>
        <el-form-item label="床位" prop="bedNum">
          <el-input v-model="form.bedNum" />
        </el-form-item>
        <el-form-item label="钥匙" prop="keyFlag">
          <el-input v-model="form.keyFlag" />
        </el-form-item>
        <el-form-item label="入住日期" prop="checkinDate">
          <el-input type="date" v-model="form.checkinDate" />
        </el-form-item>
        <el-form-item label="入住押金" prop="deposit">
          <el-input v-model="form.deposit" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveEmployee">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
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
  getEmployeeList,
  saveEmployeeInfo,
  deleteEmployeeInfo,
  getEmployeeAll,
  saveBatchEmployeeInfo
} from "@/api/employee";
import * as XLSX from "xlsx-js-style";
import UploadComponent from "@/components/Upload.vue";

// Pagination variables
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0); // Total count
const employeeList = ref<any[]>([]); // Current page data
const searchQuery = ref(""); // Search query

// Delete confirmation dialog state
const deleteDialogVisible = ref(false);
const deleteEmployee = ref<any>(null);

const importDialogVisible = ref(false);
// 存储解析数据
const parsedData = ref<any[]>([]);

// Fetch employee list with pagination
const fetchEmployeeList = async () => {
  try {
    const response = await getEmployeeList({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      query: searchQuery.value
    });
    console.log(response);
    employeeList.value = response.list;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("获取员工列表失败！");
  }
};

// Handle page change
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchEmployeeList();
};

// Dialog form
const dialogVisible = ref(false);
const form = ref({
  buildingNum: "",
  floor: "",
  roomNum: "",
  staffNum: "",
  staffName: "",
  sex: "",
  contry: "",
  company: "",
  dept: "",
  post: "",
  phone: "",
  visaType: "",
  passportNo: "",
  bedNum: "",
  keyFlag: "",
  checkinDate: "",
  deposit: "",
  remark: ""
});
const rules = {
  buildingNum: [{ required: true, message: "楼栋不能为空", trigger: "blur" }],
  floor: [{ required: true, message: "楼层不能为空", trigger: "blur" }],
  roomNum: [{ required: true, message: "房间号不能为空", trigger: "blur" }],
  staffName: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
};
const formRef = ref();

// Open dialog
const openDialog = (row: any) => {
  if (row) {
    form.value = { ...row };
  } else {
    form.value = {
      roomInfo: "",
      buildingNum: "",
      floor: "",
      roomNum: "",
      roomStandard: "",
      staffNum: "",
      staffName: "",
      sex: "",
      contry: "",
      company: "",
      dept: "",
      post: "",
      phone: "",
      visaType: "",
      passportNo: "",
      bedNum: "",
      keyFlag: "",
      checkinDate: "",
      deposit: "",
      remark: ""
    };
  }
  dialogVisible.value = true;
};

// Save employee
const saveEmployee = async () => {
  try {
    await formRef.value.validate();
    await saveEmployeeInfo(form.value);
    ElMessage.success("保存成功！");
    dialogVisible.value = false;
    fetchEmployeeList();
  } catch (error) {
    ElMessage.error("保存失败！");
  }
};

// Confirm delete
const confirmDelete = (data: any) => {
  deleteEmployee.value = data;
  deleteDialogVisible.value = true;
};

// Delete employee
const deleteRaw = async () => {
  try {
    if (deleteEmployee.value !== null) {
      await deleteEmployeeInfo(deleteEmployee.value.id);
      ElMessage.success("删除成功！");
      fetchEmployeeList();
    }
  } catch (error) {
    ElMessage.error("删除失败！");
  } finally {
    deleteDialogVisible.value = false;
    deleteEmployee.value = null;
  }
};

// Export Excel file
const handleExport = async () => {
  // Define headers based on table column labels
  const headers = [
    { label: "楼栋", key: "buildingNum" },
    { label: "楼层", key: "floor" },
    { label: "房间号", key: "roomNum" },
    { label: "房间类型", key: "roomStandard" },
    { label: "工号", key: "staffNum" },
    { label: "姓名", key: "staffName" },
    { label: "性别", key: "sex" },
    { label: "国籍", key: "contry" },
    { label: "公司", key: "company" },
    { label: "部门", key: "dept" },
    { label: "职务", key: "post" },
    { label: "电话", key: "phone" },
    { label: "签证类型", key: "visaType" },
    { label: "护照号", key: "passportNo" },
    { label: "床位", key: "bedNum" },
    { label: "钥匙", key: "keyFlag" },
    { label: "入住日期", key: "checkinDate" },
    { label: "入住押金", key: "deposit" },
    { label: "备注", key: "remark" },
    { label: "ID", key: "id" }
  ];

  const response = await getEmployeeAll();
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

  headers.forEach((_, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    if (ws[cellAddress]) ws[cellAddress].s = headerStyle;
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
      ws[cellAddress].s = { border: borderStyle }; // 为每个单元格添加边框
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // 写入文件并启用压缩
  XLSX.writeFile(wb, "员工信息表.xlsx", { compression: true });
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
  //     try{
  //       await saveBatchEmployeeInfo(chunk);
  //     }catch(error){
  //       ElMessage.error("导入失败！");
  //       clearInterval(intervalId);
  //       return;
  //     }
  // }
  // console.log(data);
  await saveBatchEmployeeInfo(data);
  clearInterval(intervalId);
  ElMessage.success("导入成功！");
  fetchEmployeeList();
};

// 导入 Excel 的主函数
const importExcel = () => {
  saveDataInChunks(parsedData.value, 500);
};

onMounted(() => {
  fetchEmployeeList();
});
</script>

<style scoped>
.mt-4 {
  margin-top: 20px;
}
</style>
