const dateNow=Date.now().toString();

//  => 23:00:00 - 11/12/2002   ==> 11/12/2002
// => 1:00:00 - 12/12/2002

//  1=> 11/12/2002
//  3=> 12/12/2002

const date1=new Date(2024/11/12); // => utc
// const date2=new Date('2024/11/12 5:35:00'); // => utc
// date1.toString
// const start=new Date('2002/12/11 1:00:00');
// const end=new Date('2002/12/11 3:00:00');
// const myDate=new Date();
// start.toLocaleString

// console.log(new Date(Date.now()).toString()); // local
// console.log(new Date().getHours()); // local
// console.log(new Date().getUTCHours()); // utc
// const targetDay=new Date(); // utc
// console.log(new Date().getUTCDay()); // utc
// console.log(new Date().getUTCFullYear()); // utc
console.log(date1)

// targetDay.setUTCDate(1);
// targetDay.setUTCMonth(11);
// const month=10;
// targetDay.setUTCFullYear(2024,month-1,1);
// targetDay.setUTCHours(2,0,0,0);
// console.log(targetDay);

// console.log(date);
// console.log(myDate);
// console.log(date);
