export default {
  name:'DoctorsPanel',
  props:{
    doctors:{ type:Array, default:()=>[] },
    depts:{ type:Array, default:()=>[] },
    doctorForm:{ type:Object, required:true },
    doctorsSubTab:{ type:String, default:'list' },
    findDeptName:{ type:Function, required:true }
  },
  emits:['update:doctors-sub-tab','create-doctor','delete-doctor','set-doctor-pwd'],
  template:`
    <div class='panel'>
      <h3>医生管理</h3>
      <div class='panel' style='margin-top:8px; padding:8px'>
        <div class='toolbar'>
          <button class='tabBtn' :class="{active:doctorsSubTab==='create'}" @click="$emit('update:doctors-sub-tab','create')">创建医生</button>
          <button class='tabBtn' :class="{active:doctorsSubTab==='list'}" @click="$emit('update:doctors-sub-tab','list')">查看医生</button>
          <div class='spacer'></div>
        </div>
      </div>
      <div><small>医生按科室分组，添加医生时请选择其所属科室。表格支持删除医生。</small></div>
      <div class='table-wrap'>
        <table class='striped' style='margin-top:8px'>
          <thead><tr><th>ID</th><th>姓名</th><th>职称</th><th>科室</th><th>联系方式</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="d in doctors" :key="d.id" v-if="doctorsSubTab==='list'">
              <td>{{ d.id }}</td>
              <td>{{ d.name }}</td>
              <td>{{ d.title || '' }}</td>
              <td>{{ findDeptName(d.department_id) }}</td>
              <td>{{ d.contact || '' }}</td>
              <td>
                <div class='compact-actions'>
                  <button class='compact-btn' @click="$emit('set-doctor-pwd', d.id)">设置密码</button>
                  <button class='compact-btn' @click="$emit('delete-doctor', d.id)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="doctors.length===0"><td colspan='6' style='text-align:center;color:#888'>暂无医生</td></tr>
          </tbody>
        </table>
      </div>

      <article v-show="doctorsSubTab==='create'" style='margin-top:10px'>
        <div class='grid'>
          <div>
            <label>姓名
              <input v-model.trim="doctorForm.name" placeholder='医生名' />
            </label>
          </div>
          <div>
            <label>职称
              <input v-model.trim="doctorForm.title" placeholder='职称' />
            </label>
          </div>
          <div>
            <label>联系方式
              <input v-model.trim="doctorForm.contact" placeholder='联系方式' />
            </label>
          </div>
          <div>
            <label>所属科室
              <select v-model="doctorForm.department_id">
                <option v-for="d in depts" :key="'d'+d.id" :value="d.id">{{ d.name }}</option>
              </select>
            </label>
          </div>
        </div>
        <footer>
          <button @click="$emit('create-doctor')">创建医生</button>
        </footer>
      </article>
    </div>
  `
};
