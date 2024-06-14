export const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};