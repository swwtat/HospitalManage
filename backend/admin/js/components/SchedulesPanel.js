export default {
  name:'SchedulesPanel',
  props:{
    depts:{ type:Array, default:()=>[] },
    doctors:{ type:Array, default:()=>[] },
    filteredDoctors:{ type:Array, default:()=>[] },
    sched:{ type:Object, required:true },
    availList:{ type:Array, default:()=>[] },
    schedSubTab:{ type:String, default:'schedule' },
    findDeptName:{ type:Function, required:true },
    findDoctorName:{ type:Function, required:true },
    findDoctorDeptId:{ type:Function, required:true },
    renderTypes:{ type:Function, required:true }
  },
  emits:['update:sched-sub-tab','change-dept','save-availability','delete-availability'],
  template:`
    <div class='panel'>
      <h3>排班与号源设置</h3>
      <div><small>先选择科室，再选择医生；选择日期与时段后设置各号别的容量。</small></div>
      <div class='panel' style='margin-top:8px; padding:8px'>
        <div class='toolbar'>
          <button class='tabBtn' :class="{active:schedSubTab==='schedule'}" @click="$emit('update:sched-sub-tab','schedule')">排班</button>
          <button class='tabBtn' :class="{active:schedSubTab==='sources'}" @click="$emit('update:sched-sub-tab','sources')">号源</button>
          <div class='spacer'></div>
        </div>
      </div>

      <div class='grid' style='margin-top:8px' v-show="schedSubTab==='schedule'">
        <div>
          <label>科室
            <select v-model="sched.deptId" @change="$emit('change-dept')">
              <option value=''>请选择科室</option>
              <option v-for="d in depts" :key="'s'+d.id" :value="String(d.id)">{{ d.name }}</option>
            </select>
          </label>
        </div>
        <div>
          <label>医生（仅显示所选科室医生）
            <select v-model="sched.doctorId">
              <option value=''>请选择医生</option>
              <option v-for="d in filteredDoctors" :key="'fd'+d.id" :value="String(d.id)">{{ d.name }}</option>
            </select>
          </label>
        </div>
        <div>
          <label>日期
            <input v-model="sched.date" type='date' />
          </label>
        </div>
      </div>

      <div v-show="schedSubTab==='schedule'" style='margin-top:8px'>
        <label>选择时段（可多选）</label><br/>
        <label><input type='checkbox' value='8-10' v-model="sched.slots" /> 8:00-10:00</label>
        <label><input type='checkbox' value='10-12' v-model="sched.slots" /> 10:00-12:00</label>
        <label><input type='checkbox' value='14-16' v-model="sched.slots" /> 14:00-16:00</label>
        <label><input type='checkbox' value='16-18' v-model="sched.slots" /> 16:00-18:00</label>
        <div><small>提示：如果需要自定义时段请在后台 API 中手动创建（当前界面提供常见时段选择）。</small></div>
      </div>

      <div v-show="schedSubTab==='schedule'" style='margin-top:8px'>
        <h4>号源数量（按类型）</h4>
        <div class='grid'>
          <label>普通
            <input type='number' min='0' v-model.number="sched.cap.normal" />
          </label>
          <label>专家
            <input type='number' min='0' v-model.number="sched.cap.expert" />
          </label>
          <label>特需
            <input type='number' min='0' v-model.number="sched.cap.vip" />
          </label>
        </div>
      </div>

      <div v-show="schedSubTab==='schedule'" style='margin-top:8px'><button @click="$emit('save-availability')">保存排班</button></div>

      <div v-show="schedSubTab==='sources'" style='margin-top:16px'>
        <h4>已保存的号源（表格）</h4>
        <div class='table-wrap'>
          <table class='striped'>
            <thead><tr><th>ID</th><th>医生</th><th>科室</th><th>日期</th><th>时段</th><th>号源(类型:数量)</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="r in availList" :key="r.id">
                <td>{{ r.id }}</td>
                <td>{{ findDoctorName(r.doctor_id) }}</td>
                <td>{{ findDeptName(findDoctorDeptId(r.doctor_id)) }}</td>
                <td>{{ r.date || '' }}</td>
                <td>{{ r.slot || '' }}</td>
                <td>{{ renderTypes(r) }}</td>
                <td><button @click="$emit('delete-availability', r.id)">删除</button></td>
              </tr>
              <tr v-if="availList.length===0"><td colspan='7' style='text-align:center;color:#888'>暂无号源</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
};
