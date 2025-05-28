import { differenceInHours, differenceInMinutes } from "date-fns";

export default function TimeInfo({ createdAt }: { createdAt: string }) {
  const minsDiff = differenceInMinutes(createdAt, new Date());
  const hrsDiff = differenceInHours(createdAt, new Date());
  // const monthNames = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];
  const getDiff = () => {
    if (Math.abs(minsDiff) < 60) {
      return `${Math.abs(minsDiff)}m`;
    }
    if (Math.abs(hrsDiff) < 24) {
      return `${Math.abs(hrsDiff)}h`;
    }
    return new Date(createdAt).toLocaleDateString();
  };
  return <span className="text-muted-foreground">{getDiff()}</span>;
}
