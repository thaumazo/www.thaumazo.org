export default function FDateRange({ start_date, end_date }) {
  if (!start_date) {
    return null;
  }

  return formatDateRange(start_date, end_date);
}

function formatDateRange(startDateString, endDateString) {
  const startDate = new Date(startDateString);
  const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short" });
  const startMonth = monthFormat.format(startDate);
  const startYear = startDate.getFullYear();

  if (!endDateString) {
    return startMonth + " " + startYear;
  }

  const endDate = new Date(endDateString);
  const endMonth = monthFormat.format(endDate);
  const endYear = endDate.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return startMonth + " " + startYear;
  }

  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${endYear}`;
  }
  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
}
