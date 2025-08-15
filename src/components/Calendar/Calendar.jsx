import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar() {
  const [value, setValue] = useState(new Date());

  return (
    <div>
      <Calendar
        onChange={setValue} // 날짜 클릭 시 상태 업데이트
        value={value} // 현재 선택된 날짜
      />
      <p>선택한 날짜: {value.toDateString()}</p>
    </div>
  );
}

export default MyCalendar;
