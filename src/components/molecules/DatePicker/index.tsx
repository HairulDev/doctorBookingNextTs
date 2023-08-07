// components/CustomDatePicker.tsx

import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

registerLocale("id", id);

interface CustomDatePickerProps {
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  handleDateChange,
}) => {
  const datePickerStyles = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "5px",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={datePickerStyles}>
      <EventAvailableIcon style={{ marginRight: "5px" }} />
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm:ss"
        dateFormat="yyyy-MM-dd HH:mm:ss"
        locale="id"
      />
    </div>
  );
};

export default CustomDatePicker;
