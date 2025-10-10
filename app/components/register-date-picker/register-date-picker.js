Component({
  data: {
    today: '',
    selectedDate: '',
    selectedTime: '',
    selectedTimeIndex: 0,
    timeSlots: ['上午 08:00-12:00', '下午 13:00-17:00', '晚上 18:00-21:00']
  },
  lifetimes: {
    attached() {
      const today = this.formatDate(new Date());
      this.setData({ today });
    }
  },
  methods: {
    formatDate(date) {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const d = date.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${d}`;
    },
    onDateChange(e) {
      const date = e.detail.value;
      this.setData({ selectedDate: date });
      this.triggerUpdate();
    },
    onTimeChange(e) {
      const index = e.detail.value;
      this.setData({
        selectedTimeIndex: index,
        selectedTime: this.data.timeSlots[index]
      });
      this.triggerUpdate();
    },
    triggerUpdate() {
      const { selectedDate, selectedTime } = this.data;
      if (selectedDate && selectedTime) {
        this.triggerEvent('timeSelected', {
          date: selectedDate,
          time: selectedTime
        });
      }
    }
  }
});
