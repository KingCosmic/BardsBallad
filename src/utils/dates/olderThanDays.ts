
export default (date: number | string | Date, days: number = 7) => {
  const DaysAgo = new Date();
  DaysAgo.setDate(DaysAgo.getDate() - days);

  return new Date(date) < DaysAgo
}