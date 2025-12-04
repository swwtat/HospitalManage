export default {
  name:'DeptsPanel',
  props:{
    depts:{ type:Array, default:()=>[] },
    deptForm:{ type:Object, required:true },
    deptsSubTab:{ type:String, default:'list' },
    findDeptName:{ type:Function, required:true }
  },
  emits:['update:depts-sub-tab','create-dept','delete-dept'],
  template:`
    <div class='panel'>
      <h3>科室管理</h3>
      <div class='panel' style='margin-top:8px; padding:8px'>
        <div class='toolbar'>
          <button class='tabBtn' :class="{active:deptsSubTab==='create'}" @click="$emit('update:depts-sub-tab','create')">创建科室</button>
          <button class='tabBtn' :class="{active:deptsSubTab==='list'}" @click="$emit('update:depts-sub-tab','list')">查看科室</button>
          <div class='spacer'></div>
        </div>
      </div>

      <div v-show="deptsSubTab==='list'">
        <div style='margin-bottom:8px'><small>科室列表（表格） — 可以删除已有科室。删除将会删除与之直接关联的数据，请谨慎操作。</small></div>
        <div class='table-wrap'>
          <table class='striped'>
            <thead><tr><th>ID</th><th>名称</th><th>父科室</th><th>Code</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="d in depts" :key="d.id">
                <td>{{ d.id }}</td>
                <td>{{ d.name }}</td>
                <td>{{ findDeptName(d.parent_id) }}</td>
                <td>{{ d.code || '' }}</td>
                <td><button @click="$emit('delete-dept', d.id)">删除</button></td>
              </tr>
              <tr v-if="depts.length===0"><td colspan='5' style='text-align:center;color:#888'>暂无科室</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <article v-show="deptsSubTab==='create'" style='margin-top:10px'>
        <div class='grid'>
          <div>
            <label>科室名
              <input v-model.trim="deptForm.name" placeholder='科室名' />
            </label>
          </div>
          <div>
            <label>Code（可选）
              <input v-model.trim="deptForm.code" placeholder='Code (可选)' />
            </label>
          </div>
          <div>
            <label>父科室（可选）
              <select v-model="deptForm.parent_id">
                <option value=''>无</option>
                <option v-for="d in depts" :key="'p'+d.id" :value="d.id">{{ d.name }}</option>
              </select>
            </label>
          </div>
        </div>
        <footer>
          <button @click="$emit('create-dept')">创建科室</button>
        </footer>
      </article>
    </div>
  `
};
