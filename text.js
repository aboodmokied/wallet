const dateNow=Date.now().toString();

const date=new Date('2024/11/8 18:30:00').getTime();

// console.log(new Date(Date.now()).toString()); // local
// console.log(new Date().getHours()); // local
// console.log(new Date().getUTCHours()); // utc
const targetDay=new Date(); // utc
// console.log(new Date().getUTCDay()); // utc
// console.log(new Date().getUTCFullYear()); // utc


// targetDay.setUTCDate(1);
// targetDay.setUTCMonth(11);
const month=10;
targetDay.setUTCFullYear(2024,month-1,1);
targetDay.setUTCHours(2,0,0,0);
console.log(targetDay);

new Date();