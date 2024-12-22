<template>
  <div class="upload-page">
    <el-upload
      action=""
      class="upload-demo"
      drag
      accept=".xlsx, .xls"
      :on-exceed="exceedFile"
      :on-error="handleError"
      :on-success="handleSuccess"
      :http-request="uploadExcel"
      :before-upload="beforeUpload"
      :show-file-list="true"
      :limit="1"
    >
      <el-icon class="el-icon--upload">
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">请上传 .xls , .xlsx 标准格式文件</div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import * as XLSX from "xlsx-js-style";

// 存储解析的表格数据
const jsonData = ref<any[]>([]);

// 上传文件之前先判断该文件是否是 Excel 文件
const beforeUpload = (file: File) => {
  const isExcel =
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const isLt20M = file.size / 1024 / 1024 < 20;

  if (!isExcel) {
    ElMessageBox.alert("上传文件只能是 xls / xlsx 格式！", "温馨提示", {
      type: "warning"
    });
  }
  if (!isLt20M) {
    ElMessageBox.alert("上传文件大小不能超过 20MB!", "温馨提示", {
      type: "warning"
    });
  }
  return isExcel && isLt20M;
};

// 文件数超出提示
const exceedFile = () => {
  ElMessage.warning("最多只能上传一个文件！");
};

// 上传错误提示
const handleError = () => {
  ElMessage.error("导入数据失败，请您重新上传！");
};

// 上传成功提示
const handleSuccess = () => {
  // ElMessage.success("导入数据成功！");
};

const emit = defineEmits(["dataParsed"]);
// 将解析后的数据传递给父组件
const emitParsedData = () => {
  emit("dataParsed", jsonData.value); // 使用 `emit` 将数据传递给父组件
};
// 文件上传处理
const uploadExcel = async (param: any) => {
  try {
    const file = param.file; // 从参数中获取文件
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result; // 读取到的文件数据
      if (!data) {
        ElMessage.error("文件读取失败，请重试！");
        return;
      }

      const workbook = XLSX.read(data, { type: "binary" }); // 解析 Excel 文件
      const importedData: any[] = [];

      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet);
        importedData.push(...sheetData); // 合并所有表数据
      });
      // console.log(importedData);
      jsonData.value = importedData; // 将解析的数据存储到 `jsonData`
      emitParsedData(); // 调用 emitParsedData 方法
    };

    reader.readAsBinaryString(file); // 以二进制格式读取文件
  } catch (error) {
    console.error("文件处理出错:", error);
    handleError(); // 显示错误提示
  }
};
</script>
