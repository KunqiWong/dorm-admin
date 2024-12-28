<template>
  <div class="flex">
    <!-- 楼栋树区域 -->
    <el-card
      style="
        width: 500px;
        height: 100vh;
        margin-right: 20px;
        overflow: scroll;
        scrollbar-width: none;
      "
    >
      <el-input
        v-model="filterText"
        :placeholder="transformI18n($t('checkIn.inputRoomNum'))"
        style="width: 180px"
        :prefix-icon="Search"
      />
      <el-tree
        :data="buildingTreeData"
        :props="defaultProps"
        highlight-current
        node-key="id"
        @node-click="handleTreeNodeClick"
        :filter-node-method="filterNode"
        :filter-text="filterText"
        ref="treeRef"
      ></el-tree>
    </el-card>
    <el-card>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <!-- 区域信息 -->
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
          <div class="text-lg font-semibold text-gray-700">
            {{ transformI18n($t('checkIn.lifeArea')) }}: {{ restList.length > 0 ? restList[0].lifeArea : "" }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('checkIn.totalCapacity')) }}:
            {{ restList.length > 0 ? parseInt(restList[0].totalCapacity) : 0 }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('checkIn.totalOccupied')) }}:
            {{ restList.length > 0 ? parseInt(restList[0].totalOccupied) : 0 }}
          </div>
          <div class="text-gray-600 text-red-500">
            {{ transformI18n($t('checkIn.occupancyRate')) }}:
            {{ restList.length > 0 ? parseInt(restList[0].occupancyRate) : "" }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('checkIn.occupancyRateTip')) }}: {{ restList.length > 0 ? restList[0].occupancyRate : "" }}%
          </div>
        </div>
        <!-- 楼栋信息 -->
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
          <div class="text-lg font-semibold text-gray-700">
            {{ transformI18n($t('building.buildingNum')) }}: {{ restList.length > 1 ? restList[1].building : "" }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('building.capacity')) }}:
            {{ restList.length > 1 ? parseInt(restList[1].totalCapacity) : 0 }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('building.capacityNum')) }}:
            {{ restList.length > 1 ? parseInt(restList[1].totalOccupied) : 0 }}
          </div>
          <div class="text-gray-600 text-red-500">
            {{ transformI18n($t('checkIn.occupancyRate')) }}:
            {{ restList.length > 1 ? parseInt(restList[1].totalVacancy) : 0 }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('checkIn.occupancyRateTip')) }}: {{ restList.length > 1 ? restList[1].occupancyRate : "" }}%
          </div>
        </div>
        <!-- 楼层信息 -->
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
          <div class="text-lg font-semibold text-gray-700">
            {{ transformI18n($t('building.floor')) }}: {{ restList.length > 2 ? restList[2].floorInfo : "" }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('building.capacity')) }}:
            {{ restList.length > 2 ? parseInt(restList[2].totalCapacity) : 0 }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('building.capacityNum')) }}:
            {{ restList.length > 2 ? parseInt(restList[2].totalOccupied) : 0 }}
          </div>
          <div class="text-gray-600 text-red-500">
            {{ transformI18n($t('checkIn.occupancyRate')) }}:
            {{ restList.length > 2 ? parseInt(restList[2].totalVacancy) : 0 }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('checkIn.occupancyRateTip')) }}: {{ restList.length > 2 ? restList[2].occupancyRate : "" }}%
          </div>
        </div>
        <!-- 房间信息 -->
        <div class="p-4 bg-gray-100 rounded-lg shadow-md">
          <div class="flex">
            <div class="text-lg font-semibold text-gray-700 mr-4">
              {{ transformI18n($t('building.roomNum')) }}: {{ restList.length > 3 ? restList[3].room : "" }}
            </div>
            <div class="text-lg font-semibold text-gray-700">
              {{ transformI18n($t('building.roomType')) }}: {{ roomForm.roomType }}
            </div>
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('building.capacity')) }}:
            {{ restList.length > 3 ? parseInt(restList[3].totalCapacity) : 0 }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('building.capacityNum')) }}:
            {{ restList.length > 3 ? parseInt(restList[3].totalOccupied) : 0 }}
          </div>
          <div class="text-gray-600 text-red-500">
            {{ transformI18n($t('checkIn.occupancyRate')) }}:
            {{ restList.length > 3 ? parseInt(restList[3].totalVacancy) : 0 }}
          </div>
          <div class="text-gray-600">
            {{ transformI18n($t('checkIn.occupancyRateTip')) }}: {{ restList.length > 3 ? restList[3].occupancyRate : "" }}%
          </div>
        </div>
      </div>
      <el-space class="mt-4 mb-4">
        <el-button type="primary" @click="openDialog(roomDetail)">
          <el-icon><Plus /></el-icon>
          {{ transformI18n($t('checkIn.addEmployee')) }}
        </el-button>

        <!-- <el-button type="success" @click="openDialog(onlyOneSelection)"  :disabled="!selection || selectionLength !== 1">
          <el-icon><Edit /></el-icon>
          修改员工
        </el-button>

        <el-button type="danger" @click="confirmDelete(row.id)" :disabled="!selection || selectionLength !== 1">
          <el-icon><Delete /></el-icon>
          删除员工
        </el-button> -->

        <el-button type="warning" @click="openRoomDialog(roomForm)">
          <el-icon><Edit /></el-icon>
          {{ transformI18n($t('checkIn.editRoomInfo')) }}
        </el-button>

        <el-button
          type="success"
          :disabled="!selection || selectionLength !== 1"
          @click="openRoomChangeDialog()"
        >
          <el-icon><Edit /></el-icon>
          {{ transformI18n($t('checkIn.roomChange')) }}
        </el-button>

        <el-button
          type="success"
          :disabled="!selection || selectionLength !== 1"
          @click="exchangeVisible = true"
        >
          <el-icon><Edit /></el-icon>
          {{ transformI18n($t('checkIn.printRoomChange')) }}
        </el-button>

        <el-button
          type="danger"
          :disabled="!selection || selectionLength !== 1"
          @click="checkOutVisible = true"
        >
          <el-icon><Edit /></el-icon>
          {{ transformI18n($t('checkIn.checkOut')) }}
        </el-button>

        <el-button type="primary" @click="printRoom">
          <el-icon><Edit /></el-icon>
          {{ transformI18n($t('checkIn.printDoorplate')) }}
        </el-button>

        <el-button
          type="primary"
          :disabled="!selection || selectionLength !== 1"
          @click="printProof"
        >
          <el-icon><Edit /></el-icon>
          {{ transformI18n($t('checkIn.printCheckOut')) }}
        </el-button>

        <el-button
          type="primary"
          :disabled="!selection || selectionLength !== 1"
          @click="keyVisible = true"
        >
          <el-icon><Edit /></el-icon>
          {{ transformI18n($t('checkIn.printKey')) }}
        </el-button>
      </el-space>

      <el-table
        :data="employeeList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column :label="transformI18n($t('building.operation'))" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openDialog(row)">
              <el-icon><Edit /></el-icon>
              {{ transformI18n($t('building.edit')) }}
            </el-button>
            <el-button type="danger" size="small" @click="confirmDelete(row)">
              <el-icon><Delete /></el-icon>
              {{ transformI18n($t('building.delete')) }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="buildingNum" :label="transformI18n($t('building.buildingNum'))" width="150" />
        <el-table-column prop="floor" :label="transformI18n($t('building.floor'))" width="100" />
        <el-table-column prop="roomNum" :label="transformI18n($t('building.roomNum'))" width="100" />
        <el-table-column prop="roomStandard" :label="transformI18n($t('building.roomStandard'))" width="100" />
        <el-table-column prop="staffNum" :label="transformI18n($t('checkIn.staffNum'))" width="120" />
        <el-table-column prop="staffName" :label="transformI18n($t('checkIn.staffName'))" width="100" />
        <el-table-column prop="sex" :label="transformI18n($t('checkIn.sex'))" width="100" />
        <el-table-column prop="contry" :label="transformI18n($t('checkIn.country'))" width="100" />
        <el-table-column prop="company" :label="transformI18n($t('checkIn.company'))" width="200" />
        <el-table-column prop="dept" :label="transformI18n($t('checkIn.dept'))" width="150" />
        <el-table-column prop="post" :label="transformI18n($t('checkIn.post'))" width="100" />
        <el-table-column prop="phone" :label="transformI18n($t('checkIn.phone'))" width="100" />
        <el-table-column prop="visaType" :label="transformI18n($t('checkIn.visaType'))" width="100" />
        <el-table-column prop="passportNo" :label="transformI18n($t('checkIn.passportNo'))" width="120" />
        <el-table-column prop="bedNum" :label="transformI18n($t('checkIn.bedNum'))" width="100" />
        <el-table-column prop="keyFlag" :label="transformI18n($t('checkIn.keyFlag'))" width="100" />
        <el-table-column prop="checkinDate" :label="transformI18n($t('checkIn.checkinDate'))" width="100" />
        <el-table-column prop="deposit" :label="transformI18n($t('checkIn.deposit'))" width="100" />
        <el-table-column prop="remark" :label="transformI18n($t('checkIn.remark'))" width="300" />
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
          deleteEmployee
            ? deleteEmployee.staffNum + deleteEmployee.staffName
            : "该员工"
        }}"吗？</span
      >
      <div slot="footer" class="dialog-footer flex justify-end">
        <el-button type="primary" @click="deleteRaw">{{ transformI18n($t('permission.sure')) }}</el-button>
        <el-button @click="deleteDialogVisible = false">{{ transformI18n($t('permission.cancel')) }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogVisible" :title="transformI18n($t('title.employeeInfo'))" width="800px">
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="150px"
        class="flex flex-wrap"
      >
        <el-form-item :label="transformI18n($t('building.buildingNum'))" prop="buildingNum">
          <el-input v-model="form.buildingNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.floor'))" prop="floor">
          <el-input v-model="form.floor" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomNum'))" prop="roomNum">
          <el-input v-model="form.roomNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomStandard'))" prop="roomStandard">
          <el-input v-model="form.roomStandard" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.staffNum'))" prop="staffNum">
          <el-input v-model="form.staffNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.staffName'))" prop="staffName">
          <el-input v-model="form.staffName" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.sex'))" prop="sex">
          <el-input v-model="form.sex" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.country'))" prop="contry">
          <el-input v-model="form.contry" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.company'))" prop="company">
          <el-input v-model="form.company" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.dept'))" prop="dept">
          <el-input v-model="form.dept" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.post'))" prop="post">
          <el-input v-model="form.post" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.phone'))" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.visaType'))" prop="visaType">
          <el-input v-model="form.visaType" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.passportNo'))" prop="passportNo">
          <el-input v-model="form.passportNo" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.bedNum'))" prop="bedNum">
          <el-input v-model="form.bedNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.keyFlag'))" prop="keyFlag">
          <el-input v-model="form.keyFlag" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.checkinDate'))" prop="checkinDate">
          <el-date-picker
            v-model="form.checkinDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.deposit'))" prop="deposit">
          <el-input v-model="form.deposit" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.remark'))" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveEmployee">{{ transformI18n($t('permission.submit')) }}</el-button>
        <el-button @click="dialogVisible = false">{{ transformI18n($t('permission.cancel')) }}</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="roomDialogVisible" :title="transformI18n($t('title.roomInfo'))" width="500px">
      <el-form
        :model="roomForm"
        :rules="roomRules"
        ref="roomFormRef"
        label-width="150px"
      >
        <el-form-item :label="transformI18n($t('building.buildingNum'))" prop="buildingNum">
          <el-input v-model="roomForm.buildingNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.floor'))" prop="floor">
          <el-select v-model="roomForm.floor">
            <el-option value="1楼" label="1楼" />
            <el-option value="2楼" label="2楼" />
            <el-option value="3楼" label="3楼" />
            <el-option value="4楼" label="4楼" />
            <el-option value="5楼" label="5楼" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomNum'))" prop="roomNum">
          <el-input v-model="roomForm.roomNum" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.capacity'))" prop="capacity">
          <el-input v-model="roomForm.capacity" type="number" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomStandard'))" prop="roomStandard">
          <el-input v-model="roomForm.roomStandard" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('building.roomType'))" prop="roomType">
          <el-select v-model="roomForm.roomType">
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
        <el-form-item :label="transformI18n($t('checkIn.remark'))" prop="remark">
          <el-input v-model="roomForm.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveRoom">{{ transformI18n($t('permission.submit')) }}</el-button>
        <el-button @click="roomDialogVisible = false">{{ transformI18n($t('permission.cancel')) }}</el-button>
      </template>
    </el-dialog>
    <!-- 房间调换 -->
    <el-dialog v-model="roomChangeDialogVisible" :title="transformI18n($t('checkIn.roomChange'))" width="600px">
      <el-card>
        <template #header>
          <div class="card-header flex flex-wrap justify-between">
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffNum')) }}：</span
              >{{ onlyOneSelection.staffNum }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffName')) }}：</span
              >{{ onlyOneSelection.staffName }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.dept')) }}：</span
              >{{ onlyOneSelection.dept }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.post')) }}：</span
              >{{ onlyOneSelection.post }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.phone')) }}：</span
              >{{ onlyOneSelection.phone }}</span
            >
          </div>
        </template>
        <div class="flex flex-wrap justify-between">
          <el-form
            :model="exchangeApplyForm"
            :rules="exchangeApplyRules"
            ref="exchangeApplyRef"
            class="flex flex-wrap justify-start"
            label-width="150px"
          >
            <el-form-item :label="transformI18n($t('building.buildingNum'))">
              <el-select
                style="width: 200px"
                v-model="exchangeForm.selectedBuilding"
              >
                <el-option
                  v-for="building in buildings"
                  :key="building"
                  :value="building"
                  :label="building"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="transformI18n($t('building.floor'))">
              <el-select
                style="width: 100px"
                v-model="exchangeForm.selectedFloor"
              >
                <el-option
                  v-for="floor in floors"
                  :key="floor"
                  :value="floor"
                  :label="floor"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="transformI18n($t('building.roomNum'))">
              <el-select
                style="width: 100px"
                v-model="exchangeForm.selectedRoom"
                @change="handleRoomChange"
              >
                <el-option
                  v-for="room in rooms"
                  :key="room"
                  :value="room"
                  :label="room"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="transformI18n($t('checkIn.staffName'))">
              <el-select
                style="width: 100px"
                v-model="exchangeForm.selectedStaff"
              >
                <el-option
                  v-for="staff in staffList"
                  :key="staff.id"
                  :value="staff.staffName || staff"
                  :label="staff.staffName || staff"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="transformI18n($t('checkIn.reason'))">
              <el-input v-model="exchangeForm.changeReason" type="textarea" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <el-button type="primary" @click="exchangeRoom">{{ transformI18n($t('checkIn.exchangeRoom')) }}</el-button>
            <el-button @click="roomChangeDialogVisible = false">{{ transformI18n($t('permission.cancel')) }}</el-button>
          </div>
        </template>
      </el-card>
    </el-dialog>
    <!-- 调换申请单 -->
    <el-dialog v-model="exchangeVisible" :title="transformI18n($t('title.roomChangeApply'))" width="600px">
      <el-card>
        <template #header>
          <div class="card-header flex flex-wrap justify-between">
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffNum')) }}：</span
              >{{ onlyOneSelection.staffNum }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffName')) }}：</span
              >{{ onlyOneSelection.staffName }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.dept')) }}：</span
              >{{ onlyOneSelection.dept }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.post')) }}：</span
              >{{ onlyOneSelection.post }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.phone')) }}：</span
              >{{ onlyOneSelection.phone }}</span
            >
          </div>
        </template>
        <div class="flex flex-wrap justify-between">
          <el-form
            :model="exchangeApplyForm"
            :rules="exchangeApplyRules"
            ref="exchangeApplyRef"
            class="flex flex-wrap justify-start flex-col"
            label-width="150px"
          >
            <el-form-item :label="transformI18n($t('checkIn.applyBuilding'))">
              <el-select
                style="width: 200px"
                v-model="exchangeApplyForm.selectedBuilding"
              >
                <el-option
                  v-for="building in buildings"
                  :key="building"
                  :value="building"
                  :label="building"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="transformI18n($t('building.floor'))">
              <el-select
                style="width: 100px"
                v-model="exchangeApplyForm.selectedFloor"
              >
                <el-option
                  v-for="floor in floors"
                  :key="floor"
                  :value="floor"
                  :label="floor"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="transformI18n($t('building.roomNum'))">
              <el-select
                style="width: 100px"
                v-model="exchangeApplyForm.selectedRoom"
                @change="handleRoomChange"
              >
                <el-option
                  v-for="room in rooms"
                  :key="room"
                  :value="room"
                  :label="room"
                />
              </el-select>
            </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.area'))" prop="area" class="flex items-center">
            <el-checkbox @change="checkedCross= false" v-model="checkedSame" :label="transformI18n($t('checkIn.sameArea'))" size="large" />
            <el-checkbox @change="checkedSame= false" v-model="checkedCross" :label="transformI18n($t('checkIn.crossArea'))" size="large" />
        </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <el-button type="primary" @click="exchangeApply">{{ transformI18n($t('checkIn.apply')) }}</el-button>
            <el-button @click="exchangeVisible = false">{{ transformI18n($t('permission.cancel')) }}</el-button>
          </div>
        </template>
      </el-card>
    </el-dialog>
    <!-- 办理退宿 -->
    <el-dialog v-model="checkOutVisible" :title="transformI18n($t('title.checkOut'))" width="600px">
      <el-card>
        <template #header>
          <div class="card-header flex flex-wrap justify-between">
             <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffNum')) }}：</span
              >{{ onlyOneSelection.staffNum }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffName')) }}：</span
              >{{ onlyOneSelection.staffName }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.sex')) }}：</span
              >{{ onlyOneSelection.sex }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.dept')) }}：</span
              >{{ onlyOneSelection.dept }}</span
            >
          </div>
        </template>
        <div class="flex flex-wrap justify-between">
          <el-form
            :model="checkOutForm"
            :rules="checkOutRules"
            ref="checkOutRef"
            class="flex flex-wrap justify-start flex-col"
            label-width="150px"
          >
            <el-form-item :label="transformI18n($t('checkIn.checkOutDate'))" prop="checkOutDate">
              <el-date-picker
                v-model="checkOutForm.checkOutDate"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item :label="transformI18n($t('checkIn.leaveDate'))" prop="leaveDate">
              <el-date-picker
                v-model="checkOutForm.leaveDate"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.keyFlag'))" prop="keyFlag">
          <el-select style="width: 100px" v-model="checkOutForm.keyFlag">
            <el-option value="无" label="无" />
            <el-option value="未退" label="未退" />
            <el-option value="退还" label="退还" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.beddingFlag'))" prop="beddingFlag">
          <el-select style="width: 100px" v-model="checkOutForm.beddingFlag">
            <el-option value="无" label="无" />
            <el-option value="未退" label="未退" />
            <el-option value="退还" label="退还" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.pillowFlag'))" prop="pillowFlag">
          <el-select style="width: 100px" v-model="checkOutForm.pillowFlag">
            <el-option value="无" label="无" />
            <el-option value="未退" label="未退" />
            <el-option value="退还" label="退还" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.basin'))" prop="basin">
          <el-select style="width: 100px" v-model="checkOutForm.basin">
            <el-option value="无" label="无" />
            <el-option value="未退" label="未退" />
            <el-option value="退还" label="退还" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.deposit'))" prop="deposit">
          <el-select style="width: 100px" v-model="checkOutForm.deposit">
            <el-option value="无" label="无" />
            <el-option value="未退" label="未退" />
            <el-option value="退还" label="退还" />
          </el-select>
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.printType'))" prop="printType" class="flex items-center">
            <el-checkbox @change="checkedOuter = false" v-model="checkedInner" :label="transformI18n($t('checkIn.printInner'))" size="large" />
            <el-checkbox @change="checkedInner = false" v-model="checkedOuter" :label="transformI18n($t('checkIn.printOuter'))" size="large" />
        </el-form-item>
        <el-form-item :label="transformI18n($t('checkIn.leaveReason'))" prop="leaveReason">
          <el-select style="width: 100px" v-model="checkOutForm.leaveReason">
            <el-option value="辞职" label="辞职" />
            <el-option value="工程结束" label="工程结束" />
          </el-select>
        </el-form-item>
            <el-form-item :label="transformI18n($t('checkIn.remark'))">
              <el-input v-model="checkOutForm.remark" type="textarea" style="width: 300px" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <el-button type="primary" @click="checkOut" :disabled="!checkOutForm.checkOutDate || !checkOutForm.leaveDate">{{ transformI18n($t('permission.sure')) }}</el-button>
            <el-button @click="checkOutVisible = false">{{ transformI18n($t('permission.cancel')) }}</el-button>
          </div>
        </template>
      </el-card>
    </el-dialog>
    
    <!-- 配备钥匙申请 -->
    <el-dialog v-model="keyVisible" :title="transformI18n($t('title.printKey'))" width="600px">
      <el-card>
        <template #header>
          <div class="card-header flex flex-wrap justify-between">
             <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffNum')) }}：</span
              >{{ onlyOneSelection.staffNum }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.staffName')) }}：</span
              >{{ onlyOneSelection.staffName }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.sex')) }}：</span
              >{{ onlyOneSelection.sex }}</span
            >
            <span
              ><span class="font-bold">{{ transformI18n($t('checkIn.dept')) }}：</span
              >{{ onlyOneSelection.dept }}</span
            >
          </div>
        </template>
        <div class="flex flex-wrap justify-between">
          <el-form
            :model="keyForm"
            :rules="keyRules"
            ref="keyRef"
            class="flex flex-wrap justify-start flex-col"
            label-width="150px"
          >
          <el-form-item :label="transformI18n($t('checkIn.num'))">
              <el-input v-model="keyForm.num" style="width: 200px"  />
            </el-form-item>
            <el-form-item :label="transformI18n($t('checkIn.reason'))">
              <el-input v-model="keyForm.reason" type="textarea" style="width: 300px" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <el-button type="primary" @click="printKey">{{ transformI18n($t('checkIn.apply')) }}</el-button>
            <el-button @click="keyVisible = false">{{ transformI18n($t('permission.cancel')) }}</el-button>
          </div>
        </template>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
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
import {
  getBuildingTreeData,
  getEmployeeListByBuilding,
  getInfoRest,
  exchangeStaffRoom,
  exchangeRoomApply
} from "@/api/checkin";
import {checkOutStaff} from "@/api/checkout";
import { getBuildingRoom, saveBuildingInfo } from "@/api/building";
import { transformI18n,$t } from "@/plugins/i18n";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Pagination variables
const currentPage = ref(1);
const pageSize = ref(8);
const total = ref(0); // Total count
const employeeList = ref<any[]>([]); 
const restList = ref<any[]>([]); 
const roomForm = ref<any>({}); 
const checkedInner = ref(true)
const checkedOuter = ref(false)
const checkedSame = ref(true)
const checkedCross = ref(false)
const exchangeVisible = ref(false)

// Delete confirmation dialog state
const deleteDialogVisible = ref(false);
const deleteEmployee = ref<any>(null);

const roomDialogVisible = ref(false);
const roomChangeDialogVisible = ref(false);
const checkOutVisible = ref(false)
const keyVisible = ref(false)
// 存储解析数据
const parsedData = ref<any[]>([]);
const refreshQuery = ref("");

// Fetch employee list with pagination
// const fetchEmployeeList = async () => {
//   try {
//     const response = await getEmployeeList({
//       pageNo: currentPage.value,
//       pageSize: pageSize.value,
//     });
//     console.log(response);
//     employeeList.value = response.list;
//     total.value = response.total;
//   } catch (error) {
//     ElMessage.error("获取员工列表失败！");
//   }
// };

// Handle page change
const handlePageChange = async (page: number) => {
  currentPage.value = page;
  const response = await getEmployeeListByBuilding({
    query: refreshQuery.value,
    pageNo: currentPage.value,
    pageSize: pageSize.value
  });
  employeeList.value = response.list;
  total.value = response.total;
};
const keyForm = ref({
  num: "1",
  reason: ""
});
const checkOutForm = ref({
  staffId:"",
  roomInfo:"",
  staffName:"",
  sex:"",
  dept:"",
  checkinDate: "",
  checkOutDate: "",
  leaveDate: "",
  keyFlag: "",
  beddingFlag: "",
  pillowFlag: "",
  basin: "",
  deposit: "",
  leaveReason: "",
  remark: ""
});
const exchangeForm = ref({
  selectedBuilding: "",
  selectedFloor: "",
  selectedRoom: "",
  selectedStaff: "",
  changeReason: "",
  staffName: "",
  buildingNum: "",
  floor: "",
  roomNum: ""
});
const exchangeApplyForm = ref({
  selectedBuilding: "",
  selectedFloor: "",
  selectedRoom: "",
  staffName: "",
  buildingNum: "",
  floor: "",
  roomNum: ""
});
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
const keyRules = {
  num: [{ required: true, message: "数量不能为空", trigger: "blur" }],
};
const rules = {
  buildingNum: [{ required: true, message: "楼栋不能为空", trigger: "blur" }],
  floor: [{ required: true, message: "楼层不能为空", trigger: "blur" }],
  roomNum: [{ required: true, message: "房间号不能为空", trigger: "blur" }],
  staffName: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
};
const formRef = ref();

const roomRules = {
  buildingNum: [{ required: true, message: "楼栋不能为空", trigger: "blur" }],
  floor: [{ required: true, message: "楼层不能为空", trigger: "blur" }],
  roomNum: [{ required: true, message: "房间号不能为空", trigger: "blur" }]
};
const roomFormRef = ref();
const exchangeRules = {
  selectedBuilding: [
    { required: true, message: "楼栋不能为空", trigger: "blur" }
  ],
  selectedFloor: [{ required: true, message: "楼层不能为空", trigger: "blur" }],
  selectedRoom: [
    { required: true, message: "房间号不能为空", trigger: "blur" }
  ],
  selectedStaff: [
    { required: true, message: "对调人员不能为空", trigger: "blur" }
  ]
};
const exchangeApplyRules = {
  selectedBuilding: [{ required: true, message: "楼栋不能为空", trigger: "blur" }],
  selectedFloor: [{ required: true, message: "楼层不能为空", trigger: "blur" }],
  selectedRoom: [{ required: true, message: "房间号不能为空", trigger: "blur" }],
};
const checkOutRules = {
  checkOutDate: [{ required: true, message: "退宿日期不能为空", trigger: "blur" }],
  leaveDate: [{ required: true, message: "出矿日期不能为空", trigger: "blur" }],
};
const exchangeRef = ref();
// Open dialog
const openDialog = (row: any) => {
  console.log(row);
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

const openRoomDialog = (row: any) => {
  // console.log(row);
  if (row) {
    roomForm.value = { ...row };
  } else {
    roomForm.value = {
      buildingNum: "",
      floor: "",
      roomNum: "",
      capacity: "",
      roomStandard: "",
      roomType: "",
      remark: ""
    };
  }
  roomDialogVisible.value = true;
};

const openRoomChangeDialog = (row: any) => {
  // console.log(row);
  roomChangeDialogVisible.value = true;
};

// Save employee
const saveEmployee = async () => {
  try {
    await formRef.value.validate();
    await saveEmployeeInfo(form.value);
    ElMessage.success("保存成功！");
    dialogVisible.value = false;
    const response = await getEmployeeListByBuilding({
      query: refreshQuery.value,
      pageNo: currentPage.value,
      pageSize: pageSize.value
    });

    employeeList.value = response.list;
    total.value = response.total;
  } catch (error) {
    ElMessage.error("保存失败！");
  }
};

// 保存房间信息
const saveRoom = async () => {
  try {
    await roomFormRef.value.validate();
    await saveBuildingInfo(roomForm.value);
    ElMessage.success("保存成功！");
    roomDialogVisible.value = false;
    const response = await getEmployeeListByBuilding({
      query: refreshQuery.value,
      pageNo: currentPage.value,
      pageSize: pageSize.value
    });

    employeeList.value = response.list;
    total.value = response.total;
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
      const response = await getEmployeeListByBuilding({
        query: refreshQuery.value,
        pageNo: currentPage.value,
        pageSize: pageSize.value
      });

      employeeList.value = response.list;
      total.value = response.total;
    }
  } catch (error) {
    ElMessage.error("删除失败！");
  } finally {
    deleteDialogVisible.value = false;
    deleteEmployee.value = null;
  }
};

// 楼栋树数据
const buildingTreeData = ref([]);
const defaultProps = {
  children: "children",
  label: "label"
};

// 获取楼栋树数据
const fetchBuildingTreeData = async () => {
  try {
    const response = await getBuildingTreeData();
    buildingTreeData.value = response.data;
    // console.log(response);
  } catch (error) {
    ElMessage.error("获取楼栋树数据失败！");
  }
};

interface Tree {
  [key: string]: any;
}

const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const roomDetail = ref({
  buildingNum: "",
  floor: "",
  roomNum: ""
});

watch(filterText, val => {
  treeRef.value!.filter(val.toUpperCase());
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
// 树节点点击事件
const handleTreeNodeClick = async node => {
  try {
    // 初始化 query 为空
    let query = "";

    // 生成查询条件，确保父节点和当前节点存在
    if (node.parentLabel && node.label) {
      query = node.parentLabel + "*" + node.label;
      const list = query.split("*");
      roomDetail.value = {
        buildingNum: list[0],
        floor: list.length > 1 ? list[1] : "",
        roomNum: list.length > 2 ? list[2] : ""
      };
      if (list.length == 3) {
        const roomResponse = await getBuildingRoom({ ...roomDetail.value });
        // console.log(roomResponse);
        roomForm.value = roomResponse.data;
      }
      // console.log(roomDetail.value);
      // console.log("查询条件:", query);
    } else {
      // 如果没有父节点或当前节点，输出提示信息
      query = node.label;
      roomDetail.value = {
        buildingNum: query,
        floor: "",
        roomNum: ""
      };
    }

    // 确保 query 已经生成，才发起请求
    if (query) {
      refreshQuery.value = query;
      // 发起请求，带上 query 参数
      const response = await getEmployeeListByBuilding({
        query: query,
        pageNo: currentPage.value,
        pageSize: pageSize.value
      });
      //实时空位获取
      const restResponse = await getInfoRest({
        query: query
      });
      restList.value = restResponse.data;
      // console.log(restList.value);
      // 处理响应数据
      employeeList.value = response.list;
      total.value = response.total;
    }
  } catch (error) {
    // 错误处理
    ElMessage.error("获取员工信息失败！");
  }
};
const staffList = ref(["调入房间"]);
const handleRoomChange = async room => {
  let query =
    exchangeForm.value.selectedBuilding +
    "*" +
    exchangeForm.value.selectedFloor +
    "*" +
    exchangeForm.value.selectedRoom;
  const response = await getEmployeeListByBuilding({
    query: query,
    pageNo: currentPage.value,
    pageSize: pageSize.value
  });
  // console.log(response);
  staffList.value = ["调入房间", ...response.list];
};
// 动态计算楼栋、楼层和房间选项
const buildings = computed(() => {
  return buildingTreeData.value.map(b => b.label) || [];
});
const floors = computed(() => {
  const building = buildingTreeData.value.find(
    b => b.label === exchangeForm.value.selectedBuilding||b.label === exchangeApplyForm.value.selectedBuilding
  );
  return building?.children.map(floor => floor.label) || [];
});

const rooms = computed(() => {
  const building = buildingTreeData.value.find(
    b => b.label === exchangeForm.value.selectedBuilding||b.label === exchangeApplyForm.value.selectedBuilding
  );
  const floor = building?.children.find(
    f => f.label === exchangeForm.value.selectedFloor||f.label === exchangeApplyForm.value.selectedFloor
  );
  return floor?.children.map(room => room.label) || [];
});
const exchangeRoom = async () => {
  await exchangeStaffRoom(exchangeForm.value);
  console.log(exchangeForm.value);
  ElMessage.success("调换成功！");
  roomChangeDialogVisible.value = false;
  const response = await getEmployeeListByBuilding({
    query: refreshQuery.value,
    pageNo: currentPage.value,
    pageSize: pageSize.value
  });

  employeeList.value = response.list;
  total.value = response.total;
};
const exchangeApply = async () => {
  await exchangeRoomApply(exchangeApplyForm.value);
  ElMessage.success("申请成功！");
  if(checkedSame.value){
    printApply();
  }else{
    printCrossApply();
  }
  exchangeVisible.value = false;
}
function formatDate(date) {
  if (!date) return ""; // 如果没有日期，返回空字符串
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // 获取月份并确保两位数
  const day = String(d.getDate()).padStart(2, "0"); // 获取日期并确保两位数
  return `${year}-${month}-${day}`; // 返回格式化的日期
}
const checkOut = async ()=>{
  checkOutForm.value.roomInfo = onlyOneSelection.value.buildingNum+onlyOneSelection.value.floor+onlyOneSelection.value.roomNum;
  checkOutForm.value.staffName = onlyOneSelection.value.staffName;
  checkOutForm.value.staffNum = onlyOneSelection.value.staffNum;
  checkOutForm.value.sex = onlyOneSelection.value.sex;
  checkOutForm.value.dept = onlyOneSelection.value.dept;
  checkOutForm.value.checkinDate = onlyOneSelection.value.checkinDate;
  checkOutForm.value.checkOutDate = formatDate(checkOutForm.value.checkOutDate);
  checkOutForm.value.leaveDate = formatDate(checkOutForm.value.leaveDate);
  checkOutForm.value.staffId = onlyOneSelection.value.id;
  await checkOutStaff(checkOutForm.value)
  ElMessage.success("退宿成功！");
  if(checkedInner.value){
    printProof();
  }else{
    printOutProof();
  }
  const response = await getEmployeeListByBuilding({
    query: refreshQuery.value,
    pageNo: currentPage.value,
    pageSize: pageSize.value
  });
  checkOutVisible.value = false
  employeeList.value = response.list;
  total.value = response.total;
}

const selection = ref([]);
const selectionLength = ref(0);
const onlyOneSelection = ref({});
const handleSelectionChange = data => {
  selectionLength.value = data.length;
  if (data.length == 1) {
    onlyOneSelection.value = data[0];
    selection.value = data;
    exchangeForm.value.staffName = onlyOneSelection.value.staffName;
    exchangeForm.value.buildingNum = onlyOneSelection.value.buildingNum;
    exchangeForm.value.floor = onlyOneSelection.value.floor;
    exchangeForm.value.roomNum = onlyOneSelection.value.roomNum;
    exchangeApplyForm.value.staffName = onlyOneSelection.value.staffName;
    exchangeApplyForm.value.buildingNum = onlyOneSelection.value.buildingNum;
    exchangeApplyForm.value.floor = onlyOneSelection.value.floor;
    exchangeApplyForm.value.roomNum = onlyOneSelection.value.roomNum;
  }
};
//打印退宿证明
const printProof = () => {
  const reportPath = "http://10.1.11.40/decision/view/report?viewlet=dorm/checkout.cpt&op=view"; // 报表路径

  window.open(reportPath+`&staffName=${onlyOneSelection.value.staffName}&roomNum=${onlyOneSelection.value.roomNum}`, "_blank");
};
//打印外协退宿证明
const printOutProof = () => {
  const reportPath = "http://10.1.11.40/decision/view/report?viewlet=dorm/checkout_outer.cpt"; // 报表路径

  window.open(reportPath+`&staffName=${onlyOneSelection.value.staffName}&roomNum=${onlyOneSelection.value.roomNum}`, "_blank");
};
//打印门牌
const printRoom = () => {
  const reportPath = "http://10.1.11.40/decision/view/report?viewlet=dorm/%25E9%2597%25A8%25E7%2589%258C.cpt&op=view"; // 报表路径
  if(roomDetail.value.roomNum) {
    window.open(reportPath+`&buildingNum=${roomDetail.value.buildingNum}&roomNum=${roomDetail.value.roomNum}`, "_blank");
  } else {
    window.open(reportPath+`&buildingNum=${onlyOneSelection.value.buildingNum}&roomNum=${onlyOneSelection.value.roomNum}`, "_blank");
  }
};
//打印钥匙
const printKey = () => {
  const reportPath = "http://10.1.11.40/decision/view/report?viewlet=dorm/%25E9%2592%25A5%25E5%258C%2599%25E7%2594%25B3%25E8%25AF%25B7%25E5%258D%2595.cpt"; // 报表路径

  window.open(reportPath+`&staffName=${onlyOneSelection.value.staffName}&roomNum=${onlyOneSelection.value.roomNum}&keyNum=${keyForm.value.num}&reason=${keyForm.value.reason}`, "_blank");
};
//打印跨区调换申请
const printCrossApply = () => {
  const reportPath = "http://10.1.11.40/decision/view/report?viewlet=dorm/%25E8%25B7%25A8%25E5%258C%25BA%25E5%25AE%25BF%25E8%2588%258D%25E8%25B0%2583%25E6%258D%25A2%25E7%2594%25B3%25E8%25AF%25B7%25E5%258D%2595.cpt"; // 报表路径
  window.open(reportPath+`&staffName=${onlyOneSelection.value.staffName}&staffNum=${onlyOneSelection.value.staffNum}`, "_blank");
};
//打印内调申请
const printApply = () => {
  const reportPath = "http://10.1.11.40/decision/view/report?viewlet=dorm/%25E5%2590%258C%25E5%258C%25BA%25E5%25AE%25BF%25E8%2588%258D%25E8%25B0%2583%25E6%258D%25A2%25E7%2594%25B3%25E8%25AF%25B7%25E5%258D%2595.cpt"; // 报表路径
  window.open(reportPath+`&staffName=${onlyOneSelection.value.staffName}&staffNum=${onlyOneSelection.value.staffNum}&roomInfo=${exchangeApplyForm.value.selectedBuilding+exchangeApplyForm.value.selectedFloor+exchangeApplyForm.value.selectedRoom}`, "_blank");
};

onMounted(() => {
  fetchBuildingTreeData();
});
</script>

<style scoped>
.mt-4 {
  margin-top: 20px;
}
</style>
