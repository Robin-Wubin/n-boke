export function host (url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function getTypes (type, arr) {
  let typeName = "未知类别";
  for(let item of arr){
    if(type === item.value){
        typeName = item.text;
        break;
    }
  }
  return typeName;
}

export function formatTime (value,type) {
    let dataTime="";
    let data = new Date(value);
    let year   =  data.getFullYear();
    let month  =  addZero(data.getMonth() + 1);
    let day    =  addZero(data.getDate());
    let hour   =  addZero(data.getHours());
    let minute =  addZero(data.getMinutes());
    let second =  addZero(data.getSeconds());
    if(type === "YMD"){
        dataTime =  year + "-"+ month + "-" + day;
    }else if(type === "YMDHMS"){
        dataTime = year + "-"+month + "-" + day + " " +hour+ ":"+minute+":" +second;
    }else if(type === "HMS"){
        dataTime = hour+":" + minute+":" + second;
    }else if(type === "YM"){
        dataTime = year + "-" + month;

    }
    return dataTime;//将格式化后的字符串输出到前端显示
}

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
function addZero(val){
    if(val < 10){
        return "0" +val;
    }else{
        return val;
    }
};
