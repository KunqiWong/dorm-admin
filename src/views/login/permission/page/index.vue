<template>
  <div class="p-6">
    <!-- 搜索区域 -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <el-form :model="queryParams" label-width="120px">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <el-form-item label="用户名 User">
            <el-input v-model="queryParams.userName" placeholder="用户名 User" clearable 
                     class="w-full" />
          </el-form-item>
          <el-form-item label="状态 Status">
            <el-select v-model="queryParams.status" placeholder="状态 Status" clearable
                      class="w-full">
              <el-option
                v-for="(item, index) in statuses"
                :label="item.label"
                :value="item.value"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="flex gap-2">
              <el-button type="info" plain icon="el-icon-search" @click="handleQuery"
                        class="hover:bg-gray-100">
                搜索 Mencari
              </el-button>
              <el-button type="success" plain icon="el-icon-plus" @click="handleAdd"
                        class="hover:bg-green-50">
                添加 Tambah
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <el-table 
        v-loading="loading" 
        :data="adminList" 
        border 
        stripe 
        class="w-full"
      >
        <el-table-column 
          align="center" 
          prop="userName" 
          label="用户名 User" 
          min-width="160"
          class="px-4 py-2" 
        />
        <el-table-column 
          align="center" 
          prop="status" 
          label="状态 Status" 
          min-width="120"
        >
          <template #default="{ row }">
            <span :class="[
              'px-2 py-1 rounded-full text-sm',
              row.status === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              {{ getStatus(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          align="center" 
          prop="createdAt" 
          label="创建时间 Tanggal" 
          min-width="180" 
        />
        <el-table-column 
          label="操作 Operasi" 
          align="center"
          min-width="200"
        >
          <template #default="{ row }">
            <div class="flex justify-center gap-2">
              <el-button 
                size="small"
                class="hover:bg-blue-50"
                @click="handleReset(row.userName)"
              >
                重置密码 Reset Password
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                plain 
                :class="[
                  'hover:bg-red-50',
                  row.status === 1 ? 'text-green-600' : 'text-red-600'
                ]"
                @click="handleChange(row)"
              >
                {{ row.status === 1 ? '启用 Aktif' : '禁用 Nonaktif' }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="mt-4 flex justify-end bg-white p-4 rounded-lg shadow">
      <el-pagination
        :current-page="queryParams.pageNo"
        :page-sizes="pageSizes"
        :page-size="queryParams.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination-container"
      />
    </div>

    <!-- 弹窗表单 -->
    <el-dialog 
      title="添加账号 Add User" 
      v-model="open" 
      width="500px" 
      append-to-body
      class="rounded-lg"
    >
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-position="right" 
        label-width="100px"
        class="p-4"
      >
        <el-form-item label="用户名 User" prop="userName">
          <el-input v-model="form.userName" placeholder="Nama" class="w-full" />
        </el-form-item>
        <el-form-item label="密码 " prop="password">
          <el-input type="password" v-model="form.password" placeholder="Password" class="w-full" />
        </el-form-item>
        <el-form-item label="确认密码" prop="ensurePassword">
          <el-input type="password" v-model="form.ensurePassword" placeholder="Ulangi Password" class="w-full" />
        </el-form-item>
        <el-form-item>
          <div class="flex justify-end gap-2">
            <el-button 
              icon="el-icon-close" 
              @click="open = false"
              class="hover:bg-gray-100"
            >
              取消 Batal
            </el-button>
            <el-button 
              type="primary" 
              plain 
              icon="el-icon-check" 
              @click="submit"
              class="hover:bg-blue-50"
            >
              提交 Simpan
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getAdminList, changeAdmin, createAdmin, resetAdmin } from '@/api/user'
import { useI18n } from "vue-i18n";
import { $t, transformI18n } from "@/plugins/i18n";

// 响应式状态
const loading = ref(false)
const open = ref(false)
const total = ref(0)
const adminList = ref([])
const formRef = ref<FormInstance>()

const pageSizes = [10, 20, 30, 40]

const { t } = useI18n();

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userName: '',
  status: ''
})

const form = reactive({
  userName: '',
  password: '',
  ensurePassword: ''
})

const statuses = [
  { label: '启用 Aktif', value: 0 },
  { label: '禁用 Nonaktif', value: 1 }
]

// 表单验证规则
const validatePass1 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please Input'))
  } else {
    if (form.ensurePassword !== '') {
      formRef.value?.validateField('ensurePassword')
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please Input Password Again'))
  } else if (value !== form.password) {
    callback(new Error('Two Password Error'))
  } else {
    callback()
  }
}

const rules = {
  userName: [{ required: true, message: 'Please Input', trigger: 'blur' }],
  password: [{ validator: validatePass1, trigger: 'blur' }],
  ensurePassword: [{ validator: validatePass2, trigger: 'blur' }]
}

// 方法
const getList = async () => {
  loading.value = true
  try {
    const resp = await getAdminList(queryParams)
    adminList.value = resp.list
    total.value = resp.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const handleAdd = () => {
  form.userName = ''
  form.password = ''
  form.ensurePassword = ''
  open.value = true
}

const submit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await createAdmin(form)
        ElMessage.success('创建成功')
        open.value = false
        getList()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const handleReset = (userName: string) => {
  ElMessageBox.confirm(`此操作将重置 ${userName} 密码, 是否继续?`, '提示', {
    confirmButtonText: '确定 Simpan',
    cancelButtonText: '取消 Batal',
    type: 'warning'
  })
    .then(async () => {
      await resetAdmin(userName)
      ElMessage.success('操作成功 Berhasil !')
      getList()
    })
    .catch(() => {
      ElMessage.info('已取消操作 Batal Pengoperasian')
    })
}

const handleChange = (row: any) => {
  ElMessageBox.confirm(`${row.status === 1 ? ' 启用 ' : ' 禁用 '} 该用户？`, '提示', {
    confirmButtonText: '确定 Simpan',
    cancelButtonText: '取消 Batal',
    type: 'warning'
  })
    .then(async () => {
      await changeAdmin({ userName: row.userName, status: row.status === 1 ? 0 : 1 })
      ElMessage.success('操作成功 Berhasil !')
      getList()
    })
    .catch(() => {
      ElMessage.info('已取消操作 Batal Pengoperasian')
    })
}

const getStatus = (status: number) => {
  return status === 0 ? '启用 Aktif' : '禁用 Nonaktif'
}

const getStatusColor = (status: number) => {
  return status === 0 ? 'green' : 'red'
}

const handleCurrentChange = (pageNo: number) => {
  queryParams.pageNo = pageNo
  getList()
}

const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  getList()
}

// 生命周期钩子
onMounted(() => {
  getList()
})
</script>

<style scoped>
/* 可以添加一些自定义样式来补充Tailwind */
.pagination-container :deep(.el-pagination) {
  @apply flex items-center justify-end;
}

.pagination-container :deep(.el-pagination button) {
  @apply bg-white hover:bg-gray-50;
}

.pagination-container :deep(.el-pager li) {
  @apply bg-white hover:bg-gray-50;
}

.pagination-container :deep(.el-pagination.is-background .el-pager li.active) {
  @apply bg-blue-500 text-white;
}
</style>