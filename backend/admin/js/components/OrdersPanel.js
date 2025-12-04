export default {
  name:'OrdersPanel',
  props:{
    orders:{ type:Object, required:true },
    doctors:{ type:Array, default:()=>[] }
  },
  emits:['refresh','cancel-order'],
  template:`
    <div class='panel'>
      <h3>订单管理</h3>
      <div class='grid' style='margin-bottom:8px'>
        <label>医生
          <select v-model="orders.filterDoctorId">
            <option value=''>全部</option>
            <option v-for="d in doctors" :key="'od'+d.id" :value="String(d.id)">{{ d.name }}</option>
          </select>
        </label>
        <label>日期
          <input v-model="orders.filterDate" type='date' />
        </label>
        <label>状态
          <select v-model="orders.filterStatus">
            <option value=''>全部</option>
            <option value='pending'>pending</option>
            <option value='confirmed'>confirmed</option>
            <option value='waiting'>waiting</option>
            <option value='cancelled'>cancelled</option>
            <option value='completed'>completed</option>
          </select>
        </label>
        <div style='display:flex;align-items:end'><button @click="$emit('refresh')">刷新</button></div>
      </div>

      <div class='table-wrap'>
        <table class='striped' style='margin-top:8px'>
          <thead><tr><th>ID</th><th>账户</th><th>医生</th><th>科室</th><th>日期</th><th>时段</th><th>状态</th><th>候补</th><th>支付</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="o in orders.list" :key="o.id">
              <td>{{ o.id }}</td>
              <td>{{ o.account_id }}</td>
              <td>{{ o.doctor_name || o.doctor_id }}</td>
              <td>{{ o.department_name || '' }}</td>
              <td>{{ o.date }}</td>
              <td>{{ o.slot }}</td>
              <td>{{ o.status }}</td>
              <td>{{ o.is_waitlist ? ('pos:'+(((o.wait_position||0)+1))+'/'+(o.wait_total||0)) : '' }}</td>
              <td>{{ o.payment_amount || '' }}</td>
              <td><button @click="$emit('cancel-order', o.id)">取消</button></td>
            </tr>
            <tr v-if="orders.list.length===0"><td colspan='10' style='text-align:center;color:#888'>暂无订单</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
};
