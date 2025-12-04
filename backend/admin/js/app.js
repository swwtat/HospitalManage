import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js';
import DeptsPanel from './components/DeptsPanel.js';
import DoctorsPanel from './components/DoctorsPanel.js';
import SchedulesPanel from './components/SchedulesPanel.js';
import OrdersPanel from './components/OrdersPanel.js';

// Shared utilities and API helper
const stateFactory = () => ({
  authed: !!localStorage.getItem('admin_token'),
  curTab: 'depts',
  sidebarOpen: false,
  login: { username:'', password:'', loading:false, msg:'' },
  depts: [],
  doctors: [],
  deptForm: { name:'', code:'', parent_id:'' },
  doctorForm: { name:'', title:'', contact:'', department_id:'' },
  sched: { deptId:'', doctorId:'', date:'', slots:[], cap:{ normal:5, expert:2, vip:1 } },
  availList: [],
  schedSubTab: 'schedule',
  deptsSubTab: 'list',
  orders: { filterDoctorId:'', filterDate:'', filterStatus:'', list:[] },
  doctorsSubTab: 'list'
});

const api = async (path, opts={}) => {
  opts.headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
  const token = localStorage.getItem('admin_token');
  if(token) opts.headers['Authorization'] = 'Bearer '+token;
  if(opts.body && typeof opts.body !== 'string') opts.body = JSON.stringify(opts.body);
  const res = await fetch(path, opts);
  if(res.status === 401){
    localStorage.removeItem('admin_token');
    alert('登录已过期，请重新登录');
    return { success:false, message:'Unauthorized', status:401 };
  }
  try{ return await res.json(); } catch(e){ return { success:false, message:'invalid json' }; }
};

// Root app
createApp({
  data(){
    return stateFactory();
  },
  components:{
    DeptsPanel,
    DoctorsPanel,
    SchedulesPanel,
    OrdersPanel
  },
  computed:{
    filteredDoctors(){
      if(!this.sched.deptId) return this.doctors;
      return this.doctors.filter(d=> String(d.department_id) === String(this.sched.deptId));
    }
  },
  methods:{
    applyTheme(t){ document.documentElement.setAttribute('data-theme', t); },
    toggleTheme(){
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      this.applyTheme(next);
      localStorage.setItem('theme', next);
    },
    async doLogin(){
      this.login.loading = true; this.login.msg='';
      const res = await api('/auth/login', { method:'POST', body:{ username:this.login.username, password:this.login.password } });
      this.login.loading = false;
      if(res && res.success){
        const token = res.token || (res.data && res.data.token);
        if(token) localStorage.setItem('admin_token', token);
        this.authed = true;
        this.curTab = 'depts';
        await this.loadAll();
      }else{
        this.login.msg = (res && res.message) || '登录失败';
      }
    },
    async loadAll(){
      await this.loadDepts();
      await this.loadDoctors();
      await this.fetchAvailabilitiesForCurrent();
    },
    async loadDepts(){
      const res = await api('/api/admin/departments');
      this.depts = res && res.success ? (res.data||[]) : [];
      if(this.deptForm.parent_id && !this.depts.find(d=>String(d.id)===String(this.deptForm.parent_id))){ this.deptForm.parent_id=''; }
    },
    async createDept(){
      if(!this.deptForm.name){ alert('请输入科室名'); return; }
      await api('/api/admin/departments',{ method:'POST', body:{ name:this.deptForm.name, code:this.deptForm.code, parent_id:this.deptForm.parent_id||null }});
      this.deptForm = { name:'', code:'', parent_id:'' };
      await this.loadDepts();
    },
    async delDept(id){
      if(!confirm('确认删除科室 ID='+id+' ?')) return;
      const r = await api('/api/admin/departments/'+id, { method:'DELETE' });
      if(r && r.success) await this.loadDepts(); else alert('删除失败: '+(r.message||JSON.stringify(r)));
    },
    async loadDoctors(){
      const res = await api('/api/admin/doctors');
      this.doctors = res && res.success ? (res.data||[]) : [];
      if(this.doctorForm.department_id && !this.depts.find(d=>String(d.id)===String(this.doctorForm.department_id))){ this.doctorForm.department_id=''; }
    },
    async createDoctor(){
      if(!this.doctorForm.name){ alert('请输入医生姓名'); return; }
      await api('/api/admin/doctors',{ method:'POST', body:{ name:this.doctorForm.name, title:this.doctorForm.title, contact:this.doctorForm.contact, department_id:this.doctorForm.department_id||null }});
      this.doctorForm = { name:'', title:'', contact:'', department_id:'' };
      await this.loadDoctors();
    },
    async setDoctorPwd(id){
      const pwd = prompt('为医生 ID='+id+' 设置新密码（明文）：');
      if(!pwd) return alert('已取消或密码为空');
      const username = prompt('可选：设定登录用户名（留空将使用默认 doctor'+id+'）');
      const body = { password: pwd };
      if(username) body.username = username;
      const r = await api('/api/admin/doctors/'+id+'/set-password',{ method:'POST', body });
      if(r && r.success){ alert('设置成功'); await this.loadDoctors(); } else alert('设置失败: '+((r && r.message) || '未知错误'));
    },
    async delDoctor(id){
      if(!confirm('确认删除医生 ID='+id+' ?')) return;
      const r = await api('/api/admin/doctors/'+id, { method:'DELETE' });
      if(r && r.success) await this.loadDoctors(); else alert('删除失败: '+(r.message||JSON.stringify(r)));
    },
    onSchedDeptChange(){
      this.sched.doctorId = '';
      if(this.schedSubTab==='sources') this.fetchAvailabilitiesForCurrent();
    },
    async fetchAvailabilities(doctorId){
      const url = doctorId ? `/api/admin/availability/${doctorId}` : '/api/admin/availability';
      const res = await api(url);
      this.availList = (res && res.success) ? (res.data||[]) : [];
    },
    async fetchAvailabilitiesForCurrent(){
      if(this.sched.doctorId){ await this.fetchAvailabilities(this.sched.doctorId); }
      else await this.fetchAvailabilities(null);
    },
    async saveAvailability(){
      const doctor_id = this.sched.doctorId;
      const date = this.sched.date;
      const slots = this.sched.slots.slice();
      if(!doctor_id || !date || slots.length===0){ alert('请选择科室/医生/日期/时段'); return; }
      const capacity_types = { '普通': Number(this.sched.cap.normal||0), '专家': Number(this.sched.cap.expert||0), '特需': Number(this.sched.cap.vip||0) };
      const capacity = Object.values(capacity_types).reduce((a,b)=>a+Number(b||0),0);
      for(const slot of slots){
        await api('/api/admin/availability',{ method:'POST', body:{ doctor_id: parseInt(doctor_id,10), date, slot, capacity, extra:{ capacity_types, booked_types: {} } }});
      }
      alert('排班已保存');
      await this.fetchAvailabilitiesForCurrent();
    },
    async delAvailability(id){
      if(!confirm('确认删除该排班 ID='+id+' ?')) return;
      const r = await api('/api/admin/availability/'+id, { method:'DELETE' });
      if(r && r.success){ await this.fetchAvailabilitiesForCurrent(); } else alert('删除失败: '+(r.message||JSON.stringify(r)));
    },
    async fetchOrders(){
      let q = '/api/admin/orders?';
      if(this.orders.filterDoctorId) q += 'doctor_id='+encodeURIComponent(this.orders.filterDoctorId)+'&';
      if(this.orders.filterDate) q += 'date='+encodeURIComponent(this.orders.filterDate)+'&';
      if(this.orders.filterStatus) q += 'status='+encodeURIComponent(this.orders.filterStatus)+'&';
      const res = await api(q);
      this.orders.list = (res && res.success) ? (res.data||[]) : [];
    },
    async cancelOrder(id){
      if(!confirm('确认取消订单 ID='+id+' ?')) return;
      const r = await api('/api/registration/cancel', { method:'POST', body:{ order_id: id } });
      if(r && r.success){ alert('已取消'); await this.fetchOrders(); } else alert('取消失败: '+(r.message||JSON.stringify(r)));
    },
    findDeptName(id){ const d = this.depts.find(x=>String(x.id)===String(id)); return d? d.name : ''; },
    findDoctorName(id){ const d = this.doctors.find(x=>String(x.id)===String(id)); return d? d.name : ''; },
    findDoctorDeptId(doctorId){ const d = this.doctors.find(x=>String(x.id)===String(doctorId)); return d? d.department_id : ''; },
    renderTypes(r){
      const types = r && r.extra && r.extra.capacity_types ? r.extra.capacity_types : null;
      if(!types) return '';
      return Object.entries(types).map(([k,v])=>`${k}:${v}`).join(', ');
    },
    async switchTab(t){
      this.curTab = t;
      if(t==='orders') await this.fetchOrders();
      if(t==='schedules' && this.schedSubTab==='sources') await this.fetchAvailabilitiesForCurrent();
    },
    logout(){
      localStorage.removeItem('admin_token');
      this.authed = false;
      this.sidebarOpen = false;
      this.depts = [];
      this.doctors = [];
      this.availList = [];
    }
  },
  mounted(){
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) this.applyTheme(savedTheme);
    else this.applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.sidebarOpen = false;
    if(this.authed){ this.loadAll(); }
  }
}).mount('#app');
