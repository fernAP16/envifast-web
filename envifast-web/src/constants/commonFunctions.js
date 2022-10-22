export function formatDate(dateString) {
    let yyyy = dateString.slice(0,4);
    let mm = dateString.slice(5,7);
    let dd = dateString.slice(8);
    return `${dd}/${mm}/${yyyy}`;
  }