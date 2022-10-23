export function formatDate(dateString) {
    let yyyy = dateString.slice(0,4);
    let mm = dateString.slice(5,7);
    let dd = dateString.slice(8);
    return `${dd}/${mm}/${yyyy}`;
}

export function formatDateToString(dateString) {
  let yyyy = dateString.slice(0,4);
  let mm = dateString.slice(5,7);
  let dd = dateString.slice(8);
  return `${mm}-${dd}-${yyyy}`;
}


export function formatDateTimeToString(date) {
  let day = date.getDate() < 10 ? '0'+date.getDate(): date.getDate();
  // let day = date.getDate();
  let month = (date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1);
  let year = date.getFullYear();
  let hour = date.getHours() === 12 ? '12' :  date.getHours() % 12 < 10 ? '0' + (date.getHours() % 12 ) : date.getHours() % 12; 
  let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes()  : date.getMinutes();
  let seconds = date.getSeconds() < 10 ? '0'+date.getSeconds() :  date.getSeconds();
  // let timeHour = date.getHours() >= 12 ? 'PM' : 'AM';

  // let stringDate = `${day}/${month}/${year} ${hour}:${minutes} ${timeHour}`;

  return [`${day}/${month}/${year}`, `${hour}:${minutes}:${seconds}`];
}